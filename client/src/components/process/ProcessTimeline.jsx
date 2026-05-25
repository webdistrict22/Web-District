import { CheckCircle2 } from "lucide-react";
import Card from "../common/Card";

function ProcessTimeline({ steps, cardClassName = "" }) {
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[#C4A77D]/0 via-[#C4A77D]/45 to-[#C4A77D]/0 lg:block" />

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="relative grid gap-5 lg:grid-cols-[80px_1fr]">
            <div className="hidden lg:flex">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4A77D]/35 bg-[#080808] text-[#F8F7F4]">
                <span className="font-display text-sm font-bold">{step.number}</span>
              </div>
            </div>

            <Card className={`p-6 md:p-8 ${cardClassName}`}>
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="mb-3 font-display text-sm font-bold text-[#C4A77D] lg:hidden">
                    {step.number}
                  </p>

                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
                    {step.subtitle}
                  </p>

                  <h3 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-8 text-[#D9D4CC]">
                    {step.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {step.points.map((point) => (
                    <div
                      key={point}
                      className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-[#D9D4CC]"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-[#C4A77D]"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessTimeline;
