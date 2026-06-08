import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import AvailableSlots from "./AvailableSlots";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

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
  const { getErrorMessage, t } = useLanguage();
  const navigate = useNavigate();

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const fetchSlots = async () => {
    try {
      setIsSlotsLoading(true);
      const { data } = await api.get("/slots/available");
      setSlots(data.slots || []);
    } catch {
      toast.error(t("start.callForm.loadError"));
    } finally {
      setIsSlotsLoading(false);
    }
  };

  useInitialLoad(fetchSlots);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const detailsMessage = t("start.callForm.validationDetails");
    const nextErrors = {
      slot: selectedSlot ? "" : t("start.callForm.validationSlot"),
      name: form.name ? "" : detailsMessage,
      phone: form.phone ? "" : detailsMessage,
      email: form.email ? "" : detailsMessage,
      topic: form.topic ? "" : detailsMessage,
    };

    if (
      nextErrors.slot ||
      nextErrors.name ||
      nextErrors.phone ||
      nextErrors.email ||
      nextErrors.topic
    ) {
      const message = nextErrors.slot || detailsMessage;
      setFieldErrors(nextErrors);
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      await api.post("/appointments", {
        slot: selectedSlot,
        ...form,
      });

      toast.success(
        isAuthenticated
          ? t("start.callForm.successLoggedIn")
          : t("start.callForm.success")
      );

      setForm({
        ...initialForm,
        name: user?.name || "",
        businessName: user?.businessName || "",
        phone: user?.phone || "",
        email: user?.email || "",
      });

      setSelectedSlot("");

      navigate("/success?type=call");
    } catch (error) {
      const message = getErrorMessage(error, "start.callForm.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`p-6 md:p-8 ${className}`}>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          {t("start.callForm.eyebrow")}
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          {t("start.callForm.title")}
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#D9D4CC]">
          {t("start.callForm.description")}
        </p>
      </div>

      {isAuthenticated && (
        <div className="mb-6 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-4">
          <p className="text-sm leading-7 text-[#F8F7F4]">
            {t("start.callForm.bookingAs", undefined, { name: user?.name })}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p
            id="available-slots-label"
            className="mb-4 font-semibold text-[#F8F7F4]"
          >
            {t("start.callForm.availableSlots")}
          </p>
          <AvailableSlots
            slots={slots}
            selectedSlot={selectedSlot}
            setSelectedSlot={(slotId) => {
              setSelectedSlot(slotId);
              if (slotId) {
                setFieldErrors((prev) => ({ ...prev, slot: "" }));
                setFormError("");
              }
            }}
            isLoading={isSlotsLoading}
            labelId="available-slots-label"
            errorId={fieldErrors.slot ? "available-slots-error" : undefined}
          />
          {fieldErrors.slot && (
            <p
              id="available-slots-error"
              role="alert"
              className="mt-2 text-sm text-[#C4A77D]"
            >
              {fieldErrors.slot}
            </p>
          )}
        </div>

        <div className="grid gap-5">
          {formError && (
            <p
              role="alert"
              className="rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/8 p-3 text-sm text-[#F8F7F4]"
            >
              {formError}
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label={t("start.requestForm.name")}
              name="name"
              autoComplete="name"
              required
              error={fieldErrors.name}
              placeholder={t("start.requestForm.namePlaceholder")}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />

            <Input
              label={t("start.requestForm.businessName")}
              name="businessName"
              autoComplete="organization"
              placeholder={t("start.requestForm.businessNamePlaceholder")}
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />

            <Input
              label={t("start.requestForm.phone")}
              type="tel"
              name="phone"
              autoComplete="tel"
              required
              error={fieldErrors.phone}
              placeholder={t("start.requestForm.phonePlaceholder")}
              className="wd-ltr"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />

            <Input
              label={t("start.requestForm.email")}
              type="email"
              name="email"
              autoComplete="email"
              required
              error={fieldErrors.email}
              placeholder={t("start.requestForm.emailPlaceholder")}
              className="wd-ltr"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <Input
            label={t("start.callForm.topic")}
            name="topic"
            required
            error={fieldErrors.topic}
            placeholder={t("start.callForm.topicPlaceholder")}
            value={form.topic}
            onChange={(e) => updateField("topic", e.target.value)}
          />

          <Textarea
            label={t("start.callForm.notes")}
            name="notes"
            placeholder={t("start.callForm.notesPlaceholder")}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t("start.callForm.submitting")
                : t("start.callForm.submit")}
            </Button>
            <span className="sr-only" aria-live="polite">
              {isSubmitting ? t("start.callForm.submitting") : ""}
            </span>

            {isAuthenticated && (
              <Button to="/account/appointments" variant="secondary">
                {t("start.callForm.myAppointments")}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}

export default BookCallForm;
