const path = require("path");
const { spawnSync } = require("child_process");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const { assertTestDatabaseSafety, withMongoDatabaseName } = require("../utils/testDatabaseSafety");

if (!process.env.MONGO_TEST_URI) throw new Error("MONGO_TEST_URI is required for integration verification");

const testDatabaseName = "web_district_verification_test";
const testUri = withMongoDatabaseName(process.env.MONGO_TEST_URI, testDatabaseName);
assertTestDatabaseSafety({ productionUri: process.env.MONGO_URI, testUri });

const result = spawnSync(process.execPath, ["--test", "test/integration/*.test.js"], {
  cwd: path.resolve(__dirname, ".."),
  env: { ...process.env, MONGO_TEST_URI: testUri },
  stdio: "inherit",
});

process.exitCode = result.status ?? 1;
