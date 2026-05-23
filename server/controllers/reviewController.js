const Review = require("../models/Review");
const asyncHandler = require("../middleware/asyncHandler");

const createManualReview = asyncHandler(async (req, res) => {
  const { name, businessName, role, rating, message, status, isVisible } = req.body;

  if (!name || !message) {
    res.status(400);
    throw new Error("Name and review message are required");
  }

  const review = await Review.create({
    name,
    businessName,
    role,
    rating,
    message,
    status: status || "Approved",
    isManual: true,
    isVisible: isVisible !== undefined ? isVisible : true,
  });

  res.status(201).json({
    success: true,
    message: "Manual review created successfully",
    review,
  });
});

const submitReview = asyncHandler(async (req, res) => {
  const { businessName, role, rating, message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Review message is required");
  }

  const review = await Review.create({
    client: req.user._id,
    name: req.user.name,
    businessName: businessName || req.user.businessName,
    role,
    rating,
    message,
    status: "Pending",
    isManual: false,
  });

  res.status(201).json({
    success: true,
    message: "Review submitted and waiting for approval",
    review,
  });
});

const getPublicReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    status: "Approved",
    isVisible: true,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("client", "name email phone businessName")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const fields = ["name", "businessName", "role", "rating", "message", "status", "isVisible"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      review[field] = req.body[field];
    }
  });

  const updatedReview = await review.save();

  res.json({
    success: true,
    message: "Review updated successfully",
    review: updatedReview,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  await review.deleteOne();

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

module.exports = {
  createManualReview,
  submitReview,
  getPublicReviews,
  getAllReviews,
  updateReview,
  deleteReview,
};