const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

// Slot date/time strings use UTC, matching the existing auto-generation logic.
const formatUtcDate = (date) => date.toISOString().slice(0, 10);

const formatUtcTime = (date) =>
  `${String(date.getUTCHours()).padStart(2, "0")}:${String(
    date.getUTCMinutes()
  ).padStart(2, "0")}`;

const getFutureSlotQuery = (now = new Date()) => {
  const date = formatUtcDate(now);
  const time = formatUtcTime(now);

  return {
    $or: [
      { date: { $gt: date } },
      {
        date,
        startTime: { $gt: time },
      },
    ],
  };
};

const getSlotStartTime = ({ date, startTime }) => {
  if (!datePattern.test(String(date)) || !timePattern.test(String(startTime))) {
    return null;
  }

  const slotStart = new Date(`${date}T${startTime}:00.000Z`);

  return Number.isNaN(slotStart.getTime()) ? null : slotStart;
};

const isFutureSlot = (slot, now = new Date()) => {
  const slotStart = getSlotStartTime(slot);

  return Boolean(slotStart && slotStart.getTime() > now.getTime());
};

module.exports = {
  datePattern,
  timePattern,
  formatUtcDate,
  getFutureSlotQuery,
  isFutureSlot,
};
