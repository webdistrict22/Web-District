import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { Plus, Search, Trash2 } from "lucide-react";
import api from "../../lib/axios";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import StatusBadge from "../common/StatusBadge";
import { confirmAction } from "../../lib/alerts";
import { formatDate, formatMoney } from "../../lib/helpers";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../common/PaginationControls";
import AdminEmptyState from "./AdminEmptyState";
import AdminMetric from "./AdminMetric";
import AdminPageHeader from "./AdminPageHeader";
import AdminToolbar from "./AdminToolbar";
import AdminModeSwitch from "./AdminModeSwitch";
import AdminWorkspace from "./AdminWorkspace";

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
  const [mode, setMode] = useState(() =>
    searchParams.get("source") && searchParams.get("id") ? "create" : "manage"
  );

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [pagination, setPagination] = useState(null);
  const submissionKey = useRef(crypto.randomUUID());

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

  const fetchContracts = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const params = { page, limit: 20 };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.status !== "All") params.status = filters.status;

      const { data } = await api.get("/contracts", { params });

      setContracts(data.contracts || []);
      setPagination(data.pagination || null);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load contracts.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const [requestsRes, appointmentsRes] = await Promise.all([
        api.get("/requests", { params: { limit: 100 } }),
        api.get("/appointments", { params: { limit: 100 } }),
      ]);

      const loadedRequests = requestsRes.data.requests || [];
      const loadedAppointments = appointmentsRes.data.appointments || [];

      setRequests(loadedRequests);
      setAppointments(loadedAppointments);

      return {
        requests: loadedRequests,
        appointments: loadedAppointments,
      };
    } catch {
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

  const setupInitialData = async () => {
    fetchContracts();

    const loadedSources = await fetchSources();

    const source = searchParams.get("source");
    const id = searchParams.get("id");

    if (source === "request" && id) {
      setMode("create");
      setSourceType("request");
      setSourceId(id);
      fillFromRequest(id, loadedSources.requests);
    }

    if (source === "appointment" && id) {
      setMode("create");
      setSourceType("appointment");
      setSourceId(id);
      fillFromAppointment(id, loadedSources.appointments);
    }
  };

  useInitialLoad(setupInitialData);

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
    submissionKey.current = crypto.randomUUID();
    setMode("manage");
  };

  const handleModeChange = (nextMode) => {
    if (nextMode === "manage") {
      resetForm();
      return;
    }

    if (editingId) resetForm();
    setMode("create");
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
          payload,
          { headers: { "Idempotency-Key": submissionKey.current } }
        );

        setContracts((prev) => [data.contract, ...prev]);

        toast.success("Contract created from request successfully.");
      } else if (sourceType === "appointment" && sourceId) {
        const { data } = await api.post(
          `/contracts/from-appointment/${sourceId}`,
          payload,
          { headers: { "Idempotency-Key": submissionKey.current } }
        );

        setContracts((prev) => [data.contract, ...prev]);

        toast.success("Contract created from appointment successfully.");
      } else {
        const { data } = await api.post("/contracts", payload, {
          headers: { "Idempotency-Key": submissionKey.current },
        });

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
    setMode("create");
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
      title: "Archive contract?",
      message: "This removes the contract from active views while preserving its audit history.",
      confirmText: "Archive",
    });

    if (!confirmed) return;

    try {
      setDeletingId(contractId);

      await api.delete(`/contracts/${contractId}`);

      setContracts((prev) => prev.filter((item) => item._id !== contractId));

      toast.success("Contract archived successfully.", { duration: 4000 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive contract.");
    } finally {
      setDeletingId("");
    }
  };

  const handleApplyFilters = () => {
    fetchContracts(1);
  };

  const handleResetFilters = () => {
    setFilters({ search: "", status: "All" });
    setTimeout(() => fetchContracts(1), 0);
  };

  return (
    <div className="wd-admin-page">
      <AdminPageHeader
        eyebrow="Admin dashboard"
        title="Contracts and proposals"
        description="Prepare proposals from requests or calls, then manage scope, timeline, pricing, notes, and delivery status."
        action={
          <Button to="/admin/requests" variant="secondary" className="wd-admin-action">
            View requests
          </Button>
        }
      />

      <AdminModeSwitch
        label="Contract workspace mode"
        value={mode}
        options={[
          { value: "manage", label: "Manage contracts" },
          { value: "create", label: editingId ? "Edit contract" : "Create contract" },
        ]}
        onChange={handleModeChange}
      />

      <AdminWorkspace
        title={mode === "manage" ? "Manage contracts" : undefined}
        description={
          mode === "manage"
            ? "Review proposals, update delivery status, and keep commercial details in one place."
            : undefined
        }
        action={
          mode === "manage" ? (
            <Button type="button" icon={false} onClick={() => handleModeChange("create")}>
              <Plus size={17} />
              Create contract
            </Button>
          ) : undefined
        }
      >
        {mode === "manage" ? (
          <div className="wd-admin-metrics" aria-label="Contract metrics">
            <StatCard label="Total contracts" value={stats.total} />
            <StatCard label="Draft" value={stats.draft} />
            <StatCard label="Sent" value={stats.sent} />
            <StatCard label="In progress" value={stats.active} />
          </div>
        ) : null}

      {mode === "create" ? (
        <div className="wd-admin-form">
        <div className="wd-admin-form-intro">
          <div>
            <p className="wd-admin-eyebrow">
              {editingId ? "Edit contract" : "Create contract"}
            </p>

            <h2 className="font-display wd-admin-form-title">
              {editingId
                ? "Update proposal details."
                : "Prepare a clear proposal for a client."}
            </h2>
          </div>

          <Button type="button" variant="secondaryLight" onClick={resetForm} className="wd-admin-action">
            Back to contracts
          </Button>
        </div>

        {!editingId && (
          <div className="wd-admin-contract-source wd-admin-form-grid wd-admin-form-grid--2">
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

        <form onSubmit={handleSubmit} className="wd-admin-contract-form">
          <section className="wd-admin-form-section" aria-labelledby="contract-client-heading">
            <div className="wd-admin-form-section__heading">
              <h3 id="contract-client-heading">1. Client and proposal</h3>
              <p>Identify the proposal, client, business, and website direction.</p>
            </div>
            <div className="wd-admin-form-grid wd-admin-form-grid--2">
              <Input label="Contract title *" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
              <Select label="Status" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </Select>
              <Input label="Client name *" value={form.clientName} onChange={(e) => updateField("clientName", e.target.value)} />
              <Input label="Business name" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
              <Input label="Client email *" type="email" value={form.clientEmail} onChange={(e) => updateField("clientEmail", e.target.value)} />
              <Input label="Client phone" value={form.clientPhone} onChange={(e) => updateField("clientPhone", e.target.value)} />
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
                {websiteTypes.map((type) => <option key={type}>{type}</option>)}
              </Select>
            </div>
          </section>

          <section className="wd-admin-form-section" aria-labelledby="contract-scope-heading">
            <div className="wd-admin-form-section__heading">
              <h3 id="contract-scope-heading">2. Scope</h3>
              <p>Define the work, pages, and features included in this proposal.</p>
            </div>
            <div className="wd-admin-form-grid">
              <Textarea label="Scope summary *" value={form.scopeSummary} onChange={(e) => updateField("scopeSummary", e.target.value)} rows={4} />
              <div className="wd-admin-form-grid wd-admin-form-grid--2">
                <Textarea label="Pages included" placeholder={"One page per line\nHome\nServices\nContact"} value={form.pagesText} onChange={(e) => updateField("pagesText", e.target.value)} rows={6} />
                <Textarea label="Features included" placeholder={"One feature per line\nContact form\nAdmin dashboard\nBooking system"} value={form.featuresText} onChange={(e) => updateField("featuresText", e.target.value)} rows={6} />
              </div>
            </div>
          </section>

          <section className="wd-admin-form-section" aria-labelledby="contract-timeline-heading">
            <div className="wd-admin-form-section__heading">
              <h3 id="contract-timeline-heading">3. Timeline</h3>
              <p>Set the working estimate, start date, and client-facing deadline.</p>
            </div>
            <div className="wd-admin-form-grid wd-admin-form-grid--3">
              <Input label="Timeline" placeholder="Example: 2-3 weeks" value={form.timeline} onChange={(e) => updateField("timeline", e.target.value)} />
              <Input label="Start date" type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
              <Input label="Deadline" value={form.deadline} onChange={(e) => updateField("deadline", e.target.value)} />
            </div>
          </section>

          <section className="wd-admin-form-section" aria-labelledby="contract-pricing-heading">
            <div className="wd-admin-form-section__heading">
              <h3 id="contract-pricing-heading">4. Pricing</h3>
              <p>Set the total project price and required deposit percentage.</p>
            </div>
            <div className="wd-admin-form-grid wd-admin-form-grid--2">
              <Input label="Total price" type="number" value={form.totalPrice} onChange={(e) => updateField("totalPrice", e.target.value)} />
              <Input label="Deposit %" type="number" value={form.depositPercent} onChange={(e) => updateField("depositPercent", e.target.value)} />
            </div>
          </section>

          <section className="wd-admin-form-section" aria-labelledby="contract-notes-heading">
            <div className="wd-admin-form-section__heading">
              <h3 id="contract-notes-heading">5. Notes</h3>
              <p>Keep payment terms, internal context, and client-visible notes distinct.</p>
            </div>
            <div className="wd-admin-form-grid">
              <Textarea label="Payment notes" value={form.paymentNotes} onChange={(e) => updateField("paymentNotes", e.target.value)} rows={3} />
              <div className="wd-admin-form-grid wd-admin-form-grid--2">
                <Textarea label="Admin notes" value={form.adminNotes} onChange={(e) => updateField("adminNotes", e.target.value)} rows={4} />
                <Textarea label="Client notes" value={form.clientNotes} onChange={(e) => updateField("clientNotes", e.target.value)} rows={4} />
              </div>
            </div>
          </section>

          <div className="wd-admin-form-submit">
            <Button type="submit" disabled={isSaving} icon={false} className="wd-admin-action">
              <Plus size={17} />
              {isSaving ? "Saving..." : editingId ? "Save contract" : "Create contract"}
            </Button>
          </div>
        </form>
        </div>
      ) : null}

      {mode === "manage" ? (
        <>
          <AdminToolbar className="wd-admin-contract-toolbar">
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

          <Button
            type="button"
            variant="secondary"
            className="wd-admin-reset"
            onClick={handleResetFilters}
            disabled={!filters.search.trim() && filters.status === "All"}
          >
            Reset
          </Button>
          </AdminToolbar>

      {isLoading ? (
        <Loader text="Loading contracts..." />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchContracts} />
      ) : contracts.length ? (
        <div className="wd-admin-record-list">
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
          <PaginationControls
            pagination={pagination}
            onPageChange={fetchContracts}
            disabled={isLoading}
            tone="light"
          />
        </div>
      ) : (
          <AdminEmptyState
          title="No contracts yet"
          description="Create contracts manually or from website requests and call appointments."
          actionText="Create contract"
          onAction={() => handleModeChange("create")}
        />
          )}
        </>
      ) : null}
      </AdminWorkspace>
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
    <Card className="wd-admin-record wd-admin-contract-record">
      <div className="wd-admin-record__header">
        <div>
          <div className="wd-admin-record__chips">
            <StatusBadge status={contract.status} tone="light" />
            <span className="wd-admin-chip">{contract.websiteType}</span>
            {contract.clientNotes ? <span className="wd-admin-chip">Client note</span> : null}
          </div>
          <h2 className="wd-admin-record__title">{contract.title}</h2>
          <p className="wd-admin-record__byline">
            {contract.businessName || contract.clientName}
          </p>
        </div>
        <time className="wd-admin-record__date" dateTime={contract.createdAt}>
          {formatDate(contract.createdAt, "en")}
        </time>
      </div>

      <p className="wd-admin-record__description">{contract.scopeSummary}</p>

      <dl className="wd-admin-record__meta">
        <ContractDetail label="Client" value={contract.clientName} />
        <ContractDetail label="Email" value={contract.clientEmail} ltr />
        <ContractDetail label="Phone" value={contract.clientPhone} ltr />
        <ContractDetail label="Timeline" value={contract.timeline} />
        <ContractDetail label="Start date" value={contract.startDate} />
        <ContractDetail label="Deadline" value={contract.deadline} />
      </dl>

      <div className="wd-admin-contract-financials" aria-label="Contract pricing">
        <ContractAmount label="Total" value={contract.totalPrice} />
        <ContractAmount
          label={`Deposit (${contract.depositPercent || 70}%)`}
          value={contract.depositAmount}
        />
        <ContractAmount label="Remaining" value={contract.remainingAmount} />
      </div>

      <div className="wd-admin-contract-inclusions">
        <ContractListBlock title="Pages included" items={contract.pagesIncluded} />
        <ContractListBlock title="Features included" items={contract.featuresIncluded} />
      </div>

      {contract.paymentNotes || contract.clientNotes || contract.adminNotes ? (
        <div className="wd-admin-contract-notes">
          <ContractNote label="Payment notes" value={contract.paymentNotes} />
          <ContractNote label="Client notes" value={contract.clientNotes} />
          <ContractNote label="Admin notes" value={contract.adminNotes} />
        </div>
      ) : null}

      <div className="wd-admin-record__actions">
        <Button type="button" variant="secondary" onClick={() => onEdit(contract)} className="wd-admin-action">
          Edit
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onQuickStatus(contract, "Sent")}
          className="wd-admin-action"
        >
          Mark Sent
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => onQuickStatus(contract, "In Progress")}
          className="wd-admin-action"
        >
          In Progress
        </Button>

        <button
          type="button"
          onClick={() => onDelete(contract._id)}
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

function ContractDetail({ label, value, ltr = false }) {
  return (
    <div className="wd-admin-meta-item">
      <dt>{label}</dt>
      <dd dir={ltr ? "ltr" : undefined} className={ltr ? "wd-ltr" : undefined}>
        {value || "—"}
      </dd>
    </div>
  );
}

function ContractAmount({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong className="font-display">
        {value || value === 0 ? formatMoney(value, "EGP", "en") : "Not set"}
      </strong>
    </div>
  );
}

function ContractListBlock({ title, items }) {
  return (
    <section>
      <h3>{title}</h3>
      {items?.length ? (
        <ul>
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p>Not set</p>
      )}
    </section>
  );
}

function ContractNote({ label, value }) {
  if (!value) return null;
  return (
    <section>
      <h3>{label}</h3>
      <p>{value}</p>
    </section>
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
  return <AdminMetric label={label} value={value} />;
}

export default ContractManager;
