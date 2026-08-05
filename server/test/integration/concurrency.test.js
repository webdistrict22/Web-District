const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env"), override: false, quiet: true });

const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const { assertTestDatabaseSafety } = require("../../utils/testDatabaseSafety");

const databaseSafety = assertTestDatabaseSafety({
  productionUri: process.env.MONGO_URI,
  testUri: process.env.MONGO_TEST_URI,
});

process.env.NODE_ENV = "test";
process.env.EMAIL_OUTBOX_ENABLED = "false";
process.env.SLOT_MAINTENANCE_ENABLED = "false";
process.env.JWT_SECRET = "integration-jwt-secret-which-is-independent";
process.env.REFRESH_TOKEN_SECRET = "integration-refresh-secret-which-is-independent";
process.env.OUTBOX_ENCRYPTION_KEY = "a".repeat(64);
process.env.CLIENT_URL = "http://localhost:5173";
process.env.ALLOWED_ORIGINS = "http://localhost:5173";
process.env.BUSINESS_TIMEZONE = "Africa/Cairo";
process.env.BOOKING_WINDOW_DAYS = "7";

const Appointment = require("../../models/Appointment");
const CallSlot = require("../../models/CallSlot");
const Contract = require("../../models/Contract");
const EmailOutbox = require("../../models/EmailOutbox");
const IdempotencyRecord = require("../../models/IdempotencyRecord");
const MaintenanceLock = require("../../models/MaintenanceLock");
const RateLimitRecord = require("../../models/RateLimitRecord");
const RefreshSession = require("../../models/RefreshSession");
const User = require("../../models/User");
const { runSlotBackfill } = require("../../services/slotBackfillService");
const { reconcileSlots } = require("../../services/slotReconciliationService");
const { safeCleanup } = require("../../services/slotMaintenanceService");
const { enqueueEmail } = require("../../services/outboxService");
const { claimNext, processOne } = require("../../services/outboxWorker");
const { createRefreshSession, rotateRefreshSession } = require("../../services/refreshSessionService");
const { runIdempotentTransaction } = require("../../services/idempotencyService");
const { withMongoTransaction } = require("../../services/transactionService");
const { addCalendarDays, bookingWindowEnd, formatDateInZone, zonedDateTimeToUtc } = require("../../utils/slotTime");

const collections = [
  Appointment, CallSlot, Contract, EmailOutbox, IdempotencyRecord,
  MaintenanceLock, RateLimitRecord, RefreshSession, User,
];
let connected = false;

const cleanTestData = async () => {
  for (const model of collections) await model.deleteMany({});
};

test.before(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URI, { serverSelectionTimeoutMS: 10000 });
  connected = true;
  assert.equal(mongoose.connection.name, databaseSafety.testDatabaseName);
  await Promise.all(collections.map((model) => model.createIndexes()));
});

test.beforeEach(cleanTestData);

test.after(async () => {
  if (!connected) return;
  await cleanTestData();
  await mongoose.disconnect();
});

test("transactions roll back business records and atomic outbox events together", async () => {
  await assert.rejects(withMongoTransaction(async (session) => {
    const [contract] = await Contract.create([{
      title: "Rollback fixture",
      clientName: "Test Client",
      clientEmail: "rollback@integration.test",
      websiteType: "Business",
      scopeSummary: "Transaction rollback fixture",
    }], { session });
    await enqueueEmail({
      eventType: "contract.created",
      idempotencyKey: `contract:${contract._id}:created`,
      relatedEntityType: "Contract",
      relatedEntityId: contract._id,
      recipientType: "client",
      recipient: "rollback@integration.test",
      template: "contract.client",
      templatePayload: { title: "Contract created", rows: [] },
    }, { session });
    throw new Error("intentional rollback");
  }), /intentional rollback/);
  assert.equal(await Contract.countDocuments({}), 0);
  assert.equal(await EmailOutbox.countDocuments({}), 0);
});

test("twelve concurrent bookings produce exactly one consistent appointment", async () => {
  const slot = await CallSlot.create({
    date: "2030-01-01", startTime: "16:00", endTime: "16:30",
    startsAt: new Date("2030-01-01T14:00:00Z"), endsAt: new Date("2030-01-01T14:30:00Z"),
  });
  const attempts = await Promise.allSettled(Array.from({ length: 12 }, (_, index) => withMongoTransaction(async (session) => {
    const appointmentId = new mongoose.Types.ObjectId();
    const claimed = await CallSlot.findOneAndUpdate(
      { _id: slot._id, isBooked: false, bookedBy: null },
      { $set: { isBooked: true, bookedBy: appointmentId } },
      { new: true, session }
    );
    if (!claimed) throw new Error("slot unavailable");
    const [appointment] = await Appointment.create([{
      _id: appointmentId,
      slot: slot._id,
      name: `Booking ${index}`,
      phone: "+201000000000",
      email: `booking-${index}@integration.test`,
      topic: "Concurrency fixture",
    }], { session });
    return appointment._id;
  })));
  assert.equal(attempts.filter((result) => result.status === "fulfilled").length, 1);
  const appointments = await Appointment.find({ slot: slot._id }).lean();
  const booked = await CallSlot.findById(slot._id).lean();
  assert.equal(appointments.length, 1);
  assert.equal(booked.isBooked, true);
  assert.equal(String(booked.bookedBy), String(appointments[0]._id));
});

test("outbox deduplicates, claims atomically, recovers stale leases, and uses fake delivery", async () => {
  const makeEvent = (suffix) => ({
    eventType: "account.verification",
    idempotencyKey: `integration:outbox:${suffix}`,
    relatedEntityType: "User",
    recipientType: "client",
    recipient: "outbox@integration.test",
    template: "account.verification",
    templatePayload: { name: "Integration Client" },
    sensitivePayload: { token: "fixture-token" },
  });
  await Promise.all(Array.from({ length: 12 }, () => enqueueEmail(makeEvent("dedupe"))));
  assert.equal(await EmailOutbox.countDocuments({ idempotencyKey: "integration:outbox:dedupe" }), 1);

  await Promise.all([enqueueEmail(makeEvent("claim-a")), enqueueEmail(makeEvent("claim-b"))]);
  const claims = (await Promise.all(Array.from({ length: 6 }, () => claimNext()))).filter(Boolean);
  assert.equal(claims.length, 3);
  assert.equal(new Set(claims.map((event) => String(event._id))).size, 3);

  await EmailOutbox.updateMany({}, { $set: { status: "delivered", deliveredAt: new Date() } });
  await enqueueEmail(makeEvent("stale"));
  await EmailOutbox.updateOne(
    { idempotencyKey: "integration:outbox:stale" },
    { $set: { status: "processing", leaseExpiresAt: new Date(Date.now() - 1000), lockedAt: new Date(Date.now() - 2000) } }
  );
  const recovered = await claimNext();
  assert.equal(recovered.idempotencyKey, "integration:outbox:stale");
  assert.equal(recovered.attempts, 1);

  await EmailOutbox.updateOne({ _id: recovered._id }, { $set: { status: "pending", nextAttemptAt: new Date(), leaseExpiresAt: null } });
  let sends = 0;
  assert.equal(await processOne({ send: async () => { sends += 1; return { messageId: "fake-message" }; } }), true);
  assert.equal(sends, 1);
  assert.equal((await EmailOutbox.findById(recovered._id).lean()).status, "delivered");
});

test("refresh rotation detects reuse and revokes the entire session family", async () => {
  const user = await User.create({
    name: "Integration Client", email: "auth@integration.test", phone: "+201000000000",
    password: "correct horse battery staple", role: "client", emailVerifiedAt: new Date(),
  });
  const req = { get: () => "node-test" };
  const created = await createRefreshSession(user, req);
  const results = await Promise.all([
    rotateRefreshSession(created.token, req),
    rotateRefreshSession(created.token, req),
  ]);
  assert.equal(results.filter((item) => item.token).length, 1);
  assert.equal(results.filter((item) => item.error === "reuse").length, 1);
  assert.equal(await RefreshSession.countDocuments({ sessionFamily: created.refreshSession.sessionFamily, revokedAt: null }), 0);
});

test("contract creation is idempotent", async () => {
  const req = { ip: "127.0.0.1", get: (name) => name === "Idempotency-Key" ? "integration-contract-key-0001" : "" };
  const payload = { title: "Idempotent fixture", clientEmail: "contract@integration.test" };
  const work = (session) => Contract.create([{
    title: payload.title,
    clientName: "Integration Client",
    clientEmail: payload.clientEmail,
    websiteType: "Business",
    scopeSummary: "Idempotency fixture",
  }], { session }).then(([contract]) => ({ contractId: String(contract._id), notificationStatus: "queued" }));
  const first = await runIdempotentTransaction({ req, scope: "contract.create", actor: "admin", payload, work });
  const second = await runIdempotentTransaction({ req, scope: "contract.create", actor: "admin", payload, work });
  assert.equal(first.contractId, second.contractId);
  assert.equal(second.replayed, true);
  assert.equal(await Contract.countDocuments({}), 1);
});

test("legacy slot backfill is bounded, timezone-correct, idempotent, and cleanup-safe", async () => {
  const now = new Date();
  const today = formatDateInZone(now, "Africa/Cairo");
  const yesterday = addCalendarDays(today, -1);
  const tomorrow = addCalendarDays(today, 1);
  const outside = addCalendarDays(today, 7);

  const expiredUnbooked = await CallSlot.create({
    date: yesterday, startTime: "09:00", endTime: "09:30", source: "legacy", isAutoGenerated: false,
  });
  const expiredBooked = await CallSlot.create({
    date: yesterday, startTime: "10:00", endTime: "10:30", source: "legacy", isAutoGenerated: false,
  });
  const futureInWindow = await CallSlot.create({
    date: tomorrow, startTime: "11:00", endTime: "11:30", source: "legacy", isAutoGenerated: false,
  });
  const futureOutsideWindow = await CallSlot.create({
    date: outside, startTime: "12:00", endTime: "12:30", source: "legacy", isAutoGenerated: false,
  });
  const appointment = await Appointment.create({
    slot: expiredBooked._id, name: "Historical booking", phone: "+201000000000",
    email: "historical@integration.test", topic: "Referenced slot fixture",
  });
  await CallSlot.updateOne({ _id: expiredBooked._id }, { $set: { isBooked: true, bookedBy: appointment._id } });

  assert.equal((await reconcileSlots()).counts.malformedSlots, 4);
  const result = await runSlotBackfill({ apply: true, batchSize: 2 });
  assert.deepEqual({ before: result.beforeCandidates, scanned: result.scanned, convertible: result.convertible, modified: result.modified, after: result.afterCandidates, malformed: result.malformedCount }, {
    before: 4, scanned: 4, convertible: 4, modified: 4, after: 0, malformed: 0,
  });
  const converted = await CallSlot.findById(futureInWindow._id).lean();
  assert.equal(converted.startsAt.toISOString(), zonedDateTimeToUtc(tomorrow, "11:00", "Africa/Cairo").toISOString());
  assert.equal(converted.endsAt.toISOString(), zonedDateTimeToUtc(tomorrow, "11:30", "Africa/Cairo").toISOString());
  assert.equal(converted.date, tomorrow);
  assert.equal(converted.startTime, "11:00");
  assert.equal(converted.endTime, "11:30");
  assert.equal((await reconcileSlots()).counts.malformedSlots, 0);
  assert.equal((await reconcileSlots()).counts.expiredUnbookedCandidates, 1);
  const rerun = await runSlotBackfill({ apply: true, batchSize: 2 });
  assert.equal(rerun.modified, 0);
  assert.equal(rerun.beforeCandidates, 0);

  const visibleFutureIds = await CallSlot.find({ startsAt: { $gt: now, $lte: bookingWindowEnd(now) } }).distinct("_id");
  assert.equal(visibleFutureIds.map(String).includes(String(futureInWindow._id)), true);
  assert.equal(visibleFutureIds.map(String).includes(String(futureOutsideWindow._id)), false);

  assert.equal(await safeCleanup(now, 100, { includeLegacy: true }), 1);
  assert.equal(await CallSlot.exists({ _id: expiredUnbooked._id }), null);
  assert.ok(await CallSlot.exists({ _id: expiredBooked._id }));
  assert.ok(await Appointment.exists({ _id: appointment._id }));
});
