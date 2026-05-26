import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
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
import { confirmAction } from "../../lib/alerts";

const messageStatuses = ["New", "Read", "Replied", "Archived"];

function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
  });

  const [drafts, setDrafts] = useState({});

  const fetchMessages = async () => {
    try {
      setIsLoading(true);

      const params = {};

      if (filters.status !== "All") {
        params.status = filters.status;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const { data } = await api.get("/contact", { params });

      const loadedMessages = data.messages || [];
      setMessages(loadedMessages);

      const nextDrafts = {};
      loadedMessages.forEach((message) => {
        nextDrafts[message._id] = {
          status: message.status,
          adminNotes: message.adminNotes || "",
        };
      });

      setDrafts(nextDrafts);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load contact messages."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    return {
      total: messages.length,
      newMessages: messages.filter((message) => message.status === "New")
        .length,
      replied: messages.filter((message) => message.status === "Replied")
        .length,
      archived: messages.filter((message) => message.status === "Archived")
        .length,
    };
  }, [messages]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateDraft = (messageId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [field]: value,
      },
    }));
  };

  const handleApplyFilters = () => {
    fetchMessages();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "All",
    });

    setTimeout(() => {
      fetchMessages();
    }, 0);
  };

  const handleUpdateMessage = async (messageId) => {
    const draft = drafts[messageId];

    if (!draft) return;

    try {
      setUpdatingId(messageId);

      const { data } = await api.put(`/contact/${messageId}`, {
        status: draft.status,
        adminNotes: draft.adminNotes,
      });

      setMessages((prev) =>
        prev.map((message) =>
          message._id === messageId ? data.contactMessage : message
        )
      );

      toast.success("Message updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update message."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = await confirmAction({
      title: "Delete contact message?",
      message: "This will permanently remove this contact message.",
      confirmText: "Delete",
    });

    if (!confirmed) return;

    try {
      setDeletingId(messageId);

      await api.delete(`/contact/${messageId}`);

      setMessages((prev) =>
        prev.filter((message) => message._id !== messageId)
      );

      toast.success("Message deleted successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete message."
      );
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
              Contact messages
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-[#D9D4CC]">
              View messages submitted through the contact page, track replies,
              and keep internal notes.
            </p>
          </div>

          <Button to="/contact" variant="secondary">
            Open contact page
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Total messages" value={stats.total} />
        <StatCard label="New" value={stats.newMessages} />
        <StatCard label="Replied" value={stats.replied} />
        <StatCard label="Archived" value={stats.archived} />
      </div>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto_auto] lg:items-end">
          <Input
            label="Search"
            placeholder="Search name, email, phone, subject, or message"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
          >
            <option>All</option>
            {messageStatuses.map((status) => (
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
        <Loader text="Loading contact messages..." />
      ) : messages.length ? (
        <div className="grid gap-5">
          {messages.map((message) => (
            <AdminMessageCard
              key={message._id}
              message={message}
              draft={drafts[message._id]}
              updateDraft={updateDraft}
              onUpdate={handleUpdateMessage}
              onDelete={handleDeleteMessage}
              isUpdating={updatingId === message._id}
              isDeleting={deletingId === message._id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No contact messages found"
          description="Messages submitted through the contact page will appear here."
          actionText="Open contact page"
          actionTo="/contact"
        />
      )}
    </div>
  );
}

function AdminMessageCard({
  message,
  draft,
  updateDraft,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  if (!draft) return null;

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
        <div className="p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={message.status} />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              {formatDate(message.createdAt)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {message.subject || "Website inquiry"}
          </h3>

          <p className="mt-2 text-sm text-[#D9D4CC]">
            Sent by {message.name}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex gap-3">
              <MessageSquare
                size={18}
                className="mt-1 shrink-0 text-[#C4A77D]"
              />

              <p className="leading-8 text-[#D9D4CC]">{message.message}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoItem icon={Mail} label="Email" value={message.email} />
            <InfoItem icon={Phone} label="Phone" value={message.phone || "Not provided"} />
            <InfoItem
              icon={CalendarDays}
              label="Submitted"
              value={formatDate(message.createdAt)}
            />
            <InfoItem
              icon={MessageSquare}
              label="Subject"
              value={message.subject || "Website inquiry"}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href={`mailto:${message.email}`} variant="secondary">
              Reply by email
            </Button>

            {message.phone && (
              <Button href={`tel:${message.phone}`} variant="secondary">
                Call client
              </Button>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.025] p-6 xl:border-l xl:border-t-0">
          <div className="grid gap-5">
            <Select
              label="Message status"
              value={draft.status}
              onChange={(e) =>
                updateDraft(message._id, "status", e.target.value)
              }
            >
              {messageStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </Select>

            <Textarea
              label="Admin notes"
              placeholder="Internal notes, reply status, follow-up plan..."
              value={draft.adminNotes}
              onChange={(e) =>
                updateDraft(message._id, "adminNotes", e.target.value)
              }
              rows={8}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                onClick={() => onUpdate(message._id)}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>

              <button
                type="button"
                onClick={() => onDelete(message._id)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 px-5 py-3 text-sm font-semibold text-[#F8F7F4] transition hover:border-[#C4A77D]/45 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={17} />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
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

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <Icon size={17} className="mt-0.5 shrink-0 text-[#C4A77D]" />
      <div className="min-w-0">
        <p className="text-xs text-[#D9D4CC]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-[#D9D4CC]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default MessageManager;
