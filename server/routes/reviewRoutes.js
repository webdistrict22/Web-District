const express = require("express");
const {
  createManualReview,
  submitReview,
  getPublicReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/public", getPublicReviews);

router.post("/submit", protect, submitReview);

router.get("/", protect, adminOnly, getAllReviews);
router.post("/manual", protect, adminOnly, createManualReview);
router.put("/:id", protect, adminOnly, updateReview);
router.delete("/:id", protect, adminOnly, deleteReview);

module.exports = router;