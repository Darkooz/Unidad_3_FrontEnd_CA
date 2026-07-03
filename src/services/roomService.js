const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

// 1. Obtener todas las salas
export async function getRooms() {
  const response = await fetch(`${API_URL}/rooms`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

// 2. Crear una nueva sala (ESTA ES LA QUE FALTABA)
export async function createRoom(data) {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// 3. Actualizar una sala existente
export async function updateRoom(id, data) {
  const response = await fetch(`${API_URL}/rooms/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// 4. Eliminar una sala
export async function deleteRoom(id) {
  const response = await fetch(`${API_URL}/rooms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return response.json();
}