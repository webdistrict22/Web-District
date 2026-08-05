const mongoose = require("mongoose");

const rateLimitRecordSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    count: { type: Number, default: 0 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: false, strict: "throw" }
);

rateLimitRecordSchema.index({ key: 1 }, { unique: true, name: "unique_rate_limit_key" });
rateLimitRecordSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0, name: "rate_limit_expiry" });

module.exports = mongoose.model("RateLimitRecord", rateLimitRecordSchema);
