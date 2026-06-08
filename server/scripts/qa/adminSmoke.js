const {
  API_BASE_URL,
  assertOkJson,
  isTrue,
  loginAdmin,
  printHeader,
  request,
  runChecks,
} = require("./helpers");

const run = async () => {
  console.log(`API base: ${API_BASE_URL}`);

  const admin = await loginAdmin();

  if (admin.skipped) {
    printHeader("Admin smoke test");
    console.log(`[SKIP] ${admin.reason}`);
    return { skipped: true, reason: admin.reason };
  }

  const checks = [
    {
      label: "GET /auth/me",
      run: async () => {
        const result = await request("/auth/me", { token: admin.token });
        assertOkJson(result, "GET /auth/me");

        if (result.data?.user?.role !== "admin") {
          throw new Error("/auth/me did not return an admin user");
        }

        return `${result.status} admin verified`;
      },
    },
    {
      label: "GET /dashboard/admin",
      run: async () => {
        const result = await request("/dashboard/admin", {
          token: admin.token,
        });
        assertOkJson(result, "GET /dashboard/admin");
        return `${result.status} JSON`;
      },
    },
    {
      label: "GET /settings/email-status",
      run: async () => {
        const result = await request("/settings/email-status", {
          token: admin.token,
        });
        assertOkJson(result, "GET /settings/email-status");
        return `${result.status} JSON`;
      },
    },
  ];

  if (isTrue(process.env.QA_SEND_TEST_EMAIL)) {
    checks.push({
      label: "POST /settings/test-email",
      run: async () => {
        const recipient = String(
          process.env.QA_TEST_EMAIL || process.env.OWNER_EMAIL || ""
        ).trim();
        const result = await request("/settings/test-email", {
          method: "POST",
          token: admin.token,
          body: recipient ? { to: recipient } : {},
        });
        assertOkJson(result, "POST /settings/test-email");
        return `${result.status} email sent`;
      },
    });
  } else {
    console.log(
      "[SKIP] Email send test disabled. Set QA_SEND_TEST_EMAIL=true to enable it."
    );
  }

  const results = await runChecks("Admin authenticated smoke test", checks);
  return { skipped: false, results };
};

if (require.main === module) {
  run().catch(() => {
    process.exitCode = 1;
  });
}

module.exports = { run };
