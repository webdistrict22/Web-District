import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import AvailableSlots from "./AvailableSlots";

const initialForm = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  topic: "",
  notes: "",
};

function BookCallForm({ className = "" }) {
  const { isAuthenticated, user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: user?.name || "",
    businessName: user?.businessName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  }));

  const [isSlotsLoading, setIsSlotsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchSlots = async () => {
    try {
      setIsSlotsLoading(true);
      const { data } = await api.get("/slots/available");
      setSlots(data.slots || []);
    } catch (error) {
      toast.error("Failed to load available call slots.");
    } finally {
      setIsSlotsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.error("Please choose a call slot.");
      return;
    }

    if (!form.name || !form.phone || !form.email || !form.topic) {
      toast.error("Please fill name, phone, email, and discussion topic.");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/appointments", {
        slot: selectedSlot,
        ...form,
      });

      toast.success(
        isAuthenticated
          ? "Call appointment booked. You can track it in your dashboard."
          : "Call appointment booked successfully."
      );

      setForm({
        ...initialForm,
        name: user?.name || "",
        businessName: user?.businessName || "",
        phone: user?.phone || "",
        email: user?.email || "",
      });

      setSelectedSlot("");
      fetchSlots();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`p-6 md:p-8 ${className}`}>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          Book a call
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Choose a time to talk.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#D9D4CC]">
          Pick an available call slot and tell us what you want to discuss.
        </p>
      </div>

      {isAuthenticated && (
        <div className="mb-6 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-4">
          <p className="text-sm leading-7 text-[#F8F7F4]">
            You are booking as {user?.name}. This appointment will appear in your
            client dashboard.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p className="mb-4 font-semibold text-[#F8F7F4]">Available slots</p>
          <AvailableSlots
            slots={slots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            isLoading={isSlotsLoading}
          />
        </div>

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Name *"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />

            <Input
              label="Business name"
              placeholder="Business / brand name"
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />

            <Input
              label="Phone / WhatsApp *"
              placeholder="011..."
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />

            <Input
              label="Email *"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <Input
            label="What do you want to discuss? *"
            placeholder="Example: I want an online store for my brand"
            value={form.topic}
            onChange={(e) => updateField("topic", e.target.value)}
          />

          <Textarea
            label="Optional notes"
            placeholder="Any extra details before the call?"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Book call appointment"}
            </Button>

            {isAuthenticated && (
              <Button to="/account/appointments" variant="secondary">
                My appointments
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}

export default BookCallForm;
