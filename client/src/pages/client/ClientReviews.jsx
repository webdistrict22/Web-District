import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import Loader from "../../components/common/Loader";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

const initialForm = {
  businessName: "",
  role: "Client",
  rating: 5,
  message: "",
};

function ClientReviews() {
  const { user } = useAuth();
  const { getErrorMessage, t } = useLanguage();

  const [form, setForm] = useState(() => ({
    ...initialForm,
    businessName: user?.businessName || "",
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [isCheckingContracts, setIsCheckingContracts] = useState(true);

  const fetchContracts = async () => {
    try {
      setIsCheckingContracts(true);

      const { data } = await api.get("/contracts/my");

      setContracts(data.contracts || []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "client.reviews.loadError")
      );
      setContracts([]);
    } finally {
      setIsCheckingContracts(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.message) {
      toast.error(t("client.reviews.validation"));
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/reviews/submit", {
        ...form,
        rating: Number(form.rating) || 5,
      });

      toast.success(t("client.reviews.success"));

      setForm({
        ...initialForm,
        businessName: user?.businessName || "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "client.reviews.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          {t("common.labels.clientPortal")}
        </p>

        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          {t("client.reviews.title")}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
          {t("client.reviews.description")}
        </p>

        <div className="mt-5 rounded-2xl border border-[#C4A77D]/20 bg-[#C4A77D]/8 p-4">
          <p className="text-sm leading-7 text-[#F8F7F4]">
            {t("client.reviews.note")}
          </p>
        </div>
      </Card>

      {isCheckingContracts ? (
        <Loader text={t("client.reviews.checking")} />
      ) : !contracts.length ? (
        <Card className="p-6 md:p-8">
          <h3 className="font-display text-2xl font-bold tracking-[-0.04em]">
            {t("client.reviews.lockedTitle")}
          </h3>

          <p className="mt-3 max-w-2xl leading-7 text-[#D9D4CC]">
            {t("client.reviews.lockedDescription")}
          </p>
        </Card>
      ) : (
        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-3">
              <Input
                label={t("common.labels.businessName")}
                placeholder={t("client.reviews.businessPlaceholder")}
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
              />

              <Input
                label={t("client.reviews.role")}
                placeholder={t("client.reviews.rolePlaceholder")}
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
              />

              <Select
                label={t("client.reviews.rating")}
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {t("client.reviews.stars", undefined, { count: rating })}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label={t("client.reviews.message")}
              placeholder={t("client.reviews.messagePlaceholder")}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              rows={6}
            />

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("client.reviews.submitting") : t("client.reviews.submit")}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default ClientReviews;
