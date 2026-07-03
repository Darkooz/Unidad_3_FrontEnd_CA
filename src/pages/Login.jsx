// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap"; // Componentes oficiales
import { loginUser, saveSession } from "../services/authService";
import Swal from "sweetalert2"; // Importaciones corregidas
// Importamos el logo oficial desde los assets
import logoSportClub from "../assets/logo_empresa_letra_v1.png";
function Login() {
  const navigate = useNavigate(); //
  const [email, setEmail] = useState(""); //
  const [password, setPassword] = useState(""); //
  const [error, setError] = useState(""); //
  const [loading, setLoading] = useState(false); // Estado para el spinner

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Encendemos el spinner

    try {
      const result = await loginUser({ email, password }); 

      // Buscamos el token y el user ya sea sueltos o adentro de "data"
      const token = result.token || result.data?.token;
      const user = result.user || result.data?.user;

      if (token && user) {
        // Guardamos las credenciales en el navegador
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirigimos a la pantalla correcta
        if (user.role === "admin" || user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "coach" || user.role === "Coach") {
          navigate("/coach/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        // Si no hay token, ahora sí mostramos el error
        Swal.fire("Acceso Denegado", result.message || "Credenciales incorrectas", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Problemas de conexión con el servidor.", "error");
    } finally {
      setLoading(false); // Apagamos el spinner al terminar
    }
  };

// Cambia esto en la parte final de tu src/pages/Login.jsx
return (
    <div 
    className="d-flex justify-content-center align-items-center min-vh-100 m-0 p-0" 
    style={{ 
        // Degradado oficial con los tonos de tu logo de SportClub
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
        
          {/* Contenedor del Logo de la Empresa */}
        <div className="text-center mb-4">
            <img 
            src="/logo_empresa_letra_v1.png" 
            alt="SportClub Logo" 
            className="img-fluid px-2"
            style={{ maxHeight: "80px", objectFit: "contain" }}
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