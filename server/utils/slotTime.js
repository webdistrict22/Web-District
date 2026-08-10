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

const validDate = (value) => {
  if (!datePattern.test(String(value))) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
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

const buildCanonicalSlotFields = ({ date, startTime, endTime, timezone = getBusinessTimezone() }) => {
  if (!validDate(date)) {
    throw Object.assign(new Error("Date must be a valid YYYY-MM-DD date"), { statusCode: 400 });
  }
  if (!timePattern.test(String(startTime)) || !timePattern.test(String(endTime))) {
    throw Object.assign(new Error("Start and end time must use HH:mm format"), { statusCode: 400 });
  }
  if (!validateTimezone(timezone)) {
    throw Object.assign(new Error("Timezone must be a valid IANA timezone"), { statusCode: 400 });
  }
  const startsAt = zonedDateTimeToUtc(date, startTime, timezone);
  const endsAt = zonedDateTimeToUtc(date, endTime, timezone);
  if (!startsAt || !endsAt || endsAt <= startsAt) {
    throw Object.assign(new Error("End time must be after start time"), { statusCode: 400 });
  }
  return { date, startTime, endTime, startsAt, endsAt, timezone };
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

const getFriendlyTimezoneLabel = (timezone = getBusinessTimezone()) =>
  timezone === "Africa/Cairo" ? "Cairo time" : "local time";

const formatSlotDisplay = (
  slot,
  {
    locale = "en-US",
    timezone = slot?.timezone || getBusinessTimezone(),
    timezoneLabel = getFriendlyTimezoneLabel(timezone),
  } = {}
) => {
  const startsAt = new Date(slot?.startsAt);
  const endsAt = new Date(slot?.endsAt);

  if (
    !slot?.startsAt ||
    !slot?.endsAt ||
    Number.isNaN(startsAt.getTime()) ||
    Number.isNaN(endsAt.getTime()) ||
    endsAt <= startsAt ||
    !validateTimezone(timezone)
  ) {
    return "Not available";
  }

  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(startsAt);
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });

  return `${date} · ${timeFormatter.format(startsAt)}–${timeFormatter.format(endsAt)} (${timezoneLabel})`;
};

module.exports = {
  datePattern, timePattern, getBusinessTimezone, getBookingWindowDays, validateTimezone,
  formatDateInZone, zonedDateTimeToUtc, buildCanonicalSlotFields, addCalendarDays, bookingWindowEnd,
  getFutureSlotQuery, isFutureSlot, getFriendlyTimezoneLabel, formatSlotDisplay,
};
