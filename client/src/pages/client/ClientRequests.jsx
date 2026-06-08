import { useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import RequestList from "../../components/dashboard/RequestList";
import api from "../../lib/axios";
import useLanguage from "../../hooks/useLanguage";
import useInitialLoad from "../../hooks/useInitialLoad";

function ClientRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getErrorMessage, t } = useLanguage();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/requests/my");

      setRequests(data.requests || []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "client.requests.loadError")
      );
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
      ) : (
        <RequestList requests={requests} />
      )}
    </div>
  );
}

export default ClientRequests;
