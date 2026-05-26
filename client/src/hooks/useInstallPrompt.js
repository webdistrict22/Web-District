import { useCallback, useEffect, useState } from "react";

export default function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setCanInstall(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return { outcome: "unavailable" };

    installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    setInstallPrompt(null);
    setCanInstall(false);

    return choice;
  }, [installPrompt]);

  return { canInstall, promptInstall };
}
