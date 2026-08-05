import { useCallback, useState } from "react";

const STORAGE_KEY = "wd:loaded-images:v1";
const MAX_STORED_URLS = 160;
const loadedImageUrls = new Set();
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
};

function useSessionImage(url) {
  const [loadedUrl, setLoadedUrl] = useState(() =>
    hasLoadedImage(url) ? url : "",
  );
  const isLoaded = Boolean(url) && (loadedUrl === url || hasLoadedImage(url));

  const handleLoad = useCallback((event) => {
    const currentUrl = event.currentTarget.currentSrc || url;
    markImageLoaded(url);
    markImageLoaded(currentUrl);
    setLoadedUrl(url);
  }, [url]);

  return { handleLoad, isLoaded };
}

export { hasLoadedImage, markImageLoaded };
export default useSessionImage;
