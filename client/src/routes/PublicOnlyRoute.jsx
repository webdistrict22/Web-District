import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function PublicOnlyRoute() {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020817] px-5 text-center">
        <div>
          <p className="font-display text-2xl font-bold text-white">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/account"} replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;