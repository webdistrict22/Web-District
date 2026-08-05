import axios from "axios";

export const PUBLIC_CONTENT_TIMEOUT = 10000;
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authApi = axios.create({ baseURL, withCredentials: true, timeout: 20000, headers: { "Content-Type": "application/json" } });
const api = axios.create({ baseURL, withCredentials: true, timeout: 20000, headers: { "Content-Type": "application/json" } });

let accessToken = "";
let csrfToken = "";
let refreshPromise = null;

export const setAuthSession = ({ accessToken: nextAccessToken = "", csrfToken: nextCsrfToken = "" } = {}) => {
  accessToken = nextAccessToken;
  csrfToken = nextCsrfToken;
};

export const clearAuthSession = () => {
  accessToken = "";
  csrfToken = "";
};

const getCsrfToken = async () => {
  const { data } = await authApi.get("/auth/csrf", { skipAuthRefresh: true });
  csrfToken = data.csrfToken;
  return csrfToken;
};

export const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const token = csrfToken || (await getCsrfToken());
      const { data } = await authApi.post("/auth/refresh", undefined, {
        headers: { "X-CSRF-Token": token },
        skipAuthRefresh: true,
      });
      setAuthSession(data);
      return data;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

export const csrfRequestConfig = async () => ({
  headers: { "X-CSRF-Token": csrfToken || (await getCsrfToken()) },
});

api.interceptors.request.use((config) => {
  if (accessToken && !config.skipAccessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const status = error.response?.status;
    const url = String(config.url || "");
    const authPath = url.includes("/auth/") && !url.endsWith("/auth/me");

    if (status === 401 && !config._authRetried && !config.skipAuthRefresh && !authPath) {
      config._authRetried = true;
      try {
        await refreshSession();
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
        return api(config);
      } catch {
        clearAuthSession();
        window.dispatchEvent(new Event("webDistrictAuthInvalidated"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
