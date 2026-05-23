const express = require("express");

const {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", createContactMessage);

router.get("/", protect, adminOnly, getAllContactMessages);
router.get("/:id", protect, adminOnly, getContactMessageById);
router.put("/:id", protect, adminOnly, updateContactMessage);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

module.exports = router;