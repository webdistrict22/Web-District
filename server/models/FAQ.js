const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;