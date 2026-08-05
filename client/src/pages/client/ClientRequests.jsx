import { useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import RequestList from "../../components/dashboard/RequestList";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../../components/common/PaginationControls";

function ClientRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pagination, setPagination] = useState(null);
  const { getErrorMessage, t } = useLanguage();

  const fetchRequests = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const { data } = await api.get("/requests/my", { params: { page, limit: 20 } });

      setRequests(data.requests || []);
      setPagination(data.pagination || null);
    } catch (error) {
      const message = getErrorMessage(error, "client.requests.loadError");
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchRequests);

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              {t("common.labels.clientPortal")}
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              {t("client.requests.title")}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
              {t("client.requests.description")}
            </p>
          </div>

          <Button to="/start">{t("common.buttons.newRequest")}</Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text={t("client.requests.loading")} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchRequests} />
      ) : (
        <>
          <RequestList requests={requests} />
          <PaginationControls pagination={pagination} onPageChange={fetchRequests} disabled={isLoading} />
        </>
      )}
    </div>
  );
}

export default ClientRequests;
