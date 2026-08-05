const { isApplyMode, requireApplyGuard, run } = require("./scriptRuntime");
const { runSlotBackfill } = require("../../services/slotBackfillService");

run(async () => {
  const apply = requireApplyGuard();
  const result = await runSlotBackfill({ apply, batchSize: 200 });
  console.log(JSON.stringify({ ok: true, mode: isApplyMode() ? "apply" : "dry-run", batchSize: 200, ...result }, null, 2));
});
