const User = require("../models/User");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all clients
// @route   GET /api/users/clients
// @access  Admin
const getAllClients = asyncHandler(async (req, res) => {
  const { search, status } = req.query;

  const query = {
    role: "client",
  };

  if (status === "Active") {
    query.isActive = true;
  }

  if (status === "Disabled") {
    query.isActive = false;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { businessName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const clients = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 });

  const clientsWithCounts = await Promise.all(
    clients.map(async (client) => {
      const [requestsCount, appointmentsCount, reviewsCount] = await Promise.all([
        WebsiteRequest.countDocuments({ client: client._id }),
        Appointment.countDocuments({ client: client._id }),
        Review.countDocuments({ client: client._id }),
      ]);

      return {
        ...client.toObject(),
        counts: {
          requests: requestsCount,
          appointments: appointmentsCount,
          reviews: reviewsCount,
        },
      };
    })
  );

  res.json({
    success: true,
    count: clientsWithCounts.length,
    clients: clientsWithCounts,
  });
});

// @desc    Get client details
// @route   GET /api/users/clients/:id
// @access  Admin
const getClientById = asyncHandler(async (req, res) => {
  const client = await User.findOne({
    _id: req.params.id,
    role: "client",
  }).select("-password");

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  const [requests, appointments, reviews] = await Promise.all([
    WebsiteRequest.find({ client: client._id }).sort({ createdAt: -1 }),
    Appointment.find({ client: client._id })
      .populate("slot")
      .sort({ createdAt: -1 }),
    Review.find({ client: client._id }).sort({ createdAt: -1 }),
  ]);

  res.json({
    success: true,
    client,
    activity: {
      requests,
      appointments,
      reviews,
    },
  });
});

// @desc    Update client status
// @route   PUT /api/users/clients/:id/status
// @access  Admin
const updateClientStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const client = await User.findOne({
    _id: req.params.id,
    role: "client",
  }).select("-password");

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  if (typeof isActive !== "boolean") {
    res.status(400);
    throw new Error("isActive must be true or false");
  }

  client.isActive = isActive;

  const updatedClient = await client.save();

  res.json({
    success: true,
    message: updatedClient.isActive
      ? "Client account activated successfully"
      : "Client account disabled successfully",
    client: updatedClient,
  });
});

module.exports = {
  getAllClients,
  getClientById,
  updateClientStatus,
};