const express = require("express");
const {
  createPackage,
  getPublicPackages,
  getAllPackages,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/public", getPublicPackages);

router.get("/", protect, adminOnly, getAllPackages);
router.post("/", protect, adminOnly, createPackage);
router.put("/:id", protect, adminOnly, updatePackage);
router.delete("/:id", protect, adminOnly, deletePackage);

module.exports = router;