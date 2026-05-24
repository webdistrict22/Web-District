const User = require("../models/User");
const WebsiteRequest = require("../models/WebsiteRequest");
const Appointment = require("../models/Appointment");
const CallSlot = require("../models/CallSlot");
const ContactMessage = require("../models/ContactMessage");
const Review = require("../models/Review");
const Project = require("../models/Project");
const Package = require("../models/Package");
const FAQ = require("../models/FAQ");
const Contract = require("../models/Contract");
const asyncHandler = require("../middleware/asyncHandler");

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalClients,
    totalRequests,
    newRequests,
    inProgressRequests,
    completedRequests,
    totalAppointments,
    pendingAppointments,
    acceptedAppointments,
    doneAppointments,
    totalSlots,
    availableSlots,
    bookedSlots,
    totalMessages,
    newMessages,
    repliedMessages,
    totalContracts,
    sentContracts,
    activeContracts,
    completedContracts,
    totalReviews,
    pendingReviews,
    approvedReviews,
    visibleReviews,
    totalProjects,
    visibleProjects,
    featuredProjects,
    totalPackages,
    visiblePackages,
    totalFAQs,
    visibleFAQs,
  ] = await Promise.all([
    User.countDocuments({ role: "client" }),

    WebsiteRequest.countDocuments(),
    WebsiteRequest.countDocuments({ status: "New" }),
    WebsiteRequest.countDocuments({ status: "In Progress" }),
    WebsiteRequest.countDocuments({ status: "Completed" }),

    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "Pending" }),
    Appointment.countDocuments({ status: "Accepted" }),
    Appointment.countDocuments({ status: "Done" }),

    CallSlot.countDocuments(),
    CallSlot.countDocuments({ isActive: true, isBooked: false }),
    CallSlot.countDocuments({ isBooked: true }),

    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "New" }),
    ContactMessage.countDocuments({ status: "Replied" }),

    Contract.countDocuments(),
    Contract.countDocuments({ status: "Sent" }),
    Contract.countDocuments({ status: "In Progress" }),
    Contract.countDocuments({ status: "Completed" }),

    Review.countDocuments(),
    Review.countDocuments({ status: "Pending" }),
    Review.countDocuments({ status: "Approved" }),
    Review.countDocuments({ isVisible: true }),

    Project.countDocuments(),
    Project.countDocuments({ isVisible: true }),
    Project.countDocuments({ isFeatured: true }),

    Package.countDocuments(),
    Package.countDocuments({ isVisible: true }),

    FAQ.countDocuments(),
    FAQ.countDocuments({ isVisible: true }),
  ]);

  const latestRequests = await WebsiteRequest.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name businessName websiteType status createdAt");

  const latestAppointments = await Appointment.find()
    .populate("slot")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name businessName topic status slot createdAt");

  const latestMessages = await ContactMessage.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email subject status createdAt");

  const latestContracts = await Contract.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title clientName businessName websiteType status totalPrice createdAt");

  res.json({
    success: true,
    stats: {
      clients: {
        total: totalClients,
      },
      requests: {
        total: totalRequests,
        new: newRequests,
        inProgress: inProgressRequests,
        completed: completedRequests,
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        accepted: acceptedAppointments,
        done: doneAppointments,
      },
      slots: {
        total: totalSlots,
        available: availableSlots,
        booked: bookedSlots,
      },
      messages: {
        total: totalMessages,
        new: newMessages,
        replied: repliedMessages,
      },
      contracts: {
        total: totalContracts,
        sent: sentContracts,
        active: activeContracts,
        completed: completedContracts,
      },
      reviews: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        visible: visibleReviews,
      },
      projects: {
        total: totalProjects,
        visible: visibleProjects,
        featured: featuredProjects,
      },
      packages: {
        total: totalPackages,
        visible: visiblePackages,
      },
      faqs: {
        total: totalFAQs,
        visible: visibleFAQs,
      },
    },
    latest: {
      requests: latestRequests,
      appointments: latestAppointments,
      messages: latestMessages,
      contracts: latestContracts,
    },
  });
});

module.exports = {
  getAdminDashboardStats,
};