const express = require("express");
const {
  getPublicSettings,
  getEmailStatus,
  sendTestEmail,
  updateSettings,
} = require("../controllers/settingsController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { getOutboxDiagnostics, verifySmtp, retryOutboxEvent, retryFailedOutboxEvents } = require("../controllers/outboxController");

const router = express.Router();

router.get("/public", getPublicSettings);
router.get("/email-status", protect, adminOnly, getEmailStatus);
router.get("/email-diagnostics", protect, adminOnly, getOutboxDiagnostics);
router.post("/email-verify", protect, adminOnly, verifySmtp);
router.post("/email-outbox/:id/retry", protect, adminOnly, retryOutboxEvent);
router.post("/email-outbox/retry-failed", protect, adminOnly, retryFailedOutboxEvents);
router.post("/test-email", protect, adminOnly, sendTestEmail);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
