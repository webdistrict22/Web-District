const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  claimRecords,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/signup", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);
router.get("/me", protect, getMe);
router.post("/claim-records", protect, claimRecords);

module.exports = router;
