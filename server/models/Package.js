const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Package slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    websiteType: {
      type: String,
      enum: ["Online Store", "Business Website", "Landing Page", "Custom Website"],
      required: [true, "Website type is required"],
    },

    features: {
      type: [String],
      default: [],
    },

    bestFor: {
      type: [String],
      default: [],
    },

    priceLabel: {
      type: String,
      default: "Custom quote",
    },

    isCustom: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;