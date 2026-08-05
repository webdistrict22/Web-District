const mongoose = require("mongoose");

const maintenanceLockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    leaseExpiresAt: { type: Date, required: true },
    lastSuccessAt: { type: Date, default: null },
    lastResult: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true, strict: "throw" }
);

maintenanceLockSchema.index({ leaseExpiresAt: 1 }, { name: "maintenance_lease" });

module.exports = mongoose.model("MaintenanceLock", maintenanceLockSchema);
