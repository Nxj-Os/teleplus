import { Navigate, Outlet } from "react-router-dom";
import { recuperarSesionDashboard } from "../../utils/dashboardAuth";

function DashboardGuard() {
  const session = recuperarSesionDashboard();
  const token = localStorage.getItem("token");

  // Sesión vieja sin JWT obliga a volver a loguearse
  if (!session || !token) {
    return <Navigate to="/dashboard/login" replace />;
  }

  return <Outlet />;
}

export default DashboardGuard;
