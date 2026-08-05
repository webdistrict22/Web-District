const WebsiteRequest = require("../models/WebsiteRequest");
const asyncHandler = require("../middleware/asyncHandler");
const { cleanText, cleanEmail, cleanPhone, cleanSearch, cleanEnum, escapeRegex } = require("../utils/validation");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const { runIdempotentTransaction } = require("../services/idempotencyService");
const { withMongoTransaction } = require("../services/transactionService");
const { notifyNewWebsiteRequest, sendWebsiteRequestConfirmationToClient, sendWebsiteRequestStatusToClient } = require("../utils/notificationService");

const requestStatuses = ["New", "Reviewed", "Accepted", "Rejected", "In Progress", "Contract Sent", "Completed"];
const requestTypes = ["Online Store", "Business Website", "Portfolio & Personal Brand Website", "Landing Page", "Booking & Reservation Website", "Custom Platform & Dashboard", "Custom Website"];

const parseRequestPayload = (body = {}) => ({
  name: cleanText(body.name, "Name", { required: true, max: 80 }),
  businessName: cleanText(body.businessName, "Business name", { max: 120 }),
  phone: cleanPhone(body.phone, "Phone", { required: true }),
  email: cleanEmail(body.email),
  websiteType: cleanEnum(body.websiteType, "Website type", requestTypes, { required: true }),
  hasBrandIdentity: body.hasBrandIdentity === undefined ? undefined : cleanEnum(body.hasBrandIdentity, "Brand identity status", ["Yes", "No", "Not sure"], { required: true }),
  hasContentReady: body.hasContentReady === undefined ? undefined : cleanEnum(body.hasContentReady, "Content readiness status", ["Yes", "No", "Partially"], { required: true }),
  budgetRange: cleanText(body.budgetRange, "Budget range", { max: 120 }),
  deadline: cleanText(body.deadline, "Deadline", { max: 120 }),
  projectDetails: cleanText(body.projectDetails, "Project details", { required: true, max: 2500 }),
  preferredContactMethod: body.preferredContactMethod === undefined ? undefined : cleanEnum(body.preferredContactMethod, "Preferred contact method", ["WhatsApp", "Phone Call", "Email", "Instagram"], { required: true }),
});

const createWebsiteRequest = asyncHandler(async (req, res) => {
  const payload = parseRequestPayload(req.body);
  const result = await runIdempotentTransaction({
    req, scope: "website-request:create", actor: req.user?._id || payload.email, payload,
    work: async (session) => {
      const [websiteRequest] = await WebsiteRequest.create([{ client: req.user?._id || null, ...payload }], { session });
      await Promise.all([
        notifyNewWebsiteRequest(websiteRequest, { session }),
        sendWebsiteRequestConfirmationToClient(websiteRequest, { session }),
      ]);
      return { request: websiteRequest.toObject(), notificationStatus: "queued" };
    },
  });
  res.status(result.replayed ? 200 : 201).json({ success: true, message: "Website request submitted successfully", ...result });
});

const getAllWebsiteRequests = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status", "name"] });
  const query = { archivedAt: null };
  if (req.query.includeArchived === "true") delete query.archivedAt;
  if (req.query.status) query.status = cleanEnum(req.query.status, "Status", requestStatuses, { required: true });
  if (req.query.websiteType) query.websiteType = cleanEnum(req.query.websiteType, "Website type", requestTypes, { required: true });
  const search = cleanSearch(req.query.search);
  if (search) query.$or = ["name", "businessName", "phone", "email", "projectDetails"].map((field) => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));
  const [requests, total] = await Promise.all([
    WebsiteRequest.find(query).populate("client", "name email phone businessName").sort(sort).skip(skip).limit(limit).lean(),
    WebsiteRequest.countDocuments(query),
  ]);
  res.json({ success: true, data: requests, requests, count: requests.length, pagination: paginationMeta({ page, limit, total }) });
});

const getMyWebsiteRequests = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status"] });
  const query = { client: req.user._id, archivedAt: null };
  const [requests, total] = await Promise.all([WebsiteRequest.find(query).sort(sort).skip(skip).limit(limit).lean(), WebsiteRequest.countDocuments(query)]);
  res.json({ success: true, data: requests, requests, count: requests.length, pagination: paginationMeta({ page, limit, total }) });
});

const getWebsiteRequestById = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findById(req.params.id).populate("client", "name email phone businessName");
  if (!request) { res.status(404); throw new Error("Website request not found"); }
  res.json({ success: true, request });
});

const updateWebsiteRequest = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findOne({ _id: req.params.id, archivedAt: null });
  if (!request) { res.status(404); throw new Error("Website request not found"); }
  const previousStatus = request.status;
  const textFields = { adminNotes: 1500, name: 80, businessName: 120, budgetRange: 120, deadline: 120, projectDetails: 2500 };
  for (const [field, max] of Object.entries(textFields)) if (req.body[field] !== undefined) request[field] = cleanText(req.body[field], field, { max });
  if (req.body.phone !== undefined) request.phone = cleanPhone(req.body.phone, "Phone", { required: true });
  if (req.body.email !== undefined) request.email = cleanEmail(req.body.email);
  if (req.body.status !== undefined) request.status = cleanEnum(req.body.status, "Status", requestStatuses, { required: true });
  if (req.body.websiteType !== undefined) request.websiteType = cleanEnum(req.body.websiteType, "Website type", requestTypes, { required: true });

  const updated = await withMongoTransaction(async (session) => {
    await request.save({ session });
    if (request.status !== previousStatus) await sendWebsiteRequestStatusToClient(request, request.updatedAt?.getTime?.() || Date.now(), { session });
    return request;
  });
  res.json({ success: true, message: "Website request updated successfully", request: updated, notificationStatus: request.status !== previousStatus ? "queued" : "not-required" });
});

const deleteWebsiteRequest = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findOneAndUpdate(
    { _id: req.params.id, archivedAt: null },
    { $set: { archivedAt: new Date(), archivedBy: req.user._id, archiveReason: cleanText(req.body?.archiveReason, "Archive reason", { max: 500 }) || "Archived by admin" } },
    { new: true, runValidators: true }
  );
  if (!request) { res.status(404); throw new Error("Website request not found"); }
  res.json({ success: true, message: "Website request archived successfully" });
});

module.exports = { createWebsiteRequest, getAllWebsiteRequests, getMyWebsiteRequests, getWebsiteRequestById, updateWebsiteRequest, deleteWebsiteRequest };
