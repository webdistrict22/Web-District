const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "primary",
      select: false,
    },

    agencyName: {
      type: String,
      default: "Web District",
    },

    phone: {
      type: String,
      default: "01130696935",
    },

    whatsapp: {
      type: String,
      default: "01130696935",
    },

    instagram: {
      type: String,
      default: "web__district",
    },

    email: {
      type: String,
      default: "web.district22@gmail.com",
    },

    heroHeadline: {
      type: String,
      default: "Your brand, brought online with care.",
    },

    heroSubtext: {
      type: String,
      default:
        "Elegant websites for brands ready to look more polished, trusted, and complete online.",
    },

    primaryCTA: {
      type: String,
      default: "Start Your Project",
    },

    secondaryCTA: {
      type: String,
      default: "View Our Work",
    },

    footerText: {
      type: String,
      default: "Clean websites for brands, businesses, and campaigns.",
    },
  },
  {
    timestamps: true,
  }
);

settingsSchema.index(
  {
    singletonKey: 1,
  },
  {
    unique: true,
    name: "unique_settings_singleton",
    partialFilterExpression: {
      singletonKey: { $type: "string" },
    },
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
