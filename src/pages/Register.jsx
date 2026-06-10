// src/pages/Register.jsx
import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const payload = {
    full_name: name,               
    email: email,
    password: password,            
    birth_date: "2000-01-01",      
    metadata: { sports: [] }       
};

try {
    const result = await registerUser(payload);
    
    // El backend del profe devuelve "ok: false" si el payload es inválido
    if (result && result.ok !== false) {
        setSuccess(true);
        setTimeout(() => {
        navigate("/login");
        }, 1500);
    } else {
      // Si el payload es inválido, mostramos los errores específicos que manda el validador
        const msgError = result.errors 
        ? Object.values(result.errors).join(", ") 
        : (result.message || "Error en el formato de los datos.");
        setError(msgError);
    }
    } catch (err) {
    setError("Error al conectar con el servidor.");
    }
};

return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Registro SportClub</h2>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">¡Registro exitoso! Redirigiendo...</div>}

        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <button type="submit" className="btn btn-success w-100">Crear Cuenta</button>
        </form>
        <p className="mt-3 text-center small">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
    </div>
    </div>
);
}

export default Register;