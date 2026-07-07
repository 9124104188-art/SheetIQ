/* eslint-disable no-undef */
import axios from "axios";

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_BASE_URL = "http://localhost:5000/api";

// Prefer Vite env, then CRA env, then fallback.
const resolvedBaseURL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  DEFAULT_BASE_URL;

function getTokenSafely() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function clearAuthSafely() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {
    // no-op
  }
}

const api = axios.create({
  baseURL: resolvedBaseURL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const nextConfig = { ...config };
    nextConfig.headers = nextConfig.headers || {};

    // Allow per-request opt-out: api.get("/public", { skipAuth: true })
    if (!nextConfig.skipAuth) {
      const token = getTokenSafely();
      if (token) {
        nextConfig.headers.Authorization = `Bearer ${token}`;
      }
    }

    return nextConfig;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    // Attach normalized message for consistent UI handling.
    error.userMessage =
      serverMessage ||
      (status >= 500
        ? "Server error. Please try again."
        : status === 401
        ? "Session expired. Please log in again."
        : error?.message || "Request failed");

    if (status === 401) {
      clearAuthSafely();

      // Notify app shell if it listens for auth expiration.
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;