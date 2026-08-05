const DISPOSABLE_DATABASE_PATTERN = /(?:_|-)(?:test|staging)$/i;

const parseMongoDatabaseName = (uri, label) => {
  const value = String(uri || "").trim();
  if (!/^mongodb(?:\+srv)?:\/\//i.test(value)) throw new Error(`${label} is missing or invalid`);

  const withoutScheme = value.slice(value.indexOf("://") + 3);
  const slashIndex = withoutScheme.indexOf("/");
  const pathAndQuery = slashIndex >= 0 ? withoutScheme.slice(slashIndex + 1) : "";
  const [rawPath, rawQuery = ""] = pathAndQuery.split("?", 2);
  const queryDatabase = new URLSearchParams(rawQuery).get("dbName");
  const rawName = queryDatabase || rawPath.split("/")[0] || "test";

  try {
    const name = decodeURIComponent(rawName).trim();
    if (!name || /[\s/\\]/.test(name)) throw new Error();
    return name;
  } catch {
    throw new Error(`${label} does not contain a valid database name`);
  }
};

const assertTestDatabaseSafety = ({ productionUri, testUri }) => {
  const productionDatabaseName = parseMongoDatabaseName(productionUri, "MONGO_URI");
  const testDatabaseName = parseMongoDatabaseName(testUri, "MONGO_TEST_URI");

  if (productionDatabaseName.toLowerCase() === testDatabaseName.toLowerCase()) {
    throw new Error("MONGO_TEST_URI must name a database different from MONGO_URI");
  }
  if (!DISPOSABLE_DATABASE_PATTERN.test(testDatabaseName)) {
    throw new Error("MONGO_TEST_URI database name must end in _test, -test, _staging, or -staging");
  }

  return { productionDatabaseName, testDatabaseName };
};

const withMongoDatabaseName = (uri, databaseName) => {
  const value = String(uri || "").trim();
  if (!/^mongodb(?:\+srv)?:\/\//i.test(value)) throw new Error("MONGO_TEST_URI is missing or invalid");
  if (!DISPOSABLE_DATABASE_PATTERN.test(databaseName)) throw new Error("Replacement test database name is not disposable");
  const schemeEnd = value.indexOf("://") + 3;
  const slashIndex = value.indexOf("/", schemeEnd);
  const queryIndex = value.indexOf("?", schemeEnd);
  const authorityEnd = slashIndex >= 0 ? slashIndex : (queryIndex >= 0 ? queryIndex : value.length);
  const query = queryIndex >= 0 ? value.slice(queryIndex) : "";
  return `${value.slice(0, authorityEnd)}/${encodeURIComponent(databaseName)}${query}`;
};

module.exports = { DISPOSABLE_DATABASE_PATTERN, parseMongoDatabaseName, assertTestDatabaseSafety, withMongoDatabaseName };
