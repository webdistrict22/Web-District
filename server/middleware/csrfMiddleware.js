const crypto = require("crypto");
const { CSRF_COOKIE, parseCookies } = require("../utils/cookies");

const normalizeOrigin = (value) => {
  try { return new URL(String(value || "")).origin; } catch { return ""; }
};

const allowedOrigins = () => new Set([
  process.env.CLIENT_URL,
  ...String(process.env.ALLOWED_ORIGINS || "").split(","),
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173", "http://localhost:3000"]),
].map(normalizeOrigin).filter(Boolean));

const timingSafeEqual = (left, right) => {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && a.length >= 32 && crypto.timingSafeEqual(a, b);
};

const requireTrustedOrigin = (req, res, next) => {
  const origin = normalizeOrigin(req.get("Origin") || req.get("Referer"));
  if (!origin || !allowedOrigins().has(origin)) {
    const error = new Error("Request origin is not allowed");
    error.statusCode = 403;
    error.code = "ORIGIN_REJECTED";
    return next(error);
  }
  next();
};

const requireCsrf = (req, res, next) => {
  const cookieToken = parseCookies(req)[CSRF_COOKIE];
  const headerToken = req.get("X-CSRF-Token");
  if (!timingSafeEqual(cookieToken, headerToken)) {
    const error = new Error("CSRF validation failed");
    error.statusCode = 403;
    error.code = "CSRF_REJECTED";
    return next(error);
  }
  next();
};

module.exports = { requireTrustedOrigin, requireCsrf, normalizeOrigin, timingSafeEqual };
