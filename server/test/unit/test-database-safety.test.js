const test = require("node:test");
const assert = require("node:assert/strict");
const { parseMongoDatabaseName, assertTestDatabaseSafety, withMongoDatabaseName } = require("../../utils/testDatabaseSafety");

test("MongoDB database names are parsed without relying on the HTTP URL parser", () => {
  assert.equal(parseMongoDatabaseName("mongodb+srv://user:pass@example.invalid/production", "MONGO_URI"), "production");
  assert.equal(parseMongoDatabaseName("mongodb://a.invalid:27017,b.invalid:27017/app_test?replicaSet=rs0", "MONGO_TEST_URI"), "app_test");
  assert.equal(parseMongoDatabaseName("mongodb://a.invalid:27017/?dbName=app-staging", "MONGO_TEST_URI"), "app-staging");
  assert.equal(parseMongoDatabaseName("mongodb://a.invalid:27017", "MONGO_URI"), "test");
});

test("a disposable database name can be applied without changing the configured test server", () => {
  const original = "mongodb+srv://user:pass@test.invalid/?retryWrites=true&w=majority";
  const replaced = withMongoDatabaseName(original, "web_district_verification_test");
  assert.equal(parseMongoDatabaseName(replaced, "MONGO_TEST_URI"), "web_district_verification_test");
  assert.match(replaced, /^mongodb\+srv:\/\/user:pass@test\.invalid\/web_district_verification_test\?/);
  assert.throws(() => withMongoDatabaseName(original, "production"), /not disposable/);
});

test("integration database guard rejects identical or non-disposable names", () => {
  assert.throws(() => assertTestDatabaseSafety({
    productionUri: "mongodb://a.invalid/production",
    testUri: "mongodb://b.invalid/production",
  }), /different/);
  assert.throws(() => assertTestDatabaseSafety({
    productionUri: "mongodb://a.invalid/production",
    testUri: "mongodb://b.invalid/sandbox",
  }), /must end/);
  assert.deepEqual(assertTestDatabaseSafety({
    productionUri: "mongodb://a.invalid/production",
    testUri: "mongodb://b.invalid/web_district_test",
  }), { productionDatabaseName: "production", testDatabaseName: "web_district_test" });
});
