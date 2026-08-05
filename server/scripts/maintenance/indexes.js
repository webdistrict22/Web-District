const mongoose = require("mongoose");
const { isApplyMode, requireApplyGuard, run } = require("./scriptRuntime");

[
  "Appointment", "CallSlot", "Contract", "EmailOutbox", "IdempotencyRecord",
  "MaintenanceLock", "RateLimitRecord", "RefreshSession", "Review", "User", "WebsiteRequest",
].forEach((name) => require(`../../models/${name}`));

run(async () => {
  const apply = requireApplyGuard();
  const report = [];
  for (const model of Object.values(mongoose.models)) {
    const diff = await model.diffIndexes();
    report.push({ model: model.modelName, missing: diff.toCreate.length, extra: diff.toDrop.length });
    if (apply && diff.toCreate.length) await model.createIndexes();
  }
  console.log(JSON.stringify({ ok: true, mode: isApplyMode() ? "apply" : "dry-run", note: "Extra indexes are reported but never dropped automatically", models: report }, null, 2));
});
