import { useContext } from "react";
import SettingsContext from "../context/settingsContext.js";

function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}

export default useSettings;
