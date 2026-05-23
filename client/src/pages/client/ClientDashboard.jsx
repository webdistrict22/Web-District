import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="grid gap-5">
      <Card className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69A4E]">
          Overview
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.05em]">
          Your Web District workspace.
        </h2>
        <p className="mt-4 leading-7 text-[#94A3B8]">
          This dashboard will show your website requests, call appointments,
          contracts, and project updates.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button to="/start">Submit a new request</Button>
          <Button to="/account/requests" variant="secondary">
            View requests
          </Button>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-[#94A3B8]">Name</p>
          <p className="mt-2 font-semibold text-white">{user?.name}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-[#94A3B8]">Business</p>
          <p className="mt-2 font-semibold text-white">
            {user?.businessName || "Not added"}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-[#94A3B8]">Email</p>
          <p className="mt-2 font-semibold text-white">{user?.email}</p>
        </Card>
      </div>
    </div>
  );
}

export default ClientDashboard;