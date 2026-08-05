const EmailOutbox = require("../models/EmailOutbox");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyEmailTransport, getEmailConfig, isEmailConfigured } = require("../utils/sendEmail");
const { parsePagination, paginationMeta } = require("../utils/pagination");

const getOutboxDiagnostics = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 20, maxLimit: 50, sortFields: ["createdAt"] });
  const [counts, oldestPending, failures, totalFailures] = await Promise.all([
    EmailOutbox.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    EmailOutbox.findOne({ status: { $in: ["pending", "retry", "processing"] } }).sort({ createdAt: 1 }).select("createdAt status").lean(),
    EmailOutbox.find({ status: "failed" }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("eventType relatedEntityType status attempts maxAttempts lastErrorCode lastErrorMessage createdAt failedAt").lean(),
    EmailOutbox.countDocuments({ status: "failed" }),
  ]);
  const config = getEmailConfig();
  res.json({
    success: true,
    email: { configured: isEmailConfigured(), hasEmailUser: Boolean(config.emailUser), hasEmailPass: Boolean(config.emailPass), hasOwnerEmail: Boolean(config.ownerEmail), selfSignedTlsEnabled: config.allowSelfSigned },
    outbox: {
      counts: Object.fromEntries(counts.map((item) => [item._id, item.count])),
      oldestPendingAgeMs: oldestPending ? Date.now() - new Date(oldestPending.createdAt).getTime() : null,
      recentFailures: failures,
      pagination: paginationMeta({ page, limit, total: totalFailures }),
    },
  });
});

const verifySmtp = asyncHandler(async (req, res) => {
  const verification = await verifyEmailTransport();
  res.status(verification.success ? 200 : 503).json({ success: verification.success, verification });
});

const retryOutboxEvent = asyncHandler(async (req, res) => {
  const event = await EmailOutbox.findOneAndUpdate(
    { _id: req.params.id, status: { $in: ["failed", "retry"] } },
    { $set: { status: "retry", nextAttemptAt: new Date(), failedAt: null, lastErrorCode: "", lastErrorMessage: "", lockedAt: null, leaseExpiresAt: null, lockToken: "" } },
    { new: true }
  ).select("eventType status");
  if (!event) { res.status(404); throw new Error("Retryable email event not found"); }
  res.json({ success: true, message: "Email event queued for retry", event });
});

const retryFailedOutboxEvents = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.body?.limit) || 25, 1), 100);
  const candidates = await EmailOutbox.find({ status: "failed" }).sort({ failedAt: 1 }).limit(limit).select("_id").lean();
  const result = await EmailOutbox.updateMany(
    { _id: { $in: candidates.map((item) => item._id) }, status: "failed" },
    { $set: { status: "retry", nextAttemptAt: new Date(), failedAt: null, lastErrorCode: "", lastErrorMessage: "" } }
  );
  res.json({ success: true, message: "Failed email events queued for retry", queued: result.modifiedCount });
});

module.exports = { getOutboxDiagnostics, verifySmtp, retryOutboxEvent, retryFailedOutboxEvents };
