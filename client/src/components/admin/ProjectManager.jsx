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
import Badge from "../common/Badge";

const initialForm = {
  title: "",
  websiteType: "Business Website",
  businessType: "",
  shortDescription: "",
  fullDescription: "",
  keyFeaturesText: "",
  pagesIncludedText: "",
  tagsText: "",
  imagesText: "",
  liveUrl: "",
  caseStudyUrl: "",
  isFeatured: false,
  isVisible: true,
  order: 0,
};

const websiteTypes = [
  "Online Store",
  "Business Website",
  "Landing Page",
  "Custom Website",
  "Factory Website",
  "Portfolio Website",
];

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
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

  const textToArray = (value) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const arrayToText = (value) => {
    return Array.isArray(value) ? value.join("\n") : "";
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/projects");

      setProjects(data.projects || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !search.trim() ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        project.websiteType.toLowerCase().includes(search.toLowerCase()) ||
        project.businessType.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" || project.websiteType === typeFilter;

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Visible" && project.isVisible) ||
        (visibilityFilter === "Hidden" && !project.isVisible);

      return matchesSearch && matchesType && matchesVisibility;
    });
  }, [projects, search, typeFilter, visibilityFilter]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      visible: projects.filter((project) => project.isVisible).length,
      featured: projects.filter((project) => project.isFeatured).length,
      hidden: projects.filter((project) => !project.isVisible).length,
    };
  }, [projects]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.websiteType || !form.shortDescription) {
      toast.error("Please add title, website type, and short description.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        title: form.title,
        websiteType: form.websiteType,
        businessType: form.businessType,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        keyFeatures: textToArray(form.keyFeaturesText),
        pagesIncluded: textToArray(form.pagesIncludedText),
        tags: textToArray(form.tagsText),
        images: textToArray(form.imagesText),
        liveUrl: form.liveUrl,
        caseStudyUrl: form.caseStudyUrl,
        isFeatured: Boolean(form.isFeatured),
        isVisible: Boolean(form.isVisible),
        order: Number(form.order) || 0,
      };

      if (editingId) {
        const { data } = await api.put(`/projects/${editingId}`, payload);

        setProjects((prev) =>
          prev.map((project) =>
            project._id === editingId ? data.project : project
          )
        );

        toast.success("Project updated successfully.");
      } else {
        const { data } = await api.post("/projects", payload);

        setProjects((prev) => [data.project, ...prev]);

        toast.success("Project created successfully.");
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title || "",
      websiteType: project.websiteType || "Business Website",
      businessType: project.businessType || "",
      shortDescription: project.shortDescription || "",
      fullDescription: project.fullDescription || "",
      keyFeaturesText: arrayToText(project.keyFeatures),
      pagesIncludedText: arrayToText(project.pagesIncluded),
      tagsText: arrayToText(project.tags),
      imagesText: arrayToText(project.images),
      liveUrl: project.liveUrl || "",
      caseStudyUrl: project.caseStudyUrl || "",
      isFeatured: Boolean(project.isFeatured),
      isVisible: Boolean(project.isVisible),
      order: project.order || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleVisibility = async (project) => {
    try {
      const { data } = await api.put(`/projects/${project._id}`, {
        isVisible: !project.isVisible,
      });

      setProjects((prev) =>
        prev.map((item) => (item._id === project._id ? data.project : item))
      );

      toast.success(
        data.project.isVisible ? "Project is now visible." : "Project hidden."
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project.");
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const { data } = await api.put(`/projects/${project._id}`, {
        isFeatured: !project.isFeatured,
      });

      setProjects((prev) =>
        prev.map((item) => (item._id === project._id ? data.project : item))
      );

      toast.success(
        data.project.isFeatured
          ? "Project marked as featured."
          : "Project unfeatured."
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project.");
    }
  };

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(projectId);

      await api.delete(`/projects/${projectId}`);

      setProjects((prev) => prev.filter((project) => project._id !== projectId));

      toast.success("Project deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project.");
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
              Projects / selected work
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#94A3B8]">
              Manage the selected projects shown on the website. Keep the public
              wording focused on “Some of our work” so Web District feels broad
              and flexible.
            </p>
          </div>

          <Button to="/work" variant="secondary">
            View work page
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total projects" value={stats.total} />
        <StatCard label="Visible" value={stats.visible} />
        <StatCard label="Featured" value={stats.featured} />
        <StatCard label="Hidden" value={stats.hidden} />
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              {editingId ? "Edit project" : "Create project"}
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
              {editingId ? "Update selected work." : "Add selected work."}
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
              label="Project name *"
              placeholder="Example: Zohour"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />

            <Select
              label="Website type *"
              value={form.websiteType}
              onChange={(e) => updateField("websiteType", e.target.value)}
            >
              {websiteTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>
          </div>

          <Input
            label="Business type"
            placeholder="Example: Fashion / Accessories Brand"
            value={form.businessType}
            onChange={(e) => updateField("businessType", e.target.value)}
          />

          <Textarea
            label="Short description *"
            placeholder="Short card description..."
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            rows={3}
          />

          <Textarea
            label="Full case study description"
            placeholder="Longer explanation for the case study page..."
            value={form.fullDescription}
            onChange={(e) => updateField("fullDescription", e.target.value)}
            rows={5}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Textarea
              label="Key features"
              placeholder={"Write one feature per line\nProduct browsing\nCart and checkout\nMobile-first experience"}
              value={form.keyFeaturesText}
              onChange={(e) => updateField("keyFeaturesText", e.target.value)}
              rows={7}
            />

            <Textarea
              label="Pages included"
              placeholder={"Write one page per line\nHome\nShop\nProduct Details\nCheckout"}
              value={form.pagesIncludedText}
              onChange={(e) => updateField("pagesIncludedText", e.target.value)}
              rows={7}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Textarea
              label="Tags"
              placeholder={"Write one tag per line\nOnline Store\nE-commerce\nBrand Website"}
              value={form.tagsText}
              onChange={(e) => updateField("tagsText", e.target.value)}
              rows={5}
            />

            <Textarea
              label="Image URLs"
              placeholder={"Optional for now. Write one image URL per line.\nLater we can add Cloudinary uploads."}
              value={form.imagesText}
              onChange={(e) => updateField("imagesText", e.target.value)}
              rows={5}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Live URL"
              placeholder="Optional"
              value={form.liveUrl}
              onChange={(e) => updateField("liveUrl", e.target.value)}
            />

            <Input
              label="External case study URL"
              placeholder="Optional"
              value={form.caseStudyUrl}
              onChange={(e) => updateField("caseStudyUrl", e.target.value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <Input
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", e.target.value)}
            />

            <Select
              label="Featured?"
              value={form.isFeatured ? "Yes" : "No"}
              onChange={(e) =>
                updateField("isFeatured", e.target.value === "Yes")
              }
            >
              <option>No</option>
              <option>Yes</option>
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

            <div className="flex items-end">
              <Button type="submit" disabled={isSaving} icon={false}>
                <Plus size={17} />
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Save project"
                    : "Create project"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px_240px] lg:items-end">
          <Input
            label="Search projects"
            placeholder="Search title, type, business, or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            label="Website type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All</option>
            {websiteTypes.map((type) => (
              <option key={type}>{type}</option>
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
        <Loader text="Loading projects..." />
      ) : filteredProjects.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <AdminProjectCard
              key={project._id}
              project={project}
              onEdit={handleEdit}
              onToggleVisibility={handleToggleVisibility}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
              isDeleting={deletingId === project._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="Add selected projects like Zohour, S8 Factory, Atheer, or AKM."
        />
      )}
    </div>
  );
}

function AdminProjectCard({
  project,
  onEdit,
  onToggleVisibility,
  onToggleFeatured,
  onDelete,
  isDeleting,
}) {
  return (
    <Card className="overflow-hidden">
      <div className="h-52 border-b border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(198,154,78,0.20),transparent_30%),linear-gradient(135deg,#0A1A2D,#020817)] p-5">
        <div className="flex h-full items-end rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5">
          <div>
            <p className="text-sm text-[#94A3B8]">{project.websiteType}</p>
            <h3 className="font-display mt-2 text-3xl font-bold tracking-[-0.06em] text-white">
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          <Badge>{project.websiteType}</Badge>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              project.isVisible
                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                : "border-red-300/25 bg-red-300/10 text-red-200"
            }`}
          >
            {project.isVisible ? "Visible" : "Hidden"}
          </span>

          {project.isFeatured && (
            <span className="inline-flex rounded-full border border-[#C69A4E]/25 bg-[#C69A4E]/10 px-3 py-1 text-xs font-semibold text-[#F1D08B]">
              Featured
            </span>
          )}
        </div>

        <p className="leading-7 text-[#94A3B8]">{project.shortDescription}</p>

        {project.businessType && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
            <p className="text-xs text-[#64748B]">Business type</p>
            <p className="mt-1 font-semibold text-[#CBD5E1]">
              {project.businessType}
            </p>
          </div>
        )}

        {project.keyFeatures?.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-white">
              Key features
            </p>
            <div className="grid gap-2">
              {project.keyFeatures.slice(0, 5).map((feature) => (
                <p key={feature} className="text-sm text-[#CBD5E1]">
                  • {feature}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={() => onEdit(project)}>
            Edit
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onToggleVisibility(project)}
            icon={false}
          >
            {project.isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
            {project.isVisible ? "Hide" : "Show"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => onToggleFeatured(project)}
            icon={false}
          >
            <Star size={17} />
            {project.isFeatured ? "Unfeature" : "Feature"}
          </Button>

          <button
            type="button"
            onClick={() => onDelete(project._id)}
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

export default ProjectManager;