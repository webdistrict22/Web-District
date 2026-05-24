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
          {title && <p className="text-sm text-[#94A3B8]">{title}</p>}

          {value !== undefined && (
            <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-white">
              {value}
            </p>
          )}

          {description && (
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
            <Icon size={20} />
          </div>
        )}
      </div>

      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export default DashboardCard;