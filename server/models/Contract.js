const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WebsiteRequest",
      default: null,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    title: {
      type: String,
      required: [true, "Contract title is required"],
      trim: true,
    },

    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },

    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    clientEmail: {
      type: String,
      required: [true, "Client email is required"],
      lowercase: true,
      trim: true,
    },

    clientPhone: {
      type: String,
      trim: true,
      default: "",
    },

    websiteType: {
      type: String,
      required: [true, "Website type is required"],
      trim: true,
    },

    scopeSummary: {
      type: String,
      required: [true, "Scope summary is required"],
      trim: true,
    },

    pagesIncluded: {
      type: [String],
      default: [],
    },

    featuresIncluded: {
      type: [String],
      default: [],
    },

    timeline: {
      type: String,
      default: "",
    },

    startDate: {
      type: String,
      default: "",
    },

    deadline: {
      type: String,
      default: "",
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    depositPercent: {
      type: Number,
      default: 70,
    },

    depositAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    paymentNotes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Sent",
        "Accepted",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Draft",
    },

    adminNotes: {
      type: String,
      default: "",
    },

    clientNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

contractSchema.pre("save", function (next) {
  const total = Number(this.totalPrice) || 0;
  const percent = Number(this.depositPercent) || 0;

  this.depositAmount = Math.round((total * percent) / 100);
  this.remainingAmount = Math.max(total - this.depositAmount, 0);

  next();
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;