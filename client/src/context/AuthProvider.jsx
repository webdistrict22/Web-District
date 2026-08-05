import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "./authContext.js";
import api, { clearAuthSession, csrfRequestConfig, refreshSession, setAuthSession } from "../lib/axios";
import { STORAGE_KEYS } from "../lib/constants";

const clearLegacyAuth = () => {
  [STORAGE_KEYS.token, STORAGE_KEYS.user, "token", "user", "webDistrictToken", "webDistrictUser"].forEach((key) => localStorage.removeItem(key));
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const clearAuth = useCallback(() => {
    clearLegacyAuth();
    clearAuthSession();
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    clearLegacyAuth();

    const invalidate = () => {
      if (active) {
        clearAuth();
        setIsAuthLoading(false);
      }
    };

    window.addEventListener("webDistrictAuthInvalidated", invalidate);
    refreshSession()
      .then((data) => { if (active) setUser(data.user || null); })
      .catch(() => { if (active) clearAuth(); })
      .finally(() => { if (active) setIsAuthLoading(false); });

    return () => {
      active = false;
      window.removeEventListener("webDistrictAuthInvalidated", invalidate);
    };
  }, [clearAuth]);

  const saveResponse = useCallback((data) => {
    setAuthSession(data);
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", { ...credentials, companyWebsite: "" }, { skipAuthRefresh: true });
    saveResponse(data);
    toast.success("Logged in successfully.");
    return data;
  }, [saveResponse]);

  const signup = useCallback(async (payload) => {
    const { data } = await api.post("/auth/signup", { ...payload, companyWebsite: "" }, { skipAuthRefresh: true });
    saveResponse(data);
    toast.success("Account created. Check your email to verify it.");
    return data;
  }, [saveResponse]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      return data.user;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", undefined, await csrfRequestConfig());
    } finally {
      clearAuth();
    }
    toast.success("Logged out successfully.");
  }, [clearAuth]);

  const logoutAll = useCallback(async () => {
    try {
      await api.post("/auth/logout-all", undefined, await csrfRequestConfig());
    } finally {
      clearAuth();
    }
    toast.success("All sessions were logged out.");
  }, [clearAuth]);

  const value = useMemo(() => ({
    user, isAuthLoading, isAuthenticated: Boolean(user), isAdmin: user?.role === "admin",
    login, signup, logout, logoutAll, refreshUser, setUser,
  }), [isAuthLoading, login, logout, logoutAll, refreshUser, signup, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
