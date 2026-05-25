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

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallbackSettings);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsSettingsLoading(true);

      const { data } = await api.get("/settings/public");

      setSettings({
        ...fallbackSettings,
        ...(data.settings || {}),
      });
    } catch (error) {
      setSettings(fallbackSettings);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
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
