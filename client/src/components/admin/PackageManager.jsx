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
  name: "",
  shortDescription: "",
  websiteType: "Business Website",
  featuresText: "",
  bestForText: "",
  priceLabel: "Custom quote",
  isCustom: false,
  isFeatured: false,
  isVisible: true,
  order: 0,
};

const websiteTypes = [
  "Online Store",
  "Business Website",
  "Landing Page",
  "Custom Website",
];

function PackageManager() {
  const [packages, setPackages] = useState([]);
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

  const fetchPackages = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/packages");

      setPackages(data.packages || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load packages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter((packageItem) => {
      const matchesSearch =
        !search.trim() ||
        packageItem.name.toLowerCase().includes(search.toLowerCase()) ||
        packageItem.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        packageItem.websiteType.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" || packageItem.websiteType === typeFilter;

      const matchesVisibility =
        visibilityFilter === "All" ||
        (visibilityFilter === "Visible" && packageItem.isVisible) ||
        (visibilityFilter === "Hidden" && !packageItem.isVisible);

      return matchesSearch && matchesType && matchesVisibility;
    });
  }, [packages, search, typeFilter, visibilityFilter]);

  const stats = useMemo(() => {
    return {
      total: packages.length,
      visible: packages.filter((item) => item.isVisible).length,
      featured: packages.filter((item) => item.isFeatured).length,
      custom: packages.filter((item) => item.isCustom).length,
    };
  }, [packages]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.shortDescription || !form.websiteType) {
      toast.error("Please add name, description, and website type.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: form.name,
        shortDescription: form.shortDescription,
        websiteType: form.websiteType,
        features: textToArray(form.featuresText),
        bestFor: textToArray(form.bestForText),
        priceLabel: form.priceLabel || "Custom quote",
        isCustom: Boolean(form.isCustom),
        isFeatured: Boolean(form.isFeatured),
        isVisible: Boolean(form.isVisible),
        order: Number(form.order) || 0,
      };

      if (editingId) {
        const { data } = await api.put(`/packages/${editingId}`, payload);

        setPackages((prev) =>
          prev.map((item) =>
            item._id === editingId ? data.package : item
          )
        );

        toast.success("Package updated successfully.");
      } else {
        const { data } = await api.post("/packages", payload);

        setPackages((prev) => [data.package, ...prev]);

        toast.success("Package created successfully.");
      }

      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save package.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (packageItem) => {
    setEditingId(packageItem._id);
    setForm({
      name: packageItem.name || "",
      shortDescription: packageItem.shortDescription || "",
      websiteType: packageItem.websiteType || "Business Website",
      featuresText: arrayToText(packageItem.features),
      bestForText: arrayToText(packageItem.bestFor),
      priceLabel: packageItem.priceLabel || "Custom quote",
      isCustom: Boolean(packageItem.isCustom),
      isFeatured: Boolean(packageItem.isFeatured),
      isVisible: Boolean(packageItem.isVisible),
      order: packageItem.order || 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleVisibility = async (packageItem) => {
    try {
      const { data } = await api.put(`/packages/${packageItem._id}`, {
        isVisible: !packageItem.isVisible,
      });

      setPackages((prev) =>
        prev.map((item) =>
          item._id === packageItem._id ? data.package : item
        )
      );

      toast.success(
        data.package.isVisible ? "Package is now visible." : "Package hidden."
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update package.");
    }
  };

  const handleToggleFeatured = async (packageItem) => {
    try {
      const { data } = await api.put(`/packages/${packageItem._id}`, {
        isFeatured: !packageItem.isFeatured,
      });

      setPackages((prev) =>
        prev.map((item) =>
          item._id === packageItem._id ? data.package : item
        )
      );

      toast.success(
        data.package.isFeatured
          ? "Package marked as featured."
          : "Package unfeatured."
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update package.");
    }
  };

  const handleDelete = async (packageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this package?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(packageId);

      await api.delete(`/packages/${packageId}`);

      setPackages((prev) => prev.filter((item) => item._id !== packageId));

      toast.success("Package deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete package.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              Admin dashboard
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Packages and website options
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
              Manage the website directions shown on the site. Keep them clear,
              premium, and flexible instead of making Web District feel limited.
            </p>
          </div>

          <Button to="/services" variant="secondary">
            View services
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total options" value={stats.total} />
        <StatCard label="Visible" value={stats.visible} />
        <StatCard label="Featured" value={stats.featured} />
        <StatCard label="Custom" value={stats.custom} />
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              {editingId ? "Edit option" : "Create option"}
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
              {editingId
                ? "Update this website option."
                : "Add a clear website direction."}
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
              label="Package / option name *"
              placeholder="Example: Online Store"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
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

          <Textarea
            label="Short description *"
            placeholder="Describe this website direction clearly..."
            value={form.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            rows={3}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Textarea
              label="Features"
              placeholder={"Write one feature per line\nProduct pages\nCart and checkout\nOrder management"}
              value={form.featuresText}
              onChange={(e) => updateField("featuresText", e.target.value)}
              rows={7}
            />

            <Textarea
              label="Best for"
              placeholder={"Write one item per line\nProduct brands\nService providers\nCampaigns"}
              value={form.bestForText}
              onChange={(e) => updateField("bestForText", e.target.value)}
              rows={7}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-5">
            <Input
              label="Price label"
              placeholder="Custom quote"
              value={form.priceLabel}
              onChange={(e) => updateField("priceLabel", e.target.value)}
            />

            <Input
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", e.target.value)}
            />

            <Select
              label="Custom?"
              value={form.isCustom ? "Yes" : "No"}
              onChange={(e) => updateField("isCustom", e.target.value === "Yes")}
            >
              <option>No</option>
              <option>Yes</option>
            </Select>

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
          </div>

          <div>
            <Button type="submit" disabled={isSaving} icon={false}>
              <Plus size={17} />
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save package changes"
                  : "Create package"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px_240px] lg:items-end">
          <Input
            label="Search packages"
            placeholder="Search name, description, or type"
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
        <Loader text="Loading website options..." />
      ) : filteredPackages.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredPackages.map((packageItem) => (
            <PackageCard
              key={packageItem._id}
              packageItem={packageItem}
              onEdit={handleEdit}
              onToggleVisibility={handleToggleVisibility}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
              isDeleting={deletingId === packageItem._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No packages found"
          description="Create website options like Online Store, Business Website, Landing Page, and Custom Website."
        />
      )}
    </div>
  );
}

function PackageCard({
  packageItem,
  onEdit,
  onToggleVisibility,
  onToggleFeatured,
  onDelete,
  isDeleting,
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        <Badge>{packageItem.websiteType}</Badge>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
            packageItem.isVisible
              ? "border-[#D9D4CC]/25 bg-white/[0.04] text-[#F8F7F4]"
              : "border-[#C4A77D]/30 bg-[#C4A77D]/12 text-[#F8F7F4]"
          }`}
        >
          {packageItem.isVisible ? "Visible" : "Hidden"}
        </span>

        {packageItem.isFeatured && (
          <span className="inline-flex rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#F8F7F4]">
            Featured
          </span>
        )}

        {packageItem.isCustom && (
          <span className="inline-flex rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
            Custom
          </span>
        )}
      </div>

      <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
        {packageItem.name}
      </h3>

      <p className="mt-4 leading-7 text-[#D9D4CC]">
        {packageItem.shortDescription}
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
        <p className="text-xs text-[#D9D4CC]">Price label</p>
        <p className="mt-1 font-semibold text-[#F8F7F4]">
          {packageItem.priceLabel || "Custom quote"}
        </p>
      </div>

      {packageItem.features?.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-[#F8F7F4]">Features</p>
          <div className="grid gap-2">
            {packageItem.features.slice(0, 5).map((feature) => (
              <p key={feature} className="text-sm text-[#D9D4CC]">
                • {feature}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="secondary" onClick={() => onEdit(packageItem)}>
          Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onToggleVisibility(packageItem)}
          icon={false}
        >
          {packageItem.isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
          {packageItem.isVisible ? "Hide" : "Show"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onToggleFeatured(packageItem)}
          icon={false}
        >
          <Star size={17} />
          {packageItem.isFeatured ? "Unfeature" : "Feature"}
        </Button>

        <button
          type="button"
          onClick={() => onDelete(packageItem._id)}
          disabled={isDeleting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-5 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 disabled:cursor-not-allowed disabled:opacity-60"
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
      <p className="text-sm text-[#D9D4CC]">{label}</p>
      <p className="font-display mt-3 text-4xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
        {value}
      </p>
    </Card>
  );
}

export default PackageManager;