const User = require("../../models/User");
const WebsiteRequest = require("../../models/WebsiteRequest");
const Appointment = require("../../models/Appointment");
const Contract = require("../../models/Contract");
const { run } = require("./scriptRuntime");

run(async () => {
  const [unverifiedClients, unownedRequests, unownedAppointments, unownedContracts, claimedRequests, claimedAppointments, claimedContracts] = await Promise.all([
    User.countDocuments({ role: "client", emailVerifiedAt: null }),
    WebsiteRequest.countDocuments({ client: null, archivedAt: null }),
    Appointment.countDocuments({ client: null, archivedAt: null }),
    Contract.countDocuments({ client: null, archivedAt: null }),
    WebsiteRequest.countDocuments({ claimedAt: { $ne: null } }),
    Appointment.countDocuments({ claimedAt: { $ne: null } }),
    Contract.countDocuments({ claimedAt: { $ne: null } }),
  ]);
  console.log(JSON.stringify({ ok: true, mode: "read-only", counts: { unverifiedClients, unownedRequests, unownedAppointments, unownedContracts, claimedRequests, claimedAppointments, claimedContracts } }, null, 2));
});
