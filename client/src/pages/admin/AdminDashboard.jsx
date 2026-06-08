import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FileQuestion,
  FileText,
  FolderKanban,
  Layers,
  Star,
  UsersRound,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../lib/axios";
import { formatDate } from "../../lib/helpers";
import useInitialLoad from "../../hooks/useInitialLoad";

const quickActions = [
  {
    title: "Review website requests",
    description: "Open submitted website requests and update their status.",
    to: "/admin/requests",
  },
  {
    title: "Manage call slots",
    description: "Create available times for clients to book calls.",
    to: "/admin/control/slots",
  },
  {
    title: "View appointments",
    description: "Check booked calls and add notes after conversations.",
    to: "/admin/appointments",
  },
  {
    title: "Manage testimonials",
    description: "Approve client reviews or add manual testimonials.",
    to: "/admin/clients/reviews",
  },
  {
    title: "Manage selected work",
    description: "Add and edit projects shown on the Work page.",
    to: "/admin/control/projects",
  },
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/dashboard/admin");

      setDashboard(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load dashboard stats."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchDashboard);

  const statsCards = useMemo(() => {
    const stats = dashboard?.stats;

    if (!stats) return [];

    return [
      {
        label: "Website requests",
        value: stats.requests.total,
        note: `${stats.requests.new} new`,
        icon: FileText,
        to: "/admin/requests",
      },
      {
        label: "Booked calls",
        value: stats.appointments.total,
        note: `${stats.appointments.pending} pending`,
        icon: CalendarDays,
        to: "/admin/appointments",
      },
      {
        label: "Pending reviews",
        value: stats.reviews.pending,
        note: `${stats.reviews.approved} approved`,
        icon: Star,
        to: "/admin/clients/reviews",
      },
      {
        label: "Clients",
        value: stats.clients.total,
        note: "Client accounts",
        icon: UsersRound,
        to: "/admin/clients",
      },
      {
        label: "Available slots",
        value: stats.slots.available,
        note: `${stats.slots.booked} booked`,
        icon: Layers,
        to: "/admin/control/slots",
      },
      {
        label: "Visible projects",
        value: stats.projects.visible,
        note: `${stats.projects.featured} featured`,
        icon: FolderKanban,
        to: "/admin/control/projects",
      },
      {
        label: "Visible FAQ",
        value: stats.faqs.visible,
        note: `${stats.faqs.total} total`,
        icon: FileQuestion,
        to: "/admin/control/faq",
      },
    ];
  }, [dashboard]);

  if (isLoading) {
    return <Loader text="Loading Web District dashboard..." />;
  }

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              Overview
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Manage the Web District platform.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
              Track the real activity behind requests, calls, reviews, selected
              work, services, FAQ, and client accounts.
            </p>
          </div>

          <Button type="button" variant="secondary" onClick={fetchDashboard}>
            Refresh stats
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <LatestRequests items={dashboard?.latest?.requests || []} />
        <LatestAppointments items={dashboard?.latest?.appointments || []} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="p-6">
            <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
              {action.title}
            </h3>

            <p className="mt-3 min-h-[84px] leading-7 text-[#D9D4CC]">
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

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <Card className="p-5 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#D9D4CC]">{stat.label}</p>
          <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-[#D9D4CC]">{stat.note}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-5">
        <Button to={stat.to} variant="secondary">
          View
        </Button>
      </div>
    </Card>
  );
}

function LatestRequests({ items }) {
  return (
    <LatestCard title="Latest requests" actionTo="/admin/requests">
      {items.length ? (
        items.map((item) => (
          <LatestItem
            key={item._id}
            title={item.businessName || item.name}
            subtitle={item.websiteType}
            date={item.createdAt}
            status={item.status}
          />
        ))
      ) : (
        <p className="text-sm text-[#D9D4CC]">No requests yet.</p>
      )}
    </LatestCard>
  );
}

function LatestAppointments({ items }) {
  return (
    <LatestCard title="Latest calls" actionTo="/admin/appointments">
      {items.length ? (
        items.map((item) => (
          <LatestItem
            key={item._id}
            title={item.businessName || item.name}
            subtitle={item.slot ? `${item.slot.date} • ${item.slot.startTime}` : item.topic}
            date={item.createdAt}
            status={item.status}
          />
        ))
      ) : (
        <p className="text-sm text-[#D9D4CC]">No appointments yet.</p>
      )}
    </LatestCard>
  );
}

function LatestCard({ title, actionTo, children }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
          {title}
        </h3>

        <Button to={actionTo} variant="ghost">
          View all
        </Button>
      </div>

      <div className="grid gap-3">{children}</div>
    </Card>
  );
}

function LatestItem({ title, subtitle, date, status }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        <span className="text-xs text-[#D9D4CC]">{formatDate(date)}</span>
      </div>

      <p className="font-semibold text-[#F8F7F4]">{title}</p>
      <p className="mt-1 text-sm text-[#D9D4CC]">{subtitle}</p>
    </div>
  );
}

export default AdminDashboard;
