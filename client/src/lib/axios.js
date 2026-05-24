import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("webDistrictToken") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const currentPath = window.location.pathname;

      localStorage.removeItem("webDistrictToken");
      localStorage.removeItem("webDistrictUser");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const isAuthPage =
        currentPath === "/login" ||
        currentPath === "/signup" ||
        currentPath === "/";

      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;