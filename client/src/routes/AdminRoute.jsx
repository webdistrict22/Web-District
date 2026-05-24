import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <Loader text="Checking admin access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export default AdminRoute;