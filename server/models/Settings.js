const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
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
      default: "Websites that make businesses look serious.",
    },

    heroSubtext: {
      type: String,
      default:
        "We build clean, modern websites for brands, businesses, and campaigns — from online stores to business websites and landing pages.",
    },

    primaryCTA: {
      type: String,
      default: "Book your website",
    },

    secondaryCTA: {
      type: String,
      default: "View our work",
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

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;