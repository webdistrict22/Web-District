const express = require("express");

const {
  createContract,
  createContractFromRequest,
  createContractFromAppointment,
  getAllContracts,
  getMyContracts,
  getContractById,
  updateContract,
  acceptContract,
  updateClientContractNote,
  deleteContract,
} = require("../controllers/contractController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/my", protect, getMyContracts);

router.post("/", protect, adminOnly, createContract);
router.post("/from-request/:requestId", protect, adminOnly, createContractFromRequest);
router.post(
  "/from-appointment/:appointmentId",
  protect,
  adminOnly,
  createContractFromAppointment
);

router.get("/", protect, adminOnly, getAllContracts);

router.get("/:id", protect, getContractById);
router.put("/:id", protect, adminOnly, updateContract);

router.put("/:id/accept", protect, acceptContract);
router.put("/:id/client-note", protect, updateClientContractNote);

router.delete("/:id", protect, adminOnly, deleteContract);

module.exports = router;