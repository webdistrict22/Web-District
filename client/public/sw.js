const CACHE_NAME = "web-district-pwa-v1";
const CORE_ASSETS = [
  "/",
  "/index.html",
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

const isApiRequest = (url) =>
  url.origin === self.location.origin &&
  (url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/admin/api") ||
    url.pathname.startsWith("/client/api"));

const isStaticRequest = (request, url) =>
  STATIC_DESTINATIONS.has(request.destination) ||
  url.pathname.startsWith("/assets/") ||
  url.pathname.startsWith("/icons/") ||
  url.pathname === "/manifest.webmanifest";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => undefined)
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) =>
            key.startsWith("web-district-pwa-") && key !== CACHE_NAME
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

  if (url.origin !== self.location.origin || isApiRequest(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedIndex = await caches.match("/index.html");
        return cachedIndex || Response.error();
      })
    );
    return;
  }

  if (!isStaticRequest(request, url)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseToCache = response.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(request, responseToCache))
          .catch(() => undefined);

        return response;
      })
      .catch(async () => {
        const cachedAsset = await caches.match(request);
        return cachedAsset || Response.error();
      })
  );
});
