const crypto = require("crypto");
const IdempotencyRecord = require("../models/IdempotencyRecord");
const { createValidationError } = require("../utils/validation");
const { withMongoTransaction } = require("./transactionService");

const KEY_PATTERN = /^[A-Za-z0-9._:-]{16,128}$/;
const hash = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");
const stableStringify = (value) => {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

const readIdempotencyKey = (req) => {
  const value = String(req.get("Idempotency-Key") || "").trim();
  if (!value) return "";
  if (!KEY_PATTERN.test(value)) throw createValidationError("Idempotency-Key is invalid");
  return value;
};

const runIdempotentTransaction = async ({ req, scope, actor, payload, work }) => {
  const rawKey = readIdempotencyKey(req);
  if (!rawKey) return withMongoTransaction(work);

  const keyHash = hash(rawKey);
  const actorHash = hash(actor || req.ip || "anonymous");
  const requestHash = hash(stableStringify(payload || {}));
  const identity = { scope, keyHash, actorHash };
  const existing = await IdempotencyRecord.findOne(identity).lean();

  if (existing) {
    if (existing.requestHash !== requestHash) {
      const error = new Error("Idempotency key was already used for a different request");
      error.statusCode = 409;
      error.code = "IDEMPOTENCY_CONFLICT";
      throw error;
    }
    if (existing.status === "completed") return { ...existing.responseBody, replayed: true };
    const error = new Error("A matching request is already being processed");
    error.statusCode = 409;
    error.code = "IDEMPOTENCY_IN_PROGRESS";
    throw error;
  }

  try {
    return await withMongoTransaction(async (session) => {
      const [record] = await IdempotencyRecord.create([{
        ...identity,
        requestHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }], { session });

      const response = await work(session);
      const responseBody = JSON.parse(JSON.stringify(response));
      await IdempotencyRecord.updateOne(
        { _id: record._id },
        { $set: { status: "completed", responseStatus: 201, responseBody } },
        { session }
      );
      return response;
    });
  } catch (error) {
    if (error?.code !== 11000 || !error?.keyPattern?.scope || !error?.keyPattern?.keyHash) throw error;
    const raced = await IdempotencyRecord.findOne(identity).lean();
    if (raced?.requestHash === requestHash && raced.status === "completed") {
      return { ...raced.responseBody, replayed: true };
    }
    const conflict = new Error("A matching request is already being processed");
    conflict.statusCode = 409;
    conflict.code = "IDEMPOTENCY_IN_PROGRESS";
    throw conflict;
  }
};

module.exports = { readIdempotencyKey, runIdempotentTransaction, stableStringify };
