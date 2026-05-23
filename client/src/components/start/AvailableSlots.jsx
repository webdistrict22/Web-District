import { CalendarDays } from "lucide-react";
import Card from "../common/Card";

function AvailableSlots({ slots, selectedSlot, setSelectedSlot, isLoading }) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-[#94A3B8]">Loading available call slots...</p>
      </Card>
    );
  }

  if (!slots.length) {
    return (
      <Card className="p-6">
        <p className="font-semibold text-white">No call slots available yet.</p>
        <p className="mt-2 leading-7 text-[#94A3B8]">
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
                isSelected ? "border-[#C69A4E]/60" : "hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="font-semibold text-white">{slot.date}</p>
                  <p className="text-sm text-[#94A3B8]">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isSelected
                    ? "bg-[#C69A4E]/15 text-[#F1D08B]"
                    : "bg-white/[0.04] text-[#94A3B8]"
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