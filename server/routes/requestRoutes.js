const express = require("express");
const {
  createWebsiteRequest,
  getMyWebsiteRequests,
  getAllWebsiteRequests,
  getWebsiteRequestById,
  updateWebsiteRequest,
  deleteWebsiteRequest,
} = require("../controllers/requestController");

const { protect, optionalAuth } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { websiteRequestLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/", websiteRequestLimiter, optionalAuth, createWebsiteRequest);

router.get("/my", protect, getMyWebsiteRequests);

router.get("/", protect, adminOnly, getAllWebsiteRequests);

router.get("/:id", protect, adminOnly, getWebsiteRequestById);

router.put("/:id", protect, adminOnly, updateWebsiteRequest);

router.delete("/:id", protect, adminOnly, deleteWebsiteRequest);

module.exports = router;
