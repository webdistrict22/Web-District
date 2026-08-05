const mongoose = require("mongoose");

const idempotencyRecordSchema = new mongoose.Schema(
  {
    scope: { type: String, required: true, maxlength: 120 },
    keyHash: { type: String, required: true, maxlength: 64 },
    actorHash: { type: String, required: true, maxlength: 64 },
    requestHash: { type: String, required: true, maxlength: 64 },
    status: { type: String, enum: ["processing", "completed", "failed"], default: "processing" },
    responseStatus: { type: Number, default: null },
    responseBody: { type: mongoose.Schema.Types.Mixed, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, strict: "throw" }
);

idempotencyRecordSchema.index(
  { scope: 1, keyHash: 1, actorHash: 1 },
  { unique: true, name: "unique_scoped_idempotency_key" }
);
idempotencyRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "idempotency_expiry" });

module.exports = mongoose.model("IdempotencyRecord", idempotencyRecordSchema);
