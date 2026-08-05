const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
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

    role: {
      type: String,
      trim: true,
      default: "Client",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    message: {
      type: String,
      required: [true, "Review message is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    isManual: {
      type: Boolean,
      default: false,
    },

    isVisible: {
      type: Boolean,
      default: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

reviewSchema.index({ archivedAt: 1, status: 1, isVisible: 1, createdAt: -1 }, { name: "public_reviews_active" });
reviewSchema.index({ client: 1, createdAt: -1 }, { name: "reviews_owner_created" });

reviewSchema.index(
  {
    client: 1,
    contract: 1,
  },
  {
    unique: true,
    name: "unique_client_contract_review",
    partialFilterExpression: {
      client: { $type: "objectId" },
      contract: { $type: "objectId" },
      isManual: false,
    },
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
