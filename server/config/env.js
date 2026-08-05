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

const validateEnvironment = () => {
  const production = process.env.NODE_ENV === "production";
  if (!['development', 'test', 'production'].includes(process.env.NODE_ENV || "development")) throw new Error("NODE_ENV is invalid");
  const required = ["MONGO_URI", "JWT_SECRET", "REFRESH_TOKEN_SECRET", "OUTBOX_ENCRYPTION_KEY"];
  for (const name of required) {
    const value = String(process.env[name] || "");
    if (!value) throw new Error(`${name} is required`);
    if (["JWT_SECRET", "REFRESH_TOKEN_SECRET", "OUTBOX_ENCRYPTION_KEY"].includes(name) && value.length < 32) throw new Error(`${name} must contain at least 32 characters`);
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
  integer("EMAIL_OUTBOX_POLL_MS", 5000, 1000, 300000);
  integer("EMAIL_OUTBOX_LEASE_MS", 60000, 10000, 600000);
  integer("REFRESH_TOKEN_DAYS", 30, 1, 90);
  if (production && /localhost|127\.0\.0\.1/i.test(clientOrigin)) throw new Error("CLIENT_URL cannot use localhost in production");
  const degraded = [];
  if (!isEmailConfigured()) degraded.push("email");
  if (!["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].every((name) => process.env[name])) degraded.push("cloudinary");
  return { valid: true, clientOrigin, timezone, degraded };
};

module.exports = { validateEnvironment, integer };
