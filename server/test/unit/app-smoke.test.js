const test = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.ALLOWED_ORIGINS = "http://localhost:5173";
process.env.JWT_SECRET = "app-smoke-jwt-secret-at-least-thirty-two";
process.env.REFRESH_TOKEN_SECRET = "app-smoke-refresh-secret-at-least-thirty-two";
process.env.OUTBOX_ENCRYPTION_KEY = "b".repeat(64);

const app = require("../../app");

test("local app serves liveness and CSRF bootstrap while portal APIs remain protected", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const live = await fetch(`${base}/api/health/live`);
  assert.equal(live.status, 200);
  assert.equal((await live.json()).status, "live");

  const csrf = await fetch(`${base}/api/auth/csrf`, { headers: { Origin: "http://localhost:5173" } });
  const csrfBody = await csrf.json();
  assert.equal(csrf.status, 200);
  assert.match(csrfBody.csrfToken, /^[A-Za-z0-9_-]{40,}$/);
  assert.match(csrf.headers.get("set-cookie") || "", /wd_csrf=/);

  const [clientRoute, adminRoute] = await Promise.all([
    fetch(`${base}/api/requests/my`),
    fetch(`${base}/api/users/clients`),
  ]);
  assert.equal(clientRoute.status, 401);
  assert.equal(adminRoute.status, 401);
});
