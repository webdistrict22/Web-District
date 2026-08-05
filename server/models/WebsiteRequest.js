const mongoose = require("mongoose");

const websiteRequestSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

    websiteType: {
      type: String,
      enum: [
        "Online Store",
        "Business Website",
        "Portfolio & Personal Brand Website",
        "Landing Page",
        "Booking & Reservation Website",
        "Custom Platform & Dashboard",
        "Custom Website",
      ],
      required: [true, "Website type is required"],
    },

    hasBrandIdentity: {
      type: String,
      enum: ["Yes", "No", "Not sure"],
      default: "Not sure",
    },

    hasContentReady: {
      type: String,
      enum: ["Yes", "No", "Partially"],
      default: "Partially",
    },

    budgetRange: {
      type: String,
      trim: true,
      default: "",
    },

    deadline: {
      type: String,
      trim: true,
      default: "",
    },

    projectDetails: {
      type: String,
      required: [true, "Project details are required"],
      trim: true,
    },

    preferredContactMethod: {
      type: String,
      enum: ["WhatsApp", "Phone Call", "Email", "Instagram"],
      default: "WhatsApp",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Reviewed",
        "Accepted",
        "Rejected",
        "In Progress",
        "Contract Sent",
        "Completed",
      ],
      default: "New",
    },

    adminNotes: {
      type: String,
      default: "",
    },
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

websiteRequestSchema.index({ client: 1, archivedAt: 1, createdAt: -1 }, { name: "requests_owner_created" });
websiteRequestSchema.index({ status: 1, archivedAt: 1, createdAt: -1 }, { name: "requests_status_created" });
websiteRequestSchema.index({ email: 1, client: 1 }, { name: "requests_guest_email" });

const WebsiteRequest = mongoose.model("WebsiteRequest", websiteRequestSchema);

module.exports = WebsiteRequest;
