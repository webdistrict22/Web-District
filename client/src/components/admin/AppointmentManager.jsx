import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  FileText,
  Mail,
  Phone,
  Search,
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
import { formatSlotDisplayParts } from "../start/slotFormatting";
import AdminEmptyState from "./AdminEmptyState";
import AdminMetric from "./AdminMetric";
import AdminPageHeader from "./AdminPageHeader";
import AdminToolbar from "./AdminToolbar";
import AdminWorkspace from "./AdminWorkspace";

const appointmentStatuses = ["Pending", "Accepted", "Cancelled", "Rescheduled", "Done"];

function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [drafts, setDrafts] = useState({});

  const fetchAppointments = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const params = { page, limit: 20 };

      if (filters.status !== "All") {
        params.status = filters.status;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const { data } = await api.get("/appointments", { params });

      const loadedAppointments = data.appointments || [];
      setAppointments(loadedAppointments);
      setPagination(data.pagination || null);

      const nextDrafts = {};

      loadedAppointments.forEach((appointment) => {
        nextDrafts[appointment._id] = {
          status: appointment.status,
          adminNotes: appointment.adminNotes || "",
          notes: appointment.notes || "",
        };
      });

      setDrafts(nextDrafts);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load call appointments.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchAppointments);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((item) => item.status === "Pending").length,
      accepted: appointments.filter((item) => item.status === "Accepted").length,
      done: appointments.filter((item) => item.status === "Done").length,
    };
  }, [appointments]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateDraft = (appointmentId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [appointmentId]: {
        ...prev[appointmentId],
        [field]: value,
      },
    }));
  };

  const handleApplyFilters = () => {
    fetchAppointments(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
    });

    setTimeout(() => {
      fetchAppointments(1);
    }, 0);
  };

  const handleUpdateAppointment = async (appointmentId) => {
    const draft = drafts[appointmentId];

    if (!draft) return;

    try {
      setUpdatingId(appointmentId);

      const { data } = await api.put(`/appointments/${appointmentId}`, {
        status: draft.status,
        adminNotes: draft.adminNotes,
        notes: draft.notes,
      });

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId ? data.appointment : appointment
        )
      );

      toast.success("Appointment updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update appointment."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    const confirmed = await confirmAction({
      title: "Archive appointment?",
      message:
        "This removes the appointment from active views and releases its call slot while retaining audit history.",
      confirmText: "Archive",
    });

    if (!confirmed) return;

    try {
      setDeletingId(appointmentId);

      await api.delete(`/appointments/${appointmentId}`);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== appointmentId)
      );

      toast.success("Appointment archived and slot released successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to archive appointment."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="wd-admin-page">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Call appointments"
        description="Review booked calls, manage their status, and keep client and internal notes together."
        action={
          <Button
            to="/admin/control/slots"
            variant="secondary"
            className="wd-admin-action"
          >
            Manage slots
          </Button>
        }
      />

      <AdminWorkspace>
        <div className="wd-admin-metrics" aria-label="Appointment metrics">
          <StatCard label="Total calls" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Accepted" value={stats.accepted} />
          <StatCard label="Done" value={stats.done} />
        </div>

        <AdminToolbar className="wd-admin-appointment-toolbar">
          <Input
            label="Search"
            placeholder="Search name, business, email, phone, or topic"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
          >
            <option>All</option>
            {appointmentStatuses.map((status) => (
              <option key={status}>{status}</option>
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
            disabled={!filters.search.trim() && filters.status === "All"}
          >
            Reset
          </Button>
        </AdminToolbar>

        {isLoading ? (
        <Loader text="Loading call appointments..." />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchAppointments} />
      ) : appointments.length ? (
        <div className="wd-admin-record-list">
          {appointments.map((appointment) => (
            <AdminAppointmentCard
              key={appointment._id}
              appointment={appointment}
              draft={drafts[appointment._id]}
              updateDraft={updateDraft}
              onUpdate={handleUpdateAppointment}
              onDelete={handleDeleteAppointment}
              isUpdating={updatingId === appointment._id}
              isDeleting={deletingId === appointment._id}
            />
          ))}
          <PaginationControls
            pagination={pagination}
            onPageChange={fetchAppointments}
            disabled={isLoading}
            tone="light"
          />
        </div>
      ) : (
          <AdminEmptyState
          title="No call appointments found"
          description="Booked call appointments from clients will appear here."
        />
        )}
      </AdminWorkspace>
    </div>
  );
}

function AdminAppointmentCard({
  appointment,
  draft,
  updateDraft,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  if (!draft) return null;
  const slotDisplay = appointment.slot
    ? formatSlotDisplayParts(appointment.slot, "en")
    : null;

  return (
    <Card className="wd-admin-record wd-admin-managed-record overflow-hidden">
      <div className="wd-admin-managed-record__grid">
        <div className="wd-admin-managed-record__body">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={appointment.status} tone="light" />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              Booked {formatDate(appointment.createdAt)}
            </span>
          </div>

          <h3 className="font-display wd-value-wrap text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {appointment.businessName || appointment.name}
          </h3>

          <p className="wd-value-wrap mt-2 text-sm text-[#D9D4CC]">
            Submitted by {appointment.name}
          </p>

          <p className="wd-value-wrap mt-5 leading-8 text-[#D9D4CC]">
            {appointment.topic}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={CalendarDays}
              label="Call date"
              value={slotDisplay?.date || "Slot not found"}
            />
            <InfoItem
              icon={Clock}
              label="Time"
              value={
                slotDisplay
                  ? `${slotDisplay.timeRange} (${slotDisplay.timezoneLabel})`
                  : "—"
              }
            />
            <InfoItem icon={Phone} label="Phone" value={appointment.phone} ltr />
            <InfoItem icon={Mail} label="Email" value={appointment.email} ltr />
          </div>

          {appointment.client && (
            <div className="wd-admin-linked-client">
              <p className="text-sm font-semibold text-[#D9D4CC]">
                Linked client account
              </p>
              <p className="wd-value-wrap mt-1 text-sm text-[#D9D4CC]">
                {appointment.client.name} —{" "}
                <span className="wd-ltr inline" dir="ltr">
                  {appointment.client.email}
                </span>
              </p>
            </div>
          )}
        </div>

        <aside className="wd-admin-record-editor" aria-label={`Manage ${appointment.businessName || appointment.name}`}>
          <div className="wd-admin-record-editor__fields">
            <Select
              label="Appointment status"
              value={draft.status}
              onChange={(e) =>
                updateDraft(appointment._id, "status", e.target.value)
              }
            >
              {appointmentStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>

            <Textarea
              label="Client notes"
              placeholder="Notes submitted by the client..."
              value={draft.notes}
              onChange={(e) =>
                updateDraft(appointment._id, "notes", e.target.value)
              }
              rows={4}
            />

            <Textarea
              label="Admin notes"
              placeholder="Internal call notes, follow-up plan, or next step..."
              value={draft.adminNotes}
              onChange={(e) =>
                updateDraft(appointment._id, "adminNotes", e.target.value)
              }
              rows={5}
            />

            <div className="grid gap-3 sm:grid-cols-2">
  <Button
    type="button"
    onClick={() => onUpdate(appointment._id)}
    disabled={isUpdating}
  >
    {isUpdating ? "Saving..." : "Save changes"}
  </Button>

  <Button
    to={`/admin/contracts?source=appointment&id=${appointment._id}`}
    variant="secondary"
    icon={false}
  >
    <FileText size={17} />
    Create contract
  </Button>

  <button
    type="button"
    onClick={() => onDelete(appointment._id)}
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

export default AppointmentManager;
