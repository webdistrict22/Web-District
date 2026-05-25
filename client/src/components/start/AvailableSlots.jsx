import { CalendarDays } from "lucide-react";
import Card from "../common/Card";

function AvailableSlots({ slots, selectedSlot, setSelectedSlot, isLoading }) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-[#D9D4CC]">Loading available call slots...</p>
      </Card>
    );
  }

  if (!slots.length) {
    return (
      <Card className="p-6">
        <p className="font-semibold text-[#F8F7F4]">No call slots available yet.</p>
        <p className="mt-2 leading-7 text-[#D9D4CC]">
          You can still submit a website request or contact Web District
          directly through WhatsApp.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot._id;

        return (
          <button
            key={slot._id}
            type="button"
            onClick={() => setSelectedSlot(slot._id)}
            className="text-left"
          >
            <Card
              className={`flex items-center justify-between gap-4 p-4 transition ${
                isSelected ? "border-[#C4A77D]/60" : "hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="font-semibold text-[#F8F7F4]">{slot.date}</p>
                  <p className="text-sm text-[#D9D4CC]">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isSelected
                    ? "bg-[#C4A77D]/15 text-[#F8F7F4]"
                    : "bg-white/[0.04] text-[#D9D4CC]"
                }`}
              >
                {isSelected ? "Selected" : "Choose"}
              </span>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

export default AvailableSlots;