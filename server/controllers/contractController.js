const Contract = require("../models/Contract");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../middleware/asyncHandler");
const {
  notifyContractAccepted,
  notifyContractClientNote,
  sendContractAcceptedToClient,
  sendContractStatusToClient,
  sendContractToClient,
} = require("../utils/notificationService");

const textArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const shouldNotifyClientAboutContract = (contract) => {
  return Boolean(contract.clientEmail && contract.status !== "Draft");
};

const createContract = asyncHandler(async (req, res) => {
  const {
    client,
    request,
    appointment,
    title,
    clientName,
    businessName,
    clientEmail,
    clientPhone,
    websiteType,
    scopeSummary,
    pagesIncluded,
    featuresIncluded,
    timeline,
    startDate,
    deadline,
    totalPrice,
    depositPercent,
    paymentNotes,
    status,
    adminNotes,
    clientNotes,
  } = req.body;

  if (!title || !clientName || !clientEmail || !websiteType || !scopeSummary) {
    res.status(400);
    throw new Error(
      "Title, client name, email, website type, and scope summary are required"
    );
  }

  const contract = await Contract.create({
    client: client || null,
    request: request || null,
    appointment: appointment || null,
    title,
    clientName,
    businessName,
    clientEmail,
    clientPhone,
    websiteType,
    scopeSummary,
    pagesIncluded: textArray(pagesIncluded),
    featuresIncluded: textArray(featuresIncluded),
    timeline,
    startDate,
    deadline,
    totalPrice: Number(totalPrice) || 0,
    depositPercent:
      depositPercent === undefined ? 70 : Number(depositPercent) || 0,
    paymentNotes,
    status: status || "Draft",
    adminNotes,
    clientNotes,
  });

  if (shouldNotifyClientAboutContract(contract)) {
    sendContractToClient(contract).catch((error) => {
      console.error("Contract client email failed:", error.message);
    });
  }

  res.status(201).json({
    success: true,
    message: "Contract created successfully",
    contract,
  });
});

const createContractFromRequest = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findById(req.params.requestId).populate(
    "client",
    "name email phone businessName"
  );

  if (!request) {
    res.status(404);
    throw new Error("Website request not found");
  }

  const {
    title,
    scopeSummary,
    pagesIncluded,
    featuresIncluded,
    timeline,
    startDate,
    deadline,
    totalPrice,
    depositPercent,
    paymentNotes,
    status,
    adminNotes,
    clientNotes,
  } = req.body;

  const contract = await Contract.create({
    client: request.client?._id || null,
    request: request._id,
    title:
      title ||
      `${request.businessName || request.name} — ${request.websiteType} Proposal`,
    clientName: request.name,
    businessName: request.businessName || "",
    clientEmail: request.email,
    clientPhone: request.phone,
    websiteType: request.websiteType,
    scopeSummary: scopeSummary || request.projectDetails,
    pagesIncluded: textArray(pagesIncluded),
    featuresIncluded: textArray(featuresIncluded),
    timeline,
    startDate,
    deadline: deadline || request.deadline,
    totalPrice: Number(totalPrice) || 0,
    depositPercent:
      depositPercent === undefined ? 70 : Number(depositPercent) || 0,
    paymentNotes,
    status: status || "Draft",
    adminNotes,
    clientNotes,
  });

  request.status = "Contract Sent";
  await request.save();

  if (shouldNotifyClientAboutContract(contract)) {
    sendContractToClient(contract).catch((error) => {
      console.error("Contract client email failed:", error.message);
    });
  }

  res.status(201).json({
    success: true,
    message: "Contract created from request successfully",
    contract,
  });
});

const createContractFromAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(
    req.params.appointmentId
  ).populate("client", "name email phone businessName");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const {
    title,
    websiteType,
    scopeSummary,
    pagesIncluded,
    featuresIncluded,
    timeline,
    startDate,
    deadline,
    totalPrice,
    depositPercent,
    paymentNotes,
    status,
    adminNotes,
    clientNotes,
  } = req.body;

  if (!websiteType) {
    res.status(400);
    throw new Error("Website type is required");
  }

  const contract = await Contract.create({
    client: appointment.client?._id || null,
    appointment: appointment._id,
    title:
      title ||
      `${appointment.businessName || appointment.name} — Website Proposal`,
    clientName: appointment.name,
    businessName: appointment.businessName || "",
    clientEmail: appointment.email,
    clientPhone: appointment.phone,
    websiteType,
    scopeSummary: scopeSummary || appointment.topic,
    pagesIncluded: textArray(pagesIncluded),
    featuresIncluded: textArray(featuresIncluded),
    timeline,
    startDate,
    deadline,
    totalPrice: Number(totalPrice) || 0,
    depositPercent:
      depositPercent === undefined ? 70 : Number(depositPercent) || 0,
    paymentNotes,
    status: status || "Draft",
    adminNotes,
    clientNotes,
  });

  appointment.status = "Accepted";
  await appointment.save();

  if (shouldNotifyClientAboutContract(contract)) {
    sendContractToClient(contract).catch((error) => {
      console.error("Contract client email failed:", error.message);
    });
  }

  res.status(201).json({
    success: true,
    message: "Contract created from appointment successfully",
    contract,
  });
});

const getAllContracts = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { clientName: { $regex: search, $options: "i" } },
      { businessName: { $regex: search, $options: "i" } },
      { clientEmail: { $regex: search, $options: "i" } },
      { clientPhone: { $regex: search, $options: "i" } },
      { websiteType: { $regex: search, $options: "i" } },
    ];
  }

  const contracts = await Contract.find(query)
    .populate("client", "name email phone businessName")
    .populate("request", "name businessName websiteType status")
    .populate("appointment", "name businessName topic status")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: contracts.length,
    contracts,
  });
});

const getMyContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.find({ client: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: contracts.length,
    contracts,
  });
});

const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id)
    .populate("client", "name email phone businessName")
    .populate("request", "name businessName websiteType status")
    .populate("appointment", "name businessName topic status");

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    contract.client &&
    contract.client._id.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error("You are not allowed to view this contract");
  }

  res.json({
    success: true,
    contract,
  });
});

const updateContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  const previousStatus = contract.status;

  const fields = [
    "client",
    "request",
    "appointment",
    "title",
    "clientName",
    "businessName",
    "clientEmail",
    "clientPhone",
    "websiteType",
    "scopeSummary",
    "timeline",
    "startDate",
    "deadline",
    "totalPrice",
    "depositPercent",
    "paymentNotes",
    "status",
    "adminNotes",
    "clientNotes",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      contract[field] = req.body[field];
    }
  });

  if (req.body.pagesIncluded !== undefined) {
    contract.pagesIncluded = textArray(req.body.pagesIncluded);
  }

  if (req.body.featuresIncluded !== undefined) {
    contract.featuresIncluded = textArray(req.body.featuresIncluded);
  }

  const updatedContract = await contract.save();

  if (
    req.body.status !== undefined &&
    updatedContract.status !== previousStatus &&
    shouldNotifyClientAboutContract(updatedContract)
  ) {
    const notifier =
      previousStatus === "Draft" && updatedContract.status === "Sent"
        ? sendContractToClient
        : sendContractStatusToClient;

    notifier(updatedContract).catch((error) => {
      console.error("Contract status email failed:", error.message);
    });
  }

  res.json({
    success: true,
    message: "Contract updated successfully",
    contract: updatedContract,
  });
});

const acceptContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  if (!contract.client || contract.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not allowed to accept this contract");
  }

  if (contract.status === "Cancelled" || contract.status === "Completed") {
    res.status(400);
    throw new Error("This contract cannot be accepted in its current status");
  }

  const { clientNotes } = req.body;

  contract.status = "Accepted";

  if (clientNotes !== undefined) {
    contract.clientNotes = clientNotes;
  }

  const updatedContract = await contract.save();

  notifyContractAccepted(updatedContract).catch((error) => {
    console.error("Contract accepted email notification failed:", error.message);
  });

  sendContractAcceptedToClient(updatedContract).catch((error) => {
    console.error("Contract accepted client email failed:", error.message);
  });

  res.json({
    success: true,
    message: "Contract accepted successfully",
    contract: updatedContract,
  });
});

const updateClientContractNote = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  if (!contract.client || contract.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not allowed to update this contract");
  }

  const { clientNotes } = req.body;

  contract.clientNotes = clientNotes || "";

  const updatedContract = await contract.save();

  notifyContractClientNote(updatedContract).catch((error) => {
    console.error("Contract client note email failed:", error.message);
  });

  res.json({
    success: true,
    message: "Contract note updated successfully",
    contract: updatedContract,
  });
});

const deleteContract = asyncHandler(async (req, res) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  await contract.deleteOne();

  res.json({
    success: true,
    message: "Contract deleted successfully",
  });
});

module.exports = {
  createContract,
  createContractFromRequest,
  createContractFromAppointment,
  getAllContracts,
  getMyContracts,
  getContractById,
  updateContract,
  acceptContract,
  updateClientContractNote,
  deleteContract,
};
