const getDateLocale = (language) => (language === "ar" ? "ar-EG" : "en-US");

const parseSlotDate = (date) => {
  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatSlotWeekday = (date, language) => {
  const parsedDate = parseSlotDate(date);

  if (!parsedDate) return date;

  return new Intl.DateTimeFormat(getDateLocale(language), {
    weekday: "short",
    timeZone: "UTC",
  }).format(parsedDate);
};

export const formatSlotMonth = (date, language) => {
  const parsedDate = parseSlotDate(date);

  if (!parsedDate) return "";

  return new Intl.DateTimeFormat(getDateLocale(language), {
    month: "short",
    timeZone: "UTC",
  }).format(parsedDate);
};

export const formatSlotDayNumber = (date, language) => {
  const parsedDate = parseSlotDate(date);

  if (!parsedDate) return "";

  return new Intl.DateTimeFormat(getDateLocale(language), {
    day: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
};

export const formatSlotDateLong = (date, language) => {
  const parsedDate = parseSlotDate(date);

  if (!parsedDate) return date;

  return new Intl.DateTimeFormat(getDateLocale(language), {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
};

export const formatSlotTime = (time, language) => {
  const [hourValue, minuteValue = "00"] = String(time).split(":");
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  const parsedTime = new Date(Date.UTC(2000, 0, 1, hour, minute));

  return new Intl.DateTimeFormat(getDateLocale(language), {
    hour: "numeric",
    minute: minute ? "2-digit" : undefined,
    hour12: true,
    timeZone: "UTC",
  }).format(parsedTime);
};

export const formatSlotSummary = (slot, language) => {
  if (!slot) return "";

  const timezone = slot.timezone || "Africa/Cairo";
  const startsAt = new Date(slot.startsAt);
  const endsAt = new Date(slot.endsAt);
  const hasCanonicalRange =
    slot.startsAt &&
    slot.endsAt &&
    !Number.isNaN(startsAt.getTime()) &&
    !Number.isNaN(endsAt.getTime());
  const date = hasCanonicalRange
    ? new Intl.DateTimeFormat(getDateLocale(language), {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: timezone,
      }).format(startsAt)
    : formatSlotDateLong(slot.date, language);
  const formatCanonicalTime = (value) =>
    new Intl.DateTimeFormat(getDateLocale(language), {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    }).format(value);
  const start = hasCanonicalRange
    ? formatCanonicalTime(startsAt)
    : formatSlotTime(slot.startTime, language);
  const end = hasCanonicalRange
    ? formatCanonicalTime(endsAt)
    : formatSlotTime(slot.endTime, language);
  const timezoneLabel = language === "ar" ? "توقيت القاهرة" : "Cairo time";

  return `${date} · ${start}–${end} (${timezoneLabel})`;
};
