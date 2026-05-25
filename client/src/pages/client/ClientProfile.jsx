import {
  CalendarDays,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

function ClientProfile() {
  const { user } = useAuth();

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              Client portal
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Profile information
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
              This is the account information connected to your Web District
              workspace. Requests, calls, reviews, and future contracts are
              linked to this account.
            </p>
          </div>

          <Button to="/start" variant="secondary">
            Start a new request
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6 md:p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
            <UserRound size={28} />
          </div>

          <h3 className="font-display mt-6 text-3xl font-bold tracking-[-0.05em] text-[#F8F7F4]">
            {user?.name || "Client"}
          </h3>

          <p className="mt-2 text-[#D9D4CC]">
            {user?.businessName || "No business name added"}
          </p>

          <div className="mt-8 grid gap-3">
            <InfoRow icon={Mail} label="Email" value={user?.email} />
            <InfoRow icon={Phone} label="Phone" value={user?.phone || "Not added"} />
            <InfoRow
              icon={UserRound}
              label="Account type"
              value={user?.role === "admin" ? "Admin" : "Client"}
            />
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              Account note
            </p>

            <h3 className="font-display mt-3 text-2xl font-bold tracking-[-0.04em]">
              Keep your requests linked.
            </h3>

            <p className="mt-4 leading-7 text-[#D9D4CC]">
              When you submit a website request or book a call while logged in,
              it appears in your client dashboard automatically. If you submit
              while logged out, it will still reach Web District, but it will not
              appear inside this account.
            </p>
          </Card>

          <div className="grid gap-5 md:grid-cols-3">
            <QuickCard
              icon={FileText}
              title="Requests"
              description="View website requests linked to your account."
              to="/account/requests"
            />

            <QuickCard
              icon={CalendarDays}
              title="Calls"
              description="Track booked appointments and call status."
              to="/account/appointments"
            />

            <QuickCard
              icon={MessageSquare}
              title="Reviews"
              description="Submit a review after working with Web District."
              to="/account/reviews"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <Icon size={17} className="mt-0.5 shrink-0 text-[#C4A77D]" />

      <div className="min-w-0">
        <p className="text-xs text-[#D9D4CC]">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-[#D9D4CC]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function QuickCard({ icon: Icon, title, description, to }) {
  return (
    <Card className="p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
        <Icon size={20} />
      </div>

      <h3 className="font-display mt-4 text-xl font-bold tracking-[-0.04em]">
        {title}
      </h3>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#D9D4CC]">
        {description}
      </p>

      <div className="mt-5">
        <Button to={to} variant="secondary">
          Open
        </Button>
      </div>
    </Card>
  );
}

export default ClientProfile;