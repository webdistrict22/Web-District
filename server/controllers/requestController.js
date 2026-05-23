const WebsiteRequest = require("../models/WebsiteRequest");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create website request
// @route   POST /api/requests
// @access  Public or Client
const createWebsiteRequest = asyncHandler(async (req, res) => {
  const {
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
  } = req.body;

  if (!name || !phone || !email || !websiteType || !projectDetails) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const request = await WebsiteRequest.create({
    client: req.user ? req.user._id : null,
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

  res.status(201).json({
    success: true,
    message: "Website request submitted successfully",
    request,
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
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
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

// @desc    Get single website request
// @route   GET /api/requests/:id
// @access  Admin or owner client
const getWebsiteRequestById = asyncHandler(async (req, res) => {
  const request = await WebsiteRequest.findById(req.params.id).populate(
    "client",
    "name email phone businessName"
  );

  if (!request) {
    res.status(404);
    throw new Error("Website request not found");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    request.client && request.client._id.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error("You are not allowed to view this request");
  }

  res.json({
    success: true,
    request,
  });
});

// @desc    Update website request status/notes
// @route   PUT /api/requests/:id
// @access  Admin
const updateWebsiteRequest = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const request = await WebsiteRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Website request not found");
  }

  if (status !== undefined) request.status = status;
  if (adminNotes !== undefined) request.adminNotes = adminNotes;

  const updatedRequest = await request.save();

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
  getMyWebsiteRequests,
  getAllWebsiteRequests,
  getWebsiteRequestById,
  updateWebsiteRequest,
  deleteWebsiteRequest,
};