const User = require("../../models/User");
const WebsiteRequest = require("../../models/WebsiteRequest");
const Appointment = require("../../models/Appointment");
const Contract = require("../../models/Contract");
const { run } = require("./scriptRuntime");

run(async () => {
  const unverifiedClientIds = await User.distinct("_id", { role: "client", emailVerifiedAt: null });
  const linkedToUnverified = { client: { $in: unverifiedClientIds } };
  const claimedByUnverified = {
    claimedAt: { $ne: null },
    $or: [{ client: { $in: unverifiedClientIds } }, { claimedBy: { $in: unverifiedClientIds } }],
  };
  const [
    requestsAttachedToUnverifiedClients,
    appointmentsAttachedToUnverifiedClients,
    contractsAttachedToUnverifiedClients,
    unsafeClaimedRequests,
    unsafeClaimedAppointments,
    unsafeClaimedContracts,
    unownedRequests,
    unownedAppointments,
    unownedContracts,
    claimedRequests,
    claimedAppointments,
    claimedContracts,
    activeAdmins,
    unverifiedActiveAdmins,
  ] = await Promise.all([
    WebsiteRequest.countDocuments(linkedToUnverified),
    Appointment.countDocuments(linkedToUnverified),
    Contract.countDocuments(linkedToUnverified),
    WebsiteRequest.countDocuments(claimedByUnverified),
    Appointment.countDocuments(claimedByUnverified),
    Contract.countDocuments(claimedByUnverified),
    WebsiteRequest.countDocuments({ client: null, archivedAt: null }),
    Appointment.countDocuments({ client: null, archivedAt: null }),
    Contract.countDocuments({ client: null, archivedAt: null }),
    WebsiteRequest.countDocuments({ claimedAt: { $ne: null } }),
    Appointment.countDocuments({ claimedAt: { $ne: null } }),
    Contract.countDocuments({ claimedAt: { $ne: null } }),
    User.countDocuments({ role: "admin", isActive: true }),
    User.countDocuments({ role: "admin", isActive: true, emailVerifiedAt: null }),
  ]);
  console.log(JSON.stringify({
    ok: true,
    mode: "read-only",
    counts: {
      unverifiedClients: unverifiedClientIds.length,
      requestsAttachedToUnverifiedClients,
      appointmentsAttachedToUnverifiedClients,
      contractsAttachedToUnverifiedClients,
      unsafeClaimedRequests,
      unsafeClaimedAppointments,
      unsafeClaimedContracts,
      unownedRequests,
      unownedAppointments,
      unownedContracts,
      claimedRequests,
      claimedAppointments,
      claimedContracts,
      activeAdmins,
      unverifiedActiveAdmins,
    },
  }, null, 2));
});
