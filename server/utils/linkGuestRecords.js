const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const Contract = require("../models/Contract");

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const emptyCounts = () => ({ linkedRequests: 0, linkedAppointments: 0, linkedContracts: 0 });

const linkVerifiedGuestRecords = async (user, { session, auditKey } = {}) => {
  if (!user?._id || user.role !== "client" || !user.emailVerifiedAt) return emptyCounts();
  if (!session) throw new Error("Verified guest record claims require a MongoDB transaction");

  const email = normalizeEmail(user.email);
  const now = new Date();
  const audit = {
    client: user._id,
    claimedAt: now,
    claimedBy: user._id,
    claimMethod: "verified-email",
    claimAuditKey: String(auditKey || `verification:${user._id}:${user.emailVerificationVersion || 0}`).slice(0, 160),
  };

  const [requestIds, appointmentIds] = await Promise.all([
    WebsiteRequest.find({ client: null, email, archivedAt: null }).select("_id").session(session).lean(),
    Appointment.find({ client: null, email, archivedAt: null }).select("_id").session(session).lean(),
  ]);

  const requestObjectIds = requestIds.map((item) => item._id);
  const appointmentObjectIds = appointmentIds.map((item) => item._id);
  const [requestResult, appointmentResult] = await Promise.all([
    WebsiteRequest.updateMany({ _id: { $in: requestObjectIds }, client: null, email }, { $set: audit }, { session }),
    Appointment.updateMany({ _id: { $in: appointmentObjectIds }, client: null, email }, { $set: audit }, { session }),
  ]);

  const sourceFilters = [];
  if (requestObjectIds.length) sourceFilters.push({ request: { $in: requestObjectIds } });
  if (appointmentObjectIds.length) sourceFilters.push({ appointment: { $in: appointmentObjectIds } });
  let linkedContracts = 0;
  if (sourceFilters.length) {
    const contractResult = await Contract.updateMany(
      { client: null, clientEmail: email, archivedAt: null, $or: sourceFilters },
      { $set: { client: user._id, claimedAt: now, claimedBy: user._id, claimMethod: audit.claimMethod, claimAuditKey: audit.claimAuditKey } },
      { session }
    );
    linkedContracts = contractResult.modifiedCount;
  }

  return {
    linkedRequests: requestResult.modifiedCount,
    linkedAppointments: appointmentResult.modifiedCount,
    linkedContracts,
  };
};

module.exports = { linkVerifiedGuestRecords, normalizeEmail };
