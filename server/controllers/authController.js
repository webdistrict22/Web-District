const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");
const { linkGuestRecords } = require("../utils/linkGuestRecords");
const {
  createValidationError,
  cleanText,
  cleanEmail,
  cleanPhone,
  cleanPassword,
} = require("../utils/validation");
const {
  notifyNewClientSignup,
  sendPasswordResetEmail,
  sendWelcomeEmailToClient,
} = require("../utils/notificationService");

const serializeAuthUser = (user) => ({
  _id: user._id.toString(),
  name: user.name,
  businessName: user.businessName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isActive: user.isActive,
});

const claimGuestRecordsForUser = async (user) => {
  try {
    return await linkGuestRecords(user);
  } catch (error) {
    console.error("[GuestClaim] Failed to link guest records");

    return {
      linkedRequests: 0,
      linkedAppointments: 0,
      linkedContracts: 0,
    };
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const name = cleanText(body.name, "Name", {
    required: true,
    max: 80,
  });
  const businessName = cleanText(body.businessName, "Business name", {
    max: 120,
  });
  const email = cleanEmail(body.email);
  const phone = cleanPhone(body.phone);
  const password = cleanPassword(body.password, "Password", {
    min: 6,
    max: 128,
  });

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    businessName,
    email,
    phone,
    password,
    role: "client",
  });

  const token = generateToken(user);
  const claimedRecords = await claimGuestRecordsForUser(user);

  notifyNewClientSignup(user)
    .then((result) => console.log("[Email] Signup notification:", result))
    .catch((error) => {
      console.error("[Email] Signup notification failed:", error.message);
    });

  sendWelcomeEmailToClient(user)
    .then((result) => console.log("[Email] Signup welcome email:", result))
    .catch((error) => {
      console.error("[Email] Signup welcome email failed:", error.message);
    });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: serializeAuthUser(user),
    claimedRecords,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const email = cleanEmail(body.email);
  const password = cleanPassword(body.password);

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account is disabled");
  }

  const token = generateToken(user);
  const claimedRecords = await claimGuestRecordsForUser(user);

  res.json({
    success: true,
    message: "Logged in successfully",
    token,
    user: serializeAuthUser(user),
    claimedRecords,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: serializeAuthUser(req.user),
  });
});

const claimRecords = asyncHandler(async (req, res) => {
  const claimedRecords = await claimGuestRecordsForUser(req.user);

  res.json({
    success: true,
    claimedRecords,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const email = cleanEmail(req.body?.email);

  const genericMessage =
    "If an account exists with this email, a password reset link has been sent.";

  const user = await User.findOne({ email }).select(
    "+resetPasswordToken +resetPasswordExpires"
  );

  if (!user) {
    return res.json({
      success: true,
      message: genericMessage,
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(
    /\/$/,
    ""
  );
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const result = await sendPasswordResetEmail(user, resetUrl);

  if (!result.success) {
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Failed to send reset email. Please try again later.");
  }

  res.json({
    success: true,
    message: genericMessage,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const token = cleanText(req.params.token, "Password reset token", {
    required: true,
    max: 128,
  });
  const password = cleanPassword(body.password, "Password", {
    min: 6,
    max: 128,
  });
  const confirmPassword = cleanPassword(
    body.confirmPassword,
    "Password confirmation",
    {
      min: 6,
      max: 128,
    }
  );

  if (password !== confirmPassword) {
    throw createValidationError("Passwords do not match");
  }

  if (!/^[a-f0-9]{64}$/i.test(token)) {
    throw createValidationError("Password reset token is invalid");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+password +resetPasswordToken +resetPasswordExpires");

  if (!user) {
    res.status(400);
    throw new Error("Password reset link is invalid or has expired");
  }

  user.password = password;
  user.resetPasswordToken = "";
  user.resetPasswordExpires = null;

  await user.save();

  const authToken = generateToken(user);

  res.json({
    success: true,
    message: "Password reset successfully",
    token: authToken,
    user: serializeAuthUser(user),
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  claimRecords,
  forgotPassword,
  resetPassword,
};
