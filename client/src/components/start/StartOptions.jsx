import { CalendarDays, FileText } from "lucide-react";
import Card from "../common/Card";

function StartOptions({ activeOption, setActiveOption }) {
  const options = [
    {
      id: "request",
      icon: FileText,
      title: "Make a website request",
      description:
        "Best if you already know you need a website and want to submit your business details.",
    },
    {
      id: "call",
      icon: CalendarDays,
      title: "Book a call appointment",
      description:
        "Best if you want to discuss your website direction first before submitting full details.",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = activeOption === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setActiveOption(option.id)}
            className="text-left"
          >
            <Card
              className={`h-full p-6 transition duration-300 hover:-translate-y-1 ${
                isActive
                  ? "border-[#C69A4E]/60 shadow-[0_0_40px_rgba(198,154,78,0.12)]"
                  : ""
              }`}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
                <Icon size={22} />
              </div>

              <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">
                {option.title}
              </h3>

              <p className="mt-3 leading-7 text-[#94A3B8]">
                {option.description}
              </p>

              <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#C69A4E]">
                <span>{isActive ? "Selected" : "Choose this option"}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

export default StartOptions;