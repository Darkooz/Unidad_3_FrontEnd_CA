const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

export async function getClassSchedules() {
  const response = await fetch(`${API_URL}/class-schedules`, { headers: getAuthHeaders() });
  return response.json();
}

export async function createClassSchedule(data) {
  const response = await fetch(`${API_URL}/class-schedules`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateClassSchedule(id, data) {
  const response = await fetch(`${API_URL}/class-schedules/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteClassSchedule(id) {
  const response = await fetch(`${API_URL}/class-schedules/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return response.json();
}