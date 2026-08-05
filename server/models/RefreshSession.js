const mongoose = require("mongoose");

const refreshSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, select: false },
    sessionFamily: { type: String, required: true, maxlength: 100 },
    expiresAt: { type: Date, required: true },
    lastUsedAt: { type: Date, default: null },
    rotatedAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
    revokeReason: { type: String, default: "", maxlength: 120 },
    replacedBy: { type: mongoose.Schema.Types.ObjectId, ref: "RefreshSession", default: null },
    userAgentHash: { type: String, default: "", maxlength: 100 },
    tokenVersion: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, strict: "throw" }
);

refreshSessionSchema.index({ tokenHash: 1 }, { unique: true, name: "unique_refresh_token_hash" });
refreshSessionSchema.index({ user: 1, revokedAt: 1, expiresAt: 1 }, { name: "user_active_sessions" });
refreshSessionSchema.index({ sessionFamily: 1, revokedAt: 1 }, { name: "refresh_family_reuse" });
refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60, name: "refresh_expiry_cleanup" });

module.exports = mongoose.model("RefreshSession", refreshSessionSchema);
