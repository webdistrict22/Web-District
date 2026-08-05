const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const CallSlot = require("../../models/CallSlot");
const EmailOutbox = require("../../models/EmailOutbox");
const RefreshSession = require("../../models/RefreshSession");
const User = require("../../models/User");
const { enqueueEmail } = require("../../services/outboxService");
const { createRefreshSession, rotateRefreshSession } = require("../../services/refreshSessionService");

const uri = process.env.MONGO_TEST_URI;
const integration = uri ? test : test.skip;

integration("atomic slot claim, outbox dedupe, and refresh rotation resist concurrency", async (t) => {
  const databaseName = new URL(uri).pathname.replace(/^\//, "");
  assert.match(databaseName, /test/i, "MONGO_TEST_URI database name must contain 'test'");
  process.env.OUTBOX_ENCRYPTION_KEY ||= "o".repeat(32);
  process.env.REFRESH_TOKEN_SECRET ||= "r".repeat(32);
  process.env.NODE_ENV = "test";
  await mongoose.connect(uri);
  t.after(async () => mongoose.disconnect());
  await Promise.all([CallSlot.deleteMany({}), EmailOutbox.deleteMany({}), RefreshSession.deleteMany({}), User.deleteMany({ email: /@integration\.test$/ })]);

  const slot = await CallSlot.create({ date: "2030-01-01", startTime: "16:00", endTime: "16:30", startsAt: new Date("2030-01-01T14:00:00Z"), endsAt: new Date("2030-01-01T14:30:00Z") });
  const claims = await Promise.all(Array.from({ length: 12 }, () => {
    const appointmentId = new mongoose.Types.ObjectId();
    return CallSlot.findOneAndUpdate({ _id: slot._id, isBooked: false, bookedBy: null }, { $set: { isBooked: true, bookedBy: appointmentId } }, { new: true });
  }));
  assert.equal(claims.filter(Boolean).length, 1);

  const event = { eventType: "test", idempotencyKey: "integration:dedupe", relatedEntityType: "Test", recipientType: "client", recipient: "client@integration.test", template: "verification", templatePayload: { name: "Client" }, sensitivePayload: { token: "secret" } };
  await Promise.all(Array.from({ length: 12 }, () => enqueueEmail(event)));
  assert.equal(await EmailOutbox.countDocuments({ idempotencyKey: event.idempotencyKey }), 1);

  const user = await User.create({ name: "Integration Client", email: "auth@integration.test", phone: "+201000000000", password: "correct horse battery staple", role: "client", emailVerifiedAt: new Date() });
  const req = { get: () => "node-test" };
  const created = await createRefreshSession(user, req);
  const rotations = await Promise.all([rotateRefreshSession(created.token, req), rotateRefreshSession(created.token, req)]);
  assert.equal(rotations.filter((item) => item.token).length, 1);
  assert.equal(rotations.filter((item) => item.error === "reuse").length, 1);
});
