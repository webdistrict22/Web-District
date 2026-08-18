import { useCallback, useRef, useSyncExternalStore } from "react";

const STORAGE_KEY = "wd:loaded-images:v1";
const MAX_STORED_URLS = 160;
const loadedImageUrls = new Set();
const loadedImageListeners = new Set();
let didHydrateSession = false;

const hydrateSessionCache = () => {
  if (didHydrateSession || typeof window === "undefined") return;
  didHydrateSession = true;

  try {
    const storedUrls = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(storedUrls)) {
      storedUrls.forEach((url) => {
        if (typeof url === "string" && url) loadedImageUrls.add(url);
      });
    }
  } catch {
    // Storage can be unavailable in private or restricted browsing modes.
  }
};

const hasLoadedImage = (url) => {
  hydrateSessionCache();
  return Boolean(url) && loadedImageUrls.has(url);
};

const markImageLoaded = (url) => {
  if (!url || loadedImageUrls.has(url)) return;
  loadedImageUrls.add(url);

  try {
    const storedUrls = Array.from(loadedImageUrls).slice(-MAX_STORED_URLS);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedUrls));
  } catch {
    // The in-memory cache still covers the active SPA session.
  }

  loadedImageListeners.forEach((listener) => listener());
};

function useSessionImage(url) {
  const imageElementRef = useRef(null);
  const nativeLoadHandlerRef = useRef(null);
  const subscribe = useCallback((listener) => {
    loadedImageListeners.add(listener);
    return () => loadedImageListeners.delete(listener);
  }, []);
  const getSnapshot = useCallback(() => hasLoadedImage(url), [url]);
  const getServerSnapshot = useCallback(() => false, []);
  const isLoaded = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const markCurrentImageLoaded = useCallback((image) => {
    if (!image || !image.complete || image.naturalWidth === 0) return;

    const currentUrl = image.currentSrc || url;
    markImageLoaded(url);
    markImageLoaded(currentUrl);
  }, [url]);

  const handleLoad = useCallback((event) => {
    markCurrentImageLoaded(event.currentTarget);
  }, [markCurrentImageLoaded]);

  const imageRef = useCallback((image) => {
    if (imageElementRef.current && nativeLoadHandlerRef.current) {
      imageElementRef.current.removeEventListener(
        "load",
        nativeLoadHandlerRef.current,
      );
    }

    imageElementRef.current = image;
    nativeLoadHandlerRef.current = null;

    if (!image) return;

    const handleNativeLoad = () => markCurrentImageLoaded(image);
    nativeLoadHandlerRef.current = handleNativeLoad;
    image.addEventListener("load", handleNativeLoad, { once: true });
    markCurrentImageLoaded(image);
  }, [markCurrentImageLoaded]);

  return { handleLoad, imageRef, isLoaded };
}

export { hasLoadedImage, markImageLoaded };
export default useSessionImage;
