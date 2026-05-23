const express = require("express");
const {
  getPublicSettings,
  updateSettings,
} = require("../controllers/settingsController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/public", getPublicSettings);
router.put("/", protect, adminOnly, updateSettings);

module.exports = router;