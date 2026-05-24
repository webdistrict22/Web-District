const express = require("express");

const {
  getAllClients,
  getClientById,
  updateClientStatus,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/clients", protect, adminOnly, getAllClients);
router.get("/clients/:id", protect, adminOnly, getClientById);
router.put("/clients/:id/status", protect, adminOnly, updateClientStatus);

module.exports = router;