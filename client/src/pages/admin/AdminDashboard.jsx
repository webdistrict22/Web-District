import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const stats = [
  { label: "Website requests", value: "—" },
  { label: "Booked calls", value: "—" },
  { label: "Contact messages", value: "—" },
  { label: "Pending reviews", value: "—" },
];

const quickActions = [
  {
    title: "Review website requests",
    description: "Open submitted website requests and update their status.",
    to: "/admin/requests",
  },
  {
    title: "Manage call slots",
    description: "Create available times for clients to book calls.",
    to: "/admin/slots",
  },
  {
    title: "View appointments",
    description: "Check booked calls and add notes after conversations.",
    to: "/admin/appointments",
  },
  {
    title: "Read contact messages",
    description: "View messages submitted from the contact page.",
    to: "/admin/messages",
  },
];

function AdminDashboard() {
  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
          Overview
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Manage the Web District platform.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-[#94A3B8]">
          This dashboard controls requests, appointments, slots, projects,
          reviews, FAQ, packages, settings, and client data.
        </p>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <p className="text-sm text-[#94A3B8]">{stat.label}</p>
            <p className="font-display mt-3 text-4xl font-bold text-white">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="p-6">
            <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
              {action.title}
            </h3>

            <p className="mt-3 min-h-[84px] leading-7 text-[#94A3B8]">
              {action.description}
            </p>

            <div className="mt-6">
              <Button to={action.to} variant="secondary">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;