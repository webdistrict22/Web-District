const express = require("express");

const { getAdminDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/admin", protect, adminOnly, getAdminDashboardStats);

module.exports = router;