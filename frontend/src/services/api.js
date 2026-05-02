import axios from "axios";

// 🔥 CREATE INSTANCE
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// 🔐 ATTACH TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 🚨 GLOBAL ERROR HANDLING
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 NETWORK ERROR
    if (!error.response) {
      console.error("Network error");
      alert("Server not reachable");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 🔐 UNAUTHORIZED
    if (status === 401) {
      localStorage.removeItem("accessToken");

      alert("Session expired. Please login again.");

      window.location.href = "/login";
    }

    // 🔥 FORBIDDEN (ROLE BASED)
    if (status === 403) {
      console.warn("Access denied:", data?.message);

      alert(
        data?.message ||
          "You are not allowed to perform this action (role restriction)",
      );
    }

    // 🔥 VALIDATION / SERVER ERROR
    if (status >= 400) {
      console.error("API ERROR:", data?.message || error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
