import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";

const initialForm = {
  agencyName: "Web District",
  phone: "01130696935",
  whatsapp: "01130696935",
  instagram: "web__district",
  email: "web.district22@gmail.com",
  heroHeadline: "Websites that make businesses look serious.",
  heroSubtext:
    "We build clean, modern websites for brands, businesses, and campaigns — from online stores to business websites and landing pages.",
  primaryCTA: "Book your website",
  secondaryCTA: "View our work",
  footerText: "Clean websites for brands, businesses, and campaigns.",
};

function SettingsManager() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchSettings = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/settings/public");

      setForm({
        ...initialForm,
        ...(data.settings || {}),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agencyName || !form.email || !form.phone || !form.whatsapp) {
      toast.error("Agency name, email, phone, and WhatsApp are required.");
      return;
    }

    if (!form.heroHeadline || !form.heroSubtext) {
      toast.error("Hero headline and subtext are required.");
      return;
    }

    try {
      setIsSaving(true);

      const { data } = await api.put("/settings", form);

      setForm({
        ...initialForm,
        ...(data.settings || {}),
      });

      toast.success("Website settings updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader text="Loading website settings..." />;
  }

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              Admin dashboard
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Website settings
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#94A3B8]">
              Control Web District public contact details, homepage hero copy,
              CTA labels, and footer text from one place.
            </p>
          </div>

          <Button to="/" variant="secondary">
            View homepage
          </Button>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <Card className="p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
            Contact details
          </p>

          <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
            Agency information shown publicly.
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Input
              label="Agency name *"
              value={form.agencyName}
              onChange={(e) => updateField("agencyName", e.target.value)}
            />

            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />

            <Input
              label="Phone *"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />

            <Input
              label="WhatsApp *"
              value={form.whatsapp}
              onChange={(e) => updateField("whatsapp", e.target.value)}
            />

            <Input
              label="Instagram username"
              value={form.instagram}
              onChange={(e) => updateField("instagram", e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
            Homepage hero
          </p>

          <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
            Main message visitors see first.
          </h3>

          <div className="mt-6 grid gap-5">
            <Input
              label="Hero headline *"
              value={form.heroHeadline}
              onChange={(e) => updateField("heroHeadline", e.target.value)}
            />

            <Textarea
              label="Hero subtext *"
              value={form.heroSubtext}
              onChange={(e) => updateField("heroSubtext", e.target.value)}
              rows={4}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Primary CTA"
                value={form.primaryCTA}
                onChange={(e) => updateField("primaryCTA", e.target.value)}
              />

              <Input
                label="Secondary CTA"
                value={form.secondaryCTA}
                onChange={(e) => updateField("secondaryCTA", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
            Footer
          </p>

          <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
            Footer description.
          </h3>

          <div className="mt-6">
            <Textarea
              label="Footer text"
              value={form.footerText}
              onChange={(e) => updateField("footerText", e.target.value)}
              rows={3}
            />
          </div>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving settings..." : "Save website settings"}
          </Button>

          <Button type="button" variant="secondary" onClick={fetchSettings}>
            Reset changes
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SettingsManager;