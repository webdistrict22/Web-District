import { useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import {
  formatSlotDateLong,
  formatSlotDayNumber,
  formatSlotMonth,
  formatSlotTime,
  formatSlotWeekday,
} from "./slotFormatting";

const visibleDayCount = 5;

const groupSlotsByDate = (slots) =>
  slots.reduce((groups, slot) => {
    if (!slot.date) return groups;

    if (!groups[slot.date]) groups[slot.date] = [];

    groups[slot.date].push(slot);
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

  const slotsByDate = useMemo(() => groupSlotsByDate(slots), [slots]);
  const visibleDates = useMemo(
    () => Object.keys(slotsByDate).sort().slice(0, visibleDayCount),
    [slotsByDate],
  );
  const activeDate =
    selectedDate && slotsByDate[selectedDate] ? selectedDate : visibleDates[0];
  const activeSlots = activeDate ? slotsByDate[activeDate] || [] : [];

  if (isLoading) {
    return (
      <div className="wd-start-slots-loading" role="status" aria-live="polite">
        <span className="wd-start-slots-loading__line" />
        <span className="wd-start-slots-loading__days" />
        <span>{t("start.slots.loading")}</span>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="wd-start-slots-empty" role="status">
        <p>{t("start.slots.emptyTitle")}</p>
        <span>{t("start.slots.emptyDescription")}</span>
      </div>
    );
  }

  return (
    <div
      className="wd-start-slots"
      role="group"
      tabIndex="-1"
      data-validation-name="slot"
      aria-labelledby={labelId}
      aria-describedby={errorId}
      aria-invalid={errorId ? true : undefined}
    >
      <div className="wd-start-day-grid" aria-label={t("start.slots.chooseDay")}>
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
              aria-label={formatSlotDateLong(date, effectiveLanguage)}
              className={`wd-start-day ${isActive ? "is-active" : ""}`}
            >
              <span className="wd-start-day__weekday">
                {formatSlotWeekday(date, effectiveLanguage)}
              </span>
              <span className="wd-start-day__month">
                {formatSlotMonth(date, effectiveLanguage)}
              </span>
              <span className="wd-start-day__number">
                {formatSlotDayNumber(date, effectiveLanguage)}
              </span>
            </button>
          );
        })}
      </div>

      {activeDate ? (
        <div className="wd-start-time-group">
          <p className="wd-start-time-group__date">
            {formatSlotDateLong(activeDate, effectiveLanguage)}
          </p>
          <div className="wd-start-time-grid">
            {activeSlots.map((slot) => {
              const isSelected = selectedSlot === slot._id;
              const isDisabled = slot.isBooked || slot.isActive === false;
              const timeLabel = `${formatSlotTime(
                slot.startTime,
                effectiveLanguage,
              )} - ${formatSlotTime(slot.endTime, effectiveLanguage)}`;

              return (
                <button
                  key={slot._id}
                  type="button"
                  onClick={() => setSelectedSlot(slot._id)}
                  aria-pressed={isSelected}
                  disabled={isDisabled}
                  className={`wd-start-time ${
                    isSelected ? "is-active" : ""
                  }`}
                >
                  {timeLabel}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AvailableSlots;
