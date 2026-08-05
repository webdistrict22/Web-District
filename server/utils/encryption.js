const crypto = require("crypto");

const getKey = () => {
  const secret = String(process.env.OUTBOX_ENCRYPTION_KEY || "");
  if (secret.length < 32) {
    const error = new Error("OUTBOX_ENCRYPTION_KEY must contain at least 32 characters");
    error.code = "OUTBOX_ENCRYPTION_KEY_INVALID";
    throw error;
  }
  return crypto.createHash("sha256").update(secret).digest();
};

const encryptJson = (value) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
};

const decryptJson = (value) => {
  const [ivValue, tagValue, encryptedValue] = String(value || "").split(".");
  if (!ivValue || !tagValue || !encryptedValue) throw new Error("Encrypted payload is invalid");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(encryptedValue, "base64url")), decipher.final()]).toString("utf8"));
};

module.exports = { encryptJson, decryptJson };
