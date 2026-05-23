import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("webDistrictToken") || "";
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const saveAuth = (authData) => {
    localStorage.setItem("webDistrictToken", authData.token);
    setToken(authData.token);
    setUser(authData.user);
  };

  const signup = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    saveAuth(data);
    toast.success("Account created successfully.");
    return data.user;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    saveAuth(data);
    toast.success("Logged in successfully.");
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("webDistrictToken");
    setToken("");
    setUser(null);
    toast.success("Logged out successfully.");
  };

  const fetchMe = async () => {
    if (!token) {
      setIsAuthLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem("webDistrictToken");
      setToken("");
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isAuthLoading,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;