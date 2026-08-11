import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FileText,
  Mail,
  Phone,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../common/PaginationControls";
import AdminEmptyState from "./AdminEmptyState";
import AdminMetric from "./AdminMetric";
import AdminToolbar from "./AdminToolbar";
import AdminWorkspace from "./AdminWorkspace";

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [expandedClientId, setExpandedClientId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchClients = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const params = { page, limit: 20 };

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.status !== "All") {
        params.status = filters.status;
      }

      const { data } = await api.get("/users/clients", { params });

      setClients(data.clients || []);
      setPagination(data.pagination || null);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load clients.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientDetails = async (clientId) => {
    try {
      setIsDetailsLoading(true);

      const { data } = await api.get(`/users/clients/${clientId}`);

      setSelectedClientData(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load client details."
      );
    } finally {
      setIsDetailsLoading(false);
    }
  };

  useInitialLoad(fetchClients);

  const handleApplyFilters = () => {
    fetchClients(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
    });

    setTimeout(() => {
      fetchClients(1);
    }, 0);
  };

  const handleToggleDetails = (client) => {
    if (expandedClientId === client._id) {
      setExpandedClientId("");
      setSelectedClientData(null);
      return;
    }

    setExpandedClientId(client._id);
    fetchClientDetails(client._id);
  };

  const handleToggleStatus = async (client) => {
    try {
      setUpdatingId(client._id);

      const { data } = await api.put(`/users/clients/${client._id}/status`, {
        isActive: !client.isActive,
      });

      setClients((prev) =>
        prev.map((item) => (item._id === client._id ? data.client : item))
      );

      if (selectedClientData?.client?._id === client._id) {
        setSelectedClientData((prev) => ({
          ...prev,
          client: data.client,
        }));
      }

      toast.success(data.message || "Client updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update client status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const stats = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter((client) => client.isActive).length,
      disabled: clients.filter((client) => !client.isActive).length,
      withRequests: clients.filter((client) => client.counts?.requests > 0).length,
    };
  }, [clients]);

  return (
    <div className="wd-admin-page">
      <AdminWorkspace
        title="Client accounts"
        description="Review account status and linked website activity."
        action={
          <Button to="/signup" variant="secondaryLight" className="wd-admin-action">
            Open signup page
          </Button>
        }
      >
        <div className="wd-admin-metrics" aria-label="Client metrics">
          <StatCard label="Total clients" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Disabled" value={stats.disabled} />
          <StatCard label="With requests" value={stats.withRequests} />
        </div>

        <AdminToolbar className="wd-admin-client-toolbar">
          <Input
            label="Search clients"
            placeholder="Search name, business, email, or phone"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Disabled</option>
          </Select>

          <Button type="button" onClick={handleApplyFilters} icon={false}>
            <Search size={17} />
            Apply
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="wd-admin-reset"
            onClick={handleResetFilters}
            disabled={!filters.search.trim() && filters.status === "All"}
          >
            Reset
          </Button>
        </AdminToolbar>

        {isLoading ? (
        <Loader text="Loading client accounts..." />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchClients} />
      ) : clients.length ? (
        <div className="wd-admin-client-workspace">
          <div className="wd-admin-record-list">
            {clients.map((client) => (
              <div key={client._id} className="wd-admin-client-entry">
                <ClientCard
                  client={client}
                  onToggleDetails={handleToggleDetails}
                  onToggleStatus={handleToggleStatus}
                  isUpdating={updatingId === client._id}
                  isExpanded={expandedClientId === client._id}
                  isDetailsLoading={isDetailsLoading && expandedClientId === client._id}
                />
                {expandedClientId === client._id ? (
                  <div className="wd-admin-client-detail-mobile">
                    <ClientDetailsPanel data={selectedClientData} isLoading={isDetailsLoading} />
                  </div>
                ) : null}
              </div>
            ))}
            <PaginationControls
              pagination={pagination}
              onPageChange={fetchClients}
              disabled={isLoading}
              tone="light"
            />
          </div>

          <div className="wd-admin-client-detail-desktop">
            <ClientDetailsPanel data={selectedClientData} isLoading={isDetailsLoading} />
          </div>
        </div>
      ) : (
          <AdminEmptyState
          title="No clients found"
          description="Client accounts will appear here after users sign up."
        />
        )}
      </AdminWorkspace>
    </div>
  );
}

function ClientCard({
  client,
  onToggleDetails,
  onToggleStatus,
  isUpdating,
  isExpanded,
  isDetailsLoading,
}) {
  return (
    <Card
      className={`wd-admin-record wd-admin-client-card${isExpanded ? " is-selected" : ""}`}
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                client.isActive
                  ? "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]"
                  : "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]"
              }`}
            >
              {client.isActive ? "Active" : "Disabled"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              Joined {formatDate(client.createdAt)}
            </span>
          </div>

          <h3 className="font-display wd-value-wrap text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {client.name}
          </h3>

          <p className="wd-value-wrap mt-1 text-sm text-[#D9D4CC]">
            {client.businessName || "No business name added"}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onToggleDetails(client)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Hide details" : "Show details"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoItem icon={Mail} label="Email" value={client.email} ltr />
        <InfoItem
          icon={Phone}
          label="Phone"
          value={client.phone || "Not added"}
          ltr
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Requests" value={client.counts?.requests || 0} />
        <MiniStat label="Calls" value={client.counts?.appointments || 0} />
        <MiniStat label="Reviews" value={client.counts?.reviews || 0} />
      </div>

      {isExpanded && (
        <div className="wd-admin-client-inline-summary">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              Client details
            </span>

            {isDetailsLoading && (
              <span className="rounded-full border border-[#C4A77D]/20 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
                Loading linked activity...
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Name" value={client.name} />
            <DetailItem
              label="Business"
              value={client.businessName || "Not added"}
            />
            <DetailItem label="Email" value={client.email} ltr />
            <DetailItem
              label="Phone"
              value={client.phone || "Not added"}
              ltr
            />
            <DetailItem label="Role" value={client.role || "client"} />
            <DetailItem label="Joined" value={formatDate(client.createdAt)} />
            <DetailItem label="Requests" value={client.counts?.requests ?? 0} />
            <DetailItem
              label="Calls"
              value={client.counts?.appointments ?? 0}
            />
            <DetailItem label="Reviews" value={client.counts?.reviews ?? 0} />
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onToggleStatus(client)}
          disabled={isUpdating}
          className={client.isActive ? "wd-admin-danger" : "wd-admin-action"}
        >
          {isUpdating
            ? "Updating..."
            : client.isActive
              ? "Disable account"
              : "Activate account"}
        </Button>
      </div>
    </Card>
  );
}

function ClientDetailsPanel({ data, isLoading }) {
  if (isLoading) {
    return <Loader text="Loading client details..." />;
  }

  if (!data) {
    return (
      <Card className="wd-admin-client-detail wd-admin-record">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
          <UserRound size={24} />
        </div>

        <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.04em]">
          Select a client
        </h3>

        <p className="mt-3 leading-7 text-[#D9D4CC]">
          Click Show details on any client account to view linked requests,
          appointments, and reviews.
        </p>
      </Card>
    );
  }

  const { client, activity } = data;

  return (
    <div className="wd-admin-client-detail-stack">
      <Card className="wd-admin-client-detail wd-admin-record">
        <div className="mb-5 flex flex-wrap gap-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              client.isActive
                ? "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]"
                : "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]"
            }`}
          >
            {client.isActive ? "Active" : "Disabled"}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
            Client account
          </span>
        </div>

        <h3 className="font-display wd-value-wrap text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
          {client.name}
        </h3>

        <p className="wd-value-wrap mt-2 text-[#D9D4CC]">
          {client.businessName || "No business name added"}
        </p>

        <div className="mt-5 grid gap-3">
          <InfoItem icon={Mail} label="Email" value={client.email} ltr />
          <InfoItem
            icon={Phone}
            label="Phone"
            value={client.phone || "Not added"}
            ltr
          />
          <InfoItem icon={CalendarDays} label="Joined" value={formatDate(client.createdAt)} />
        </div>
      </Card>

      <ActivityBlock
        title="Website requests"
        icon={FileText}
        emptyText="No linked requests."
        items={activity.requests}
        renderItem={(item) => (
          <ActivityItem
            key={item._id}
            title={item.businessName || item.name}
            subtitle={item.websiteType}
            date={item.createdAt}
            status={item.status}
          />
        )}
      />

      <ActivityBlock
        title="Appointments"
        icon={CalendarDays}
        emptyText="No linked appointments."
        items={activity.appointments}
        renderItem={(item) => (
          <ActivityItem
            key={item._id}
            title={item.businessName || item.name}
            subtitle={
              item.slot
                ? `${item.slot.date} • ${item.slot.startTime} - ${item.slot.endTime}`
                : item.topic
            }
            date={item.createdAt}
            status={item.status}
          />
        )}
      />

      <ActivityBlock
        title="Reviews"
        icon={Star}
        emptyText="No linked reviews."
        items={activity.reviews}
        renderItem={(item) => (
          <ActivityItem
            key={item._id}
            title={item.businessName || item.name}
            subtitle={item.message}
            date={item.createdAt}
            status={item.status}
          />
        )}
      />
    </div>
  );
}

function ActivityBlock({ title, icon: Icon, items, renderItem, emptyText }) {
  return (
    <section className="wd-admin-client-activity">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
          <Icon size={18} />
        </div>

        <h3 className="font-display text-xl font-bold tracking-[-0.04em]">
          {title}
        </h3>
      </div>

      <div className="grid gap-3">
        {items?.length ? (
          items.map(renderItem)
        ) : (
          <p className="text-sm text-[#D9D4CC]">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

function ActivityItem({ title, subtitle, date, status }) {
  return (
    <article className="wd-admin-client-activity-item">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={status} tone="light" />
        <span className="text-xs text-[#D9D4CC]">{formatDate(date)}</span>
      </div>

      <p className="wd-value-wrap font-semibold text-[#F8F7F4]">{title}</p>
      <p className="wd-value-wrap mt-1 line-clamp-2 text-sm text-[#D9D4CC]">
        {subtitle}
      </p>
    </article>
  );
}

function InfoItem({ icon: Icon, label, value, ltr = false }) {
  return (
    <div className="wd-admin-info-item">
      <Icon size={16} className="wd-admin-info-item__icon" />
      <div className="min-w-0 max-w-full">
        <p className="wd-admin-info-item__label">{label}</p>
        <p
          dir={ltr ? "ltr" : undefined}
          className={`wd-admin-info-item__value wd-value-wrap ${
            ltr ? "wd-ltr" : ""
          }`}
        >
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function DetailItem({ label, value, ltr = false }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "Not added" : value;

  return (
    <div className="wd-admin-mini-info">
      <p className="wd-admin-info-item__label">{label}</p>
      <p
          dir={ltr ? "ltr" : undefined}
          className={`wd-admin-info-item__value wd-value-wrap ${
          ltr ? "wd-ltr" : ""
        }`}
      >
        {displayValue}
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="wd-admin-client-count">
      <p>{label}</p>
      <strong className="font-display">{value}</strong>
    </div>
  );
}

function StatCard({ label, value }) {
  return <AdminMetric label={label} value={value} />;
}

export default ClientManager;
