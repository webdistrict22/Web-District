const publicSmoke = require("./publicSmoke");
const protectedSmoke = require("./protectedSmoke");
const workflowSmoke = require("./workflowSmoke");
const adminSmoke = require("./adminSmoke");
const writeSmoke = require("./writeSmoke");
const { isTrue, printHeader } = require("./helpers");

const suites = [
  ["Public", publicSmoke.run],
  ["Protected", protectedSmoke.run],
  ["Workflow", workflowSmoke.run],
  ["Admin", adminSmoke.run],
];

const run = async () => {
  const results = [];

  const enabledSuites = [...suites];
  const writeEnabled = isTrue(process.env.QA_RUN_WRITE_TESTS);

  if (writeEnabled) {
    enabledSuites.push(["Write", writeSmoke.run]);
  }

  for (const [name, suite] of enabledSuites) {
    try {
      const result = await suite();
      results.push({
        name,
        passed: true,
        skipped: Boolean(result?.skipped),
      });
    } catch (error) {
      results.push({
        name,
        passed: false,
        skipped: false,
        message: error.message,
      });
    }
  }

  if (!writeEnabled) {
    results.push({
      name: "Write",
      passed: true,
      skipped: true,
    });
  }

  printHeader("Combined QA summary");

  results.forEach((result) => {
    const status = result.skipped
      ? "SKIP"
      : result.passed
        ? "PASS"
        : "FAIL";
    console.log(
      `[${status}] ${result.name}${result.message ? ` - ${result.message}` : ""}`
    );
  });

  if (results.some((result) => !result.passed)) {
    throw new Error("One or more QA suites failed");
  }

  return results;
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`\n[FAIL] ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { run };
