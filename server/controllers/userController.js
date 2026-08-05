const mongoose = require("mongoose");
const User = require("../models/User");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const asyncHandler = require("../middleware/asyncHandler");
const { cleanSearch, cleanBoolean, cleanEnum, escapeRegex } = require("../utils/validation");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const { withMongoTransaction } = require("../services/transactionService");
const { revokeAllUserSessions } = require("../services/refreshSessionService");

const getAllClients = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "name", "email"] });
  const match = { role: "client" };
  if (req.query.status) {
    const status = cleanEnum(req.query.status, "Status", ["Active", "Disabled"], { required: true });
    match.isActive = status === "Active";
  }
  const search = cleanSearch(req.query.search);
  if (search) match.$or = ["name", "businessName", "email", "phone"].map((field) => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));

  const result = await User.aggregate([
    { $match: match },
    { $facet: {
      metadata: [{ $count: "total" }],
      data: [
        { $sort: sort }, { $skip: skip }, { $limit: limit },
        { $lookup: { from: "websiterequests", let: { clientId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$client", "$$clientId"] }, archivedAt: null } }, { $count: "count" }], as: "requestCount" } },
        { $lookup: { from: "appointments", let: { clientId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$client", "$$clientId"] }, archivedAt: null } }, { $count: "count" }], as: "appointmentCount" } },
        { $lookup: { from: "reviews", let: { clientId: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$client", "$$clientId"] }, archivedAt: null } }, { $count: "count" }], as: "reviewCount" } },
        { $project: { name: 1, businessName: 1, email: 1, phone: 1, role: 1, isActive: 1, emailVerifiedAt: 1, createdAt: 1, updatedAt: 1,
          counts: { requests: { $ifNull: [{ $first: "$requestCount.count" }, 0] }, appointments: { $ifNull: [{ $first: "$appointmentCount.count" }, 0] }, reviews: { $ifNull: [{ $first: "$reviewCount.count" }, 0] } } } },
      ],
    } },
  ]);
  const clients = result[0]?.data || [];
  const total = result[0]?.metadata?.[0]?.total || 0;
  res.json({ success: true, data: clients, clients, count: clients.length, pagination: paginationMeta({ page, limit, total }) });
});

const getClientById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) { res.status(400); throw new Error("Client ID is invalid"); }
  const client = await User.findOne({ _id: req.params.id, role: "client" }).select("name businessName email phone role isActive emailVerifiedAt createdAt updatedAt").lean();
  if (!client) { res.status(404); throw new Error("Client not found"); }
  const query = { client: client._id, archivedAt: null };
  const [requests, appointments, reviews] = await Promise.all([
    WebsiteRequest.find(query).sort({ createdAt: -1 }).limit(50).lean(),
    Appointment.find(query).populate("slot").sort({ createdAt: -1 }).limit(50).lean(),
    Review.find({ client: client._id, archivedAt: null }).sort({ createdAt: -1 }).limit(50).lean(),
  ]);
  res.json({ success: true, client, activity: { requests, appointments, reviews }, activityLimit: 50 });
});

const updateClientStatus = asyncHandler(async (req, res) => {
  const isActive = cleanBoolean(req.body?.isActive, "isActive");
  const updatedClient = await withMongoTransaction(async (session) => {
    const client = await User.findOne({ _id: req.params.id, role: "client" }).select("+tokenVersion").session(session);
    if (!client) { const error = new Error("Client not found"); error.statusCode = 404; throw error; }
    if (client.isActive !== isActive) {
      client.isActive = isActive;
      if (!isActive) {
        client.tokenVersion += 1;
        await revokeAllUserSessions(client._id, "account-deactivated", { session });
      }
      await client.save({ session });
    }
    return client;
  });
  res.json({ success: true, message: updatedClient.isActive ? "Client account activated successfully" : "Client account disabled successfully", client: updatedClient });
});

module.exports = { getAllClients, getClientById, updateClientStatus };
