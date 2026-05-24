import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FileText,
  Mail,
  MessageSquare,
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
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";

function ClientManager() {
  const [clients, setClients] = useState([]);
  const [selectedClientData, setSelectedClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

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

  const fetchClients = async () => {
    try {
      setIsLoading(true);

      const params = {};

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.status !== "All") {
        params.status = filters.status;
      }

      const { data } = await api.get("/users/clients", { params });

      setClients(data.clients || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load clients.");
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

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    fetchClients();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
    });

    setTimeout(() => {
      fetchClients();
    }, 0);
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
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              Admin dashboard
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Clients
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#94A3B8]">
              View client accounts and their linked website requests, call
              appointments, and reviews.
            </p>
          </div>

          <Button to="/signup" variant="secondary">
            Open signup page
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total clients" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Disabled" value={stats.disabled} />
        <StatCard label="With requests" value={stats.withRequests} />
      </div>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto_auto] lg:items-end">
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

          <Button type="button" variant="secondary" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading client accounts..." />
      ) : clients.length ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-5">
            {clients.map((client) => (
              <ClientCard
                key={client._id}
                client={client}
                onViewDetails={fetchClientDetails}
                onToggleStatus={handleToggleStatus}
                isUpdating={updatingId === client._id}
                isSelected={selectedClientData?.client?._id === client._id}
              />
            ))}
          </div>

          <ClientDetailsPanel
            data={selectedClientData}
            isLoading={isDetailsLoading}
          />
        </div>
      ) : (
        <EmptyState
          title="No clients found"
          description="Client accounts will appear here after users sign up."
          actionText="Open signup page"
          actionTo="/signup"
        />
      )}
    </div>
  );
}

function ClientCard({
  client,
  onViewDetails,
  onToggleStatus,
  isUpdating,
  isSelected,
}) {
  return (
    <Card
      className={`p-6 transition ${
        isSelected ? "border-[#C69A4E]/50" : "hover:border-[#C69A4E]/25"
      }`}
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                client.isActive
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                  : "border-red-300/25 bg-red-300/10 text-red-200"
              }`}
            >
              {client.isActive ? "Active" : "Disabled"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
              Joined {formatDate(client.createdAt)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
            {client.name}
          </h3>

          <p className="mt-1 text-sm text-[#94A3B8]">
            {client.businessName || "No business name added"}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="secondary" onClick={() => onViewDetails(client._id)}>
            Details
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoItem icon={Mail} label="Email" value={client.email} />
        <InfoItem icon={Phone} label="Phone" value={client.phone || "Not added"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniStat label="Requests" value={client.counts?.requests || 0} />
        <MiniStat label="Calls" value={client.counts?.appointments || 0} />
        <MiniStat label="Reviews" value={client.counts?.reviews || 0} />
      </div>

      <div className="mt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onToggleStatus(client)}
          disabled={isUpdating}
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
      <Card className="sticky top-24 h-fit p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
          <UserRound size={24} />
        </div>

        <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.04em]">
          Select a client
        </h3>

        <p className="mt-3 leading-7 text-[#94A3B8]">
          Click Details on any client account to view linked requests,
          appointments, and reviews.
        </p>
      </Card>
    );
  }

  const { client, activity } = data;

  return (
    <div className="sticky top-24 grid h-fit gap-5">
      <Card className="p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              client.isActive
                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                : "border-red-300/25 bg-red-300/10 text-red-200"
            }`}
          >
            {client.isActive ? "Active" : "Disabled"}
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
            Client account
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
          {client.name}
        </h3>

        <p className="mt-2 text-[#94A3B8]">
          {client.businessName || "No business name added"}
        </p>

        <div className="mt-5 grid gap-3">
          <InfoItem icon={Mail} label="Email" value={client.email} />
          <InfoItem icon={Phone} label="Phone" value={client.phone || "Not added"} />
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
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
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
          <p className="text-sm text-[#94A3B8]">{emptyText}</p>
        )}
      </div>
    </Card>
  );
}

function ActivityItem({ title, subtitle, date, status }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={status} />
        <span className="text-xs text-[#64748B]">{formatDate(date)}</span>
      </div>

      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-[#94A3B8]">{subtitle}</p>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <Icon size={17} className="mt-0.5 shrink-0 text-[#C69A4E]" />
      <div className="min-w-0">
        <p className="text-xs text-[#64748B]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#CBD5E1]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className="font-display mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-[#94A3B8]">{label}</p>
      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-white">
        {value}
      </p>
    </Card>
  );
}

export default ClientManager;