import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import AppointmentList from "../../components/dashboard/AppointmentList";
import api from "../../lib/axios";

function ClientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/appointments/my");

      setAppointments(data.appointments || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load your appointments."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
              Your call appointments
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#94A3B8]">
              Track your booked calls with Web District and follow their current
              status.
            </p>
          </div>

          <Button to="/start">Book another call</Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading your call appointments..." />
      ) : (
        <AppointmentList appointments={appointments} />
      )}
    </div>
  );
}

export default ClientAppointments;