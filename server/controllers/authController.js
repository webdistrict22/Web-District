const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");
const { linkVerifiedGuestRecords } = require("../utils/linkGuestRecords");
const { createValidationError, cleanText, cleanEmail, cleanPhone, cleanPassword } = require("../utils/validation");
const { notifyNewClientSignup, queueVerificationEmail, sendWelcomeEmailToClient, sendPasswordResetEmail } = require("../utils/notificationService");
const { withMongoTransaction } = require("../services/transactionService");
const { createRefreshSession, rotateRefreshSession, revokeToken, revokeAllUserSessions } = require("../services/refreshSessionService");
const { REFRESH_COOKIE, parseCookies, setRefreshCookie, clearRefreshCookie, issueCsrfToken, clearCsrfCookie } = require("../utils/cookies");

const serializeAuthUser = (user) => ({
  _id: user._id.toString(), name: user.name, businessName: user.businessName,
  email: user.email, phone: user.phone, role: user.role, isActive: user.isActive,
  emailVerified: Boolean(user.emailVerifiedAt),
});

const validatePasswordPolicy = (value, field = "Password") => {
  const password = cleanPassword(value, field, { min: 12, max: 128 });
  const normalized = password.toLowerCase();
  if (/^(.)\1+$/.test(password) || ["password", "123456", "qwerty"].some((item) => normalized.includes(item))) {
    throw createValidationError(`${field} is too easy to guess`);
  }
  return password;
};

const attachSession = async (user, req, res, session) => {
  const created = await createRefreshSession(user, req, { session });
  setRefreshCookie(res, created.token);
  const csrfToken = issueCsrfToken(res);
  return { accessToken: generateToken(user), csrfToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const payload = {
    name: cleanText(body.name, "Name", { required: true, max: 80 }),
    businessName: cleanText(body.businessName, "Business name", { max: 120 }),
    email: cleanEmail(body.email),
    phone: cleanPhone(body.phone),
    password: validatePasswordPolicy(body.password),
    role: "client",
  };
  if (body.confirmPassword !== undefined && payload.password !== body.confirmPassword) throw createValidationError("Passwords do not match");
  if (await User.exists({ email: payload.email })) {
    const error = new Error("Account could not be created with these details");
    error.statusCode = 409;
    throw error;
  }

  const result = await withMongoTransaction(async (session) => {
    const [user] = await User.create([payload], { session });
    const verificationToken = user.createEmailVerificationToken();
    await user.save({ session });
    await Promise.all([
      notifyNewClientSignup(user, { session }),
      queueVerificationEmail(user, verificationToken, user.emailVerificationVersion, { session }),
    ]);
    const auth = await attachSession(user, req, res, session);
    return { user, auth };
  });

  res.status(201).json({ success: true, message: "Account created. Check your email to verify it.", ...result.auth, user: serializeAuthUser(result.user), notificationStatus: "queued" });
});

const loginUser = asyncHandler(async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const password = cleanPassword(req.body?.password);
  const user = await User.findOne({ email }).select("+password +tokenVersion +emailVerificationVersion");
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error("Invalid email or password"); }
  if (!user.isActive) { res.status(403); throw new Error("This account is disabled"); }

  if (user.role === "admin" && !user.emailVerifiedAt) {
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = "";
    user.emailVerificationExpires = null;
    await user.save({ validateBeforeSave: false });
  }

  const auth = await attachSession(user, req, res);
  res.json({ success: true, message: "Logged in successfully", ...auth, user: serializeAuthUser(user) });
});

const getCsrfToken = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ success: true, csrfToken: issueCsrfToken(res) });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const rawToken = parseCookies(req)[REFRESH_COOKIE];
  const rotated = await rotateRefreshSession(rawToken, req);
  if (rotated.error) {
    clearRefreshCookie(res); clearCsrfCookie(res);
    res.status(401);
    const error = new Error("Session expired. Please sign in again.");
    error.code = rotated.error === "reuse" ? "REFRESH_REUSE_DETECTED" : "REFRESH_INVALID";
    throw error;
  }
  setRefreshCookie(res, rotated.token);
  const csrfToken = issueCsrfToken(res);
  res.set("Cache-Control", "no-store");
  res.json({ success: true, accessToken: generateToken(rotated.user), csrfToken, user: serializeAuthUser(rotated.user) });
});

const logout = asyncHandler(async (req, res) => {
  await revokeToken(parseCookies(req)[REFRESH_COOKIE], "logout");
  clearRefreshCookie(res); clearCsrfCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
});

const logoutAll = asyncHandler(async (req, res) => {
  await revokeAllUserSessions(req.user._id, "logout-all");
  clearRefreshCookie(res); clearCsrfCookie(res);
  res.json({ success: true, message: "All sessions were logged out" });
});

const getMe = asyncHandler(async (req, res) => res.json({ success: true, user: serializeAuthUser(req.user) }));

const resendVerification = asyncHandler(async (req, res) => {
  const genericMessage = "If verification is needed, a new email has been queued.";
  const user = await User.findById(req.user._id).select("+emailVerificationToken +emailVerificationExpires +emailVerificationVersion +verificationResendCount");
  if (!user || user.emailVerifiedAt) return res.json({ success: true, message: genericMessage });
  if (user.verificationSentAt && Date.now() - user.verificationSentAt.getTime() < 60000) return res.json({ success: true, message: genericMessage });

  await withMongoTransaction(async (session) => {
    const token = user.createEmailVerificationToken();
    await user.save({ session });
    await queueVerificationEmail(user, token, user.emailVerificationVersion, { session });
  });
  res.json({ success: true, message: genericMessage, notificationStatus: "queued" });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const token = cleanText(req.body?.token, "Verification token", { required: true, max: 128 });
  if (!/^[a-f0-9]{64}$/i.test(token)) throw createValidationError("Verification token is invalid");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const result = await withMongoTransaction(async (session) => {
    const user = await User.findOne({ emailVerificationToken: hashed, emailVerificationExpires: { $gt: new Date() } })
      .select("+emailVerificationToken +emailVerificationExpires +emailVerificationVersion")
      .session(session);
    if (!user) { const error = new Error("Verification link is invalid or expired"); error.statusCode = 400; throw error; }
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = "";
    user.emailVerificationExpires = null;
    await user.save({ session, validateBeforeSave: false });
    const claimedRecords = await linkVerifiedGuestRecords(user, { session, auditKey: `verification:${user._id}:${user.emailVerificationVersion}` });
    await sendWelcomeEmailToClient(user, { session });
    return { user, claimedRecords };
  });

  res.json({ success: true, message: "Email verified successfully", user: serializeAuthUser(result.user), claimedRecords: result.claimedRecords, notificationStatus: "queued" });
});

const claimRecords = asyncHandler(async (req, res) => {
  if (!req.user.emailVerifiedAt) { res.status(403); throw new Error("Verify your email before claiming guest records"); }
  const claimedRecords = await withMongoTransaction((session) => linkVerifiedGuestRecords(req.user, { session, auditKey: `manual-verified-claim:${req.user._id}` }));
  res.json({ success: true, claimedRecords });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const genericMessage = "If an account exists with this email, a password reset link has been sent.";
  const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
  if (!user) return res.json({ success: true, message: genericMessage });
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${String(process.env.CLIENT_URL).replace(/\/$/, "")}/reset-password/${resetToken}`;
  try {
    await sendPasswordResetEmail(user, resetUrl);
  } catch (error) {
    user.resetPasswordToken = ""; user.resetPasswordExpires = null;
    await user.save({ validateBeforeSave: false });
    error.statusCode = 503; error.code = "PASSWORD_RESET_EMAIL_FAILED";
    throw error;
  }
  res.json({ success: true, message: genericMessage });
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = cleanText(req.params.token, "Password reset token", { required: true, max: 128 });
  const password = validatePasswordPolicy(req.body?.password);
  const confirmation = validatePasswordPolicy(req.body?.confirmPassword, "Password confirmation");
  if (password !== confirmation) throw createValidationError("Passwords do not match");
  if (!/^[a-f0-9]{64}$/i.test(token)) throw createValidationError("Password reset token is invalid");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  await withMongoTransaction(async (session) => {
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } })
      .select("+password +resetPasswordToken +resetPasswordExpires +tokenVersion").session(session);
    if (!user) { const error = new Error("Password reset link is invalid or has expired"); error.statusCode = 400; throw error; }
    user.password = password; user.resetPasswordToken = ""; user.resetPasswordExpires = null; user.tokenVersion += 1;
    await user.save({ session });
    await revokeAllUserSessions(user._id, "password-reset", { session });
  });
  res.json({ success: true, message: "Password reset successfully. Please sign in again." });
});

module.exports = { registerUser, loginUser, getCsrfToken, refreshAccessToken, logout, logoutAll, getMe, resendVerification, verifyEmail, claimRecords, forgotPassword, resetPassword };
