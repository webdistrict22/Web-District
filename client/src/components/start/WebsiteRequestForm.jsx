import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import useLanguage from "../../hooks/useLanguage";

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

function WebsiteRequestForm({ className = "" }) {
  const { isAuthenticated, user } = useAuth();
  const { getErrorMessage, t, translateValue } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: user?.name || "",
    businessName: user?.businessName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  }));

  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.projectDetails) {
      toast.error(t("start.requestForm.validation"));
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/requests", form);

      toast.success(
        isAuthenticated
          ? t("start.requestForm.successLoggedIn")
          : t("start.requestForm.success")
      );

      setForm({
        ...initialForm,
        name: user?.name || "",
        businessName: user?.businessName || "",
        phone: user?.phone || "",
        email: user?.email || "",
      });

      navigate("/success?type=request");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "start.requestForm.error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`p-6 md:p-8 ${className}`}>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          {t("start.requestForm.eyebrow")}
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          {t("start.requestForm.title")}
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#D9D4CC]">
          {t("start.requestForm.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label={t("start.requestForm.name")}
            placeholder={t("start.requestForm.namePlaceholder")}
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <Input
            label={t("start.requestForm.businessName")}
            placeholder={t("start.requestForm.businessNamePlaceholder")}
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
          />

          <Input
            label={t("start.requestForm.phone")}
            placeholder={t("start.requestForm.phonePlaceholder")}
            className="wd-ltr"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />

          <Input
            label={t("start.requestForm.email")}
            type="email"
            placeholder={t("start.requestForm.emailPlaceholder")}
            className="wd-ltr"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <Select
            label={t("start.requestForm.websiteType")}
            value={form.websiteType}
            onChange={(e) => updateField("websiteType", e.target.value)}
          >
            {[
              "Online Store",
              "Business Website",
              "Landing Page",
              "Custom Website",
            ].map((type) => (
              <option key={type} value={type}>
                {translateValue("websiteTypes", type)}
              </option>
            ))}
          </Select>

          <Select
            label={t("start.requestForm.preferredContact")}
            value={form.preferredContactMethod}
            onChange={(e) =>
              updateField("preferredContactMethod", e.target.value)
            }
          >
            {["WhatsApp", "Phone Call", "Email", "Instagram"].map((method) => (
              <option key={method} value={method}>
                {translateValue("contactMethods", method)}
              </option>
            ))}
          </Select>

          <Select
            label={t("start.requestForm.identity")}
            value={form.hasBrandIdentity}
            onChange={(e) => updateField("hasBrandIdentity", e.target.value)}
          >
            {["Yes", "No", "Not sure"].map((value) => (
              <option key={value} value={value}>
                {translateValue("yesNo", value)}
              </option>
            ))}
          </Select>

          <Select
            label={t("start.requestForm.content")}
            value={form.hasContentReady}
            onChange={(e) => updateField("hasContentReady", e.target.value)}
          >
            {["Yes", "No", "Partially"].map((value) => (
              <option key={value} value={value}>
                {translateValue("yesNo", value)}
              </option>
            ))}
          </Select>

          <Input
            label={t("start.requestForm.budget")}
            placeholder={t("start.requestForm.optional")}
            value={form.budgetRange}
            onChange={(e) => updateField("budgetRange", e.target.value)}
          />

          <Input
            label={t("start.requestForm.deadline")}
            placeholder={t("start.requestForm.optional")}
            value={form.deadline}
            onChange={(e) => updateField("deadline", e.target.value)}
          />
        </div>

        <Textarea
          label={t("start.requestForm.details")}
          placeholder={t("start.requestForm.detailsPlaceholder")}
          value={form.projectDetails}
          onChange={(e) => updateField("projectDetails", e.target.value)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isLoading} className="text-[#F8F7F4]">
            {isLoading
              ? t("start.requestForm.submitting")
              : t("start.requestForm.submit")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default WebsiteRequestForm;
