const test = require("node:test");
const assert = require("node:assert/strict");
const { assertSafeObject, escapeRegex, cleanSearch, cleanBoolean } = require("../../utils/validation");
const { normalizeOrigin, timingSafeEqual } = require("../../middleware/csrfMiddleware");
const { publicSettingsDto, publicReviewDto, clientContractDto } = require("../../utils/responseDtos");
const { validateEnvironment } = require("../../config/env");

test("query operators and dotted keys are rejected recursively", () => {
  assert.throws(() => assertSafeObject({ nested: { $where: "sleep(10)" } }), /unsupported field/i);
  assert.throws(() => assertSafeObject({ "profile.role": "admin" }), /unsupported field/i);
  assert.doesNotThrow(() => assertSafeObject({ nested: { value: "safe" } }));
});

test("search input is bounded and regular-expression metacharacters are escaped", () => {
  assert.equal(escapeRegex("a.*(b)"), "a\\.\\*\\(b\\)");
  assert.throws(() => cleanSearch("x".repeat(121)), /100/);
  assert.equal(cleanBoolean("true", "flag"), true);
  assert.equal(cleanBoolean("false", "flag"), false);
});

test("origin and double-submit comparison helpers fail closed", () => {
  assert.equal(normalizeOrigin("https://example.com/path?q=1"), "https://example.com");
  assert.equal(normalizeOrigin("not a url"), "");
  const token = "a".repeat(43);
  assert.equal(timingSafeEqual(token, token), true);
  assert.equal(timingSafeEqual(token, `${token}b`), false);
  assert.equal(timingSafeEqual("short", "short"), false);
});

test("public and client DTOs exclude internal fields", () => {
  const settings = publicSettingsDto({ agencyName: "WD", smtpPassword: "secret", createdAt: new Date() });
  assert.deepEqual(settings, { agencyName: "WD" });
  const review = publicReviewDto({ name: "Client", message: "Great", client: "private", isVisible: true });
  assert.equal(review.client, undefined);
  const contract = clientContractDto({ _id: "1", title: "Proposal", adminNotes: "private", request: "private" });
  assert.equal(contract.adminNotes, undefined);
  assert.equal(contract.request, undefined);
});

test("environment validation separates core requirements from degraded integrations", () => {
  const previous = { ...process.env };
  Object.assign(process.env, {
    NODE_ENV: "production",
    MONGO_URI: "mongodb://localhost:27017/web_district_test",
    JWT_SECRET: "j".repeat(32),
    REFRESH_TOKEN_SECRET: "r".repeat(32),
    OUTBOX_ENCRYPTION_KEY: "a".repeat(64),
    OWNER_EMAIL: "owner@example.com",
    CLIENT_URL: "https://www.example.com",
    ALLOWED_ORIGINS: "https://example.com",
    BUSINESS_TIMEZONE: "Africa/Cairo",
    EMAIL_USER: "",
    EMAIL_PASS: "",
    CLOUDINARY_CLOUD_NAME: "",
    CLOUDINARY_API_KEY: "",
    CLOUDINARY_API_SECRET: "",
  });
  const result = validateEnvironment();
  assert.deepEqual(result.degraded.sort(), ["cloudinary", "email"]);
  process.env.JWT_SECRET = "short";
  assert.throws(() => validateEnvironment(), /32 characters/);
  process.env.JWT_SECRET = "j".repeat(32);
  process.env.OUTBOX_ENCRYPTION_KEY = "not-hex";
  assert.throws(() => validateEnvironment(), /64 hexadecimal/);
  process.env.JWT_SECRET = "a".repeat(64);
  process.env.OUTBOX_ENCRYPTION_KEY = "a".repeat(64);
  assert.throws(() => validateEnvironment(), /independent values/);
  for (const key of Object.keys(process.env)) if (!(key in previous)) delete process.env[key];
  Object.assign(process.env, previous);
});
