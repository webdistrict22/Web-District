import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ContractList from "../../components/dashboard/ContractList";
import api from "../../lib/axios";

function ClientContracts() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get("/contracts/my");

      setContracts(data.contracts || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load your contracts."
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
              Contracts and proposals
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#94A3B8]">
              View proposals, project scope, payment details, timeline, and
              contract status prepared by Web District. You can accept a
              proposal or send a note from here.
            </p>
          </div>

          <Button to="/start">Start new request</Button>
        </div>
      </Card>

      {isLoading ? (
        <Loader text="Loading your contracts..." />
      ) : (
        <ContractList
          contracts={contracts}
          setContracts={setContracts}
          allowClientActions
        />
      )}
    </div>
  );
}

export default ClientContracts;