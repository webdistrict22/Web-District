const express = require("express");
const {
  getPublicSettings,
  getEmailStatus,
  sendTestEmail,
  updateSettings,
} = require("../controllers/settingsController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/public", getPublicSettings);
router.get("/email-status", protect, adminOnly, getEmailStatus);
router.post("/test-email", protect, adminOnly, sendTestEmail);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;
