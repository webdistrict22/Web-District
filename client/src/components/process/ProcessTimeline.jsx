import { CheckCircle2 } from "lucide-react";
import Card from "../common/Card";

function ProcessTimeline({ steps }) {
  return (
    <div className="relative">
      <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-[#C69A4E]/0 via-[#C69A4E]/45 to-[#C69A4E]/0 lg:block" />

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.number} className="relative grid gap-5 lg:grid-cols-[80px_1fr]">
            <div className="hidden lg:flex">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C69A4E]/35 bg-[#0A1A2D] text-[#F1D08B]">
                <span className="font-display text-sm font-bold">{step.number}</span>
              </div>
            </div>

            <Card className="p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="mb-3 font-display text-sm font-bold text-[#C69A4E] lg:hidden">
                    {step.number}
                  </p>

                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
                    {step.subtitle}
                  </p>

                  <h3 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-8 text-[#94A3B8]">
                    {step.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {step.points.map((point) => (
                    <div
                      key={point}
                      className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-[#CBD5E1]"
                    >
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-[#C69A4E]"
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