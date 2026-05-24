import {
  CalendarDays,
  FileText,
  MessageSquare,
  UserRound,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_80%_20%,rgba(198,154,78,0.16),transparent_32%),linear-gradient(135deg,#0A1A2D,#020817)] p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
            Overview
          </p>

          <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.06em] md:text-5xl">
            Your Web District workspace.
          </h2>

          <p className="mt-5 max-w-2xl leading-8 text-[#94A3B8]">
            Track your website requests, call appointments, reviews, and future
            contracts from one clean client portal.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/start">Submit a new request</Button>
            <Button to="/account/requests" variant="secondary">
              View requests
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <InfoCard label="Name" value={user?.name} />
        <InfoCard label="Business" value={user?.businessName || "Not added"} />
        <InfoCard label="Email" value={user?.email} />
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <ActionCard
          icon={FileText}
          title="Website requests"
          description="See the requests you submitted while logged in."
          to="/account/requests"
        />

        <ActionCard
          icon={CalendarDays}
          title="Call appointments"
          description="Track booked calls and appointment status."
          to="/account/appointments"
        />

        <ActionCard
          icon={MessageSquare}
          title="Reviews"
          description="Submit a review for Web District after working together."
          to="/account/reviews"
        />

        <ActionCard
          icon={UserRound}
          title="Profile"
          description="View your account and business information."
          to="/account/profile"
        />
      </div>

      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
          What happens next?
        </p>

        <h3 className="font-display mt-3 text-2xl font-bold tracking-[-0.04em]">
          Start with a request or a call.
        </h3>

        <p className="mt-4 max-w-3xl leading-8 text-[#94A3B8]">
          If you already know what website you need, submit a website request.
          If you are still unsure, book a call and Web District will help shape
          the right direction before moving to a proposal or contract.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <StepItem number="01" title="Submit a request" />
          <StepItem number="02" title="Web District reviews it" />
          <StepItem number="03" title="We clarify scope and next step" />
          <StepItem number="04" title="Proposal or contract is prepared" />
        </div>
      </Card>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <Card className="p-6">
      <p className="text-sm text-[#94A3B8]">{label}</p>
      <p className="mt-2 break-words font-semibold text-white">
        {value || "—"}
      </p>
    </Card>
  );
}

function ActionCard({ icon: Icon, title, description, to }) {
  return (
    <Card className="p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C69A4E]/35">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C69A4E]/25 bg-[#C69A4E]/10 text-[#F1D08B]">
        <Icon size={22} />
      </div>

      <h3 className="font-display mt-5 text-xl font-bold tracking-[-0.04em]">
        {title}
      </h3>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#94A3B8]">
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

function StepItem({ number, title }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C69A4E]/15 text-xs font-bold text-[#F1D08B]">
        {number}
      </span>

      <span className="text-sm font-medium text-[#CBD5E1]">{title}</span>
    </div>
  );
}

export default ClientDashboard;