const CallSlot = require("../models/CallSlot");
const { parseSlotTimes } = require("../controllers/slotController");

const legacySlotQuery = {
  $or: [
    { startsAt: null },
    { endsAt: null },
    { startsAt: { $exists: false } },
    { endsAt: { $exists: false } },
  ],
};

const runSlotBackfill = async ({ apply = false, batchSize = 200 } = {}) => {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 1000) {
    throw new Error("Slot backfill batch size must be between 1 and 1000");
  }

  const beforeCandidates = await CallSlot.countDocuments(legacySlotQuery);
  let lastId = null;
  let scanned = 0;
  let convertible = 0;
  let modified = 0;
  const malformedIds = [];

  while (true) {
    const pageQuery = lastId ? { $and: [legacySlotQuery, { _id: { $gt: lastId } }] } : legacySlotQuery;
    const slots = await CallSlot.find(pageQuery)
      .sort({ _id: 1 })
      .limit(batchSize)
      .select("date startTime endTime timezone")
      .lean();
    if (!slots.length) break;

    const operations = [];
    for (const slot of slots) {
      scanned += 1;
      try {
        const times = parseSlotTimes({
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          timezone: slot.timezone || "Africa/Cairo",
        });
        convertible += 1;
        operations.push({
          updateOne: {
            filter: { _id: slot._id, ...legacySlotQuery },
            update: { $set: times },
          },
        });
      } catch {
        malformedIds.push(String(slot._id));
      }
    }

    if (apply && operations.length) {
      const result = await CallSlot.bulkWrite(operations, { ordered: false });
      modified += result.modifiedCount;
    }
    lastId = slots.at(-1)._id;
  }

  const afterCandidates = apply ? await CallSlot.countDocuments(legacySlotQuery) : beforeCandidates;
  return {
    beforeCandidates,
    scanned,
    convertible,
    modified,
    afterCandidates,
    malformedCount: malformedIds.length,
    malformedSampleIds: malformedIds.slice(0, 20),
  };
};

module.exports = { legacySlotQuery, runSlotBackfill };
