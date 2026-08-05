const mongoose = require("mongoose");
const { isApplyMode, requireApplyGuard, run } = require("./scriptRuntime");

[
  "Appointment", "CallSlot", "Contract", "EmailOutbox", "IdempotencyRecord",
  "MaintenanceLock", "RateLimitRecord", "RefreshSession", "Review", "User", "WebsiteRequest",
].forEach((name) => require(`../../models/${name}`));

const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.keys(value).sort().reduce((result, key) => ({ ...result, [key]: stable(value[key]) }), {});
  }
  return value;
};

const equivalent = (actual, fields, options) => JSON.stringify(stable({
  key: actual.key,
  unique: Boolean(actual.unique),
  sparse: Boolean(actual.sparse),
  partialFilterExpression: actual.partialFilterExpression || null,
  expireAfterSeconds: actual.expireAfterSeconds ?? null,
})) === JSON.stringify(stable({
  key: fields,
  unique: Boolean(options.unique),
  sparse: Boolean(options.sparse),
  partialFilterExpression: options.partialFilterExpression || null,
  expireAfterSeconds: options.expireAfterSeconds ?? null,
}));

run(async () => {
  const apply = requireApplyGuard();
  const report = [];
  let conflicts = 0;
  for (const model of Object.values(mongoose.models)) {
    const actual = await model.collection.indexes();
    const desired = model.schema.indexes();
    const missing = desired.filter(([fields, options]) => !actual.some((index) => equivalent(index, fields, options)));
    const extra = actual.filter((index) => index.name !== "_id_" && !desired.some(([fields, options]) => equivalent(index, fields, options)));
    const modelConflicts = missing.filter(([, options]) => options.name && actual.some((index) => index.name === options.name));
    const additive = missing.filter((item) => !modelConflicts.includes(item));
    conflicts += modelConflicts.length;

    if (apply) {
      for (const [fields, options] of additive) await model.collection.createIndex(fields, options);
    }
    report.push({
      model: model.modelName,
      missing: missing.length,
      extra: extra.length,
      additive: additive.map(([, options]) => options.name || "unnamed"),
      nameConflicts: modelConflicts.map(([, options]) => options.name),
      extraNames: extra.map((index) => index.name),
    });
  }
  console.log(JSON.stringify({
    ok: conflicts === 0,
    mode: isApplyMode() ? "apply" : "dry-run",
    note: "Only missing, non-conflicting indexes are created; extra indexes are never dropped",
    models: report,
  }, null, 2));
  if (apply && conflicts) process.exitCode = 1;
});
