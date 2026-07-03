const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

// Obtener todos los deportes
export async function getSports() {
  const response = await fetch(`${API_URL}/sports`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

// Crear un deporte
export async function createSport(data) {
  const response = await fetch(`${API_URL}/sports`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Actualizar un deporte
export async function updateSport(id, data) {
  const response = await fetch(`${API_URL}/sports/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

// Eliminar un deporte
export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/sports/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return response.json();
}
// Cambiar el estado de un deporte (Activar/Desactivar)
export async function toggleSportStatus(id, statusData) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/sports/${id}`, {
    // Usamos PUT o PATCH dependiendo de cómo actualice el backend
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    // Enviamos el nuevo estado (ej: { is_active: false })
    body: JSON.stringify(statusData), 
  });
  
  return response.json();
}