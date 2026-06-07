const CACHE_PREFIX = "web-district-pwa-";
const CACHE_NAME = "web-district-pwa-v3";
const OFFLINE_URL = "/index.html";
const CORE_ASSETS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-icon-512.png",
];

const STATIC_DESTINATIONS = new Set([
  "font",
  "image",
  "manifest",
  "script",
  "style",
  "worker",
]);

const isSensitiveRequest = (request, url) => {
  const acceptsJson = request.headers
    .get("accept")
    ?.includes("application/json");
  const isPrivateDataPath =
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/admin/api") ||
    url.pathname.startsWith("/client/api") ||
    ((url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/client")) &&
      request.mode !== "navigate");

  return acceptsJson || isPrivateDataPath;
};

const isStaticRequest = (request, url) =>
  STATIC_DESTINATIONS.has(request.destination) ||
  url.pathname.startsWith("/assets/") ||
  url.pathname.startsWith("/icons/") ||
  url.pathname === "/manifest.webmanifest";

const isCacheableStaticResponse = (response) => {
  if (!response || !response.ok || response.type !== "basic") return false;

  const contentType = response.headers.get("content-type") || "";

  return (
    !contentType.includes("text/html") &&
    !contentType.includes("application/json")
  );
};

const cacheCoreAssets = async () => {
  const cache = await caches.open(CACHE_NAME);

  await Promise.allSettled(
    CORE_ASSETS.map(async (asset) => {
      const response = await fetch(asset, { cache: "reload" });

      if (response.ok) {
        await cache.put(asset, response);
      }
    })
  );
};

const handleNavigation = async (request) => {
  try {
    const response = await fetch(request, { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";

    if (response.ok && contentType.includes("text/html")) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(OFFLINE_URL, response.clone());
    }

    return response;
  } catch {
    const cache = await caches.open(CACHE_NAME);
    const cachedIndex = await cache.match(OFFLINE_URL);

    return cachedIndex || Response.error();
  }
};

const handleStaticRequest = async (request) => {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    if (isCacheableStaticResponse(response)) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    const cachedAsset = await cache.match(request);

    return cachedAsset || Response.error();
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(Promise.all([cacheCoreAssets(), self.skipWaiting()]));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) =>
            key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME
              ? caches.delete(key)
              : undefined
          )
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (
    url.origin !== self.location.origin ||
    isSensitiveRequest(request, url)
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (!isStaticRequest(request, url)) return;

  event.respondWith(handleStaticRequest(request));
});
