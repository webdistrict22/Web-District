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
  heroHeadline: "Websites that make businesses look serious.",
  heroSubtext:
    "We build clean, modern websites for brands, businesses, and campaigns — from online stores to business websites and landing pages.",
  primaryCTA: "Book your website",
  secondaryCTA: "View our work",
  footerText: "Clean websites for brands, businesses, and campaigns.",
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