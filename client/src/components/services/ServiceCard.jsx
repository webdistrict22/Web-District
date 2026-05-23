import { CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";

function ServiceCard({ service, index }) {
  return (
    <Card className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C69A4E]/35">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
          <span className="font-display text-sm font-bold">
            0{index + 1}
          </span>
        </div>

        <Badge>{service.label}</Badge>
      </div>

      <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
        {service.title}
      </h3>

      <p className="mt-4 leading-7 text-[#94A3B8]">
        {service.description}
      </p>

      <div className="mt-6 space-y-3">
        {service.includes.map((item) => (
          <div key={item} className="flex gap-2 text-sm text-[#CBD5E1]">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#C69A4E]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ServiceCard;