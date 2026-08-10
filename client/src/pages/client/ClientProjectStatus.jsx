import { useState } from "react";
import toast from "react-hot-toast";
import { FolderKanban } from "lucide-react";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/common/StatusBadge";
import PortalButton from "../../components/portal/PortalButton";
import PortalEmptyState from "../../components/portal/PortalEmptyState";
import PortalPageHeader from "../../components/portal/PortalPageHeader";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

const visibleStatusSteps = ["Sent", "Accepted", "In Progress", "Completed"];

function ClientProjectStatus() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { getErrorMessage, t } = useLanguage();

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      setLoadError("");
      const { data } = await api.get("/contracts/my", { params: { limit: 100 } });
      setContracts(data.contracts || []);
    } catch (error) {
      const message = getErrorMessage(error, "client.projectStatus.loadError");
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchContracts);

  return (
    <div className="wd-portal-page">
      <PortalPageHeader
        eyebrow={t("common.labels.clientPortal")}
        title={t("client.projectStatus.title")}
        description={t("client.projectStatus.description")}
        action={(
          <PortalButton to="/account/contracts" variant="secondary">
            {t("client.projectStatus.viewContracts")}
          </PortalButton>
        )}
      />

      {isLoading ? (
        <Loader text={t("client.projectStatus.loading")} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchContracts} />
      ) : contracts.length ? (
        <div className="wd-portal-record-list">
          {contracts.map((contract) => (
            <ProjectStatusRecord key={contract._id} contract={contract} />
          ))}
        </div>
      ) : (
        <PortalEmptyState
          icon={FolderKanban}
          title={t("client.projectStatus.emptyTitle")}
          description={t("client.projectStatus.emptyDescription")}
          actionText={t("common.buttons.startRequest")}
          actionTo="/start"
        />
      )}
    </div>
  );
}

function ProjectStatusRecord({ contract }) {
  const { t, translateValue } = useLanguage();
  const currentIndex = visibleStatusSteps.indexOf(contract.status);
  const terminalMessageKey = {
    Cancelled: "client.projectStatus.cancelledMessage",
    Rejected: "client.projectStatus.rejectedMessage",
  }[contract.status];

  return (
    <article className="wd-portal-record wd-portal-project-status">
      <div className="wd-portal-record__heading">
        <div className="min-w-0">
          <div className="wd-portal-record__topline">
            <StatusBadge status={contract.status} tone="light" />
            <span className="wd-portal-record__type">
              {translateValue("websiteTypes", contract.websiteType)}
            </span>
          </div>
          <h2 className="wd-portal-record__title wd-value-wrap">{contract.title}</h2>
        </div>
      </div>

      {contract.scopeSummary ? (
        <p className="wd-portal-record__description wd-value-wrap">
          {contract.scopeSummary}
        </p>
      ) : null}

      {terminalMessageKey ? (
        <div className="wd-portal-note wd-portal-note--neutral">
          <p className="wd-portal-note__label">{t(terminalMessageKey)}</p>
        </div>
      ) : (
        <ol className="wd-portal-progress" aria-label={t("client.projectStatus.progressLabel")}>
          {visibleStatusSteps.map((step, index) => {
            const isDone = currentIndex >= index;
            const isCurrent = currentIndex === index;
            return (
              <li
                key={step}
                className={`${isDone ? "is-done" : ""}${isCurrent ? " is-current" : ""}`.trim()}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="wd-portal-progress__marker" aria-hidden="true" />
                <strong>{translateValue("statuses", step)}</strong>
                <span>
                  {isCurrent
                    ? t("common.stages.current")
                    : isDone
                      ? t("common.stages.completed")
                      : t("common.stages.upcoming")}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}

export default ClientProjectStatus;
