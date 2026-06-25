import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Unauthorized from "../pages/Unauthorized";
import UserDashboard from "../pages/user/UserDashboard";
import CoachDashboard from "../pages/coach/CoachDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersPage from "../pages/admin/UsersPage";
import Profile from "../pages/Profile";
import UserLayout from "../layouts/UserLayout";
import CoachLayout from "../layouts/CoachLayout";
import AdminLayout from "../layouts/AdminLayout";
import RoleRoute from "./RoleRoute";
import ProtectedRoute from "./ProtectedRoute";
import SportsPage from "../pages/admin/SportsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 2. Agrega la ruta de Profile protegida para cualquier usuario logueado */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/user" element={<RoleRoute allowedRoles={["user", "User", "alumno"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        <Route path="/coach" element={<RoleRoute allowedRoles={["coach", "Coach", "entrenador"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
        </Route>

        <Route path="/admin" element={<RoleRoute allowedRoles={["admin", "Admin", "administrador"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sports" element={<SportsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;