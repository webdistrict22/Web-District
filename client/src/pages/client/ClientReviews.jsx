import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MessageSquareText } from "lucide-react";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import PortalButton from "../../components/portal/PortalButton";
import PortalEmptyState from "../../components/portal/PortalEmptyState";
import PortalPageHeader from "../../components/portal/PortalPageHeader";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

const initialForm = {
  businessName: "",
  role: "Client",
  rating: 5,
  message: "",
};
const eligibleContractStatuses = new Set(["Accepted", "In Progress", "Completed"]);

const normalizedReviewRoles = {
  عميل: "Client",
  مؤسس: "Founder",
  مالك: "Owner",
  مدير: "Manager",
  "مؤسس / مالك / مدير": "Founder / Owner / Manager",
};

function ClientReviews() {
  const submissionKey = useRef(crypto.randomUUID());
  const { user } = useAuth();
  const { getErrorMessage, t, translateValue } = useLanguage();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    businessName: user?.businessName || "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [formError, setFormError] = useState("");
  const [contracts, setContracts] = useState([]);
  const [isCheckingContracts, setIsCheckingContracts] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submittedReview, setSubmittedReview] = useState(null);

  const fetchContracts = async () => {
    try {
      setIsCheckingContracts(true);
      setLoadError("");
      const { data } = await api.get("/contracts/my", { params: { limit: 100 } });
      setContracts(
        (data.contracts || []).filter((contract) =>
          eligibleContractStatuses.has(contract.status),
        ),
      );
    } catch (error) {
      const message = getErrorMessage(error, "client.reviews.loadError");
      setLoadError(message);
      toast.error(message);
      setContracts([]);
    } finally {
      setIsCheckingContracts(false);
    }
  };

  useInitialLoad(fetchContracts);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "message") setMessageError("");
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.message) {
      const message = t("client.reviews.validation");
      setMessageError(message);
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");
      const { data } = await api.post(
        "/reviews/submit",
        {
          ...form,
          rating: Number(form.rating) || 5,
          contractId: contracts[0]?._id,
          companyWebsite: "",
        },
        { headers: { "Idempotency-Key": submissionKey.current } },
      );

      setSubmittedReview(data.review || { status: "Pending" });
      toast.success(t("client.reviews.success"));
      setForm({ ...initialForm, businessName: user?.businessName || "" });
      submissionKey.current = crypto.randomUUID();
    } catch (error) {
      const message = getErrorMessage(error, "client.reviews.error");
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wd-portal-page">
      <PortalPageHeader
        eyebrow={t("common.labels.clientPortal")}
        title={t("client.reviews.title")}
        description={t("client.reviews.description")}
      />

      {isCheckingContracts ? (
        <Loader text={t("client.reviews.checking")} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchContracts} />
      ) : submittedReview ? (
        <section className="wd-portal-review-state" aria-live="polite">
          <span aria-hidden="true"><MessageSquareText size={23} strokeWidth={1.5} /></span>
          <div>
            <p className="wd-portal-eyebrow">{translateValue("statuses", submittedReview.status || "Pending")}</p>
            <h2>{t("client.reviews.pendingTitle")}</h2>
            <p>{t("client.reviews.pendingDescription")}</p>
          </div>
          <PortalButton to="/account/contracts" variant="ink">
            {t("client.reviews.viewContracts")}
          </PortalButton>
        </section>
      ) : !contracts.length ? (
        <PortalEmptyState
          icon={MessageSquareText}
          title={t("client.reviews.lockedTitle")}
          description={t("client.reviews.lockedDescription")}
          actionText={t("client.reviews.viewContracts")}
          actionTo="/account/contracts"
        />
      ) : (
        <section className="wd-portal-review-form" aria-labelledby="review-form-title">
          <div className="wd-portal-review-form__intro">
            <h2 id="review-form-title">{t("client.reviews.formTitle")}</h2>
            <p>{t("client.reviews.note")}</p>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
            <input type="text" name="companyWebsite" tabIndex="-1" autoComplete="off" className="sr-only" aria-hidden="true" />
            {formError ? <p role="alert" className="wd-portal-form-error">{formError}</p> : null}

            <div className="wd-portal-review-form__fields">
              <Input
                tone="light"
                label={t("common.labels.businessName")}
                name="businessName"
                autoComplete="organization"
                placeholder={t("client.reviews.businessPlaceholder")}
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.target.value)}
              />
              <Input
                tone="light"
                label={t("client.reviews.role")}
                name="role"
                placeholder={t("client.reviews.rolePlaceholder")}
                value={translateValue("reviewRoles", form.role)}
                onChange={(event) =>
                  updateField("role", normalizedReviewRoles[event.target.value] || event.target.value)
                }
              />
              <Select
                tone="light"
                label={t("client.reviews.rating")}
                name="rating"
                value={form.rating}
                onChange={(event) => updateField("rating", event.target.value)}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {t(`client.reviews.ratingOptions.${rating}`)}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              tone="light"
              label={t("client.reviews.message")}
              name="message"
              required
              error={messageError}
              placeholder={t("client.reviews.messagePlaceholder")}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              rows={6}
            />

            <PortalButton type="submit" disabled={isSubmitting} icon={false}>
              {isSubmitting ? t("client.reviews.submitting") : t("client.reviews.submit")}
            </PortalButton>
            <span className="sr-only" aria-live="polite">
              {isSubmitting ? t("client.reviews.submitting") : ""}
            </span>
          </form>
        </section>
      )}
    </div>
  );
}

export default ClientReviews;
