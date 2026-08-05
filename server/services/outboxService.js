const crypto = require("crypto");
const EmailOutbox = require("../models/EmailOutbox");
const { cleanEmail, cleanText } = require("../utils/validation");
const { encryptJson } = require("../utils/encryption");

const sanitizePayload = (value, depth = 0) => {
  if (depth > 4 || value === undefined || value === null) return value ?? null;
  if (["string", "number", "boolean"].includes(typeof value)) {
    return typeof value === "string" ? value.slice(0, 2500) : value;
  }
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => sanitizePayload(item, depth + 1));
  if (typeof value === "object") {
    return Object.entries(value).slice(0, 60).reduce((result, [key, nested]) => {
      if (!key.startsWith("$") && !key.includes(".")) result[key] = sanitizePayload(nested, depth + 1);
      return result;
    }, {});
  }
  return String(value).slice(0, 2500);
};

const enqueueEmail = async (event, { session } = {}) => {
  const recipient = cleanEmail(event.recipient, "Email recipient");
  const document = {
    eventType: cleanText(event.eventType, "Email event type", { required: true, max: 100 }),
    idempotencyKey: cleanText(event.idempotencyKey, "Email idempotency key", { required: true, max: 240 }),
    relatedEntityType: cleanText(event.relatedEntityType, "Related entity type", { required: true, max: 80 }),
    relatedEntityId: event.relatedEntityId || null,
    recipientType: event.recipientType,
    recipientHash: crypto.createHash("sha256").update(recipient).digest("hex"),
    encryptedRecipient: encryptJson({ recipient }),
    template: cleanText(event.template, "Email template", { required: true, max: 100 }),
    templatePayload: {},
    encryptedPayload: encryptJson({
      ...sanitizePayload(event.templatePayload || {}),
      ...sanitizePayload(event.sensitivePayload || {}),
    }),
    priority: event.priority || 5,
    maxAttempts: event.maxAttempts || 5,
    nextAttemptAt: new Date(),
  };

  const options = { upsert: true, setDefaultsOnInsert: true, session };
  await EmailOutbox.updateOne(
    { idempotencyKey: document.idempotencyKey },
    { $setOnInsert: document },
    options
  );
  return { status: "queued" };
};

const deterministicMessageId = (idempotencyKey) => {
  const hash = crypto.createHash("sha256").update(idempotencyKey).digest("hex");
  return `<${hash}@mail.web-district.com>`;
};

module.exports = { enqueueEmail, deterministicMessageId, sanitizePayload };
