const Contract = require("../models/Contract");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../middleware/asyncHandler");
const { cleanText, cleanEmail, cleanPhone, cleanEnum, cleanSearch, cleanObjectId, escapeRegex } = require("../utils/validation");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const { clientContractDto } = require("../utils/responseDtos");
const { runIdempotentTransaction } = require("../services/idempotencyService");
const { withMongoTransaction } = require("../services/transactionService");
const { getAppointmentStatusAfterContract, getRequestContractSentUpdate } = require("../utils/workflowTransitions");
const { notifyContractAccepted, notifyContractClientNote, sendContractAcceptedToClient, sendContractStatusToClient, sendContractToClient } = require("../utils/notificationService");

const statuses = ["Draft", "Sent", "Accepted", "In Progress", "Completed", "Cancelled"];
const textArray = (value, field) => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 100) throw Object.assign(new Error(`${field} must be a list`), { statusCode: 400 });
  return value.map((item) => cleanText(item, field, { max: 300 })).filter(Boolean);
};
const numberValue = (value, field, fallback = 0, max = 100000000) => {
  if (value === undefined || value === "") return fallback;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > max) throw Object.assign(new Error(`${field} is invalid`), { statusCode: 400 });
  return number;
};

const parseContractPayload = (body = {}, defaults = {}) => ({
  client: body.client ? cleanObjectId(body.client, "Client ID") : defaults.client || null,
  request: body.request ? cleanObjectId(body.request, "Request ID") : defaults.request || null,
  appointment: body.appointment ? cleanObjectId(body.appointment, "Appointment ID") : defaults.appointment || null,
  title: cleanText(body.title ?? defaults.title, "Contract title", { required: true, max: 200 }),
  clientName: cleanText(body.clientName ?? defaults.clientName, "Client name", { required: true, max: 120 }),
  businessName: cleanText(body.businessName ?? defaults.businessName, "Business name", { max: 120 }),
  clientEmail: cleanEmail(body.clientEmail ?? defaults.clientEmail, "Client email"),
  clientPhone: cleanPhone(body.clientPhone ?? defaults.clientPhone, "Client phone"),
  websiteType: cleanText(body.websiteType ?? defaults.websiteType, "Website type", { required: true, max: 120 }),
  scopeSummary: cleanText(body.scopeSummary ?? defaults.scopeSummary, "Scope summary", { required: true, max: 5000 }),
  pagesIncluded: textArray(body.pagesIncluded, "Pages included"),
  featuresIncluded: textArray(body.featuresIncluded, "Features included"),
  timeline: cleanText(body.timeline, "Timeline", { max: 300 }),
  startDate: cleanText(body.startDate, "Start date", { max: 80 }),
  deadline: cleanText(body.deadline ?? defaults.deadline, "Deadline", { max: 120 }),
  totalPrice: numberValue(body.totalPrice, "Total price"),
  depositPercent: numberValue(body.depositPercent, "Deposit percent", 70, 100),
  paymentNotes: cleanText(body.paymentNotes, "Payment notes", { max: 2000 }),
  status: cleanEnum(body.status || "Draft", "Status", statuses, { required: true }),
  adminNotes: cleanText(body.adminNotes, "Admin notes", { max: 2000 }),
  clientNotes: cleanText(body.clientNotes, "Client notes", { max: 1500 }),
});

const shouldNotify = (contract) => Boolean(contract.clientEmail && contract.status !== "Draft");
const syncSource = async (contract, session) => {
  const transition = getRequestContractSentUpdate(contract.request, contract.status);
  if (transition) await WebsiteRequest.updateOne(transition.filter, transition.update, { session });
  if (contract.appointment) {
    const appointment = await Appointment.findById(contract.appointment).session(session);
    if (appointment) {
      const next = getAppointmentStatusAfterContract(appointment.status);
      if (next !== appointment.status) { appointment.status = next; appointment.statusVersion += 1; await appointment.save({ session }); }
    }
  }
};

const createWithPayload = async ({ req, payload, scope }) => runIdempotentTransaction({
  req, scope, actor: req.user._id, payload,
  work: async (session) => {
    if (payload.request && payload.appointment) {
      const error = new Error("A contract can have only one source"); error.statusCode = 400; throw error;
    }
    if (payload.request) {
      const source = await WebsiteRequest.findOne({ _id: payload.request, archivedAt: null }).select("client").session(session).lean();
      if (!source) { const error = new Error("Website request source not found"); error.statusCode = 404; throw error; }
      if (source.client) payload.client = source.client;
    }
    if (payload.appointment) {
      const source = await Appointment.findOne({ _id: payload.appointment, archivedAt: null }).select("client").session(session).lean();
      if (!source) { const error = new Error("Appointment source not found"); error.statusCode = 404; throw error; }
      if (source.client) payload.client = source.client;
    }
    if (payload.request || payload.appointment) {
      const existing = await Contract.findOne({
        archivedAt: null,
        ...(payload.request ? { request: payload.request } : { appointment: payload.appointment }),
      }).session(session);
      if (existing) return { contract: existing.toObject(), notificationStatus: "not-required", existing: true };
    }
    const [contract] = await Contract.create([payload], { session });
    await syncSource(contract, session);
    if (shouldNotify(contract)) await sendContractToClient(contract, { session });
    return { contract: contract.toObject(), notificationStatus: shouldNotify(contract) ? "queued" : "not-required" };
  },
});

const createContract = asyncHandler(async (req, res) => {
  const result = await createWithPayload({ req, payload: parseContractPayload(req.body), scope: "contract:create" });
  res.status(result.replayed || result.existing ? 200 : 201).json({ success: true, message: result.existing ? "Existing contract returned" : "Contract created successfully", ...result });
});

const createContractFromRequest = asyncHandler(async (req, res) => {
  const source = await WebsiteRequest.findOne({ _id: req.params.requestId, archivedAt: null }).populate("client", "name email phone businessName");
  if (!source) { res.status(404); throw new Error("Website request not found"); }
  const defaults = { client: source.client?._id || null, request: source._id, title: `${source.businessName || source.name} — ${source.websiteType} Proposal`, clientName: source.name, businessName: source.businessName, clientEmail: source.email, clientPhone: source.phone, websiteType: source.websiteType, scopeSummary: source.projectDetails, deadline: source.deadline };
  const payload = parseContractPayload(req.body, defaults);
  payload.request = source._id; payload.appointment = null; payload.client = source.client?._id || null;
  const result = await createWithPayload({ req, payload, scope: `contract:request:${source._id}` });
  res.status(result.replayed || result.existing ? 200 : 201).json({ success: true, message: result.existing ? "Existing contract returned" : "Contract created from request successfully", ...result });
});

const createContractFromAppointment = asyncHandler(async (req, res) => {
  const source = await Appointment.findOne({ _id: req.params.appointmentId, archivedAt: null }).populate("client", "name email phone businessName");
  if (!source) { res.status(404); throw new Error("Appointment not found"); }
  const defaults = { client: source.client?._id || null, appointment: source._id, title: `${source.businessName || source.name} — Website Proposal`, clientName: source.name, businessName: source.businessName, clientEmail: source.email, clientPhone: source.phone, scopeSummary: source.topic };
  const payload = parseContractPayload(req.body, defaults);
  payload.appointment = source._id; payload.request = null; payload.client = source.client?._id || null;
  const result = await createWithPayload({ req, payload, scope: `contract:appointment:${source._id}` });
  res.status(result.replayed || result.existing ? 200 : 201).json({ success: true, message: result.existing ? "Existing contract returned" : "Contract created from appointment successfully", ...result });
});

const getAllContracts = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status", "clientName", "totalPrice"] });
  const query = { archivedAt: null };
  if (req.query.includeArchived === "true") delete query.archivedAt;
  if (req.query.status) query.status = cleanEnum(req.query.status, "Status", statuses, { required: true });
  const search = cleanSearch(req.query.search);
  if (search) query.$or = ["title", "clientName", "businessName", "clientEmail", "clientPhone", "websiteType"].map((field) => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));
  const [contracts, total] = await Promise.all([
    Contract.find(query).populate("client", "name email phone businessName").populate("request", "name businessName websiteType status").populate("appointment", "name businessName topic status").sort(sort).skip(skip).limit(limit).lean(),
    Contract.countDocuments(query),
  ]);
  res.json({ success: true, data: contracts, contracts, count: contracts.length, pagination: paginationMeta({ page, limit, total }) });
});

const getMyContracts = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status"] });
  const query = { client: req.user._id, status: { $ne: "Draft" }, archivedAt: null };
  const [documents, total] = await Promise.all([Contract.find(query).sort(sort).skip(skip).limit(limit).lean(), Contract.countDocuments(query)]);
  const contracts = documents.map(clientContractDto);
  res.json({ success: true, data: contracts, contracts, count: contracts.length, pagination: paginationMeta({ page, limit, total }) });
});

const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id, archivedAt: null }).populate("client", "name email phone businessName").populate("request", "name businessName websiteType status").populate("appointment", "name businessName topic status");
  if (!contract) { res.status(404); throw new Error("Contract not found"); }
  const isAdmin = req.user.role === "admin";
  const ownerId = contract.client?._id || contract.client;
  if (!isAdmin && String(ownerId) !== String(req.user._id)) { res.status(403); throw new Error("You are not allowed to view this contract"); }
  if (!isAdmin && contract.status === "Draft") { res.status(404); throw new Error("Contract not found"); }
  res.json({ success: true, contract: isAdmin ? contract : clientContractDto(contract) });
});

const updateContract = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await withMongoTransaction(async (session) => {
    const contract = await Contract.findOne({ _id: id, archivedAt: null }).session(session);
    if (!contract) { const error = new Error("Contract not found"); error.statusCode = 404; throw error; }
    const previousStatus = contract.status;
    const allowed = ["title", "clientName", "businessName", "websiteType", "scopeSummary", "timeline", "startDate", "deadline", "paymentNotes", "adminNotes", "clientNotes"];
    for (const field of allowed) if (req.body[field] !== undefined) contract[field] = cleanText(req.body[field], field, { max: field === "scopeSummary" ? 5000 : 2000 });
    if (req.body.clientEmail !== undefined) contract.clientEmail = cleanEmail(req.body.clientEmail);
    if (req.body.clientPhone !== undefined) contract.clientPhone = cleanPhone(req.body.clientPhone);
    if (req.body.totalPrice !== undefined) contract.totalPrice = numberValue(req.body.totalPrice, "Total price");
    if (req.body.depositPercent !== undefined) contract.depositPercent = numberValue(req.body.depositPercent, "Deposit percent", 70, 100);
    if (req.body.pagesIncluded !== undefined) contract.pagesIncluded = textArray(req.body.pagesIncluded, "Pages included");
    if (req.body.featuresIncluded !== undefined) contract.featuresIncluded = textArray(req.body.featuresIncluded, "Features included");
    if (req.body.status !== undefined) contract.status = cleanEnum(req.body.status, "Status", statuses, { required: true });
    if (contract.status !== previousStatus) contract.statusVersion += 1;
    await contract.save({ session });
    await syncSource(contract, session);
    if (contract.status !== previousStatus && shouldNotify(contract)) {
      await (previousStatus === "Draft" && contract.status === "Sent" ? sendContractToClient : sendContractStatusToClient)(contract, { session });
    }
    return { id: contract._id, notificationStatus: contract.status !== previousStatus && shouldNotify(contract) ? "queued" : "not-required" };
  });
  const contract = await Contract.findById(result.id);
  res.json({ success: true, message: "Contract updated successfully", contract, notificationStatus: result.notificationStatus });
});

const acceptContract = asyncHandler(async (req, res) => {
  const contractId = req.params.id;
  await withMongoTransaction(async (session) => {
    const contract = await Contract.findOne({ _id: contractId, client: req.user._id, status: "Sent", archivedAt: null }).session(session);
    if (!contract) { const error = new Error("Only your sent contracts can be accepted"); error.statusCode = 409; throw error; }
    if (req.body.clientNotes !== undefined) contract.clientNotes = cleanText(req.body.clientNotes, "Client note", { max: 1500 });
    contract.status = "Accepted"; contract.statusVersion += 1;
    await contract.save({ session });
    await Promise.all([notifyContractAccepted(contract, { session }), sendContractAcceptedToClient(contract, { session })]);
  });
  const contract = await Contract.findById(contractId).lean();
  res.json({ success: true, message: "Contract accepted successfully", contract: clientContractDto(contract), notificationStatus: "queued" });
});

const updateClientContractNote = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await withMongoTransaction(async (session) => {
    const contract = await Contract.findOne({ _id: id, client: req.user._id, status: { $ne: "Draft" }, archivedAt: null }).session(session);
    if (!contract) { const error = new Error("Contract not found"); error.statusCode = 404; throw error; }
    contract.clientNotes = cleanText(req.body?.clientNotes, "Client note", { max: 1500 });
    await contract.save({ session });
    await notifyContractClientNote(contract, { session });
  });
  const contract = await Contract.findById(id).lean();
  res.json({ success: true, message: "Contract note updated successfully", contract: clientContractDto(contract), notificationStatus: "queued" });
});

const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id, archivedAt: null }, { $set: { archivedAt: new Date(), archivedBy: req.user._id, archiveReason: cleanText(req.body?.archiveReason, "Archive reason", { max: 500 }) || "Archived by admin" } }, { new: true, runValidators: true });
  if (!contract) { res.status(404); throw new Error("Contract not found"); }
  res.json({ success: true, message: "Contract archived successfully" });
});

module.exports = { createContract, createContractFromRequest, createContractFromAppointment, getAllContracts, getMyContracts, getContractById, updateContract, acceptContract, updateClientContractNote, deleteContract };
