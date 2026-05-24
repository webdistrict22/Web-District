import { CheckCircle2, CircleDashed } from "lucide-react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";

const defaultSteps = ["Draft", "Sent", "Accepted", "In Progress", "Completed"];

function ProjectStatus({ title, description, status = "Draft", steps = defaultSteps }) {
  const currentIndex = steps.indexOf(status);

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <StatusBadge status={status} />

          {title && (
            <h3 className="font-display mt-4 text-2xl font-bold tracking-[-0.04em] text-white">
              {title}
            </h3>
          )}

          {description && (
            <p className="mt-3 max-w-3xl leading-7 text-[#94A3B8]">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => {
          const isDone = currentIndex >= index;
          const isCurrent = currentIndex === index;

          return (
            <div
              key={step}
              className={`rounded-2xl border p-4 ${
                isDone
                  ? "border-[#C69A4E]/30 bg-[#C69A4E]/10"
                  : "border-white/10 bg-white/[0.025]"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 size={18} className="text-[#C69A4E]" />
                ) : (
                  <CircleDashed size={18} className="text-[#64748B]" />
                )}

                <span
                  className={`text-sm font-semibold ${
                    isCurrent ? "text-[#F1D08B]" : "text-[#CBD5E1]"
                  }`}
                >
                  {step}
                </span>
              </div>

              <p className="text-xs leading-5 text-[#94A3B8]">
                {isCurrent
                  ? "Current stage"
                  : isDone
                    ? "Completed stage"
                    : "Upcoming stage"}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ProjectStatus;