const Contract = require("../models/Contract");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const asyncHandler = require("../middleware/asyncHandler");
const { cleanText } = require("../utils/validation");
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

const syncRequestContractSentStatus = async (contract) => {
  if (!contract.request || contract.status === "Draft") return;

  await WebsiteRequest.findOneAndUpdate(
    {
      _id: contract.request,
      status: { $nin: ["Contract Sent", "Completed"] },
    },
    {
      status: "Contract Sent",
    }
  );
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

  await syncRequestContractSentStatus(contract);

  if (shouldNotifyClientAboutContract(contract)) {
    sendContractToClient(contract)
      .then((result) => console.log("[Email] Contract client email:", result))
      .catch((error) => {
        console.error("[Email] Contract client email failed:", error.message);
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

  await syncRequestContractSentStatus(contract);

  if (shouldNotifyClientAboutContract(contract)) {
    sendContractToClient(contract)
      .then((result) => console.log("[Email] Contract client email:", result))
      .catch((error) => {
        console.error("[Email] Contract client email failed:", error.message);
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
    sendContractToClient(contract)
      .then((result) => console.log("[Email] Contract client email:", result))
      .catch((error) => {
        console.error("[Email] Contract client email failed:", error.message);
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
  const contracts = await Contract.find({
    client: req.user._id,
    status: { $ne: "Draft" },
  }).sort({ createdAt: -1 });

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

  if (!isAdmin && contract.status === "Draft") {
    res.status(404);
    throw new Error("Contract not found");
  }

  res.json({
    success: true,
    contract,
  });
});

const updateContract = asyncHandler(async (req, res) => {
  const body = req.body || {};
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
    if (body[field] !== undefined) {
      contract[field] = body[field];
    }
  });

  if (body.pagesIncluded !== undefined) {
    contract.pagesIncluded = textArray(body.pagesIncluded);
  }

  if (body.featuresIncluded !== undefined) {
    contract.featuresIncluded = textArray(body.featuresIncluded);
  }

  const updatedContract = await contract.save();

  await syncRequestContractSentStatus(updatedContract);

  if (
    body.status !== undefined &&
    updatedContract.status !== previousStatus &&
    shouldNotifyClientAboutContract(updatedContract)
  ) {
    const notifier =
      previousStatus === "Draft" && updatedContract.status === "Sent"
        ? sendContractToClient
        : sendContractStatusToClient;

    notifier(updatedContract)
      .then((result) => console.log("[Email] Contract status email:", result))
      .catch((error) => {
        console.error("[Email] Contract status email failed:", error.message);
      });
  }

  res.json({
    success: true,
    message: "Contract updated successfully",
    contract: updatedContract,
  });
});

const acceptContract = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  if (!contract.client || contract.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not allowed to accept this contract");
  }

  if (contract.status !== "Sent") {
    res.status(400);
    throw new Error("Only sent contracts can be accepted");
  }

  const clientNotes =
    body.clientNotes === undefined
      ? undefined
      : cleanText(body.clientNotes, "Client note", {
          max: 1500,
        });

  const updates = {
    status: "Accepted",
  };

  if (clientNotes !== undefined) {
    updates.clientNotes = clientNotes;
  }

  const updatedContract = await Contract.findOneAndUpdate(
    {
      _id: contract._id,
      client: req.user._id,
      status: "Sent",
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedContract) {
    res.status(400);
    throw new Error("Only sent contracts can be accepted");
  }

  notifyContractAccepted(updatedContract)
    .then((result) =>
      console.log("[Email] Contract accepted notification:", result)
    )
    .catch((error) => {
      console.error(
        "[Email] Contract accepted notification failed:",
        error.message
      );
    });

  sendContractAcceptedToClient(updatedContract)
    .then((result) =>
      console.log("[Email] Contract accepted client email:", result)
    )
    .catch((error) => {
      console.error(
        "[Email] Contract accepted client email failed:",
        error.message
      );
    });

  res.json({
    success: true,
    message: "Contract accepted successfully",
    contract: updatedContract,
  });
});

const updateClientContractNote = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const contract = await Contract.findById(req.params.id);

  if (!contract) {
    res.status(404);
    throw new Error("Contract not found");
  }

  if (!contract.client || contract.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not allowed to update this contract");
  }

  if (contract.status === "Draft") {
    res.status(404);
    throw new Error("Contract not found");
  }

  const clientNotes = cleanText(body.clientNotes, "Client note", {
    max: 1500,
  });

  contract.clientNotes = clientNotes;

  const updatedContract = await contract.save();

  notifyContractClientNote(updatedContract)
    .then((result) =>
      console.log("[Email] Contract client note notification:", result)
    )
    .catch((error) => {
      console.error(
        "[Email] Contract client note notification failed:",
        error.message
      );
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
