import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

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

function WebsiteRequestForm() {
  const { isAuthenticated, user } = useAuth();

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
      toast.error("Please fill name, phone, email, and project details.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/requests", form);

      toast.success(
        isAuthenticated
          ? "Website request submitted. You can track it in your dashboard."
          : "Website request submitted successfully."
      );

      setForm({
        ...initialForm,
        name: user?.name || "",
        businessName: user?.businessName || "",
        phone: user?.phone || "",
        email: user?.email || "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit website request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
          Website request
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Tell us what you need.
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[#94A3B8]">
          Share your business details and the website direction you need. Web
          District will review it and guide you to the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
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

          <Select
            label="Website type *"
            value={form.websiteType}
            onChange={(e) => updateField("websiteType", e.target.value)}
          >
            <option>Online Store</option>
            <option>Business Website</option>
            <option>Landing Page</option>
            <option>Custom Website</option>
          </Select>

          <Select
            label="Preferred contact method"
            value={form.preferredContactMethod}
            onChange={(e) =>
              updateField("preferredContactMethod", e.target.value)
            }
          >
            <option>WhatsApp</option>
            <option>Phone Call</option>
            <option>Email</option>
            <option>Instagram</option>
          </Select>

          <Select
            label="Do you already have a logo / identity?"
            value={form.hasBrandIdentity}
            onChange={(e) => updateField("hasBrandIdentity", e.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
            <option>Not sure</option>
          </Select>

          <Select
            label="Do you have content/products/images?"
            value={form.hasContentReady}
            onChange={(e) => updateField("hasContentReady", e.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
            <option>Partially</option>
          </Select>

          <Input
            label="Budget range"
            placeholder="Optional"
            value={form.budgetRange}
            onChange={(e) => updateField("budgetRange", e.target.value)}
          />

          <Input
            label="Deadline"
            placeholder="Optional"
            value={form.deadline}
            onChange={(e) => updateField("deadline", e.target.value)}
          />
        </div>

        <Textarea
          label="Project details *"
          placeholder="Tell us about your business, website goal, pages, features, and anything important."
          value={form.projectDetails}
          onChange={(e) => updateField("projectDetails", e.target.value)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit website request"}
          </Button>

          {isAuthenticated && (
            <Button to="/account/requests" variant="secondary">
              My requests
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

export default WebsiteRequestForm;