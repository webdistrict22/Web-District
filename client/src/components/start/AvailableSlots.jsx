import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import Card from "../common/Card";
import useLanguage from "../../hooks/useLanguage";

const visibleDayCount = 5;

const formatSlotDate = (date, locale) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
}).format(parsedDate);
};

const formatDayLabel = (date, locale) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(parsedDate);
};

const formatDayNumber = (date, locale) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
}).format(parsedDate);
};

const formatSlotTime = (time, locale) => {
  const [hourValue, minuteValue = "00"] = String(time).split(":");
  const hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  const period = hour >= 12 ? (locale === "ar-EG" ? "م" : "PM") : (locale === "ar-EG" ? "ص" : "AM");
  const displayHour = hour % 12 || 12;
  const displayMinute = minute ? `:${String(minute).padStart(2, "0")}` : "";

  return `${displayHour}${displayMinute} ${period}`;
};

const groupSlotsByDate = (slots) =>
  slots.reduce((groups, slot) => {
    const date = slot.date || "Available";

    if (!groups[date]) groups[date] = [];

    groups[date].push(slot);

    return groups;
  }, {});

function AvailableSlots({
  slots,
  selectedSlot,
  setSelectedSlot,
  isLoading,
  labelId,
  errorId,
}) {
  const [selectedDate, setSelectedDate] = useState("");
  const { effectiveLanguage, t } = useLanguage();
  const dateLocale = effectiveLanguage === "ar" ? "ar-EG" : undefined;

  const slotsByDate = useMemo(() => groupSlotsByDate(slots), [slots]);
  const visibleDates = useMemo(
    () => Object.keys(slotsByDate).sort().slice(0, visibleDayCount),
    [slotsByDate]
  );

  const activeDate =
    selectedDate && slotsByDate[selectedDate] ? selectedDate : visibleDates[0];
  const activeSlots = activeDate ? slotsByDate[activeDate] || [] : [];

  if (isLoading) {
    return (
      <Card className="p-6" role="status" aria-live="polite">
        <p className="text-[#D9D4CC]">{t("start.slots.loading")}</p>
      </Card>
    );
  }

  if (!slots.length) {
    return (
      <Card className="p-6" role="status">
        <p className="font-semibold text-[#F8F7F4]">
          {t("start.slots.emptyTitle")}
        </p>
        <p className="mt-2 leading-7 text-[#D9D4CC]">
          {t("start.slots.emptyDescription")}
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="p-4"
      role="group"
      aria-labelledby={labelId}
      aria-describedby={errorId}
      aria-invalid={errorId ? true : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F3EEE4]">
          <CalendarDays size={18} />
        </div>

        <div>
          <p className="font-semibold text-[#F3EEE4]">
            {t("start.slots.chooseDay")}
          </p>
          <p className="text-sm text-[#D6CFC2]">{t("start.slots.nextDays")}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {visibleDates.map((date) => {
          const isActive = activeDate === date;

          return (
            <button
              key={date}
              type="button"
              onClick={() => {
                setSelectedDate(date);
                setSelectedSlot("");
              }}
              aria-pressed={isActive}
              className={`rounded-2xl border px-3 py-3 text-left transition forced-color-adjust-none ${
                isActive
                  ? "border-[#C4A77D]/70 bg-[#A8874F] text-[#F3EEE4]"
                  : "border-white/10 bg-white/[0.035] text-[#D6CFC2] hover:border-[#C4A77D]/45 hover:text-[#F3EEE4]"
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-[0.18em]">
                {formatDayLabel(date, dateLocale)}
              </span>
              <span className="mt-1 block text-sm font-semibold">
                {formatDayNumber(date, dateLocale)}
              </span>
            </button>
          );
        })}
      </div>

      {activeDate && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F3EEE4]">
              <CalendarDays size={18} />
            </div>

            <div>
              <p className="font-semibold text-[#F3EEE4]">
                {formatSlotDate(activeDate, dateLocale)}
              </p>
              <p className="text-sm text-[#D6CFC2]">{activeDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activeSlots.map((slot) => {
              const isSelected = selectedSlot === slot._id;

              return (
                <button
                  key={slot._id}
                  type="button"
                  onClick={() => setSelectedSlot(slot._id)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition forced-color-adjust-none ${
                    isSelected
                      ? "border-[#C4A77D]/70 bg-[#A8874F] text-[#F3EEE4]"
                      : "border-white/10 bg-white/[0.035] text-[#D6CFC2] hover:border-[#C4A77D]/45 hover:text-[#F3EEE4]"
                  }`}
                >
                  {formatSlotTime(slot.startTime, dateLocale)} - {formatSlotTime(slot.endTime, dateLocale)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export default AvailableSlots;
