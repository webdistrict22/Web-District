import { CheckCircle2 } from "lucide-react";
import Card from "../common/Card";

function ClientRequirements({ requirements }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {requirements.map((group) => (
        <Card
          key={group.title}
          className="p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35"
        >
          <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
            {group.title}
          </h3>

          <div className="mt-5 space-y-3">
            {group.items.map((item) => (
              <div key={item} className="flex gap-2 text-sm text-[#D9D4CC]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C4A77D]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default ClientRequirements;