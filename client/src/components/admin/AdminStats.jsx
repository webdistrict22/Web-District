import DashboardCard from "../dashboard/DashboardCard";

function AdminStats({ stats = [] }) {
  if (!stats.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <DashboardCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          description={stat.description || stat.note}
          icon={stat.icon}
          action={stat.action}
        />
      ))}
    </div>
  );
}

export default AdminStats;