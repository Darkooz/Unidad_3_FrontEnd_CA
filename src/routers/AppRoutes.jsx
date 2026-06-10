// src/routers/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Dejamos una vista de inicio simple con Bootstrap tradicional para navegar
function Home() {
  return (
    <div className="container text-center mt-5">
      <h1>Bienvenido a SportClub</h1>
      <p className="lead">Sistema SPA desarrollado con React y Bootstrap tradicional.</p>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary me-2">Ir al Login</Link>
        <Link to="/register" className="btn btn-success">Ir al Registro</Link>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;