import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Unauthorized from "../pages/Unauthorized";
import UserDashboard from "../pages/user/UserDashboard";
import CoachDashboard from "../pages/coach/CoachDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserLayout from "../layouts/UserLayout";
import CoachLayout from "../layouts/CoachLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔒 Zona Alumno: Protegida por rol "user" */}
        <Route 
          path="/user" 
          element={
            <RoleRoute allowedRoles={["user", "User", "alumno"]}>
              <UserLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        {/* 🔒 Zona Entrenador: Protegida por rol "coach" */}
        <Route 
          path="/coach" 
          element={
            <RoleRoute allowedRoles={["coach", "Coach", "entrenador"]}>
              <CoachLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<CoachDashboard />} />
        </Route>

        {/* 🔒 Zona Administrador: Protegida por rol "admin" */}
        <Route 
          path="/admin" 
          element={
            <RoleRoute allowedRoles={["admin", "Admin", "administrador"]}>
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Ruta comodín para evitar páginas en blanco */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;