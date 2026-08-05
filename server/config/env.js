const { validateTimezone } = require("../utils/slotTime");
const { isEmailConfigured } = require("../utils/sendEmail");

const url = (name, { required = false, https = false } = {}) => {
  const value = String(process.env[name] || "").trim();
  if (!value && !required) return "";
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol) || (https && parsed.protocol !== "https:")) throw new Error();
    return parsed.origin;
  } catch {
    throw new Error(`${name} must be a valid ${https ? "HTTPS " : ""}URL`);
  }
};

const integer = (name, fallback, min, max) => {
  const raw = process.env[name];
  const value = raw === undefined || raw === "" ? fallback : Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} must be a whole number from ${min} to ${max}`);
  return value;
};

const boolean = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  if (!['true', 'false'].includes(String(raw).toLowerCase())) throw new Error(`${name} must be true or false`);
  return String(raw).toLowerCase() === "true";
};

const validateEnvironment = () => {
  const production = process.env.NODE_ENV === "production";
  if (!['development', 'test', 'production'].includes(process.env.NODE_ENV || "development")) throw new Error("NODE_ENV is invalid");
  const required = ["MONGO_URI", "JWT_SECRET", "REFRESH_TOKEN_SECRET", "OUTBOX_ENCRYPTION_KEY"];
  for (const name of required) {
    const value = String(process.env[name] || "");
    if (!value) throw new Error(`${name} is required`);
    if (["JWT_SECRET", "REFRESH_TOKEN_SECRET"].includes(name) && value.length < 32) throw new Error(`${name} must contain at least 32 characters`);
  }
  if (!/^[a-f0-9]{64}$/i.test(process.env.OUTBOX_ENCRYPTION_KEY)) throw new Error("OUTBOX_ENCRYPTION_KEY must contain exactly 64 hexadecimal characters");
  if (new Set([process.env.JWT_SECRET, process.env.REFRESH_TOKEN_SECRET, process.env.OUTBOX_ENCRYPTION_KEY]).size !== 3) {
    throw new Error("JWT_SECRET, REFRESH_TOKEN_SECRET, and OUTBOX_ENCRYPTION_KEY must be independent values");
  }
  const ownerEmail = String(process.env.OWNER_EMAIL || process.env.EMAIL_USER || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) {
    throw new Error("OWNER_EMAIL or EMAIL_USER must contain a valid notification address");
  }
  const clientOrigin = url("CLIENT_URL", { required: true, https: production });
  const origins = String(process.env.ALLOWED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean);
  for (const origin of origins) {
    try {
      const parsed = new URL(origin);
      if (!["http:", "https:"].includes(parsed.protocol) || (production && parsed.protocol !== "https:")) throw new Error();
    } catch {
      throw new Error("ALLOWED_ORIGINS contains an invalid origin");
    }
  }
  const timezone = process.env.BUSINESS_TIMEZONE || "Africa/Cairo";
  if (!validateTimezone(timezone)) throw new Error("BUSINESS_TIMEZONE is invalid");
  integer("BOOKING_WINDOW_DAYS", 7, 1, 31);
  integer("SLOT_MAINTENANCE_INTERVAL_MS", 6 * 60 * 60 * 1000, 60000, 24 * 60 * 60 * 1000);
  integer("EMAIL_OUTBOX_POLL_MS", 5000, 1000, 300000);
  integer("EMAIL_OUTBOX_LEASE_MS", 60000, 10000, 600000);
  integer("EMAIL_OUTBOX_BATCH_SIZE", 10, 1, 50);
  integer("REFRESH_TOKEN_DAYS", 30, 1, 90);
  boolean("EMAIL_OUTBOX_ENABLED", true);
  boolean("EMAIL_ALLOW_SELF_SIGNED", false);
  if (process.env.ACCESS_TOKEN_EXPIRES_IN && !/^\d+[smhd]$/i.test(process.env.ACCESS_TOKEN_EXPIRES_IN)) {
    throw new Error("ACCESS_TOKEN_EXPIRES_IN must use a duration such as 15m");
  }
  if (process.env.ALLOW_MAINTENANCE_APPLY && !["NO", "YES"].includes(process.env.ALLOW_MAINTENANCE_APPLY)) {
    throw new Error("ALLOW_MAINTENANCE_APPLY must be NO or YES");
  }
  if (production && process.env.ALLOW_MAINTENANCE_APPLY === "YES") throw new Error("ALLOW_MAINTENANCE_APPLY must be NO during normal production startup");
  if (production && /localhost|127\.0\.0\.1/i.test(clientOrigin)) throw new Error("CLIENT_URL cannot use localhost in production");
  const degraded = [];
  if (!isEmailConfigured()) degraded.push("email");
  if (!["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].every((name) => process.env[name])) degraded.push("cloudinary");
  return { valid: true, clientOrigin, timezone, degraded };
};

module.exports = { validateEnvironment, integer, boolean };
