// src/services/authService.js
const API_URL = "http://localhost:3000/api/auth"; // [cite: 327]

export async function loginUser(data) { // [cite: 328]
  const response = await fetch(`${API_URL}/login`, { // [cite: 329]
    method: "POST", // [cite: 329]
    headers: {
      "Content-Type": "application/json", // [cite: 332]
    },
    body: JSON.stringify(data), // [cite: 333]
  });
  return response.json(); // [cite: 335, 336]
}
// src/services/authService.js

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
export async function registerUser(data) { // [cite: 337]
  const response = await fetch(`${API_URL}/register`, { // [cite: 338]
    method: "POST", // [cite: 339]
    headers: {
      "Content-Type": "application/json", // [cite: 341]
    },
    body: JSON.stringify(data), // [cite: 342]
  });
  return response.json(); // [cite: 346]
}