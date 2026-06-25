const API_URL = "http://localhost:3000/api/sports";

// Función auxiliar que busca tu "credencial VIP" (Token) en el navegador
// y arma las cabeceras de seguridad que exige el backend.
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); 
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

// 1. Listar todos los deportes
export async function getSports() {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders() // Agregamos la credencial
  });
  return response.json();
}

// 2. Obtener un deporte por ID
export async function getSportById(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

// 3. Crear un deporte
export async function createSport(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(), // Agregamos la credencial al POST
    body: JSON.stringify(data),
  });
  return response.json();
}

// 4. Actualizar un deporte
export async function updateSport(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// 5. Eliminar un deporte
export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders() // Fundamental para poder borrar
  });
  return response.json();
}

// 6. Cambiar estado de un deporte
export async function toggleSportStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return response.json();
}