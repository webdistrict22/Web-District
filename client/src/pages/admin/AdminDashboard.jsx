import { useMemo, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FileText,
  Star,
  UsersRound,
} from "lucide-react";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import AdminMetric from "../../components/admin/AdminMetric";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminWorkspace from "../../components/admin/AdminWorkspace";
import api from "../../lib/axios";
import { formatDate } from "../../lib/helpers";
import { formatSlotDisplayParts } from "../../components/start/slotFormatting";
import useInitialLoad from "../../hooks/useInitialLoad";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/dashboard/admin");
      setDashboard(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard stats.");
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
    ];
  }, [dashboard]);

  if (isLoading) return <Loader text="Loading Web District dashboard..." />;

  return (
    <div className="wd-admin-page">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Manage the Web District platform."
        description="Track requests, calls, reviews, and client activity from one operational workspace."
        action={
          <Button
            type="button"
            variant="secondary"
            className="wd-admin-action"
            onClick={fetchDashboard}
          >
            Refresh stats
          </Button>
        }
      />

      <AdminWorkspace title="Platform at a glance" className="wd-admin-overview-summary">
        <div className="wd-admin-metrics" aria-label="Platform metrics">
          {statsCards.map((stat) => (
            <AdminMetric key={stat.label} {...stat} />
          ))}
        </div>
      </AdminWorkspace>

      <AdminWorkspace title="Recent activity" className="wd-admin-overview-activity">
        <div className="wd-admin-dashboard-activity" aria-label="Latest activity">
          <LatestActivity
            title="Latest requests"
            actionTo="/admin/requests"
            items={dashboard?.latest?.requests || []}
            type="request"
          />
          <LatestActivity
            title="Latest calls"
            actionTo="/admin/appointments"
            items={dashboard?.latest?.appointments || []}
            type="appointment"
          />
        </div>
      </AdminWorkspace>
    </div>
  );
}

function LatestActivity({ title, actionTo, items, type }) {
  return (
    <section className="wd-admin-activity-panel">
      <div className="wd-admin-section-heading">
        <h2>{title}</h2>
        <Link to={actionTo} className="wd-admin-text-link">
          View all
        </Link>
      </div>

      <div className="wd-admin-activity-list">
        {items.length ? (
          items.map((item) => (
            <LatestItem key={item._id} item={item} type={type} />
          ))
        ) : (
          <p className="wd-admin-activity-empty">No {type === "request" ? "requests" : "appointments"} yet.</p>
        )}
      </div>
    </section>
  );
}

function LatestItem({ item, type }) {
  const slot = type === "appointment" && item.slot
    ? formatSlotDisplayParts(item.slot, "en")
    : null;
  const subtitle = type === "request"
    ? item.websiteType
    : slot?.date
      ? `${slot.date} · ${slot.timeRange}`
      : item.topic;

  return (
    <article className="wd-admin-activity-item">
      <div className="wd-admin-activity-item__copy">
        <div className="wd-admin-activity-item__status">
          <StatusBadge status={item.status} tone="light" />
          <time dateTime={item.createdAt}>{formatDate(item.createdAt, "en")}</time>
        </div>
        <h3>{item.businessName || item.name}</h3>
        <p>{subtitle}</p>
      </div>
    </article>
  );
}

export default AdminDashboard;
