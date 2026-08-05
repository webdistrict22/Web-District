const { run } = require("./scriptRuntime");
const CallSlot = require("../../models/CallSlot");
const Review = require("../../models/Review");

const normalize = (index) => ({
  name: index.name,
  key: index.key,
  unique: Boolean(index.unique),
  sparse: Boolean(index.sparse),
  partialFilterExpression: index.partialFilterExpression || null,
  expireAfterSeconds: index.expireAfterSeconds ?? null,
});

run(async () => {
  const models = [];
  for (const model of [CallSlot, Review]) {
    const [actual, diff] = await Promise.all([model.collection.indexes(), model.diffIndexes()]);
    const desired = model.schema.indexes().map(([key, options]) => normalize({ key, ...options }));
    models.push({
      model: model.modelName,
      actual: actual.map(normalize),
      desired,
      missing: diff.toCreate,
      extra: diff.toDrop,
    });
  }
  console.log(JSON.stringify({ ok: true, mode: "read-only", models }, null, 2));
});
