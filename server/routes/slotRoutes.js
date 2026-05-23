const express = require("express");
const {
  createCallSlot,
  getAvailableSlots,
  getAllSlots,
  updateCallSlot,
  deleteCallSlot,
} = require("../controllers/slotController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/available", getAvailableSlots);

router.get("/", protect, adminOnly, getAllSlots);

router.post("/", protect, adminOnly, createCallSlot);

router.put("/:id", protect, adminOnly, updateCallSlot);

router.delete("/:id", protect, adminOnly, deleteCallSlot);

module.exports = router;