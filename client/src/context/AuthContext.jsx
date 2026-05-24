import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { STORAGE_KEYS } from "../lib/constants";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const saveAuth = (token, nextUser) => {
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));

    setUser(nextUser);
  };

  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("webDistrictToken");
    localStorage.removeItem("webDistrictUser");

    setUser(null);
  };

  const loadStoredUser = () => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);

    if (!storedUser || !storedToken) {
      setIsAuthLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      clearAuth();
    } finally {
      setIsAuthLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");

      setUser(data.user);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      clearAuth();
      return null;
    }
  };

  useEffect(() => {
    loadStoredUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    saveAuth(data.token, data.user);

    toast.success("Logged in successfully.");

    return data;
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);

    saveAuth(data.token, data.user);

    toast.success("Account created successfully.");

    return data;
  };

  const logout = () => {
    clearAuth();
    toast.success("Logged out successfully.");
  };

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
      refreshUser,
      setUser,
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;