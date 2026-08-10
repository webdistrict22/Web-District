import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import RequestList from "../../components/dashboard/RequestList";
import PortalButton from "../../components/portal/PortalButton";
import PortalPageHeader from "../../components/portal/PortalPageHeader";
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
    <div className="wd-portal-page">
      <PortalPageHeader
        eyebrow={t("common.labels.clientPortal")}
        title={t("client.requests.title")}
        description={t("client.requests.description")}
        action={<PortalButton to="/start">{t("common.buttons.newRequest")}</PortalButton>}
      />

      {isLoading ? (
        <Loader text={t("client.requests.loading")} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchRequests} />
      ) : (
        <>
          <RequestList requests={requests} />
          <PaginationControls pagination={pagination} onPageChange={fetchRequests} disabled={isLoading} tone="light" />
        </>
      )}
    </div>
  );
}

export default ClientRequests;
