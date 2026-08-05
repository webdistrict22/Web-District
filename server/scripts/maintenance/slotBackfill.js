const CallSlot = require("../../models/CallSlot");
const { parseSlotTimes } = require("../../controllers/slotController");
const { isApplyMode, requireApplyGuard, run } = require("./scriptRuntime");

run(async () => {
  const apply = requireApplyGuard();
  const query = { $or: [{ startsAt: null }, { endsAt: null }, { startsAt: { $exists: false } }, { endsAt: { $exists: false } }] };
  const candidates = await CallSlot.find(query).select("date startTime endTime timezone").lean();
  const operations = [];
  const malformedIds = [];
  for (const slot of candidates) {
    try {
      const times = parseSlotTimes(slot);
      operations.push({ updateOne: { filter: { _id: slot._id, ...query }, update: { $set: times } } });
    } catch {
      malformedIds.push(String(slot._id));
    }
  }
  let modified = 0;
  if (apply && operations.length) {
    const result = await CallSlot.bulkWrite(operations, { ordered: false });
    modified = result.modifiedCount;
  }
  console.log(JSON.stringify({ ok: true, mode: isApplyMode() ? "apply" : "dry-run", candidates: candidates.length, convertible: operations.length, modified, malformedCount: malformedIds.length, malformedSampleIds: malformedIds.slice(0, 20) }, null, 2));
});
