import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Clock, Plus, Search, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const initialForm = {
  date: "",
  startTime: "",
  endTime: "",
  notes: "",
};

function SlotManager() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [filter, setFilter] = useState("All");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/slots");
      setSlots(data.slots || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load call slots.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const filteredSlots = useMemo(() => {
    if (filter === "Available") {
      return slots.filter((slot) => slot.isActive && !slot.isBooked);
    }

    if (filter === "Booked") {
      return slots.filter((slot) => slot.isBooked);
    }

    if (filter === "Inactive") {
      return slots.filter((slot) => !slot.isActive);
    }

    return slots;
  }, [slots, filter]);

  const stats = useMemo(() => {
    return {
      total: slots.length,
      available: slots.filter((slot) => slot.isActive && !slot.isBooked).length,
      booked: slots.filter((slot) => slot.isBooked).length,
      inactive: slots.filter((slot) => !slot.isActive).length,
    };
  }, [slots]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.startTime || !form.endTime) {
      toast.error("Please add date, start time, and end time.");
      return;
    }

    try {
      setIsSaving(true);

      if (editingId) {
        const { data } = await api.put(`/slots/${editingId}`, form);

        setSlots((prev) =>
          prev.map((slot) => (slot._id === editingId ? data.slot : slot))
        );

        toast.success("Call slot updated successfully.");
      } else {
        const { data } = await api.post("/slots", form);

        setSlots((prev) => [data.slot, ...prev]);

        toast.success("Call slot created successfully.");
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save call slot.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (slot) => {
    setEditingId(slot._id);
    setForm({
      date: slot.date || "",
      startTime: slot.startTime || "",
      endTime: slot.endTime || "",
      notes: slot.notes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleActive = async (slot) => {
    try {
      const { data } = await api.put(`/slots/${slot._id}`, {
        isActive: !slot.isActive,
      });

      setSlots((prev) =>
        prev.map((item) => (item._id === slot._id ? data.slot : item))
      );

      toast.success(data.slot.isActive ? "Slot activated." : "Slot disabled.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update slot.");
    }
  };

  const handleDelete = async (slotId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this call slot?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(slotId);

      await api.delete(`/slots/${slotId}`);

      setSlots((prev) => prev.filter((slot) => slot._id !== slotId));

      toast.success("Call slot deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete slot.");
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
              Available call slots
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
              Create and control the call times clients can book from the Start page.
            </p>
          </div>

          <Button to="/start" variant="secondary">
            View start page
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total slots" value={stats.total} />
        <StatCard label="Available" value={stats.available} />
        <StatCard label="Booked" value={stats.booked} />
        <StatCard label="Inactive" value={stats.inactive} />
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              {editingId ? "Edit slot" : "Create slot"}
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
              {editingId ? "Update call availability." : "Add a new available call time."}
            </h3>
          </div>

          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Date *"
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />

            <Input
              label="Start time *"
              type="time"
              value={form.startTime}
              onChange={(e) => updateField("startTime", e.target.value)}
            />

            <Input
              label="End time *"
              type="time"
              value={form.endTime}
              onChange={(e) => updateField("endTime", e.target.value)}
            />
          </div>

          <Textarea
            label="Notes"
            placeholder="Optional internal note for this slot..."
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />

          <div>
            <Button type="submit" disabled={isSaving} icon={false}>
              <Plus size={17} />
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save slot changes"
                  : "Create call slot"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-[#D9D4CC]">Slot list</p>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-[#D9D4CC]">
              <Search size={17} className="text-[#C4A77D]" />
              <span className="text-sm">Filter call slots by status</span>
            </div>
          </div>

          <Select
            label="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Available</option>
            <option>Booked</option>
            <option>Inactive</option>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading call slots..." />
      ) : filteredSlots.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredSlots.map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              isDeleting={deletingId === slot._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No call slots found"
          description="Create your first available slot so clients can book a discovery call."
        />
      )}
    </div>
  );
}

function SlotCard({ slot, onEdit, onToggleActive, onDelete, isDeleting }) {
  const status = slot.isBooked ? "Booked" : slot.isActive ? "Available" : "Inactive";

  const statusClass = slot.isBooked
    ? "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]"
    : slot.isActive
      ? "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]"
      : "border-[#D9D4CC]/18 bg-white/[0.025] text-[#D9D4CC]";

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass}`}>
            {status}
          </span>

          <h3 className="font-display mt-4 text-2xl font-bold tracking-[-0.04em]">
            {slot.date}
          </h3>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-[#D9D4CC]">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-[#C4A77D]" />
              {slot.date}
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-[#C4A77D]" />
              {slot.startTime} - {slot.endTime}
            </span>
          </div>
        </div>
      </div>

      {slot.notes && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <p className="text-sm leading-7 text-[#D9D4CC]">{slot.notes}</p>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button type="button" variant="secondary" onClick={() => onEdit(slot)}>
          Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onToggleActive(slot)}
          disabled={slot.isBooked}
        >
          {slot.isActive ? "Disable" : "Activate"}
        </Button>

        <button
          type="button"
          onClick={() => onDelete(slot._id)}
          disabled={slot.isBooked || isDeleting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-5 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={17} />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {slot.isBooked && (
        <p className="mt-4 text-sm text-[#D9D4CC]">
          Booked slots cannot be deleted or disabled until the appointment is removed.
        </p>
      )}
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

export default SlotManager;
