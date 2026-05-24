import { useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import api from "../../lib/axios";
import useAuth from "../../hooks/useAuth";

const initialForm = {
  businessName: "",
  role: "Client",
  rating: 5,
  message: "",
};

function ClientReviews() {
  const { user } = useAuth();

  const [form, setForm] = useState(() => ({
    ...initialForm,
    businessName: user?.businessName || "",
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.message) {
      toast.error("Please write your review message.");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/reviews/submit", {
        ...form,
        rating: Number(form.rating) || 5,
      });

      toast.success("Review submitted and waiting for approval.");

      setForm({
        ...initialForm,
        businessName: user?.businessName || "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
          Client portal
        </p>

        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Submit a review
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-[#94A3B8]">
          Share your experience with Web District. Your review will appear
          publicly only after admin approval.
        </p>

        <div className="mt-5 rounded-2xl border border-[#C69A4E]/20 bg-[#C69A4E]/8 p-4">
          <p className="text-sm leading-7 text-[#F1D08B]">
            Later, this page will only be available for clients with completed
            contracts. For now, it is open to logged-in clients for testing.
          </p>
        </div>
      </Card>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Business name"
              placeholder="Your business / brand"
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />

            <Input
              label="Role"
              placeholder="Founder / Owner / Manager"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            />

            <Select
              label="Rating"
              value={form.rating}
              onChange={(e) => updateField("rating", e.target.value)}
            >
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </Select>
          </div>

          <Textarea
            label="Review message *"
            placeholder="Example: Web District helped us launch a cleaner and more professional website."
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={6}
          />

          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit review"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ClientReviews;