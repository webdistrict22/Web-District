import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Plus, Star, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";

const initialForm = {
  name: "",
  businessName: "",
  role: "Client",
  rating: 5,
  message: "",
  status: "Approved",
  isVisible: true,
};

const reviewStatuses = ["Pending", "Approved", "Rejected"];
const ratingOptions = [5, 4, 3, 2, 1];

function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibilityFilter, setVisibilityFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchReviews = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/reviews");

      setReviews(data.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !search.trim() ||
        review.name?.toLowerCase().includes(searchValue) ||
        review.businessName?.toLowerCase().includes(searchValue) ||
        review.role?.toLowerCase().includes(searchValue) ||
        review.message?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || review.status === statusFilter;

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Visible" && review.isVisible) ||
        (visibilityFilter === "Hidden" && !review.isVisible);

      return matchesSearch && matchesStatus && matchesVisibility;
    });
  }, [reviews, search, statusFilter, visibilityFilter]);

  const stats = useMemo(() => {
    return {
      total: reviews.length,
      approved: reviews.filter((review) => review.status === "Approved").length,
      pending: reviews.filter((review) => review.status === "Pending").length,
      visible: reviews.filter((review) => review.isVisible).length,
    };
  }, [reviews]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.message) {
      toast.error("Please add client name and review message.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...form,
        rating: Number(form.rating) || 5,
      };

      if (editingId) {
        const { data } = await api.put(`/reviews/${editingId}`, payload);

        setReviews((prev) =>
          prev.map((review) =>
            review._id === editingId ? data.review : review
          )
        );

        toast.success("Review updated successfully.");
      } else {
        const { data } = await api.post("/reviews/manual", payload);

        setReviews((prev) => [data.review, ...prev]);

        toast.success("Manual review added successfully.");
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save review.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setForm({
      name: review.name || "",
      businessName: review.businessName || "",
      role: review.role || "Client",
      rating: review.rating || 5,
      message: review.message || "",
      status: review.status || "Pending",
      isVisible: Boolean(review.isVisible),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickUpdate = async (review, changes) => {
    try {
      const { data } = await api.put(`/reviews/${review._id}`, changes);

      setReviews((prev) =>
        prev.map((item) => (item._id === review._id ? data.review : item))
      );

      toast.success("Review updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update review.");
    }
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(reviewId);

      await api.delete(`/reviews/${reviewId}`);

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));

      toast.success("Review deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              Admin dashboard
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Reviews and testimonials
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#94A3B8]">
              Manage public testimonials. Approve real client reviews, hide
              weak ones, or manually add polished testimonials after completed
              work.
            </p>
          </div>

          <Button to="/" variant="secondary">
            View homepage
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total reviews" value={stats.total} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Visible" value={stats.visible} />
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              {editingId ? "Edit review" : "Add manual review"}
            </p>

            <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
              {editingId
                ? "Update this testimonial."
                : "Add a testimonial that feels real and premium."}
            </h3>
          </div>

          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Client name *"
              placeholder="Example: Ahmed Hassan"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />

            <Input
              label="Business name"
              placeholder="Example: Zohour"
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />

            <Input
              label="Role"
              placeholder="Example: Founder"
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
            />

            <Select
              label="Rating"
              value={form.rating}
              onChange={(e) => updateField("rating", e.target.value)}
            >
              {ratingOptions.map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              {reviewStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>

            <Select
              label="Visibility"
              value={form.isVisible ? "Visible" : "Hidden"}
              onChange={(e) =>
                updateField("isVisible", e.target.value === "Visible")
              }
            >
              <option>Visible</option>
              <option>Hidden</option>
            </Select>
          </div>

          <Textarea
            label="Review message *"
            placeholder="Example: Web District made the website process clear and gave our brand a serious online presence."
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            rows={5}
          />

          <div>
            <Button type="submit" disabled={isSaving} icon={false}>
              <Plus size={17} />
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save review changes"
                  : "Add review"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px] lg:items-end">
          <Input
            label="Search reviews"
            placeholder="Search client, business, role, or message"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {reviewStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>

          <Select
            label="Visibility"
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option>All</option>
            <option>Visible</option>
            <option>Hidden</option>
          </Select>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading reviews..." />
      ) : filteredReviews.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEdit}
              onQuickUpdate={handleQuickUpdate}
              onDelete={handleDelete}
              isDeleting={deletingId === review._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reviews found"
          description="Approved testimonials will appear publicly on the homepage."
        />
      )}
    </div>
  );
}

function ReviewCard({ review, onEdit, onQuickUpdate, onDelete, isDeleting }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        <StatusBadge status={review.status} />

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            review.isVisible
              ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
              : "border-red-300/25 bg-red-300/10 text-red-200"
          }`}
        >
          {review.isVisible ? "Visible" : "Hidden"}
        </span>

        <span className="inline-flex rounded-full border border-[#C69A4E]/25 bg-[#C69A4E]/10 px-3 py-1 text-xs font-semibold text-[#F1D08B]">
          {review.isManual ? "Manual" : "Client submitted"}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <div className="mb-4 flex gap-1 text-[#C69A4E]">
        {"★".repeat(review.rating || 5)}
        {"☆".repeat(5 - (review.rating || 5))}
      </div>

      <p className="leading-8 text-[#CBD5E1]">“{review.message}”</p>

      <div className="mt-6 border-t border-white/10 pt-5">
        <h3 className="font-display text-xl font-bold tracking-[-0.04em] text-white">
          {review.name}
        </h3>

        <p className="mt-1 text-sm text-[#94A3B8]">
          {review.role || "Client"}
          {review.businessName ? ` — ${review.businessName}` : ""}
        </p>

        {review.client && (
          <div className="mt-4 rounded-2xl border border-[#22D3EE]/15 bg-[#22D3EE]/5 p-4">
            <p className="text-sm font-semibold text-[#A7F3FF]">
              Linked client account
            </p>
            <p className="mt-1 text-sm text-[#94A3B8]">
              {review.client.name} — {review.client.email}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="secondary" onClick={() => onEdit(review)}>
          Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          icon={false}
          onClick={() =>
            onQuickUpdate(review, { isVisible: !review.isVisible })
          }
        >
          {review.isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
          {review.isVisible ? "Hide" : "Show"}
        </Button>

        {review.status !== "Approved" ? (
          <Button
            type="button"
            variant="secondary"
            icon={false}
            onClick={() => onQuickUpdate(review, { status: "Approved" })}
          >
            <Star size={17} />
            Approve
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            icon={false}
            onClick={() => onQuickUpdate(review, { status: "Rejected" })}
          >
            Reject
          </Button>
        )}

        <button
          type="button"
          onClick={() => onDelete(review._id)}
          disabled={isDeleting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={17} />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Card>
  );
}

function StatCard({ label, value }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-[#94A3B8]">{label}</p>
      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-white">
        {value}
      </p>
    </Card>
  );
}

export default ReviewManager;