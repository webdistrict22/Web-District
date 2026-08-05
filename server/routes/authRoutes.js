const express = require("express");
const {
  registerUser, loginUser, getCsrfToken, refreshAccessToken, logout, logoutAll,
  getMe, resendVerification, verifyEmail, claimRecords, forgotPassword, resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter, verificationLimiter } = require("../middleware/rateLimiters");
const { rejectHoneypot } = require("../middleware/requestSecurity");
const { requireTrustedOrigin, requireCsrf } = require("../middleware/csrfMiddleware");

const router = express.Router();

router.get("/csrf", getCsrfToken);
router.post("/register", authLimiter, requireTrustedOrigin, rejectHoneypot, registerUser);
router.post("/signup", authLimiter, requireTrustedOrigin, rejectHoneypot, registerUser);
router.post("/login", authLimiter, requireTrustedOrigin, rejectHoneypot, loginUser);
router.post("/refresh", authLimiter, requireTrustedOrigin, requireCsrf, refreshAccessToken);
router.post("/logout", requireTrustedOrigin, requireCsrf, logout);
router.post("/logout-all", protect, requireTrustedOrigin, requireCsrf, logoutAll);
router.post("/forgot-password", authLimiter, requireTrustedOrigin, rejectHoneypot, forgotPassword);
router.put("/reset-password/:token", authLimiter, requireTrustedOrigin, resetPassword);
router.post("/verify-email", verificationLimiter, requireTrustedOrigin, verifyEmail);
router.post("/resend-verification", verificationLimiter, protect, requireTrustedOrigin, resendVerification);
router.get("/me", protect, getMe);
router.post("/claim-records", protect, requireTrustedOrigin, claimRecords);

module.exports = router;
