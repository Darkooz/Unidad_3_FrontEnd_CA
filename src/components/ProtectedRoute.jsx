import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 1. Si no hay token ni sesión activa, directo al Login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Si hay sesión pero el rol no tiene permiso para esta ruta
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirigimos según el rol real que tenga el usuario para que no quede atrapado
    if (user.role === "admin") {
      return <Navigate to="/admin/schedules" replace />; // Cambia esto por tu ruta principal de admin
    }
    if (user.role === "coach") {
      return <Navigate to="/coach/dashboard" replace />; // Cambia esto por tu ruta de coach
    }
    return <Navigate to="/portal" replace />; // Alumnos van a su portal
  }

  // 3. Si tiene el token y el rol correcto, se le permite el acceso
  return <Outlet />;
}

export default ProtectedRoute;