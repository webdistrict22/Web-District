import { ArrowRight } from "lucide-react";
import Card from "../common/Card";

function AfterStartOptions({ options }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {options.map((option) => (
        <Card key={option.title} className="p-6 md:p-8">
          <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">
            {option.title}
          </h3>

          <p className="mt-4 leading-8 text-[#94A3B8]">
            {option.description}
          </p>

          <div className="mt-6 space-y-3">
            {option.steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C69A4E]/15 text-xs font-bold text-[#F1D08B]">
                  {index + 1}
                </span>

                <span className="text-sm text-[#CBD5E1]">{step}</span>

                <ArrowRight size={15} className="ml-auto hidden text-[#C69A4E] sm:block" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default AfterStartOptions;