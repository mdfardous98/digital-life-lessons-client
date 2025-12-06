import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function UserRoute() {
  const { userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return userRole === "user" ? <Outlet /> : <Navigate to="/" replace />;
}
