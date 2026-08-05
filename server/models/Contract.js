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

    claimedAt: { type: Date, default: null },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    claimMethod: { type: String, default: "", maxlength: 40 },
    claimAuditKey: { type: String, default: "", maxlength: 160 },

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
    statusVersion: { type: Number, default: 0, min: 0 },

    adminNotes: {
      type: String,
      default: "",
    },

    clientNotes: {
      type: String,
      default: "",
    },
    archivedAt: { type: Date, default: null },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    archiveReason: { type: String, default: "", maxlength: 500 },
  },
  {
    timestamps: true,
    strict: "throw",
  }
);

contractSchema.index({ client: 1, archivedAt: 1, createdAt: -1 }, { name: "contracts_owner_created" });
contractSchema.index({ status: 1, archivedAt: 1, createdAt: -1 }, { name: "contracts_status_created" });
contractSchema.index(
  { request: 1 },
  { unique: true, partialFilterExpression: { request: { $type: "objectId" }, archivedAt: null }, name: "unique_active_request_contract" }
);
contractSchema.index(
  { appointment: 1 },
  { unique: true, partialFilterExpression: { appointment: { $type: "objectId" }, archivedAt: null }, name: "unique_active_appointment_contract" }
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
