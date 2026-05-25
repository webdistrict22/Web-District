import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  FileText,
  Mail,
  Phone,
  Search,
  StickyNote,
  Trash2,
} from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";

const requestStatuses = [
  "New",
  "Reviewed",
  "Accepted",
  "Rejected",
  "In Progress",
  "Contract Sent",
  "Completed",
];

const websiteTypes = [
  "All",
  "Online Store",
  "Business Website",
  "Landing Page",
  "Custom Website",
];

function RequestManager() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    websiteType: "All",
  });

  const [drafts, setDrafts] = useState({});

  const fetchRequests = async () => {
    try {
      setIsLoading(true);

      const params = {};

      if (filters.status !== "All") {
        params.status = filters.status;
      }

      if (filters.websiteType !== "All") {
        params.websiteType = filters.websiteType;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const { data } = await api.get("/requests", { params });

      const loadedRequests = data.requests || [];
      setRequests(loadedRequests);

      const nextDrafts = {};

      loadedRequests.forEach((request) => {
        nextDrafts[request._id] = {
          status: request.status,
          adminNotes: request.adminNotes || "",
        };
      });

      setDrafts(nextDrafts);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load website requests."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateDraft = (requestId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value,
      },
    }));
  };

  const handleApplyFilters = () => {
    fetchRequests();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      websiteType: "All",
    });

    setTimeout(() => {
      fetchRequests();
    }, 0);
  };

  const handleUpdateRequest = async (requestId) => {
    const draft = drafts[requestId];

    if (!draft) return;

    try {
      setUpdatingId(requestId);

      const { data } = await api.put(`/requests/${requestId}`, {
        status: draft.status,
        adminNotes: draft.adminNotes,
      });

      setRequests((prev) =>
        prev.map((request) =>
          request._id === requestId ? data.request : request
        )
      );

      toast.success("Request updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update request."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this website request?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(requestId);

      await api.delete(`/requests/${requestId}`);

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

      toast.success("Request deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete request."
      );
    } finally {
      setDeletingId("");
    }
  };

  const stats = useMemo(() => {
    return {
      total: requests.length,
      newRequests: requests.filter((request) => request.status === "New")
        .length,
      inProgress: requests.filter(
        (request) => request.status === "In Progress"
      ).length,
      completed: requests.filter((request) => request.status === "Completed")
        .length,
    };
  }, [requests]);

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              Admin dashboard
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Website requests
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
              View website requests, filter by status or website type, update
              progress, and add internal admin notes.
            </p>
          </div>

          <Button to="/start" variant="secondary">
            Open start page
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total requests" value={stats.total} />
        <StatCard label="New" value={stats.newRequests} />
        <StatCard label="In progress" value={stats.inProgress} />
        <StatCard label="Completed" value={stats.completed} />
      </div>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.7fr_auto_auto] lg:items-end">
          <Input
            label="Search"
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
            {requestStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>

          <Select
            label="Website type"
            value={filters.websiteType}
            onChange={(e) => updateFilter("websiteType", e.target.value)}
          >
            {websiteTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
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
        <Loader text="Loading website requests..." />
      ) : requests.length ? (
        <div className="grid gap-5">
          {requests.map((request) => (
            <AdminRequestCard
              key={request._id}
              request={request}
              draft={drafts[request._id]}
              updateDraft={updateDraft}
              onUpdate={handleUpdateRequest}
              onDelete={handleDeleteRequest}
              isUpdating={updatingId === request._id}
              isDeleting={deletingId === request._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No website requests found"
          description="No requests match your current filters. New website requests will appear here."
          actionText="Open start page"
          actionTo="/start"
        />
      )}
    </div>
  );
}

function AdminRequestCard({
  request,
  draft,
  updateDraft,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  if (!draft) return null;

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
        <div className="p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              {request.websiteType}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              {formatDate(request.createdAt)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {request.businessName || request.name}
          </h3>

          <p className="mt-2 text-sm text-[#D9D4CC]">
            Submitted by {request.name}
          </p>

          <p className="mt-5 leading-8 text-[#D9D4CC]">
            {request.projectDetails}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem icon={Phone} label="Phone" value={request.phone} />
            <InfoItem icon={Mail} label="Email" value={request.email} />
            <InfoItem
              icon={CalendarDays}
              label="Deadline"
              value={request.deadline || "Not provided"}
            />
            <InfoItem
              icon={StickyNote}
              label="Budget"
              value={request.budgetRange || "Not provided"}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniInfo
              label="Brand identity"
              value={request.hasBrandIdentity}
            />
            <MiniInfo label="Content ready" value={request.hasContentReady} />
            <MiniInfo
              label="Preferred contact"
              value={request.preferredContactMethod}
            />
          </div>

          {request.client && (
            <div className="mt-5 rounded-2xl border border-[#C4A77D]/15 bg-[#C4A77D]/5 p-4">
              <p className="text-sm font-semibold text-[#D9D4CC]">
                Linked client account
              </p>
              <p className="mt-1 text-sm text-[#D9D4CC]">
                {request.client.name} — {request.client.email}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/[0.025] p-6 xl:border-l xl:border-t-0">
          <div className="grid gap-5">
            <Select
              label="Request status"
              value={draft.status}
              onChange={(e) =>
                updateDraft(request._id, "status", e.target.value)
              }
            >
              {requestStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>

            <Textarea
              label="Admin notes"
              placeholder="Internal notes, next steps, or client follow-up details..."
              value={draft.adminNotes}
              onChange={(e) =>
                updateDraft(request._id, "adminNotes", e.target.value)
              }
              rows={7}
            />

            <div className="grid gap-3 sm:grid-cols-2">
  <Button
    type="button"
    onClick={() => onUpdate(request._id)}
    disabled={isUpdating}
  >
    {isUpdating ? "Saving..." : "Save changes"}
  </Button>

  <Button
    to={`/admin/contracts?source=request&id=${request._id}`}
    variant="secondary"
    icon={false}
  >
    <FileText size={17} />
    Create contract
  </Button>

  <button
    type="button"
    onClick={() => onDelete(request._id)}
    disabled={isDeleting}
    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-5 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
  >
    <Trash2 size={17} />
    {isDeleting ? "Deleting..." : "Delete"}
  </button>
</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-[#D9D4CC]">{label}</p>
      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
        {value}
      </p>
    </Card>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <Icon size={17} className="mt-0.5 shrink-0 text-[#C4A77D]" />
      <div className="min-w-0">
        <p className="text-xs text-[#D9D4CC]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#D9D4CC]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs text-[#D9D4CC]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#D9D4CC]">
        {value || "—"}
      </p>
    </div>
  );
}

export default RequestManager;