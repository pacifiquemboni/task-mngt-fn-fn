import axios from "axios";

const api = axios.create({
  // Use a relative `/api` URL by default so the service worker can intercept
  // requests and cache API responses. Set `VITE_API_URL` only when you need
  // to target a different origin (production with a proxy or same-origin API).
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
