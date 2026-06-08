import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import SettingsContext from "./settingsContext.js";
import api, { PUBLIC_CONTENT_TIMEOUT } from "../lib/axios";
import { AGENCY } from "../lib/constants";

const fallbackSettings = {
  agencyName: AGENCY.name,
  phone: AGENCY.phone,
  whatsapp: AGENCY.whatsapp,
  instagram: AGENCY.instagram,
  email: AGENCY.email,
  heroHeadline: "Your brand, brought online with care.",
  heroSubtext:
    "Elegant websites for brands ready to look more polished, trusted, and complete online.",
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

  const fetchSettings = useCallback(async (signal) => {
    try {
      setIsSettingsLoading(true);

      const { data } = await api.get("/settings/public", {
        signal,
        timeout: PUBLIC_CONTENT_TIMEOUT,
      });

      setSettings({
        ...fallbackSettings,
        ...(data.settings || {}),
      });
    } catch {
      if (!signal?.aborted) {
        setSettings(fallbackSettings);
      }
    } finally {
      if (!signal?.aborted) {
        setIsSettingsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const cancelScheduledFetch = scheduleAfterPaint(() => {
      fetchSettings(controller.signal);
    });

    return () => {
      controller.abort();
      cancelScheduledFetch?.();
    };
  }, [fetchSettings]);

  const value = useMemo(
    () => ({
      settings,
      isSettingsLoading,
      refetchSettings: fetchSettings,
    }),
    [fetchSettings, isSettingsLoading, settings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
