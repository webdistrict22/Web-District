const express = require("express");
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const { protect, optionalAuth } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", optionalAuth, createAppointment);

router.get("/my", protect, getMyAppointments);

router.get("/", protect, adminOnly, getAllAppointments);

router.get("/:id", protect, adminOnly, getAppointmentById);

router.put("/:id", protect, adminOnly, updateAppointment);

router.delete("/:id", protect, adminOnly, deleteAppointment);

module.exports = router;
