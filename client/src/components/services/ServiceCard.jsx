import { CheckCircle2 } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";

function ServiceCard({ service, index, className = "" }) {
  return (
    <Card className={`group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35 ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
          <span className="font-display text-sm font-bold">
            0{index + 1}
          </span>
        </div>

        <Badge>{service.label}</Badge>
      </div>

      <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
        {service.title}
      </h3>

      <p className="mt-4 leading-7 text-[#D9D4CC]">
        {service.description}
      </p>

      <div className="mt-6 space-y-3">
        {service.includes.map((item) => (
          <div key={item} className="flex gap-2 text-sm text-[#D9D4CC]">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#C4A77D]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ServiceCard;
