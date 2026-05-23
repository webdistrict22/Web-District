import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Plus, Search, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

const initialForm = {
  question: "",
  answer: "",
  category: "General",
  order: 0,
  isVisible: true,
};

function FAQManager() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
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

  const fetchFAQs = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/faqs");

      setFaqs(data.faqs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load FAQ.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        !search.trim() ||
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase()) ||
        faq.category.toLowerCase().includes(search.toLowerCase());

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Visible" && faq.isVisible) ||
        (visibilityFilter === "Hidden" && !faq.isVisible);

      return matchesSearch && matchesVisibility;
    });
  }, [faqs, search, visibilityFilter]);

  const stats = useMemo(() => {
    return {
      total: faqs.length,
      visible: faqs.filter((faq) => faq.isVisible).length,
      hidden: faqs.filter((faq) => !faq.isVisible).length,
      categories: new Set(faqs.map((faq) => faq.category)).size,
    };
  }, [faqs]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question || !form.answer) {
      toast.error("Please add a question and answer.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        ...form,
        order: Number(form.order) || 0,
      };

      if (editingId) {
        const { data } = await api.put(`/faqs/${editingId}`, payload);

        setFaqs((prev) =>
          prev.map((faq) => (faq._id === editingId ? data.faq : faq))
        );

        toast.success("FAQ updated successfully.");
      } else {
        const { data } = await api.post("/faqs", payload);

        setFaqs((prev) => [data.faq, ...prev]);

        toast.success("FAQ created successfully.");
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save FAQ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || "General",
      order: faq.order || 0,
      isVisible: Boolean(faq.isVisible),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleVisibility = async (faq) => {
    try {
      const { data } = await api.put(`/faqs/${faq._id}`, {
        isVisible: !faq.isVisible,
      });

      setFaqs((prev) =>
        prev.map((item) => (item._id === faq._id ? data.faq : item))
      );

      toast.success(data.faq.isVisible ? "FAQ is now visible." : "FAQ hidden.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update FAQ.");
    }
  };

  const handleDelete = async (faqId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this FAQ?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(faqId);

      await api.delete(`/faqs/${faqId}`);

      setFaqs((prev) => prev.filter((faq) => faq._id !== faqId));

      toast.success("FAQ deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete FAQ.");
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
              FAQ management
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#94A3B8]">
              Add and manage questions that help clients understand the Web
              District process before they submit a request.
            </p>
          </div>

          <Button to="/" variant="secondary">
            View homepage
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total questions" value={stats.total} />
        <StatCard label="Visible" value={stats.visible} />
        <StatCard label="Hidden" value={stats.hidden} />
        <StatCard label="Categories" value={stats.categories} />
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              {editingId ? "Edit FAQ" : "Create FAQ"}
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
              {editingId
                ? "Update this question."
                : "Add a helpful client question."}
            </h3>
          </div>

          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <Input
            label="Question *"
            placeholder="Example: How long does a website take?"
            value={form.question}
            onChange={(e) => updateField("question", e.target.value)}
          />

          <Textarea
            label="Answer *"
            placeholder="Write a clear, helpful answer..."
            value={form.answer}
            onChange={(e) => updateField("answer", e.target.value)}
            rows={5}
          />

          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Category"
              placeholder="General"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />

            <Input
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", e.target.value)}
            />

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

          <div>
            <Button type="submit" disabled={isSaving} icon={false}>
              <Plus size={17} />
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save FAQ changes"
                  : "Create FAQ"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px] lg:items-end">
          <Input
            label="Search FAQ"
            placeholder="Search question, answer, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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
        <Loader text="Loading FAQ questions..." />
      ) : filteredFAQs.length ? (
        <div className="grid gap-5">
          {filteredFAQs.map((faq) => (
            <FAQCard
              key={faq._id}
              faq={faq}
              onEdit={handleEdit}
              onToggleVisibility={handleToggleVisibility}
              onDelete={handleDelete}
              isDeleting={deletingId === faq._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No FAQ questions found"
          description="Create FAQ questions to help visitors understand services, timelines, hosting, calls, and custom websites."
        />
      )}
    </div>
  );
}

function FAQCard({ faq, onEdit, onToggleVisibility, onDelete, isDeleting }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                faq.isVisible
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                  : "border-red-300/25 bg-red-300/10 text-red-200"
              }`}
            >
              {faq.isVisible ? "Visible" : "Hidden"}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
              {faq.category}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
              Order {faq.order}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
            {faq.question}
          </h3>

          <p className="mt-4 max-w-4xl leading-8 text-[#94A3B8]">
            {faq.answer}
          </p>
        </div>

        <div className="grid shrink-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Button type="button" variant="secondary" onClick={() => onEdit(faq)}>
            Edit
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onToggleVisibility(faq)}
            icon={false}
          >
            {faq.isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
            {faq.isVisible ? "Hide" : "Show"}
          </Button>

          <button
            type="button"
            onClick={() => onDelete(faq._id)}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-400/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={17} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
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

export default FAQManager;