const crypto = require("crypto");
const EmailOutbox = require("../models/EmailOutbox");
const sendEmail = require("../utils/sendEmail");
const { redactEmailError } = require("../utils/sendEmail");
const { renderEmailTemplate } = require("../utils/emailTemplates");
const { deterministicMessageId } = require("./outboxService");
const { decryptJson } = require("../utils/encryption");

const DEFAULT_POLL_MS = 5000;
const DEFAULT_LEASE_MS = 60000;
let timer = null;
let running = false;
let stopping = false;
let lastRunAt = null;
let lastSuccessAt = null;

const intEnv = (name, fallback, min, max) => {
  const value = Number(process.env[name] || fallback);
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback;
};

const getBackoffMs = (attempts) => {
  const base = Math.min(60000 * 2 ** Math.max(attempts - 1, 0), 6 * 60 * 60 * 1000);
  return base + crypto.randomInt(0, Math.max(Math.floor(base * 0.2), 1));
};

const isPermanentError = (error) =>
  Boolean(error?.permanent) ||
  ["EAUTH", "EENVELOPE", "INVALID_RECIPIENT", "UNKNOWN_EMAIL_TEMPLATE", "EMAIL_NOT_CONFIGURED"].includes(error?.code) ||
  [500, 501, 503, 504, 550, 551, 552, 553, 554].includes(Number(error?.responseCode));

const claimNext = async () => {
  const now = new Date();
  const leaseMs = intEnv("EMAIL_OUTBOX_LEASE_MS", DEFAULT_LEASE_MS, 10000, 10 * 60 * 1000);
  const lockToken = crypto.randomUUID();

  return EmailOutbox.findOneAndUpdate(
    {
      $or: [
        { status: { $in: ["pending", "retry"] }, nextAttemptAt: { $lte: now } },
        { status: "processing", leaseExpiresAt: { $lte: now } },
      ],
    },
    {
      $set: {
        status: "processing",
        lockedAt: now,
        leaseExpiresAt: new Date(now.getTime() + leaseMs),
        lockToken,
      },
      $inc: { attempts: 1 },
    },
    { new: true, sort: { priority: -1, createdAt: 1 } }
  ).select("+encryptedRecipient +encryptedPayload +lockToken");
};

const processOne = async () => {
  const event = await claimNext();
  if (!event) return false;

  try {
    const { recipient } = decryptJson(event.encryptedRecipient);
    const sensitivePayload = event.encryptedPayload ? decryptJson(event.encryptedPayload) : {};
    const rendered = renderEmailTemplate(event.template, { ...event.templatePayload, ...sensitivePayload });
    const result = await sendEmail({
      to: recipient,
      ...rendered,
      messageId: deterministicMessageId(event.idempotencyKey),
    });

    await EmailOutbox.updateOne(
      { _id: event._id, status: "processing", lockToken: event.lockToken },
      {
        $set: {
          status: "delivered",
          deliveredAt: new Date(),
          providerMessageId: result.messageId || "",
          leaseExpiresAt: null,
          lockedAt: null,
          lockToken: "",
          lastErrorCode: "",
          lastErrorMessage: "",
        },
      }
    );
    lastSuccessAt = new Date();
  } catch (error) {
    const redacted = redactEmailError(error);
    const permanent = isPermanentError(error) || event.attempts >= event.maxAttempts;
    await EmailOutbox.updateOne(
      { _id: event._id, status: "processing", lockToken: event.lockToken },
      {
        $set: {
          status: permanent ? "failed" : "retry",
          nextAttemptAt: permanent ? event.nextAttemptAt : new Date(Date.now() + getBackoffMs(event.attempts)),
          failedAt: permanent ? new Date() : null,
          leaseExpiresAt: null,
          lockedAt: null,
          lockToken: "",
          lastErrorCode: redacted.code,
          lastErrorMessage: redacted.message,
        },
      }
    );
  }

  return true;
};

const tick = async () => {
  if (running || stopping) return;
  running = true;
  lastRunAt = new Date();
  try {
    const batchSize = intEnv("EMAIL_OUTBOX_BATCH_SIZE", 10, 1, 50);
    for (let index = 0; index < batchSize && !stopping; index += 1) {
      if (!(await processOne())) break;
    }
  } catch (error) {
    console.error(JSON.stringify({ level: "error", event: "outbox_worker_error", code: error.code || "OUTBOX_ERROR" }));
  } finally {
    running = false;
  }
};

const startOutboxWorker = () => {
  if (timer || process.env.NODE_ENV === "test" || process.env.EMAIL_OUTBOX_ENABLED === "false") return;
  stopping = false;
  const pollMs = intEnv("EMAIL_OUTBOX_POLL_MS", DEFAULT_POLL_MS, 1000, 5 * 60 * 1000);
  timer = setInterval(tick, pollMs);
  timer.unref?.();
  void tick();
};

const stopOutboxWorker = async () => {
  stopping = true;
  if (timer) clearInterval(timer);
  timer = null;
  const deadline = Date.now() + 10000;
  while (running && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const getOutboxWorkerStatus = () => ({ initialized: Boolean(timer) || process.env.NODE_ENV === "test", running, lastRunAt, lastSuccessAt });

module.exports = { startOutboxWorker, stopOutboxWorker, getOutboxWorkerStatus, processOne, getBackoffMs, isPermanentError };
