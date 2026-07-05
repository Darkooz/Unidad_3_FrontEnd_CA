// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { loginUser } from "../services/authService";
import Swal from "sweetalert2";
import logoSportClub from "../assets/logo_empresa_letra_v1.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ email, password }); 

      const token = result.token || result.data?.token;
      const user = result.user || result.data?.user;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // RUTAS CORREGIDAS SEGÚN LO QUE ARMAMOS HOY
        if (user.role === "admin" || user.role === "Admin") {
          navigate("/admin/schedules"); // Ruta del administrador
        } else if (user.role === "coach" || user.role === "Coach") {
          navigate("/coach/dashboard"); // Ruta del entrenador
        } else {
          navigate("/portal"); // <--- AHORA SÍ LOS MANDA AL PORTAL AZUL
        }
      } else {
        Swal.fire("Acceso Denegado", result.message || "Credenciales incorrectas", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Problemas de conexión con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100 m-0 p-0" 
      style={{ 
        background: "linear-gradient(135deg, #1b0933 0%, #0d041a 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowY: "auto"
      }}
    >
      <Card style={{ width: "24rem" }} className="shadow-lg border-0 bg-white rounded-4 my-auto">
        <Card.Body className="p-4">
        
        <div className="text-center mb-4">
            {/* CORREGIDA LA ETIQUETA IMG PARA USAR LA VARIABLE IMPORTADA */}
            <img 
              src={logoSportClub} 
              alt="SportClub Logo" 
              className="img-fluid px-2"
              style={{ maxHeight: "80px", objectFit: "contain" }}
              onError={(e) => { e.target.src = "https://via.placeholder.com/150x50?text=SPORTCLUB"; }} 
            />
            <div 
              className="mt-2 text-muted px-3" 
              style={{ borderTop: "2px solid #ffcc00", height: "2px" }}
            />
        </div>

        {error && <Alert variant="danger" className="text-center p-2 small">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-secondary">Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="ejemplo@sportclub.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 border-2"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 border-2"
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="dark" 
              className="w-100 p-2 fw-bold text-uppercase shadow-sm" 
              disabled={loading}
              style={{ backgroundColor: "#250c46", borderColor: "#250c46" }}
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
        </Form>

        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;