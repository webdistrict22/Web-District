const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const getBusinessTimezone = () => process.env.BUSINESS_TIMEZONE || "Africa/Cairo";
const getBookingWindowDays = () => {
  const value = Number(process.env.BOOKING_WINDOW_DAYS || 7);
  return Number.isInteger(value) && value >= 1 && value <= 31 ? value : 7;
};

const validateTimezone = (timezone) => {
  try { new Intl.DateTimeFormat("en", { timeZone: timezone }).format(); return true; } catch { return false; }
};

const partsInZone = (date, timezone = getBusinessTimezone()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return parts;
};

const formatDateInZone = (date, timezone = getBusinessTimezone()) => {
  const p = partsInZone(date, timezone);
  return `${p.year}-${p.month}-${p.day}`;
};

const zonedDateTimeToUtc = (date, time, timezone = getBusinessTimezone()) => {
  if (!datePattern.test(String(date)) || !timePattern.test(String(time)) || !validateTimezone(timezone)) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let guess = new Date(targetAsUtc);
  for (let index = 0; index < 3; index += 1) {
    const p = partsInZone(guess, timezone);
    const renderedAsUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
    guess = new Date(guess.getTime() + (targetAsUtc - renderedAsUtc));
  }
  const check = partsInZone(guess, timezone);
  return `${check.year}-${check.month}-${check.day}` === date && `${check.hour}:${check.minute}` === time ? guess : null;
};

const addCalendarDays = (dateString, days) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const value = new Date(Date.UTC(year, month - 1, day + days));
  return value.toISOString().slice(0, 10);
};

const bookingWindowEnd = (now = new Date(), timezone = getBusinessTimezone()) => {
  const finalDate = addCalendarDays(formatDateInZone(now, timezone), getBookingWindowDays() - 1);
  return zonedDateTimeToUtc(finalDate, "23:59", timezone);
};

const getFutureSlotQuery = (now = new Date()) => ({ startsAt: { $gt: now } });
const isFutureSlot = (slot, now = new Date()) => Boolean(slot?.startsAt && new Date(slot.startsAt) > now);

module.exports = {
  datePattern, timePattern, getBusinessTimezone, getBookingWindowDays, validateTimezone,
  formatDateInZone, zonedDateTimeToUtc, addCalendarDays, bookingWindowEnd,
  getFutureSlotQuery, isFutureSlot,
};
