import { useState } from "react";
import { CalendarDays, FileText, FolderKanban, ScrollText } from "lucide-react";
import { Link } from "react-router";
import api from "../../lib/axios";
import PortalButton from "../../components/portal/PortalButton";
import useAuth from "../../hooks/useAuth";
import useInitialLoad from "../../hooks/useInitialLoad";
import useLanguage from "../../hooks/useLanguage";

const summaryDefinitions = [
  { key: "requests", path: "/account/requests", icon: FileText },
  { key: "appointments", path: "/account/appointments", icon: CalendarDays },
  { key: "contracts", path: "/account/contracts", icon: ScrollText },
  { key: "project", path: "/account/project-status", icon: FolderKanban },
];

const emptySummary = {
  requests: { count: null, status: "" },
  appointments: { count: null, status: "" },
  contracts: { count: null, status: "" },
  project: { count: null, status: "" },
};

function ClientDashboard() {
  const { user } = useAuth();
  const { t, translateValue } = useLanguage();
  const steps = t("client.dashboard.steps", []);
  const [summary, setSummary] = useState(emptySummary);
  const [summaryState, setSummaryState] = useState("loading");

  const loadSummary = async () => {
    const endpoints = [
      api.get("/requests/my", { params: { page: 1, limit: 1 } }),
      api.get("/appointments/my", { params: { page: 1, limit: 1 } }),
      api.get("/contracts/my", { params: { page: 1, limit: 1 } }),
    ];

    const [requestsResult, appointmentsResult, contractsResult] =
      await Promise.allSettled(endpoints);

    const requestData = requestsResult.status === "fulfilled" ? requestsResult.value.data : null;
    const appointmentData = appointmentsResult.status === "fulfilled" ? appointmentsResult.value.data : null;
    const contractData = contractsResult.status === "fulfilled" ? contractsResult.value.data : null;
    const latestContract = contractData?.contracts?.[0];

    setSummary({
      requests: {
        count: requestData?.pagination?.total ?? null,
        status: requestData?.requests?.[0]?.status || "",
      },
      appointments: {
        count: appointmentData?.pagination?.total ?? null,
        status: appointmentData?.appointments?.[0]?.status || "",
      },
      contracts: {
        count: contractData?.pagination?.total ?? null,
        status: latestContract?.status || "",
      },
      project: {
        count: latestContract ? 1 : 0,
        status: latestContract?.status || "",
      },
    });

    setSummaryState(
      requestData || appointmentData || contractData ? "ready" : "error",
    );
  };

  useInitialLoad(loadSummary);

  const firstName = user?.name?.trim().split(/\s+/)[0] || "";

  return (
    <div className="wd-portal-page wd-portal-overview">
      <section className="wd-portal-overview-hero" aria-labelledby="portal-overview-title">
        <p className="wd-portal-eyebrow">{t("common.labels.clientPortal")}</p>
        {firstName ? (
          <p className="wd-portal-overview-hero__greeting">
            {t("client.dashboard.greeting", undefined, { name: firstName })}
          </p>
        ) : null}
        <h1 id="portal-overview-title">{t("client.dashboard.title")}</h1>
        <p className="wd-portal-overview-hero__description">
          {t("client.dashboard.description")}
        </p>
        <div className="wd-portal-overview-hero__actions">
          <PortalButton to="/start">{t("client.dashboard.startProject")}</PortalButton>
          <PortalButton to="/start" variant="secondary">
            {t("client.dashboard.bookCall")}
          </PortalButton>
        </div>
      </section>

      <section className="wd-portal-summary" aria-labelledby="portal-summary-title">
        <div className="wd-portal-summary__heading">
          <h2 id="portal-summary-title">{t("client.dashboard.summaryTitle")}</h2>
          <p aria-live="polite">
            {summaryState === "loading"
              ? t("client.dashboard.summaryLoading")
              : summaryState === "error"
                ? t("client.dashboard.summaryUnavailable")
                : t("client.dashboard.summaryDescription")}
          </p>
        </div>

        <div className="wd-portal-summary__items">
          {summaryDefinitions.map(({ key, path, icon: Icon }) => {
            const item = summary[key];
            const isProject = key === "project";
            const value =
              summaryState === "loading"
                ? "-"
                : isProject
                  ? item.status
                    ? translateValue("statuses", item.status)
                    : t("client.dashboard.noneYet")
                  : item.count ?? "-";
            const detail = item.status
              ? t("client.dashboard.latestStatus", undefined, {
                  status: translateValue("statuses", item.status),
                })
              : t("client.dashboard.noneYet");

            return (
              <Link key={key} to={path} className="wd-portal-summary-item">
                <span className="wd-portal-summary-item__icon" aria-hidden="true">
                  <Icon size={19} strokeWidth={1.5} />
                </span>
                <span className="wd-portal-summary-item__label">
                  {t(`client.dashboard.summary.${key}`)}
                </span>
                <strong>{value}</strong>
                <span className="wd-portal-summary-item__detail">
                  {summaryState === "ready" ? detail : t("client.dashboard.summaryPending")}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wd-portal-next" aria-labelledby="portal-next-title">
        <div className="wd-portal-next__intro">
          <p className="wd-portal-eyebrow">{t("client.dashboard.nextEyebrow")}</p>
          <h2 id="portal-next-title">{t("client.dashboard.nextTitle")}</h2>
          <p>{t("client.dashboard.nextDescription")}</p>
        </div>
        <ol className="wd-portal-next__steps">
          {steps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default ClientDashboard;
