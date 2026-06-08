const {
  API_BASE_URL,
  assertArray,
  assertOkJson,
  request,
  runChecks,
} = require("./helpers");

const publicChecks = [
  {
    label: "GET /health",
    path: "/health",
    validate: (data) => {
      if (data?.success !== true || data?.status !== "healthy") {
        throw new Error("health response did not report a healthy service");
      }
    },
  },
  {
    label: "GET /settings/public",
    path: "/settings/public",
    validate: (data) => {
      if (!data?.settings || typeof data.settings !== "object") {
        throw new Error("settings response did not include settings");
      }
    },
  },
  {
    label: "GET /projects/public",
    path: "/projects/public",
    validate: (data) => assertArray(data?.projects, "projects"),
  },
  {
    label: "GET /packages/public",
    path: "/packages/public",
    validate: (data) => assertArray(data?.packages, "packages"),
  },
  {
    label: "GET /faqs/public",
    path: "/faqs/public",
    validate: (data) => assertArray(data?.faqs, "faqs"),
  },
  {
    label: "GET /reviews/public",
    path: "/reviews/public",
    validate: (data) => assertArray(data?.reviews, "reviews"),
  },
  {
    label: "GET /slots/available",
    path: "/slots/available",
    validate: (data) => assertArray(data?.slots, "slots"),
  },
];

const run = async () => {
  console.log(`API base: ${API_BASE_URL}`);

  return runChecks(
    "Public API smoke test",
    publicChecks.map((check) => ({
      label: check.label,
      run: async () => {
        const result = await request(check.path);
        assertOkJson(result, check.label);
        check.validate(result.data);
        return `${result.status} JSON`;
      },
    }))
  );
};

if (require.main === module) {
  run().catch(() => {
    process.exitCode = 1;
  });
}

module.exports = { run };
