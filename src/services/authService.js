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