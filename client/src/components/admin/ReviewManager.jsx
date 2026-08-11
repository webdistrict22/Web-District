import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Plus, Search, Star, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/helpers";
import { confirmAction } from "../../lib/alerts";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../common/PaginationControls";
import AdminEmptyState from "./AdminEmptyState";
import AdminMetric from "./AdminMetric";
import AdminToolbar from "./AdminToolbar";
import AdminModeSwitch from "./AdminModeSwitch";
import AdminWorkspace from "./AdminWorkspace";

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
  const [mode, setMode] = useState("manage");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibilityFilter, setVisibilityFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [pagination, setPagination] = useState(null);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchReviews = async (page = 1) => {
    try {
      setIsLoading(true);

      const params = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "All") params.status = statusFilter;
      if (visibilityFilter !== "All") params.visibility = visibilityFilter === "Visible";
      const { data } = await api.get("/reviews", { params });

      setReviews(data.reviews || []);
      setPagination(data.pagination || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchReviews);

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
    setMode("manage");
  };

  const handleModeChange = (nextMode) => {
    if (nextMode === "manage") {
      resetForm();
      return;
    }

    if (editingId) {
      setForm(initialForm);
      setEditingId("");
    }
    setMode("add");
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
    setMode("add");
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
    const confirmed = await confirmAction({
      title: "Archive review?",
      message: "This removes the testimonial from active and public views while preserving its history.",
      confirmText: "Archive",
    });

    if (!confirmed) return;

    try {
      setDeletingId(reviewId);

      await api.delete(`/reviews/${reviewId}`);

      setReviews((prev) => prev.filter((review) => review._id !== reviewId));

      toast.success("Review archived successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive review.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="wd-admin-page">
      <AdminModeSwitch
        label="Review workspace mode"
        value={mode}
        options={[
          { value: "manage", label: "Manage reviews" },
          { value: "add", label: editingId ? "Edit testimonial" : "Add testimonial" },
        ]}
        onChange={handleModeChange}
      />

      <AdminWorkspace
        title={mode === "manage" ? "Reviews and testimonials" : undefined}
        description={
          mode === "manage"
            ? "Approve client reviews, control visibility, or add a manual testimonial."
            : undefined
        }
        action={
          mode === "manage" ? (
            <div className="wd-admin-workspace-actions">
              <Button type="button" icon={false} onClick={() => handleModeChange("add")}>
                <Plus size={17} />
                Add testimonial
              </Button>
              <Button to="/work" variant="secondaryLight" className="wd-admin-action">
                View work page
              </Button>
            </div>
          ) : undefined
        }
      >
        {mode === "manage" ? (
          <div className="wd-admin-metrics" aria-label="Review metrics">
            <StatCard label="Total reviews" value={stats.total} />
            <StatCard label="Approved" value={stats.approved} />
            <StatCard label="Pending" value={stats.pending} />
            <StatCard label="Visible" value={stats.visible} />
          </div>
        ) : null}

      {mode === "add" ? (
        <div className="wd-admin-form">
        <div className="wd-admin-form-intro">
          <div>
            <p className="wd-admin-eyebrow">
              {editingId ? "Edit review" : "Add manual review"}
            </p>

            <h3 className="font-display wd-admin-form-title">
              {editingId
                ? "Update this testimonial."
                : "Add a testimonial that feels real and premium."}
            </h3>
          </div>

          <Button type="button" variant="secondaryLight" onClick={resetForm} className="wd-admin-action">
            Back to reviews
          </Button>
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
            <Button type="submit" disabled={isSaving} icon={false} className="wd-admin-action">
              <Plus size={17} />
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save review changes"
                  : "Add review"}
            </Button>
          </div>
        </form>
        </div>
      ) : null}

      {mode === "manage" ? (
        <>
          <AdminToolbar className="wd-admin-review-toolbar">
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

          <Button type="button" onClick={() => fetchReviews(1)} icon={false}>
            <Search size={17} />
            Apply
          </Button>
          </AdminToolbar>

          {isLoading ? (
        <Loader text="Loading reviews..." />
      ) : reviews.length ? (
        <div className="wd-admin-record-list wd-admin-review-grid">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEdit}
              onQuickUpdate={handleQuickUpdate}
              onDelete={handleDelete}
              isDeleting={deletingId === review._id}
            />
          ))}
          <div className="md:col-span-2">
            <PaginationControls
              pagination={pagination}
              onPageChange={fetchReviews}
              disabled={isLoading}
              tone="light"
            />
          </div>
        </div>
      ) : (
          <AdminEmptyState
          title="No reviews found"
          description="Approved testimonials will appear publicly on the Work page."
        />
          )}
        </>
      ) : null}
      </AdminWorkspace>
    </div>
  );
}

function ReviewCard({ review, onEdit, onQuickUpdate, onDelete, isDeleting }) {
  return (
    <Card className="wd-admin-record wd-admin-review-record">
      <div className="mb-5 flex flex-wrap gap-3">
        <StatusBadge status={review.status} tone="light" />

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            review.isVisible
              ? "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]"
              : "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]"
          }`}
        >
          {review.isVisible ? "Visible" : "Hidden"}
        </span>

        <span className="inline-flex rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#F8F7F4]">
          {review.isManual ? "Manual" : "Client submitted"}
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <div className="mb-4 flex gap-1 text-[#C4A77D]">
        {"★".repeat(review.rating || 5)}
        {"☆".repeat(5 - (review.rating || 5))}
      </div>

      <p className="wd-value-wrap leading-8 text-[#D9D4CC]">
        “{review.message}”
      </p>

      <div className="mt-6 border-t border-white/10 pt-5">
        <h3 className="font-display text-xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
          {review.name}
        </h3>

        <p className="mt-1 text-sm text-[#D9D4CC]">
          {review.role || "Client"}
          {review.businessName ? ` — ${review.businessName}` : ""}
        </p>

        {review.client && (
          <div className="wd-admin-linked-client">
            <p className="text-sm font-semibold text-[#D9D4CC]">
              Linked client account
            </p>
            <p className="wd-value-wrap mt-1 text-sm text-[#D9D4CC]">
              {review.client.name} —{" "}
              <span className="wd-ltr inline" dir="ltr">
                {review.client.email}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className="wd-admin-record__actions">
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
          className="wd-admin-danger"
        >
          <Trash2 size={17} />
          {isDeleting ? "Archiving..." : "Archive"}
        </button>
      </div>
    </Card>
  );
}

function StatCard({ label, value }) {
  return <AdminMetric label={label} value={value} />;
}

export default ReviewManager;
