const {
  API_BASE_URL,
  assertJson,
  request,
  runChecks,
} = require("./helpers");

const protectedEndpoints = [
  "/dashboard/admin",
  "/settings/email-status",
  "/users/clients",
  "/requests",
  "/appointments",
  "/contracts",
];

const run = async () => {
  console.log(`API base: ${API_BASE_URL}`);

  return runChecks(
    "Protected route smoke test",
    protectedEndpoints.map((path) => ({
      label: `GET ${path}`,
      run: async () => {
        const result = await request(path);
        assertJson(result, `GET ${path}`);

        if (![401, 403].includes(result.status)) {
          throw new Error(
            `expected 401 or 403 without a token, received ${result.status}`
          );
        }

        return `${result.status} rejected`;
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
