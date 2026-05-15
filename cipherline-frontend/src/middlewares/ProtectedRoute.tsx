import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = false; // replace with real auth check

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
