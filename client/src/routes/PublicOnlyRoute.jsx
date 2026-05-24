import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isAdmin, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <Loader text="Loading..." />;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/account"} replace />;
  }

  return children;
}

export default PublicOnlyRoute;