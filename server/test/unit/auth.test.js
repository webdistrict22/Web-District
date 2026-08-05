const test = require("node:test");
const assert = require("node:assert/strict");
const { hashToken } = require("../../services/refreshSessionService");
const { issueCsrfToken, setRefreshCookie, parseCookies } = require("../../utils/cookies");

test("refresh tokens are stored as keyed hashes", () => {
  process.env.REFRESH_TOKEN_SECRET = "r".repeat(32);
  const raw = "refresh-token-value";
  const hash = hashToken(raw);
  assert.notEqual(hash, raw);
  assert.equal(hash.length, 64);
  assert.equal(hashToken(raw), hash);
});

test("production refresh cookie is HttpOnly, Secure, scoped, and cross-site compatible", () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const headers = {};
  const res = { getHeader: (name) => headers[name], setHeader: (name, value) => { headers[name] = value; } };
  setRefreshCookie(res, "raw-token");
  issueCsrfToken(res);
  const cookies = headers["Set-Cookie"];
  assert.match(cookies[0], /HttpOnly/);
  assert.match(cookies[0], /Secure/);
  assert.match(cookies[0], /SameSite=None/);
  assert.match(cookies[0], /Path=\/api\/auth/);
  assert.doesNotMatch(cookies[1], /HttpOnly/);
  process.env.NODE_ENV = previous;
});

test("cookie parser only returns cookie values", () => {
  assert.deepEqual(parseCookies({ headers: { cookie: "a=1; wd_csrf=token%20value" } }), { a: "1", wd_csrf: "token value" });
});
