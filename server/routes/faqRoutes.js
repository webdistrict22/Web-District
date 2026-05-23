const express = require("express");
const {
  createFAQ,
  getPublicFAQs,
  getAllFAQs,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faqController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/public", getPublicFAQs);

router.get("/", protect, adminOnly, getAllFAQs);
router.post("/", protect, adminOnly, createFAQ);
router.put("/:id", protect, adminOnly, updateFAQ);
router.delete("/:id", protect, adminOnly, deleteFAQ);

module.exports = router;