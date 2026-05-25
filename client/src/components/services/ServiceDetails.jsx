import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

function ServiceDetails({ service, reverse = false }) {
  return (
    <div
      className={`grid gap-6 lg:grid-cols-2 lg:items-stretch ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <Card className="p-6 md:p-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-[#C4A77D]">
          {service.label}
        </p>

        <h3 className="font-display text-3xl font-bold tracking-[-0.05em] md:text-4xl">
          {service.title}
        </h3>

        <p className="mt-5 leading-8 text-[#D9D4CC]">
          {service.longDescription}
        </p>

        <div className="mt-7">
          <p className="mb-3 font-semibold text-[#F8F7F4]">Best for</p>

          <div className="flex flex-wrap gap-2">
            {service.bestFor.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-sm text-[#D9D4CC]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button to="/start">Start Your Project</Button>
        </div>
      </Card>

      <Card className="relative overflow-hidden p-6 md:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[#C4A77D]/10 blur-[70px]" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#C4A77D]/5 blur-[70px]" />

        <div className="relative">
          <div className="mb-8 flex items-center justify-between">
            <p className="font-semibold text-[#F8F7F4]">What can be included</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <div className="grid gap-3">
            {service.includes.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4"
              >
                <CheckCircle2 size={18} className="shrink-0 text-[#C4A77D]" />
                <span className="text-sm text-[#F8F7F4]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ServiceDetails;
