import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import AppointmentList from "../../components/dashboard/AppointmentList";
import PortalButton from "../../components/portal/PortalButton";
import PortalPageHeader from "../../components/portal/PortalPageHeader";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";
import PaginationControls from "../../components/common/PaginationControls";

function ClientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pagination, setPagination] = useState(null);
  const { getErrorMessage, t } = useLanguage();

  const fetchAppointments = async (page = 1) => {
    try {
      setIsLoading(true);
      setLoadError("");

      const { data } = await api.get("/appointments/my", { params: { page, limit: 20 } });

      setAppointments(data.appointments || []);
      setPagination(data.pagination || null);
    } catch (error) {
      const message = getErrorMessage(error, "client.appointments.loadError");
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchAppointments);

  return (
    <div className="wd-portal-page">
      <PortalPageHeader
        eyebrow={t("common.labels.clientPortal")}
        title={t("client.appointments.title")}
        description={t("client.appointments.description")}
        action={<PortalButton to="/start">{t("client.appointments.bookAnother")}</PortalButton>}
      />

      {isLoading ? (
        <Loader text={t("client.appointments.loading")} />
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={fetchAppointments} />
      ) : (
        <>
          <AppointmentList appointments={appointments} />
          <PaginationControls pagination={pagination} onPageChange={fetchAppointments} disabled={isLoading} tone="light" />
        </>
      )}
    </div>
  );
}

export default ClientAppointments;
