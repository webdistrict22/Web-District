const test = require("node:test");
const assert = require("node:assert/strict");
const { zonedDateTimeToUtc, formatDateInZone, addCalendarDays, bookingWindowEnd, validateTimezone } = require("../../utils/slotTime");
const { deterministicMessageId, sanitizePayload } = require("../../services/outboxService");
const { getBackoffMs, isPermanentError } = require("../../services/outboxWorker");
const { renderEmailTemplate } = require("../../utils/emailTemplates");

test("Cairo wall-clock slots round-trip through UTC", () => {
  const utc = zonedDateTimeToUtc("2026-08-05", "16:00", "Africa/Cairo");
  assert.ok(utc instanceof Date);
  assert.equal(formatDateInZone(utc, "Africa/Cairo"), "2026-08-05");
  assert.equal(addCalendarDays("2026-12-31", 1), "2027-01-01");
  assert.equal(validateTimezone("Africa/Cairo"), true);
  assert.equal(validateTimezone("Mars/Olympus"), false);
});

test("booking horizon ends on the seventh Cairo calendar day", () => {
  process.env.BOOKING_WINDOW_DAYS = "7";
  const end = bookingWindowEnd(new Date("2026-08-05T12:00:00Z"), "Africa/Cairo");
  assert.equal(formatDateInZone(end, "Africa/Cairo"), "2026-08-11");
});

test("outbox retry policy is bounded and permanent failures are classified", () => {
  const first = getBackoffMs(1);
  const late = getBackoffMs(20);
  assert.ok(first >= 60000 && first < 72000);
  assert.ok(late >= 21600000 && late < 25920000);
  assert.equal(isPermanentError({ responseCode: 550 }), true);
  assert.equal(isPermanentError({ code: "ETIMEDOUT" }), false);
  assert.equal(deterministicMessageId("same-event"), deterministicMessageId("same-event"));
});

test("outbox payload sanitization removes Mongo-style keys", () => {
  assert.deepEqual(sanitizePayload({ safe: "yes", $where: "bad", "a.b": "bad" }), { safe: "yes" });
});

test("email templates escape stored customer content", () => {
  process.env.CLIENT_URL = "https://www.example.com";
  const rendered = renderEmailTemplate("review.owner", { name: "<script>alert(1)</script>", rows: [{ label: "Review", value: "<img src=x>" }] });
  assert.doesNotMatch(rendered.html, /<script>alert/);
  assert.doesNotMatch(rendered.html, /<img src=x>/);
  assert.match(rendered.html, /&lt;img src=x&gt;/);
});
