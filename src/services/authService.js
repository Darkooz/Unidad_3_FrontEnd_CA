// src/services/authService.js
// Función para iniciar sesión
export async function loginUser(credentials) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials), // Enviamos email y password
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error en la petición de login:", error);
    return { message: "Error de conexión con el servidor" };
  }
}

// Guarda el token y los datos del usuario que manda el backend
export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Obtiene el token guardado
export function getToken() {
  return localStorage.getItem("token");
}

// Obtiene los datos del usuario (como el rol)
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Retorna true si hay un token activo
export function isAuthenticated() {
  return Boolean(getToken());
}

// Limpia el almacenamiento al salir
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Función para registrar un nuevo usuario
export async function registerUser(userData) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error en la petición de registro:", error);
    return { ok: false, message: "Error de conexión con el servidor" };
  }
}