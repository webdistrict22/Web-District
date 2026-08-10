import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import { focusFirstInvalidControl } from "../../lib/a11y";
import { trackCustomEvent, trackLead } from "../../lib/metaPixel";
import { submitAndNavigateToSuccess } from "../../lib/successFlow";

const initialForm = {
  name: "",
  businessName: "",
  phone: "",
  email: "",
  websiteType: "Business Website",
  hasBrandIdentity: "Not sure",
  hasContentReady: "Partially",
  budgetRange: "",
  deadline: "",
  projectDetails: "",
  preferredContactMethod: "WhatsApp",
};

const websiteTypes = [
  "Online Store",
  "Business Website",
  "Portfolio & Personal Brand Website",
  "Landing Page",
  "Booking & Reservation Website",
  "Custom Platform & Dashboard",
];

function WebsiteRequestForm() {
  const submissionKey = useRef(crypto.randomUUID());
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { effectiveLanguage, getErrorMessage, t, translateValue } =
    useLanguage();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: user?.name || "",
    businessName: user?.businessName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const validationMessage = t("start.requestForm.validation");
    const nextErrors = {
      name: form.name ? "" : validationMessage,
      phone: form.phone ? "" : validationMessage,
      email: form.email ? "" : validationMessage,
      projectDetails: form.projectDetails ? "" : validationMessage,
    };

    if (
      nextErrors.name ||
      nextErrors.phone ||
      nextErrors.email ||
      nextErrors.projectDetails
    ) {
      const invalidFields = Object.keys(nextErrors).filter(
        (field) => nextErrors[field],
      );
      setFieldErrors(nextErrors);
      setFormError(validationMessage);
      focusFirstInvalidControl(formElement, invalidFields);
      return;
    }

    try {
      setIsLoading(true);
      setFormError("");

      await submitAndNavigateToSuccess({
        type: "request",
        navigate,
        submit: () => api.post(
          "/requests",
          { ...form, companyWebsite: "" },
          { headers: { "Idempotency-Key": submissionKey.current } },
        ),
        beforeNavigate: () => {
          const leadParams = {
            lead_type: "project_request",
            content_name: "Start Project Form",
            language: effectiveLanguage,
          };
          trackLead(leadParams);
          trackCustomEvent("StartProjectSubmitted", leadParams);
          toast.success(
            isAuthenticated
              ? t("start.requestForm.successLoggedIn")
              : t("start.requestForm.success"),
          );
        },
      });
    } catch (error) {
      const message = getErrorMessage(error, "start.requestForm.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wd-start-form">
      <header className="wd-start-form__header">
        <div className="wd-start-form__header-copy">
          <p className="wd-start-form__eyebrow">
            {t("start.requestForm.eyebrow")}
          </p>
          <h2>{t("start.requestForm.title")}</h2>
          <p>{t("start.requestForm.description")}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate aria-busy={isLoading}>
        <input type="text" name="companyWebsite" tabIndex="-1" autoComplete="off" className="sr-only" aria-hidden="true" />
        {formError ? (
          <p role="alert" className="wd-start-form__error">
            {formError}
          </p>
        ) : null}

        <fieldset className="wd-start-field-group">
          <legend>{t("start.requestForm.groups.contact")}</legend>
          <div className="wd-start-field-grid">
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
        </fieldset>

        <fieldset className="wd-start-field-group">
          <legend>{t("start.requestForm.groups.direction")}</legend>
          <div className="wd-start-field-grid">
            <Select
              tone="light"
              label={t("start.requestForm.websiteType")}
              name="websiteType"
              required
              value={form.websiteType}
              onChange={(event) =>
                updateField("websiteType", event.target.value)
              }
            >
              {websiteTypes.map((type) => (
                <option key={type} value={type}>
                  {translateValue("websiteTypes", type)}
                </option>
              ))}
            </Select>
            <Select
              tone="light"
              label={t("start.requestForm.preferredContact")}
              name="preferredContactMethod"
              value={form.preferredContactMethod}
              onChange={(event) =>
                updateField("preferredContactMethod", event.target.value)
              }
            >
              {["WhatsApp", "Phone Call", "Email", "Instagram"].map(
                (method) => (
                  <option key={method} value={method}>
                    {translateValue("contactMethods", method)}
                  </option>
                ),
              )}
            </Select>
            <Select
              tone="light"
              label={t("start.requestForm.identity")}
              name="hasBrandIdentity"
              value={form.hasBrandIdentity}
              onChange={(event) =>
                updateField("hasBrandIdentity", event.target.value)
              }
            >
              {["Yes", "No", "Not sure"].map((value) => (
                <option key={value} value={value}>
                  {translateValue("yesNo", value)}
                </option>
              ))}
            </Select>
            <Select
              tone="light"
              label={t("start.requestForm.content")}
              name="hasContentReady"
              value={form.hasContentReady}
              onChange={(event) =>
                updateField("hasContentReady", event.target.value)
              }
            >
              {["Yes", "No", "Partially"].map((value) => (
                <option key={value} value={value}>
                  {translateValue("yesNo", value)}
                </option>
              ))}
            </Select>
          </div>
        </fieldset>

        <fieldset className="wd-start-field-group">
          <legend>{t("start.requestForm.groups.scope")}</legend>
          <div className="wd-start-field-grid">
            <Input
              tone="light"
              label={t("start.requestForm.budget")}
              name="budgetRange"
              placeholder={t("start.requestForm.optional")}
              value={form.budgetRange}
              onChange={(event) =>
                updateField("budgetRange", event.target.value)
              }
            />
            <Input
              tone="light"
              label={t("start.requestForm.deadline")}
              name="deadline"
              placeholder={t("start.requestForm.optional")}
              value={form.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
            />
          </div>
          <Textarea
            tone="light"
            label={t("start.requestForm.details")}
            name="projectDetails"
            rows={7}
            required
            error={fieldErrors.projectDetails}
            placeholder={t("start.requestForm.detailsPlaceholder")}
            value={form.projectDetails}
            onChange={(event) =>
              updateField("projectDetails", event.target.value)
            }
          />
        </fieldset>

        <div className="wd-start-submit-row">
          <Button
            type="submit"
            disabled={isLoading}
            className="wd-start-primary-button"
          >
            {isLoading
              ? t("start.requestForm.submitting")
              : t("start.requestForm.submit")}
          </Button>
          <span className="sr-only" aria-live="polite">
            {isLoading ? t("start.requestForm.submitting") : ""}
          </span>
        </div>
      </form>
    </div>
  );
}

export default WebsiteRequestForm;
