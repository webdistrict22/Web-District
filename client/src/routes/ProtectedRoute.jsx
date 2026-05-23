import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020817] px-5 text-center">
        <div>
          <p className="font-display text-2xl font-bold text-white">
            Loading your account...
          </p>
          <p className="mt-3 text-[#94A3B8]">
            Preparing your Web District dashboard.
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;