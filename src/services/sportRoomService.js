const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

export async function getSportRooms() {
  const response = await fetch(`${API_URL}/sport-rooms`, { headers: getAuthHeaders() });
  return response.json();
}

export async function createSportRoom(data) {
  const response = await fetch(`${API_URL}/sport-rooms`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateSportRoom(id, data) {
  const response = await fetch(`${API_URL}/sport-rooms/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteSportRoom(id) {
  const response = await fetch(`${API_URL}/sport-rooms/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return response.json();
}