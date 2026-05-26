import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import ContractList from "../dashboard/ContractList";
import { confirmAction } from "../../lib/alerts";

const statuses = [
  "Draft",
  "Sent",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

const websiteTypes = [
  "Online Store",
  "Business Website",
  "Landing Page",
  "Custom Website",
];

const initialForm = {
  title: "",
  clientName: "",
  businessName: "",
  clientEmail: "",
  clientPhone: "",
  websiteType: "Business Website",
  scopeSummary: "",
  pagesText: "",
  featuresText: "",
  timeline: "",
  startDate: "",
  deadline: "",
  totalPrice: "",
  depositPercent: 70,
  paymentNotes: "",
  status: "Draft",
  adminNotes: "",
  clientNotes: "",
};

function ContractManager() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [contracts, setContracts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [sourceType, setSourceType] = useState("manual");
  const [sourceId, setSourceId] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const textToArray = (value) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const arrayToText = (value) => {
    return Array.isArray(value) ? value.join("\n") : "";
  };

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchContracts = async () => {
    try {
      setIsLoading(true);

      const params = {};

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.status !== "All") params.status = filters.status;

      const { data } = await api.get("/contracts", { params });

      setContracts(data.contracts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contracts.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const [requestsRes, appointmentsRes] = await Promise.all([
        api.get("/requests"),
        api.get("/appointments"),
      ]);

      const loadedRequests = requestsRes.data.requests || [];
      const loadedAppointments = appointmentsRes.data.appointments || [];

      setRequests(loadedRequests);
      setAppointments(loadedAppointments);

      return {
        requests: loadedRequests,
        appointments: loadedAppointments,
      };
    } catch (error) {
      return {
        requests: [],
        appointments: [],
      };
    }
  };

  const fillFromRequest = (requestId, requestList = requests) => {
    const request = requestList.find((item) => item._id === requestId);
    if (!request) return;

    setForm((prev) => ({
      ...prev,
      title: `${request.businessName || request.name} — ${request.websiteType} Proposal`,
      clientName: request.name || "",
      businessName: request.businessName || "",
      clientEmail: request.email || "",
      clientPhone: request.phone || "",
      websiteType: request.websiteType || "Business Website",
      scopeSummary: request.projectDetails || "",
      deadline: request.deadline || "",
      pagesText: suggestPages(request.websiteType),
      featuresText: suggestFeatures(request.websiteType),
    }));
  };

  const fillFromAppointment = (appointmentId, appointmentList = appointments) => {
    const appointment = appointmentList.find((item) => item._id === appointmentId);
    if (!appointment) return;

    setForm((prev) => ({
      ...prev,
      title: `${appointment.businessName || appointment.name} — Website Proposal`,
      clientName: appointment.name || "",
      businessName: appointment.businessName || "",
      clientEmail: appointment.email || "",
      clientPhone: appointment.phone || "",
      scopeSummary: appointment.topic || "",
      pagesText: suggestPages(prev.websiteType),
      featuresText: suggestFeatures(prev.websiteType),
    }));
  };

  useEffect(() => {
    const setup = async () => {
      fetchContracts();

      const loadedSources = await fetchSources();

      const source = searchParams.get("source");
      const id = searchParams.get("id");

      if (source === "request" && id) {
        setSourceType("request");
        setSourceId(id);
        fillFromRequest(id, loadedSources.requests);
      }

      if (source === "appointment" && id) {
        setSourceType("appointment");
        setSourceId(id);
        fillFromAppointment(id, loadedSources.appointments);
      }
    };

    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    return {
      total: contracts.length,
      draft: contracts.filter((item) => item.status === "Draft").length,
      sent: contracts.filter((item) => item.status === "Sent").length,
      active: contracts.filter((item) => item.status === "In Progress").length,
    };
  }, [contracts]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
    setSourceType("manual");
    setSourceId("");
    setSearchParams({});
  };

  const handleSourceChange = (value) => {
    setSourceId(value);
    setSearchParams(value ? { source: sourceType, id: value } : {});

    if (sourceType === "request") fillFromRequest(value);
    if (sourceType === "appointment") fillFromAppointment(value);
  };

  const buildPayload = () => ({
    title: form.title,
    clientName: form.clientName,
    businessName: form.businessName,
    clientEmail: form.clientEmail,
    clientPhone: form.clientPhone,
    websiteType: form.websiteType,
    scopeSummary: form.scopeSummary,
    pagesIncluded: textToArray(form.pagesText),
    featuresIncluded: textToArray(form.featuresText),
    timeline: form.timeline,
    startDate: form.startDate,
    deadline: form.deadline,
    totalPrice: Number(form.totalPrice) || 0,
    depositPercent: Number(form.depositPercent) || 70,
    paymentNotes: form.paymentNotes,
    status: form.status,
    adminNotes: form.adminNotes,
    clientNotes: form.clientNotes,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.clientName || !form.clientEmail || !form.scopeSummary) {
      toast.error("Please fill title, client name, email, and scope summary.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = buildPayload();

      if (editingId) {
        const { data } = await api.put(`/contracts/${editingId}`, payload);

        setContracts((prev) =>
          prev.map((item) => (item._id === editingId ? data.contract : item))
        );

        toast.success("Contract updated successfully.");
      } else if (sourceType === "request" && sourceId) {
        const { data } = await api.post(
          `/contracts/from-request/${sourceId}`,
          payload
        );

        setContracts((prev) => [data.contract, ...prev]);

        toast.success("Contract created from request successfully.");
      } else if (sourceType === "appointment" && sourceId) {
        const { data } = await api.post(
          `/contracts/from-appointment/${sourceId}`,
          payload
        );

        setContracts((prev) => [data.contract, ...prev]);

        toast.success("Contract created from appointment successfully.");
      } else {
        const { data } = await api.post("/contracts", payload);

        setContracts((prev) => [data.contract, ...prev]);

        toast.success("Contract created successfully.");
      }

      resetForm();
      fetchSources();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save contract.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (contract) => {
    setEditingId(contract._id);
    setSourceType("manual");
    setSourceId("");
    setSearchParams({});

    setForm({
      title: contract.title || "",
      clientName: contract.clientName || "",
      businessName: contract.businessName || "",
      clientEmail: contract.clientEmail || "",
      clientPhone: contract.clientPhone || "",
      websiteType: contract.websiteType || "Business Website",
      scopeSummary: contract.scopeSummary || "",
      pagesText: arrayToText(contract.pagesIncluded),
      featuresText: arrayToText(contract.featuresIncluded),
      timeline: contract.timeline || "",
      startDate: contract.startDate || "",
      deadline: contract.deadline || "",
      totalPrice: contract.totalPrice || "",
      depositPercent: contract.depositPercent || 70,
      paymentNotes: contract.paymentNotes || "",
      status: contract.status || "Draft",
      adminNotes: contract.adminNotes || "",
      clientNotes: contract.clientNotes || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickStatus = async (contract, status) => {
    try {
      const { data } = await api.put(`/contracts/${contract._id}`, {
        status,
      });

      setContracts((prev) =>
        prev.map((item) => (item._id === contract._id ? data.contract : item))
      );

      toast.success("Contract status updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (contractId) => {
    const confirmed = await confirmAction({
      title: "Delete contract?",
      message: "This will permanently remove this contract/proposal.",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      setDeletingId(contractId);

      await api.delete(`/contracts/${contractId}`);

      setContracts((prev) => prev.filter((item) => item._id !== contractId));

      toast.success("Contract deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete contract.");
    } finally {
      setDeletingId("");
    }
  };

  const handleApplyFilters = () => {
    fetchContracts();
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "All" });
    setTimeout(() => fetchContracts(), 0);
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
              Contracts and proposals
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
              Create proposals from website requests or call appointments, then
              track scope, timeline, pricing, deposit, client notes, and status.
            </p>
          </div>

          <Button to="/admin/requests" variant="secondary">
            View requests
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total contracts" value={stats.total} />
        <StatCard label="Draft" value={stats.draft} />
        <StatCard label="Sent" value={stats.sent} />
        <StatCard label="In progress" value={stats.active} />
      </div>

      <Card className="p-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              {editingId ? "Edit contract" : "Create contract"}
            </p>

            <h3 className="font-display mt-2 text-2xl font-bold tracking-[-0.04em]">
              {editingId
                ? "Update proposal details."
                : "Prepare a clear proposal for a client."}
            </h3>
          </div>

          {editingId && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>

        {!editingId && (
          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <Select
              label="Create from"
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value);
                setSourceId("");
                setSearchParams({});
              }}
            >
              <option value="manual">Manual</option>
              <option value="request">Website request</option>
              <option value="appointment">Call appointment</option>
            </Select>

            {sourceType === "request" && (
              <Select
                label="Choose request"
                value={sourceId}
                onChange={(e) => handleSourceChange(e.target.value)}
              >
                <option value="">Select request</option>
                {requests.map((request) => (
                  <option key={request._id} value={request._id}>
                    {request.businessName || request.name} — {request.websiteType}
                  </option>
                ))}
              </Select>
            )}

            {sourceType === "appointment" && (
              <Select
                label="Choose appointment"
                value={sourceId}
                onChange={(e) => handleSourceChange(e.target.value)}
              >
                <option value="">Select appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {appointment.businessName || appointment.name} — {appointment.topic}
                  </option>
                ))}
              </Select>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Contract title *"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />

            <Select
              label="Status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>

            <Input
              label="Client name *"
              value={form.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
            />

            <Input
              label="Business name"
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
            />

            <Input
              label="Client email *"
              type="email"
              value={form.clientEmail}
              onChange={(e) => updateField("clientEmail", e.target.value)}
            />

            <Input
              label="Client phone"
              value={form.clientPhone}
              onChange={(e) => updateField("clientPhone", e.target.value)}
            />

            <Select
              label="Website type"
              value={form.websiteType}
              onChange={(e) => {
                const nextType = e.target.value;
                updateField("websiteType", nextType);
                setForm((prev) => ({
                  ...prev,
                  websiteType: nextType,
                  pagesText: prev.pagesText || suggestPages(nextType),
                  featuresText: prev.featuresText || suggestFeatures(nextType),
                }));
              }}
            >
              {websiteTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </Select>

            <Input
              label="Timeline"
              placeholder="Example: 2-3 weeks"
              value={form.timeline}
              onChange={(e) => updateField("timeline", e.target.value)}
            />
          </div>

          <Textarea
            label="Scope summary *"
            value={form.scopeSummary}
            onChange={(e) => updateField("scopeSummary", e.target.value)}
            rows={4}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Textarea
              label="Pages included"
              placeholder={"One page per line\nHome\nServices\nContact"}
              value={form.pagesText}
              onChange={(e) => updateField("pagesText", e.target.value)}
              rows={6}
            />

            <Textarea
              label="Features included"
              placeholder={"One feature per line\nContact form\nAdmin dashboard\nBooking system"}
              value={form.featuresText}
              onChange={(e) => updateField("featuresText", e.target.value)}
              rows={6}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <Input
              label="Start date"
              type="date"
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
            />

            <Input
              label="Deadline"
              value={form.deadline}
              onChange={(e) => updateField("deadline", e.target.value)}
            />

            <Input
              label="Total price"
              type="number"
              value={form.totalPrice}
              onChange={(e) => updateField("totalPrice", e.target.value)}
            />

            <Input
              label="Deposit %"
              type="number"
              value={form.depositPercent}
              onChange={(e) => updateField("depositPercent", e.target.value)}
            />
          </div>

          <Textarea
            label="Payment notes"
            value={form.paymentNotes}
            onChange={(e) => updateField("paymentNotes", e.target.value)}
            rows={3}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Textarea
              label="Admin notes"
              value={form.adminNotes}
              onChange={(e) => updateField("adminNotes", e.target.value)}
              rows={4}
            />

            <Textarea
              label="Client notes"
              value={form.clientNotes}
              onChange={(e) => updateField("clientNotes", e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Button type="submit" disabled={isSaving} icon={false}>
              <Plus size={17} />
              {isSaving
                ? "Saving..."
                : editingId
                  ? "Save contract"
                  : "Create contract"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px_auto_auto] lg:items-end">
          <Input
            label="Search contracts"
            placeholder="Search title, client, business, email, phone, or type"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option>All</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </Select>

          <Button type="button" onClick={handleApplyFilters} icon={false}>
            <Search size={17} />
            Apply
          </Button>

          <Button type="button" variant="secondary" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading contracts..." />
      ) : contracts.length ? (
        <div className="grid gap-5">
          {contracts.map((contract) => (
            <AdminContractCard
              key={contract._id}
              contract={contract}
              onEdit={handleEdit}
              onQuickStatus={handleQuickStatus}
              onDelete={handleDelete}
              isDeleting={deletingId === contract._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No contracts yet"
          description="Create contracts manually or from website requests and call appointments."
        />
      )}
    </div>
  );
}

function AdminContractCard({
  contract,
  onEdit,
  onQuickStatus,
  onDelete,
  isDeleting,
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-wrap gap-3">
        <StatusBadge status={contract.status} />

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
          {contract.websiteType}
        </span>

        {contract.clientNotes && (
          <span className="rounded-full border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
            Has client note
          </span>
        )}
      </div>

      <ContractList contracts={[contract]} emptyMode="admin" />

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Button type="button" variant="secondary" onClick={() => onEdit(contract)}>
          Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onQuickStatus(contract, "Sent")}
        >
          Mark Sent
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onQuickStatus(contract, "In Progress")}
        >
          In Progress
        </Button>

        <button
          type="button"
          onClick={() => onDelete(contract._id)}
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

function suggestPages(websiteType) {
  const map = {
    "Online Store": [
      "Home",
      "Shop",
      "Product Details",
      "Cart",
      "Checkout",
      "Contact",
    ],
    "Business Website": [
      "Home",
      "About",
      "Services",
      "Process",
      "FAQ",
      "Contact",
    ],
    "Landing Page": [
      "Hero Section",
      "Offer / Service Explanation",
      "Benefits",
      "Testimonials",
      "FAQ",
      "Contact Form",
    ],
    "Custom Website": [
      "Home",
      "Client Portal",
      "Admin Dashboard",
      "Request Flow",
      "Status Tracking",
      "Contact",
    ],
  };

  return (map[websiteType] || map["Business Website"]).join("\n");
}

function suggestFeatures(websiteType) {
  const map = {
    "Online Store": [
      "Responsive design",
      "Product listing",
      "Product details",
      "Cart and checkout flow",
      "Order management structure",
      "WhatsApp/contact CTA",
    ],
    "Business Website": [
      "Responsive design",
      "Services presentation",
      "Contact form",
      "WhatsApp CTA",
      "FAQ section",
      "Basic SEO structure",
    ],
    "Landing Page": [
      "Responsive design",
      "Campaign-focused hero",
      "Lead capture form",
      "Trust section",
      "FAQ section",
      "Tracking-ready structure",
    ],
    "Custom Website": [
      "Responsive frontend",
      "Backend API",
      "Database structure",
      "Admin dashboard",
      "Client dashboard",
      "Custom workflow logic",
    ],
  };

  return (map[websiteType] || map["Business Website"]).join("\n");
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

export default ContractManager;
