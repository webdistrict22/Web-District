import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import ContractList from "../../components/dashboard/ContractList";
import PortalButton from "../../components/portal/PortalButton";
import PortalPageHeader from "../../components/portal/PortalPageHeader";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../../components/common/PaginationControls";

function ClientContracts() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pagination, setPagination] = useState(null);
  const { getErrorMessage, t } = useLanguage();

  const fetchContracts = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const { data } = await api.get("/contracts/my", { params: { page, limit: 20 } });

      setContracts(data.contracts || []);
      setPagination(data.pagination || null);
    } catch (error) {
      const message = getErrorMessage(error, "client.contracts.loadError");
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
        title={t("client.contracts.title")}
        description={t("client.contracts.description")}
        action={<PortalButton to="/start">{t("client.profile.startNew")}</PortalButton>}
      />

      {isLoading ? (
        <Loader text={t("client.contracts.loading")} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchContracts} />
      ) : (
        <>
          <ContractList contracts={contracts} setContracts={setContracts} allowClientActions variant="portal" />
          <PaginationControls pagination={pagination} onPageChange={fetchContracts} disabled={isLoading} tone="light" />
        </>
      )}
    </div>
  );
}

export default ClientContracts;
