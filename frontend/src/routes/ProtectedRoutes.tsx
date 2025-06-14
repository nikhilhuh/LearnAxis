import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { UserDetails, isInitialized } = useUser();

  // Avoid redirecting before context is loaded
  if (!isInitialized) return null;

  if (!UserDetails) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(UserDetails.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
