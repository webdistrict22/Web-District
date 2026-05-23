import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function AdminRoute() {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020817] px-5 text-center">
        <div>
          <p className="font-display text-2xl font-bold text-white">
            Checking admin access...
          </p>
          <p className="mt-3 text-[#94A3B8]">
            Securing the Web District dashboard.
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;