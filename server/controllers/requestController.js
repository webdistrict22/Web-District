const WebsiteRequest = require("../models/WebsiteRequest");
const asyncHandler = require("../middleware/asyncHandler");
const {
  cleanText,
  cleanEmail,
  cleanPhone,
} = require("../utils/validation");
const {
  notifyNewWebsiteRequest,
  sendWebsiteRequestConfirmationToClient,
  sendWebsiteRequestStatusToClient,
} = require("../utils/notificationService");

// @desc    Create website request
// @route   POST /api/requests
// @access  Public, optionally logged-in client
const createWebsiteRequest = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const name = cleanText(body.name, "Name", {
    required: true,
    max: 80,
  });
  const businessName = cleanText(body.businessName, "Business name", {
    max: 120,
  });
  const phone = cleanPhone(body.phone, "Phone", { required: true });
  const email = cleanEmail(body.email);
  const websiteType = cleanText(body.websiteType, "Website type", {
    required: true,
    max: 80,
  });
  const hasBrandIdentity =
    body.hasBrandIdentity === undefined
      ? undefined
      : cleanText(body.hasBrandIdentity, "Brand identity status", {
          required: true,
          max: 20,
        });
  const hasContentReady =
    body.hasContentReady === undefined
      ? undefined
      : cleanText(body.hasContentReady, "Content readiness status", {
          required: true,
          max: 20,
        });
  const budgetRange = cleanText(body.budgetRange, "Budget range", {
    max: 120,
  });
  const deadline = cleanText(body.deadline, "Deadline", {
    max: 120,
  });
  const projectDetails = cleanText(
    body.projectDetails,
    "Project details",
    {
      required: true,
      max: 2500,
    }
  );
  const preferredContactMethod =
    body.preferredContactMethod === undefined
      ? undefined
      : cleanText(
          body.preferredContactMethod,
          "Preferred contact method",
          {
            required: true,
            max: 40,
          }
        );

  const websiteRequest = await WebsiteRequest.create({
    client: req.user?._id || null,
    name,
    businessName,
    phone,
    email,
    websiteType,
    hasBrandIdentity,
    hasContentReady,
    budgetRange,
    deadline,
    projectDetails,
    preferredContactMethod,
  });

  notifyNewWebsiteRequest(websiteRequest)
    .then((result) =>
      console.log("[Email] Website request notification:", result)
    )
    .catch((error) => {
      console.error(
        "[Email] Website request notification failed:",
        error.message
      );
    });

  sendWebsiteRequestConfirmationToClient(websiteRequest)
    .then((result) =>
      console.log("[Email] Website request client confirmation:", result)
    )
    .catch((error) => {
      console.error(
        "[Email] Website request client confirmation failed:",
        error.message
      );
    });

  res.status(201).json({
    success: true,
    message: "Website request submitted successfully",
    request: websiteRequest,
  });
});

// @desc    Get all website requests
// @route   GET /api/requests
// @access  Admin
const getAllWebsiteRequests = asyncHandler(async (req, res) => {
  const { status, websiteType, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (websiteType) {
    query.websiteType = websiteType;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { businessName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { projectDetails: { $regex: search, $options: "i" } },
    ];
  }

  const requests = await WebsiteRequest.find(query)
    .populate("client", "name email phone businessName")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});

// @desc    Get my website requests
// @route   GET /api/requests/my
// @access  Client
const getMyWebsiteRequests = asyncHandler(async (req, res) => {
  const requests = await WebsiteRequest.find({ client: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: requests.length,
    requests,
  });
});

// @desc    Get single website request
// @route   GET /api/requests/:id
// @access  Admin
const getWebsiteRequestById = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findById(req.params.id).populate(
    "client",
    "name email phone businessName"
  );

  if (!request) {
    res.status(404);
    throw new Error("Website request not found");
  }

  res.json({
    success: true,
    request,
  });
});

// @desc    Update website request
// @route   PUT /api/requests/:id
// @access  Admin
const updateWebsiteRequest = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const request = await WebsiteRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Website request not found");
  }

  const previousStatus = request.status;

  const allowedFields = [
    "status",
    "adminNotes",
    "name",
    "businessName",
    "phone",
    "email",
    "websiteType",
    "hasBrandIdentity",
    "hasContentReady",
    "budgetRange",
    "deadline",
    "projectDetails",
    "preferredContactMethod",
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      request[field] = body[field];
    }
  });

  const updatedRequest = await request.save();

  if (body.status !== undefined && updatedRequest.status !== previousStatus) {
    sendWebsiteRequestStatusToClient(updatedRequest)
      .then((result) =>
        console.log("[Email] Website request status email:", result)
      )
      .catch((error) => {
        console.error(
          "[Email] Website request status email failed:",
          error.message
        );
      });
  }

  res.json({
    success: true,
    message: "Website request updated successfully",
    request: updatedRequest,
  });
});

// @desc    Delete website request
// @route   DELETE /api/requests/:id
// @access  Admin
const deleteWebsiteRequest = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Website request not found");
  }

  await request.deleteOne();

  res.json({
    success: true,
    message: "Website request deleted successfully",
  });
});

module.exports = {
  createWebsiteRequest,
  getAllWebsiteRequests,
  getMyWebsiteRequests,
  getWebsiteRequestById,
  updateWebsiteRequest,
  deleteWebsiteRequest,
};
