import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useInitialLoad from "../../hooks/useInitialLoad";
import useLanguage from "../../hooks/useLanguage";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import AvailableSlots from "./AvailableSlots";
import StartSuccessState from "./StartSuccessState";
import { formatSlotSummary } from "./slotFormatting";
import { focusFirstInvalidControl } from "../../lib/a11y";
import { trackCustomEvent, trackLead } from "../../lib/metaPixel";

const initialForm = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  topic: "",
  notes: "",
};

function BookCallForm() {
  const { isAuthenticated, user } = useAuth();
  const { effectiveLanguage, getErrorMessage, t } = useLanguage();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirmedSummary, setConfirmedSummary] = useState("");
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

  const selectedSlotData = slots.find((slot) => slot._id === selectedSlot);
  const selectedSummary = formatSlotSummary(
    selectedSlotData,
    effectiveLanguage,
  );

  const updateField = (field, value) => {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [field]: "",
    }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
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
      const invalidFields = Object.keys(nextErrors).filter(
        (field) => nextErrors[field],
      );
      setFieldErrors(nextErrors);
      setFormError(nextErrors.slot || detailsMessage);
      focusFirstInvalidControl(formElement, invalidFields);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const { data } = await api.post("/appointments", {
        slot: selectedSlot,
        ...form,
      });

      const leadParams = {
        lead_type: "appointment_booking",
        content_name: "Call Booking",
        language: effectiveLanguage,
      };

      trackLead(leadParams);
      trackCustomEvent("AppointmentBookingSubmitted", leadParams);

      toast.success(
        isAuthenticated
          ? t("start.callForm.successLoggedIn")
          : t("start.callForm.success"),
      );

      const confirmedSlot = data.appointment?.slot || selectedSlotData;
      setConfirmedSummary(
        formatSlotSummary(confirmedSlot, effectiveLanguage),
      );
    } catch (error) {
      const message = getErrorMessage(error, "start.callForm.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedSummary) {
    return <StartSuccessState type="call" summary={confirmedSummary} />;
  }

  return (
    <div className="wd-start-form">
      <header className="wd-start-form__header">
        <div className="wd-start-form__header-copy">
          <p className="wd-start-form__eyebrow">
            {t("start.callForm.eyebrow")}
          </p>
          <h2>{t("start.callForm.title")}</h2>
          <p>{t("start.callForm.description")}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        {formError ? (
          <p role="alert" className="wd-start-form__error">
            {formError}
          </p>
        ) : null}

        <div className="wd-start-booking-layout">
          <section className="wd-start-booking-layout__slots">
            <div className="wd-start-booking-label">
              <p id="available-slots-label">
                {t("start.callForm.availableSlots")}
              </p>
              <span>{t("start.slots.nextDays")}</span>
            </div>
            <AvailableSlots
              slots={slots}
              selectedSlot={selectedSlot}
              setSelectedSlot={(slotId) => {
                setSelectedSlot(slotId);
                if (slotId) {
                  setFieldErrors((previousErrors) => ({
                    ...previousErrors,
                    slot: "",
                  }));
                  setFormError("");
                }
              }}
              isLoading={isSlotsLoading}
              labelId="available-slots-label"
              errorId={fieldErrors.slot ? "available-slots-error" : undefined}
            />
            {fieldErrors.slot ? (
              <p
                id="available-slots-error"
                role="alert"
                className="wd-start-slot-error"
              >
                {fieldErrors.slot}
              </p>
            ) : null}
          </section>

          <section className="wd-start-booking-layout__details">
            <div className="wd-start-call-field-grid">
              <Input
                tone="light"
                label={t("start.requestForm.name")}
                name="name"
                autoComplete="name"
                required
                error={fieldErrors.name}
                placeholder={t("start.requestForm.namePlaceholder")}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              <Input
                tone="light"
                label={t("start.requestForm.businessName")}
                name="businessName"
                autoComplete="organization"
                placeholder={t("start.requestForm.businessNamePlaceholder")}
                value={form.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
              />
              <Input
                tone="light"
                label={t("start.requestForm.phone")}
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                required
                error={fieldErrors.phone}
                placeholder={t("start.requestForm.phonePlaceholder")}
                className="wd-ltr"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              <Input
                tone="light"
                label={t("start.requestForm.email")}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                required
                error={fieldErrors.email}
                placeholder={t("start.requestForm.emailPlaceholder")}
                className="wd-ltr"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>

            <Input
              tone="light"
              label={t("start.callForm.topic")}
              name="topic"
              required
              error={fieldErrors.topic}
              placeholder={t("start.callForm.topicPlaceholder")}
              value={form.topic}
              onChange={(event) => updateField("topic", event.target.value)}
            />
            <Textarea
              tone="light"
              label={t("start.callForm.notes")}
              name="notes"
              rows={5}
              placeholder={t("start.callForm.notesPlaceholder")}
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />

            {selectedSummary ? (
              <div className="wd-start-booking-summary" aria-live="polite">
                <span>{t("start.callForm.summaryLabel")}</span>
                <strong dir="auto">{selectedSummary}</strong>
              </div>
            ) : null}

            <div className="wd-start-submit-row">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="wd-start-primary-button"
              >
                {isSubmitting
                  ? t("start.callForm.submitting")
                  : t("start.callForm.submit")}
              </Button>
              <span className="sr-only" aria-live="polite">
                {isSubmitting ? t("start.callForm.submitting") : ""}
              </span>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

export default BookCallForm;
