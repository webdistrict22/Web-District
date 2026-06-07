let didQueueRegistration = false;

const isLocalhost = () =>
  ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

export default function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return undefined;

  const canRegister =
    import.meta.env.PROD ||
    window.location.protocol === "https:" ||
    isLocalhost();

  if (!canRegister) return undefined;

  if (didQueueRegistration) return undefined;

  didQueueRegistration = true;

  const register = async () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let isReloading = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || isReloading) return;

      isReloading = true;
      window.location.reload();
    });

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        updateViaCache: "none",
      });

      await registration.update();
    } catch (error) {
      console.warn("Service worker registration failed.", error);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }

  return undefined;
}
