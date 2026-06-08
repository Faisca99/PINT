import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Injecta automaticamente o x-user-id em todos os pedidos
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("pint_auth");
    if (stored) {
      const auth = JSON.parse(stored);
      if (auth?.id) config.headers["x-user-id"] = String(auth.id);
    }
  } catch {
    // sem auth guardada — pedido público
  }
  return config;
});

export default api;
