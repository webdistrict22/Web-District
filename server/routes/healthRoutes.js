const express = require("express");
const { live, ready, diagnostics } = require("../controllers/healthController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();
router.get("/live", live);
router.get("/ready", ready);
router.get("/diagnostics", protect, adminOnly, diagnostics);
module.exports = router;
