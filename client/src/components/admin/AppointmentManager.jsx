import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  FileText,
  Mail,
  MessageSquare,
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
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";
import { confirmAction } from "../../lib/alerts";

const appointmentStatuses = ["Pending", "Accepted", "Cancelled", "Rescheduled", "Done"];

function AppointmentManager() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [drafts, setDrafts] = useState({});

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);

      const params = {};

      if (filters.status !== "All") {
        params.status = filters.status;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const { data } = await api.get("/appointments", { params });

      const loadedAppointments = data.appointments || [];
      setAppointments(loadedAppointments);

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
      toast.error(
        error.response?.data?.message || "Failed to load call appointments."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    fetchAppointments();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
    });

    setTimeout(() => {
      fetchAppointments();
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
      title: "Delete appointment?",
      message:
        "This will delete the appointment and make the call slot available again.",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      setDeletingId(appointmentId);

      await api.delete(`/appointments/${appointmentId}`);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== appointmentId)
      );

      toast.success("Appointment deleted and slot freed successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete appointment."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              Admin dashboard
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Call appointments
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
              View booked calls, manage their status, and add notes after client conversations.
            </p>
          </div>

          <Button to="/admin/control/slots" variant="secondary">
            Manage slots
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total calls" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Accepted" value={stats.accepted} />
        <StatCard label="Done" value={stats.done} />
      </div>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto_auto] lg:items-end">
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

          <Button type="button" variant="secondary" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading call appointments..." />
      ) : appointments.length ? (
        <div className="grid gap-5">
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
        </div>
      ) : (
        <EmptyState
          title="No call appointments found"
          description="Booked call appointments from clients will appear here."
          actionText="Manage slots"
          actionTo="/admin/control/slots"
        />
      )}
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

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
        <div className="p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={appointment.status} />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              Booked {formatDate(appointment.createdAt)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {appointment.businessName || appointment.name}
          </h3>

          <p className="mt-2 text-sm text-[#D9D4CC]">
            Submitted by {appointment.name}
          </p>

          <p className="mt-5 leading-8 text-[#D9D4CC]">{appointment.topic}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={CalendarDays}
              label="Call date"
              value={appointment.slot?.date || "Slot not found"}
            />
            <InfoItem
              icon={Clock}
              label="Time"
              value={
                appointment.slot
                  ? `${appointment.slot.startTime} - ${appointment.slot.endTime}`
                  : "—"
              }
            />
            <InfoItem icon={Phone} label="Phone" value={appointment.phone} />
            <InfoItem icon={Mail} label="Email" value={appointment.email} />
          </div>

          {appointment.client && (
            <div className="mt-5 rounded-2xl border border-[#C4A77D]/15 bg-[#C4A77D]/5 p-4">
              <p className="text-sm font-semibold text-[#D9D4CC]">
                Linked client account
              </p>
              <p className="mt-1 text-sm text-[#D9D4CC]">
                {appointment.client.name} — {appointment.client.email}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/[0.025] p-6 xl:border-l xl:border-t-0">
          <div className="grid gap-5">
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

export default AppointmentManager;
