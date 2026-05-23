const express = require("express");
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  return protect(req, res, next);
};

router.post("/", optionalProtect, bookAppointment);

router.get("/my", protect, getMyAppointments);

router.get("/", protect, adminOnly, getAllAppointments);

router.get("/:id", protect, getAppointmentById);

router.put("/:id", protect, adminOnly, updateAppointment);

router.delete("/:id", protect, adminOnly, deleteAppointment);

module.exports = router;