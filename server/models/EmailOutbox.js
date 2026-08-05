const mongoose = require("mongoose");

const emailOutboxSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, trim: true, maxlength: 100 },
    idempotencyKey: { type: String, required: true, trim: true, maxlength: 240 },
    relatedEntityType: { type: String, required: true, trim: true, maxlength: 80 },
    relatedEntityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    recipientType: { type: String, enum: ["owner", "client", "admin"], required: true },
    recipientHash: { type: String, required: true, maxlength: 64 },
    encryptedRecipient: { type: String, required: true, select: false },
    template: { type: String, required: true, trim: true, maxlength: 100 },
    templatePayload: { type: mongoose.Schema.Types.Mixed, default: {} },
    encryptedPayload: { type: String, default: "", select: false },
    priority: { type: Number, default: 5, min: 1, max: 10 },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "retry", "failed", "cancelled"],
      default: "pending",
    },
    attempts: { type: Number, default: 0, min: 0 },
    maxAttempts: { type: Number, default: 5, min: 1, max: 20 },
    nextAttemptAt: { type: Date, default: Date.now },
    lockedAt: { type: Date, default: null },
    lockToken: { type: String, default: "", select: false },
    leaseExpiresAt: { type: Date, default: null },
    lastErrorCode: { type: String, default: "", maxlength: 80 },
    lastErrorMessage: { type: String, default: "", maxlength: 500 },
    providerMessageId: { type: String, default: "", maxlength: 300 },
    deliveredAt: { type: Date, default: null },
    failedAt: { type: Date, default: null },
  },
  { timestamps: true, strict: "throw" }
);

emailOutboxSchema.index({ idempotencyKey: 1 }, { unique: true, name: "unique_email_event" });
emailOutboxSchema.index(
  { status: 1, nextAttemptAt: 1, priority: -1, createdAt: 1 },
  { name: "email_worker_queue" }
);
emailOutboxSchema.index({ status: 1, createdAt: 1 }, { name: "email_status_age" });
emailOutboxSchema.index({ leaseExpiresAt: 1 }, { name: "email_processing_lease" });

module.exports = mongoose.model("EmailOutbox", emailOutboxSchema);
