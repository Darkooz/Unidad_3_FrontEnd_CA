import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Componentes temporales para el desierto blanco del Dashboard (mientras los creas en la otra semana)
const UserDashboard = () => (
  <div className="container mt-5">
    <div className="card p-5 text-center shadow">
      <h3>🏋️‍♂️ ¡Panel de Alumno Activo! (SportClub)</h3>
      <p className="text-muted mt-2">Bienvenido Carlos. Aquí verás tus rutinas y asistencias pronto.</p>
    </div>
  </div>
);

const CoachDashboard = () => (
  <div className="container mt-5">
    <div className="card p-5 text-center shadow-sm">
      <h3>📋 Panel del Entrenador</h3>
      <p className="text-muted">Gestión de alumnos asignados y rutinas.</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="container mt-5">
    <div className="card p-5 text-center shadow-sm">
      <h3>⚙️ Panel de Administración Global</h3>
      <p className="text-muted">Control total de usuarios, roles y sedes del club.</p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Enrutamiento Público */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔒 Rutas Protegidas y Filtradas por Rol Estricto de INACAP */}
        <Route 
          path="/user/dashboard" 
          element={
            <RoleRoute allowedRoles={["user", "User", "alumno"]}>
              <UserDashboard />
            </RoleRoute>
          } 
        />

        <Route 
          path="/coach/dashboard" 
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <CoachDashboard />
            </RoleRoute>
          } 
        />

        <Route 
          path="/admin/dashboard" 
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          } 
        />

        {/* Si escriben cualquier ruta loca o inexistente, los patea al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;