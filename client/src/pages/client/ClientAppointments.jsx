import { useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import AppointmentList from "../../components/dashboard/AppointmentList";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

function ClientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getErrorMessage, t } = useLanguage();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/appointments/my");

      setAppointments(data.appointments || []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "client.appointments.loadError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useInitialLoad(fetchAppointments);

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C4A77D]">
              {t("common.labels.clientPortal")}
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
              {t("client.appointments.title")}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#D9D4CC]">
              {t("client.appointments.description")}
            </p>
          </div>

          <Button to="/start">{t("client.appointments.bookAnother")}</Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text={t("client.appointments.loading")} />
      ) : (
        <AppointmentList appointments={appointments} />
      )}
    </div>
  );
}

export default ClientAppointments;
