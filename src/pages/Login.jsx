// src/pages/Login.jsx
import { useState } from "react";
// 1. Agregamos "saveSession" en la importación para poder usarlo de la guía
import { loginUser, saveSession } from "../services/authService"; 
import { useNavigate, Link } from "react-router-dom";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);
const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
    const result = await loginUser({ 
        email: email, 
        username: email, 
        password: password 
    });

      // Si el backend responde con token o éxito rotundo
    if (result && (result.token || result.ok === true)) {
        
        // 2. Extraemos el token y el usuario según responda tu backend
        const tokenVal = result.token || result.data?.token;
        const userVal = result.user || result.data?.user;

        // 3. Usamos la función oficial para guardar AMBAS cosas en el LocalStorage
        saveSession(tokenVal, userVal);
        
        setError("");       
        setSuccess(true);   
        
        setTimeout(() => {
        navigate("/user/dashboard"); 
        }, 1500);
    } else {
        setSuccess(false);
        setError(result?.message || "Credenciales incorrectas.");
    }
    } catch (err) {
    setSuccess(false);
    setError("Error al conectar con el servidor.");
    }
};

return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login SportClub</h2>
        
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">¡Login exitoso! Redirigiendo...</div>}

        <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
        <p className="mt-3 text-center small">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
    </div>
    </div>
);
}

export default Login;