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
      enum: ["Online Store", "Business Website", "Landing Page", "Custom Website"],
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
  },
  {
    timestamps: true,
  }
);

const WebsiteRequest = mongoose.model("WebsiteRequest", websiteRequestSchema);

module.exports = WebsiteRequest;