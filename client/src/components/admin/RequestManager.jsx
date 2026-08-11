import { useMemo, useState } from "react";
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
import ErrorState from "../common/ErrorState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";
import { confirmAction } from "../../lib/alerts";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../common/PaginationControls";
import AdminEmptyState from "./AdminEmptyState";
import AdminMetric from "./AdminMetric";
import AdminPageHeader from "./AdminPageHeader";
import AdminToolbar from "./AdminToolbar";
import AdminWorkspace from "./AdminWorkspace";

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
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    websiteType: "All",
  });

  const [drafts, setDrafts] = useState({});

  const fetchRequests = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const params = { page, limit: 20 };

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
      setPagination(data.pagination || null);

      const nextDrafts = {};

      loadedRequests.forEach((request) => {
        nextDrafts[request._id] = {
          status: request.status,
          adminNotes: request.adminNotes || "",
        };
      });

      setDrafts(nextDrafts);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load website requests.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchRequests);

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
    fetchRequests(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      websiteType: "All",
    });

    setTimeout(() => {
      fetchRequests(1);
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
    const confirmed = await confirmAction({
      title: "Archive website request?",
      message: "This removes the request from active views while preserving its audit history.",
      confirmText: "Archive",
    });

    if (!confirmed) return;

    try {
      setDeletingId(requestId);

      await api.delete(`/requests/${requestId}`);

      setRequests((prev) =>
        prev.filter((request) => request._id !== requestId)
      );

      toast.success("Request archived successfully.", { duration: 4000 });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to archive request."
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
    <div className="wd-admin-page">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Website requests"
        description="Filter submitted website requests, update progress, and keep internal follow-up notes close to the client brief."
        action={
          <Button to="/start" variant="secondary" className="wd-admin-action">
            Open start page
          </Button>
        }
      />

      <AdminWorkspace>
        <div className="wd-admin-metrics" aria-label="Request metrics">
          <StatCard label="Total requests" value={stats.total} />
          <StatCard label="New" value={stats.newRequests} />
          <StatCard label="In progress" value={stats.inProgress} />
          <StatCard label="Completed" value={stats.completed} />
        </div>

        <AdminToolbar className="wd-admin-request-toolbar">
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

          <Button
            type="button"
            variant="secondary"
            className="wd-admin-reset"
            onClick={handleResetFilters}
            disabled={
              !filters.search.trim() &&
              filters.status === "All" &&
              filters.websiteType === "All"
            }
          >
            Reset
          </Button>
        </AdminToolbar>

        {isLoading ? (
        <Loader text="Loading website requests..." />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchRequests} />
      ) : requests.length ? (
        <div className="wd-admin-record-list">
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
          <PaginationControls
            pagination={pagination}
            onPageChange={fetchRequests}
            disabled={isLoading}
            tone="light"
          />
        </div>
      ) : (
          <AdminEmptyState
          title="No website requests found"
          description="No requests match your current filters. New website requests will appear here."
        />
        )}
      </AdminWorkspace>
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
    <Card className="wd-admin-record wd-admin-managed-record overflow-hidden">
      <div className="wd-admin-managed-record__grid">
        <div className="wd-admin-managed-record__body">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} tone="light" />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              {request.websiteType}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              {formatDate(request.createdAt)}
            </span>
          </div>

          <h3 className="font-display wd-value-wrap text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {request.businessName || request.name}
          </h3>

          <p className="wd-value-wrap mt-2 text-sm text-[#D9D4CC]">
            Submitted by {request.name}
          </p>

          <p className="wd-value-wrap mt-5 leading-8 text-[#D9D4CC]">
            {request.projectDetails}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem icon={Phone} label="Phone" value={request.phone} ltr />
            <InfoItem icon={Mail} label="Email" value={request.email} ltr />
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
            <div className="wd-admin-linked-client">
              <p className="text-sm font-semibold text-[#D9D4CC]">
                Linked client account
              </p>
              <p className="wd-value-wrap mt-1 text-sm text-[#D9D4CC]">
                {request.client.name} —{" "}
                <span className="wd-ltr inline" dir="ltr">
                  {request.client.email}
                </span>
              </p>
            </div>
          )}
        </div>

        <aside className="wd-admin-record-editor" aria-label={`Manage ${request.businessName || request.name}`}>
          <div className="wd-admin-record-editor__fields">
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
    className="wd-admin-danger sm:col-span-2"
  >
    <Trash2 size={17} />
    {isDeleting ? "Archiving..." : "Archive"}
  </button>
</div>
          </div>
        </aside>
      </div>
    </Card>
  );
}

function StatCard({ label, value }) {
  return <AdminMetric label={label} value={value} />;
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

function MiniInfo({ label, value }) {
  return (
    <div className="wd-admin-mini-info">
      <p className="wd-admin-info-item__label">{label}</p>
      <p className="wd-admin-info-item__value wd-value-wrap">
        {value || "—"}
      </p>
    </div>
  );
}

export default RequestManager;
