const REDACT_KEYS = new Set(["password", "token", "authorization", "cookie", "email", "phone", "body", "mongoUri", "smtp"]);

const sanitize = (value, depth = 0) => {
  if (depth > 3) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => sanitize(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.entries(value).reduce((result, [key, nested]) => {
      result[key] = REDACT_KEYS.has(key.toLowerCase()) ? "[redacted]" : sanitize(nested, depth + 1);
      return result;
    }, {});
  }
  return typeof value === "string" ? value.slice(0, 500) : value;
};

const log = (level, event, fields = {}) => {
  const entry = sanitize({ timestamp: new Date().toISOString(), level, environment: process.env.NODE_ENV || "development", event, deploymentVersion: process.env.DEPLOYMENT_VERSION || "", ...fields });
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  console[method](JSON.stringify(entry));
};

module.exports = { log, sanitize };
