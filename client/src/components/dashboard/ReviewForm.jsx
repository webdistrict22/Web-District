import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const initialForm = {
  businessName: "",
  role: "Client",
  rating: 5,
  message: "",
};

function ReviewForm({ defaultBusinessName = "", onSubmitted }) {
  const [form, setForm] = useState({
    ...initialForm,
    businessName: defaultBusinessName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.message.trim()) {
      toast.error("Please write your review message.");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await api.post("/reviews/submit", {
        ...form,
        rating: Number(form.rating) || 5,
      });

      toast.success("Review submitted and waiting for approval.");

      setForm({
        ...initialForm,
        businessName: defaultBusinessName,
      });

      if (typeof onSubmitted === "function") {
        onSubmitted(data.review);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}

export default ReviewForm;