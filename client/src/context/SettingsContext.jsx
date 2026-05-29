import { createContext, useEffect, useState } from "react";
import api from "../lib/axios";
import { AGENCY } from "../lib/constants";

export const SettingsContext = createContext(null);

const fallbackSettings = {
  agencyName: AGENCY.name,
  phone: AGENCY.phone,
  whatsapp: AGENCY.whatsapp,
  instagram: AGENCY.instagram,
  email: AGENCY.email,
  heroHeadline: "Websites that make your business look serious.",
  heroSubtext:
    "Clean websites for brands, stores, and businesses that need a stronger online presence.",
  primaryCTA: "Start Your Project",
  secondaryCTA: "View Our Work",
  footerText: "Clean websites for brands, stores, and businesses.",
};

const scheduleAfterPaint = (callback) => {
  if (typeof window === "undefined") return undefined;

  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout: 1800 });

    return () => window.cancelIdleCallback(idleId);
  }

  const timerId = window.setTimeout(callback, 700);

  return () => window.clearTimeout(timerId);
};

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  const fetchSettings = async (signal) => {
    try {
      setIsSettingsLoading(true);

      const { data } = await api.get("/settings/public", { signal });

      setSettings({
        ...fallbackSettings,
        ...(data.settings || {}),
      });
    } catch (error) {
      if (!signal?.aborted) {
        setSettings(fallbackSettings);
      }
    } finally {
      if (!signal?.aborted) {
        setIsSettingsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const cancelScheduledFetch = scheduleAfterPaint(() => {
      fetchSettings(controller.signal);
    });

    return () => {
      controller.abort();
      cancelScheduledFetch?.();
    };
  }, []);

  const value = {
    settings,
    isSettingsLoading,
    refetchSettings: fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
