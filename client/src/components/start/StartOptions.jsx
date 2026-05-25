import { CalendarDays, CheckCircle2, FileText } from "lucide-react";
import Card from "../common/Card";

function StartOptions({ activeOption, setActiveOption, cardClassName = "", className = "" }) {
  const options = [
    {
      id: "request",
      icon: FileText,
      title: "Send a project request",
      description: "Best if you already know the website you need.",
    },
    {
      id: "call",
      icon: CalendarDays,
      title: "Book a call",
      description: "Best if you want to discuss the direction first.",
    },
  ];

  return (
    <Card className={`p-6 lg:sticky lg:top-28 ${cardClassName} ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#C4A77D]">
        Choose your way
      </p>

      <h2 className="font-display mt-4 text-4xl font-bold leading-[0.95] tracking-[-0.06em] text-[#F8F7F4]">
        Start with the path that fits.
      </h2>

      <p className="mt-4 text-sm leading-7 text-[#D9D4CC]">
        Send the request now, or book a call if the direction needs shaping first.
      </p>

      <div className="mt-7 grid gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = activeOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveOption(option.id)}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                isActive
                  ? "border-[#C4A77D]/55 bg-[#C4A77D]/14 text-[#F8F7F4]"
                  : "border-white/10 bg-white/[0.03] text-[#D9D4CC] hover:border-[#C4A77D]/30 hover:text-[#F8F7F4]"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
                <Icon size={22} />
              </span>

              <span className="min-w-0">
                <span className="block font-semibold text-[#F8F7F4]">
                  {option.title}
                </span>

                <span className="mt-1 block text-sm leading-6 text-[#D9D4CC]">
                  {option.description}
                </span>
              </span>

              {isActive && (
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-[#C4A77D]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-sm leading-7 text-[#D9D4CC]">
          Logged-in clients can track requests and appointments from their dashboard.
        </p>
      </div>
    </Card>
  );
}

export default StartOptions;
