import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, CircleDashed } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

const statusSteps = [
  "Draft",
  "Sent",
  "Accepted",
  "In Progress",
  "Completed",
];

function ClientProjectStatus() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getErrorMessage, t } = useLanguage();

  const fetchContracts = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/contracts/my");

      setContracts(data.contracts || []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "client.projectStatus.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchContracts);

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              {t("common.labels.clientPortal")}
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              {t("client.projectStatus.title")}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
              {t("client.projectStatus.description")}
            </p>
          </div>

          <Button to="/account/contracts" variant="secondary">
            {t("client.projectStatus.viewContracts")}
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text={t("client.projectStatus.loading")} />
      ) : contracts.length ? (
        <div className="grid gap-5">
          {contracts.map((contract) => (
            <ProjectStatusCard key={contract._id} contract={contract} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("client.projectStatus.emptyTitle")}
          description={t("client.projectStatus.emptyDescription")}
          actionText={t("common.buttons.startRequest")}
          actionTo="/start"
        />
      )}
    </div>
  );
}

function ProjectStatusCard({ contract }) {
  const { t, translateValue } = useLanguage();
  const currentIndex = statusSteps.indexOf(contract.status);
  const terminalMessageKey = {
    Cancelled: "client.projectStatus.cancelledMessage",
    Rejected: "client.projectStatus.rejectedMessage",
  }[contract.status];

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <StatusBadge status={contract.status} />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#D9D4CC]">
              {translateValue("websiteTypes", contract.websiteType)}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[#F8F7F4]">
            {contract.title}
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-[#D9D4CC]">
            {contract.scopeSummary}
          </p>
        </div>
      </div>

      {terminalMessageKey ? (
        <div className="mt-8 rounded-2xl border border-[#64131A]/35 bg-[#64131A]/18 p-5">
          <p className="font-semibold text-[#F8F7F4]">
            {t(terminalMessageKey)}
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3 md:grid-cols-5">
          {statusSteps.map((step, index) => {
            const isDone = currentIndex >= index;
            const isCurrent = currentIndex === index;

            return (
              <div
                key={step}
                className={`rounded-2xl border p-4 ${
                  isDone
                    ? "border-[#C4A77D]/30 bg-[#C4A77D]/10"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 size={18} className="text-[#C4A77D]" />
                  ) : (
                    <CircleDashed size={18} className="text-[#D9D4CC]" />
                  )}

                  <span
                    className={`text-sm font-semibold ${
                      isCurrent ? "text-[#F8F7F4]" : "text-[#D9D4CC]"
                    }`}
                  >
                    {translateValue("statuses", step)}
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#D9D4CC]">
                  {isCurrent
                    ? t("common.stages.current")
                    : isDone
                      ? t("common.stages.completed")
                      : t("common.stages.upcoming")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default ClientProjectStatus;
