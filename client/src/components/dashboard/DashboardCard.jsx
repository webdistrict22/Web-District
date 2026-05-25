import Card from "../common/Card";

function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  action,
  className = "",
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <p className="text-sm text-[#D9D4CC]">{title}</p>}

          {value !== undefined && (
            <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
              {value}
            </p>
          )}

          {description && (
            <p className="mt-2 text-sm leading-6 text-[#D9D4CC]">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
            <Icon size={20} />
          </div>
        )}
      </div>

      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export default DashboardCard;