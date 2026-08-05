const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CallSlot",
      required: [true, "Call slot is required"],
    },

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

    phone: {
      type: String,
      required: [true, "Phone / WhatsApp is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    topic: {
      type: String,
      required: [true, "Discussion topic is required"],
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Cancelled", "Rescheduled", "Done"],
      default: "Pending",
    },

    slotReleased: {
      type: Boolean,
      default: false,
      select: false,
    },

    adminNotes: {
      type: String,
      default: "",
    },
    holdsSlot: { type: Boolean, default: true },
    statusVersion: { type: Number, default: 0, min: 0 },
    claimedAt: { type: Date, default: null },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    claimMethod: { type: String, default: "", maxlength: 80 },
    claimAuditKey: { type: String, default: "", maxlength: 160 },
    archivedAt: { type: Date, default: null },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    archiveReason: { type: String, default: "", maxlength: 500 },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

appointmentSchema.index(
  { slot: 1 },
  { unique: true, partialFilterExpression: { holdsSlot: true, archivedAt: null }, name: "unique_active_slot_holder" }
);
appointmentSchema.index({ client: 1, archivedAt: 1, createdAt: -1 }, { name: "appointments_owner_created" });
appointmentSchema.index({ status: 1, archivedAt: 1, createdAt: -1 }, { name: "appointments_status_created" });
appointmentSchema.index({ email: 1, client: 1 }, { name: "appointments_guest_email" });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
