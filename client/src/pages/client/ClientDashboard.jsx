import {
  CalendarDays,
  FileText,
  MessageSquare,
  UserRound,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function ClientDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const actions = t("client.dashboard.actions", []);
  const steps = t("client.dashboard.steps", []);

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_80%_20%,rgba(196,167,125,0.16),transparent_32%),linear-gradient(135deg,#080808,#0B0B0B)] p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
            {t("client.dashboard.eyebrow")}
          </p>

          <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.06em] md:text-5xl">
            {t("client.dashboard.title")}
          </h2>

          <p className="mt-5 max-w-2xl leading-8 text-[#D9D4CC]">
            {t("client.dashboard.description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/start">{t("client.dashboard.submitNew")}</Button>
            <Button to="/account/requests" variant="secondary">
              {t("client.dashboard.viewRequests")}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <InfoCard label={t("common.labels.name")} value={user?.name} />
        <InfoCard
          label={t("common.labels.business")}
          value={user?.businessName || t("client.dashboard.businessFallback")}
        />
        <InfoCard
          label={t("common.labels.email")}
          value={user?.email}
          ltr
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <ActionCard
          icon={FileText}
          title={actions[0]?.title}
          description={actions[0]?.description}
          to="/account/requests"
        />

        <ActionCard
          icon={CalendarDays}
          title={actions[1]?.title}
          description={actions[1]?.description}
          to="/account/appointments"
        />

        <ActionCard
          icon={MessageSquare}
          title={actions[2]?.title}
          description={actions[2]?.description}
          to="/account/reviews"
        />

        <ActionCard
          icon={UserRound}
          title={actions[3]?.title}
          description={actions[3]?.description}
          to="/account/profile"
        />
      </div>

      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
          {t("client.dashboard.nextEyebrow")}
        </p>

        <h3 className="font-display mt-3 text-2xl font-bold tracking-[-0.04em]">
          {t("client.dashboard.nextTitle")}
        </h3>

        <p className="mt-4 max-w-3xl leading-8 text-[#D9D4CC]">
          {t("client.dashboard.nextDescription")}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => (
            <StepItem
              key={step}
              number={String(index + 1).padStart(2, "0")}
              title={step}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function InfoCard({ label, value, ltr = false }) {
  return (
    <Card className="min-w-0 p-6">
      <p className="text-sm text-[#D9D4CC]">{label}</p>
      <p
        dir={ltr ? "ltr" : undefined}
        className={`wd-value-wrap mt-2 font-semibold text-[#F8F7F4] ${
          ltr ? "wd-ltr" : ""
        }`}
      >
        {value || "-"}
      </p>
    </Card>
  );
}

function ActionCard({ icon: Icon, title, description, to }) {
  const { t } = useLanguage();

  return (
    <Card className="p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C4A77D]/35">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C4A77D]/25 bg-[#C4A77D]/10 text-[#F8F7F4]">
        <Icon size={22} />
      </div>

      <h3 className="font-display mt-5 text-xl font-bold tracking-[-0.04em]">
        {title}
      </h3>

      <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#D9D4CC]">
        {description}
      </p>

      <div className="mt-5">
        <Button to={to} variant="secondary">
          {t("common.buttons.open")}
        </Button>
      </div>
    </Card>
  );
}

function StepItem({ number, title }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C4A77D]/15 text-xs font-bold text-[#F8F7F4]">
        {number}
      </span>

      <span className="text-sm font-medium text-[#D9D4CC]">{title}</span>
    </div>
  );
}

export default ClientDashboard;
