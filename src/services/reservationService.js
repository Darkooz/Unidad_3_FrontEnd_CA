// src/services/reservationService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  };
};

// Crear una nueva reserva (Inscribirse a una clase)
export async function createReservation(classScheduleId) {
  const response = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ class_schedule_id: classScheduleId })
  });
  if (!response.ok) throw new Error("Error al crear la reserva");
  return response.json();
}

// Obtener las reservas del alumno que está logueado
export async function getMyReservations() {
  const response = await fetch(`${API_URL}/reservations/my-reservations`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Error al obtener tus reservas");
  return response.json();
}

// Cancelar una reserva
export async function cancelReservation(id) {
  const url = `${API_URL}/reservations/${id}/cancel`;
  console.log("Enviando PATCH a:", url); // Para verificar la URL exacta en la consola

  const response = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    // Intentamos leer el mensaje de error que mandó el controlador del backend
    const errorBody = await response.json().catch(() => ({}));
    console.error("Error del backend:", errorBody);
    throw new Error(errorBody.message || "Error al cancelar la reserva");
  }

  return response.json();
}