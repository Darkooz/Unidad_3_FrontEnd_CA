import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    birth_date: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validación visual con SweetAlert2
    if (!formData.full_name || !formData.email || !formData.password || !formData.birth_date) {
      Swal.fire("Faltan datos", "Por favor, completa todos los campos para registrarte.", "warning");
      return;
    }

    // 2. Armamos el payload exacto que pide el backend del profe
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      birth_date: formData.birth_date,
      role: "user",
      metadata: { sports: [] }
    };

    try {
      const result = await registerUser(payload);
      
      // 3. Manejo de Respuesta
      if (result && result.ok !== false && !result.errors) {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
          icon: "success",
          confirmButtonText: "Ir al Login",
          confirmButtonColor: "#198754"
        }).then(() => {
          navigate("/login");
        });
      } else {
        // Adiós "Payload inválido" -> Extraemos los errores reales
        const msgError = result.errors 
          ? Object.values(result.errors).join(", ") 
          : (result.message || "El correo ya está en uso o los datos son incorrectos.");
        
        Swal.fire("No pudimos registrarte", msgError, "error");
      }
    } catch (err) {
      Swal.fire("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg border-0" style={{ width: "400px", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 fw-bold text-success">Registro SportClub</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre Completo</label>
            <input
              type="text"
              name="full_name"
              className="form-control"
              placeholder="Ej: Juan Pérez"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Fecha de Nacimiento</label>
            <input
              type="date"
              name="birth_date"
              className="form-control"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold py-2">
            Crear Cuenta
          </button>
        </form>
        <p className="mt-4 text-center small text-muted">
          ¿Ya tienes cuenta? <Link to="/login" className="text-success fw-bold text-decoration-none">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;