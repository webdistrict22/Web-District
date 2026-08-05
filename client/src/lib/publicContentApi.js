import api, { PUBLIC_CONTENT_TIMEOUT } from "./axios";

const cache = new Map();
const CACHE_TTL_MS = 60_000;

const dedupedGet = (key, request) => {
  const now = Date.now();
  const cached = cache.get(key);
  if (cached?.data && cached.expiresAt > now) return Promise.resolve(cached.data);
  if (cached?.promise) return cached.promise;
  const promise = request()
    .then((data) => {
      cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      return data;
    })
    .catch((error) => {
      cache.delete(key);
      throw error;
    });
  cache.set(key, { promise });
  return promise;
};

export const getPublicReviews = () => dedupedGet("public-reviews", async () => {
  const { data } = await api.get("/reviews/public", { timeout: PUBLIC_CONTENT_TIMEOUT });
  return data.reviews || [];
});

export const invalidatePublicReviews = () => cache.delete("public-reviews");
