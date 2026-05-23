import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill name, email, and message.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/contact", form);

      toast.success("Message sent successfully.");
      setForm(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
          Contact form
        </p>

        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Tell us what you need.
        </h2>

        <p className="mt-3 leading-7 text-[#94A3B8]">
          Send a short message about your business, website idea, or the problem you want your website to solve.
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
            label="Email *"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          <Input
            label="Phone / WhatsApp"
            placeholder="011..."
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />

          <Input
            label="Subject"
            placeholder="Website inquiry"
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
          />
        </div>

        <Textarea
          label="Message *"
          placeholder="Example: I want a business website for my company and I need pages for services, contact, and previous work."
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Card>
  );
}

export default ContactForm;