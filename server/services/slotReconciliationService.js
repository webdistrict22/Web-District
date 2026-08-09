const Appointment = require("../models/Appointment");
const CallSlot = require("../models/CallSlot");
const {
  buildExpiredCleanupQuery,
  buildOutsideHorizonCleanupQuery,
  findUnreferencedCleanupCandidates,
} = require("./slotMaintenanceService");

const sample = (values) => values.slice(0, 20).map(String);

const reconcileSlots = async () => {
  const now = new Date();
  const [holdingAppointments, bookedSlots, duplicateHolders, expiredCandidates, outsideHorizon, malformed, activeSlots] = await Promise.all([
    Appointment.find({ holdsSlot: true, archivedAt: null }).select("slot status").lean(),
    CallSlot.find({ isBooked: true }).select("bookedBy").lean(),
    Appointment.aggregate([{ $match: { holdsSlot: true, archivedAt: null } }, { $group: { _id: "$slot", count: { $sum: 1 }, ids: { $push: "$_id" } } }, { $match: { count: { $gt: 1 } } }]),
    findUnreferencedCleanupCandidates(buildExpiredCleanupQuery(now, { includeLegacy: true }), { batchLimit: 1000, sort: { endsAt: 1, _id: 1 } }),
    findUnreferencedCleanupCandidates(buildOutsideHorizonCleanupQuery(now), { batchLimit: 1000, sort: { startsAt: 1, _id: 1 } }),
    CallSlot.find({ $or: [{ startsAt: null }, { endsAt: null }, { $expr: { $gte: ["$startsAt", "$endsAt"] } }] }).select("_id").limit(1000).lean(),
    CallSlot.find({ isActive: true, startsAt: { $ne: null }, endsAt: { $ne: null } }).sort({ startsAt: 1 }).select("startsAt endsAt").limit(5000).lean(),
  ]);

  const slotIds = holdingAppointments.map((item) => item.slot).filter(Boolean);
  const referencedSlots = await CallSlot.find({ _id: { $in: slotIds } }).select("isBooked bookedBy").lean();
  const slotMap = new Map(referencedSlots.map((slot) => [String(slot._id), slot]));
  const inconsistentAppointments = holdingAppointments.filter((appointment) => {
    const slot = slotMap.get(String(appointment.slot));
    return !slot || !slot.isBooked || (slot.bookedBy && String(slot.bookedBy) !== String(appointment._id));
  });
  const holdingIds = new Set(holdingAppointments.map((item) => String(item._id)));
  const orphanBooked = bookedSlots.filter((slot) => !slot.bookedBy || !holdingIds.has(String(slot.bookedBy)));
  const overlapIds = [];
  for (let index = 1; index < activeSlots.length; index += 1) {
    if (new Date(activeSlots[index - 1].endsAt) > new Date(activeSlots[index].startsAt)) overlapIds.push(activeSlots[index - 1]._id, activeSlots[index]._id);
  }

  return {
    generatedAt: new Date(),
    counts: {
      inconsistentHoldingAppointments: inconsistentAppointments.length,
      bookedSlotsWithoutHolder: orphanBooked.length,
      slotsWithMultipleHolders: duplicateHolders.length,
      overlappingActiveSlots: new Set(overlapIds.map(String)).size,
      malformedSlots: malformed.length,
      expiredUnbookedCandidates: expiredCandidates.length,
      generatedSlotsOutsideHorizon: outsideHorizon.length,
    },
    samples: {
      inconsistentAppointmentIds: sample(inconsistentAppointments.map((item) => item._id)),
      orphanBookedSlotIds: sample(orphanBooked.map((item) => item._id)),
      duplicateSlotIds: sample(duplicateHolders.map((item) => item._id)),
      overlappingSlotIds: sample([...new Set(overlapIds.map(String))]),
      malformedSlotIds: sample(malformed.map((item) => item._id)),
    },
  };
};

module.exports = { reconcileSlots };
