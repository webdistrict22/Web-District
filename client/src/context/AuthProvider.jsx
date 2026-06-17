import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "./authContext.js";
import api from "../lib/axios";
import { STORAGE_KEYS } from "../lib/constants";

const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("webDistrictToken");
  localStorage.removeItem("webDistrictUser");
};

const readStoredUser = () => {
  const storedUser =
    localStorage.getItem(STORAGE_KEYS.user) || localStorage.getItem("user");

  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);

    return parsedUser &&
      typeof parsedUser === "object" &&
      ["client", "admin"].includes(parsedUser.role)
      ? parsedUser
      : null;
  } catch {
    return null;
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const claimedSessionUsersRef = useRef(new Set());

  const claimGuestRecordsOnce = useCallback(async (nextUser) => {
    if (!nextUser || nextUser.role !== "client") return;

    const claimKey = nextUser._id || nextUser.id || nextUser.email;

    if (!claimKey || claimedSessionUsersRef.current.has(claimKey)) return;

    claimedSessionUsersRef.current.add(claimKey);

    try {
      await api.post("/auth/claim-records", undefined, {
        skipAuthInvalidation: true,
      });
    } catch {
      // Best-effort only: a failed claim should not disrupt the session.
    }
  }, []);

  const saveAuth = useCallback((token, nextUser) => {
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));

    setUser(nextUser);
  }, []);

  const clearAuth = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");

      setUser(data.user);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuth();
      }

      return null;
    }
  }, [clearAuth]);

  useEffect(() => {
    let isActive = true;

    const handleAuthInvalidated = () => {
      clearStoredAuth();

      if (isActive) {
        setUser(null);
        setIsAuthLoading(false);
      }
    };

    const validateStoredSession = async () => {
      const storedToken =
        localStorage.getItem(STORAGE_KEYS.token) ||
        localStorage.getItem("token");
      const storedUser = readStoredUser();

      if (!storedToken) {
        clearStoredAuth();

        if (isActive) {
          setIsAuthLoading(false);
        }
        return;
      }

      localStorage.setItem(STORAGE_KEYS.token, storedToken);

      try {
        const { data } = await api.get("/auth/me");

        if (!isActive) return;

        if (!data?.user) {
          throw new Error("Invalid session response");
        }

        await claimGuestRecordsOnce(data.user);

        if (!isActive) return;

        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      } catch (error) {
        const isRejectedSession = [401, 403].includes(error.response?.status);

        if (isRejectedSession || !storedUser) {
          clearStoredAuth();
        }

        if (isActive && isRejectedSession) {
          setUser(null);
        } else if (isActive && storedUser) {
          setUser(storedUser);
        }
      } finally {
        if (isActive) {
          setIsAuthLoading(false);
        }
      }
    };

    window.addEventListener(
      "webDistrictAuthInvalidated",
      handleAuthInvalidated
    );
    validateStoredSession();

    return () => {
      isActive = false;
      window.removeEventListener(
        "webDistrictAuthInvalidated",
        handleAuthInvalidated
      );
    };
  }, [claimGuestRecordsOnce, clearAuth]);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    saveAuth(data.token, data.user);

    toast.success("Logged in successfully.");

    return data;
  }, [saveAuth]);

  const signup = useCallback(async (payload) => {
    const { data } = await api.post("/auth/signup", payload);

    saveAuth(data.token, data.user);

    toast.success("Account created successfully.");

    return data;
  }, [saveAuth]);

  const logout = useCallback(() => {
    clearAuth();
    toast.success("Logged out successfully.");
  }, [clearAuth]);

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
    [isAuthLoading, login, logout, refreshUser, signup, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
