const mongoose = require("mongoose");
const EmailOutbox = require("../models/EmailOutbox");
const RefreshSession = require("../models/RefreshSession");
const asyncHandler = require("../middleware/asyncHandler");
const { getOutboxWorkerStatus } = require("../services/outboxWorker");
const { getSlotMaintenanceStatus } = require("../services/slotMaintenanceService");
const { reconcileSlots } = require("../services/slotReconciliationService");
const { snapshot } = require("../services/metricsService");
const { isEmailConfigured } = require("../utils/sendEmail");

let environmentStatus = { valid: false, degraded: [] };
const setEnvironmentStatus = (status) => { environmentStatus = status; };

const live = (req, res) => res.json({ success: true, status: "live", service: "Web District API", timestamp: new Date().toISOString() });

const ready = asyncHandler(async (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  const outbox = getOutboxWorkerStatus();
  const slotMaintenance = await getSlotMaintenanceStatus();
  const isReady = databaseConnected && environmentStatus.valid && outbox.initialized && slotMaintenance.initialized;
  res.status(isReady ? 200 : 503).json({ success: isReady, status: isReady ? "ready" : "not-ready", checks: { database: databaseConnected, environment: environmentStatus.valid, outboxWorker: outbox.initialized, slotMaintenance: slotMaintenance.initialized }, degraded: environmentStatus.degraded || [], timestamp: new Date().toISOString() });
});

const diagnostics = asyncHandler(async (req, res) => {
  const now = new Date();
  const [outboxCounts, oldest, activeSessions, slotMaintenance, reconciliation] = await Promise.all([
    EmailOutbox.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    EmailOutbox.findOne({ status: { $in: ["pending", "retry", "processing"] } }).sort({ createdAt: 1 }).select("createdAt").lean(),
    RefreshSession.countDocuments({ revokedAt: null, expiresAt: { $gt: now } }),
    getSlotMaintenanceStatus(),
    reconcileSlots(),
  ]);
  res.json({ success: true, deploymentVersion: process.env.DEPLOYMENT_VERSION || "", database: { connected: mongoose.connection.readyState === 1 }, email: { configured: isEmailConfigured(), outboxCounts: Object.fromEntries(outboxCounts.map((item) => [item._id, item.count])), oldestPendingAgeMs: oldest ? now - new Date(oldest.createdAt) : null, worker: getOutboxWorkerStatus() }, cloudinary: { configured: ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].every((name) => Boolean(process.env[name])) }, refreshSessions: { active: activeSessions }, slotMaintenance, reconciliation, metrics: snapshot() });
});

module.exports = { live, ready, diagnostics, setEnvironmentStatus };
