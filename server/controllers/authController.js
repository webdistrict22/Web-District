const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middleware/asyncHandler");
const {
  notifyNewClientSignup,
  sendPasswordResetEmail,
  sendWelcomeEmailToClient,
} = require("../utils/notificationService");

const registerUser = asyncHandler(async (req, res) => {
  const { name, businessName, email, phone, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

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

  const signupEmailResults = await Promise.allSettled([
    notifyNewClientSignup(user),
    sendWelcomeEmailToClient(user),
  ]);

  signupEmailResults.forEach((result, index) => {
    const label =
      index === 0
        ? "Signup owner email notification"
        : "Signup client welcome email";

    if (result.status === "rejected") {
      console.error(`${label} failed:`, result.reason?.message || result.reason);
      return;
    }

    if (!result.value?.success) {
      console.error(
        `${label} failed:`,
        result.value?.reason || result.value?.error || "Unknown email error"
      );
    }
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      businessName: user.businessName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

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

  res.json({
    success: true,
    message: "Logged in successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      businessName: user.businessName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      businessName: req.user.businessName,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

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
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    res.status(400);
    throw new Error("Password and confirmation are required");
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
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
    user: {
      id: user._id,
      name: user.name,
      businessName: user.businessName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
