const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    websiteType: {
      type: String,
      required: [true, "Website type is required"],
      trim: true,
    },

    businessType: {
      type: String,
      trim: true,
      default: "",
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    fullDescription: {
      type: String,
      default: "",
    },

    keyFeatures: {
      type: [String],
      default: [],
    },

    pagesIncluded: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    liveUrl: {
      type: String,
      default: "",
    },

    caseStudyUrl: {
      type: String,
      default: "",
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;