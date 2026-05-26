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

  const register = () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker registration failed.", error);
    });
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }

  return undefined;
}
