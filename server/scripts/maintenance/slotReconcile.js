const { run } = require("./scriptRuntime");
const { reconcileSlots } = require("../../services/slotReconciliationService");

run(async () => {
  const report = await reconcileSlots();
  console.log(JSON.stringify({ ok: true, mode: "read-only", ...report }, null, 2));
  if (Object.values(report.counts).some((count) => count > 0)) process.exitCode = 2;
});
