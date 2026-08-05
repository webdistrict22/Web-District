const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [12, "Password must be at least 12 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    resetPasswordToken: {
      type: String,
      default: "",
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationToken: { type: String, default: "", select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
    emailVerificationVersion: { type: Number, default: 0, select: false },
    verificationSentAt: { type: Date, default: null },
    verificationResendCount: { type: Number, default: 0, min: 0, select: false },
    tokenVersion: { type: Number, default: 0, min: 0, select: false },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.emailVerificationExpires = Date.now() + 30 * 60 * 1000;
  this.emailVerificationVersion += 1;
  this.verificationSentAt = new Date();
  this.verificationResendCount += 1;
  return token;
};

userSchema.index({ role: 1, isActive: 1, createdAt: -1 }, { name: "users_role_status_created" });

const User = mongoose.model("User", userSchema);

module.exports = User;
