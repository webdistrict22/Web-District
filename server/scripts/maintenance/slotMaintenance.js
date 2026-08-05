const { isApplyMode, requireApplyGuard, run } = require("./scriptRuntime");
const { reconcileSlots } = require("../../services/slotReconciliationService");
const { runSlotMaintenance } = require("../../services/slotMaintenanceService");

run(async () => {
  const apply = requireApplyGuard();
  const before = await reconcileSlots();
  const result = apply ? await runSlotMaintenance({ includeLegacyCleanup: true }) : null;
  const after = apply ? await reconcileSlots() : before;
  console.log(JSON.stringify({ ok: true, mode: isApplyMode() ? "apply" : "dry-run", before, maintenance: result, after }, null, 2));
});
