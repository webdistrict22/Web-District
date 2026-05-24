import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, CircleDashed } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../lib/axios";

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

  const fetchContracts = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/contracts/my");

      setContracts(data.contracts || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load project status."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
              Client portal
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              Project status
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#94A3B8]">
              Track the progress of proposals and active projects from contract
              status.
            </p>
          </div>

          <Button to="/account/contracts" variant="secondary">
            View contracts
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading project status..." />
      ) : contracts.length ? (
        <div className="grid gap-5">
          {contracts.map((contract) => (
            <ProjectStatusCard key={contract._id} contract={contract} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No active project status yet"
          description="Once Web District prepares a proposal or contract for you, project status will appear here."
          actionText="Start a request"
          actionTo="/start"
        />
      )}
    </div>
  );
}

function ProjectStatusCard({ contract }) {
  const currentIndex = statusSteps.indexOf(contract.status);

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <StatusBadge status={contract.status} />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-[#94A3B8]">
              {contract.websiteType}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
            {contract.title}
          </h3>

          <p className="mt-3 max-w-3xl leading-7 text-[#94A3B8]">
            {contract.scopeSummary}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-5">
        {statusSteps.map((step, index) => {
          const isDone = currentIndex >= index;
          const isCurrent = currentIndex === index;

          return (
            <div
              key={step}
              className={`rounded-2xl border p-4 ${
                isDone
                  ? "border-[#C69A4E]/30 bg-[#C69A4E]/10"
                  : "border-white/10 bg-white/[0.025]"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                {isDone ? (
                  <CheckCircle2 size={18} className="text-[#C69A4E]" />
                ) : (
                  <CircleDashed size={18} className="text-[#64748B]" />
                )}

                <span
                  className={`text-sm font-semibold ${
                    isCurrent ? "text-[#F1D08B]" : "text-[#CBD5E1]"
                  }`}
                >
                  {step}
                </span>
              </div>

              <p className="text-xs leading-5 text-[#94A3B8]">
                {isCurrent ? "Current stage" : isDone ? "Completed stage" : "Upcoming stage"}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ClientProjectStatus;