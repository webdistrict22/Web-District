const Review = require("../models/Review");
const Contract = require("../models/Contract");
const asyncHandler = require("../middleware/asyncHandler");
const {
  notifyReviewSubmitted,
  sendReviewDecisionToClient,
  sendReviewSubmittedConfirmationToClient,
} = require("../utils/notificationService");

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

  const contract = await Contract.findOne({ client: req.user._id }).select(
    "_id"
  );

  if (!contract) {
    res.status(403);
    throw new Error("You need at least one contract before submitting a review");
  }

  const review = await Review.create({
    client: req.user._id,
    contract: contract._id,
    name: req.user.name,
    businessName: businessName || req.user.businessName,
    role,
    rating,
    message,
    status: "Pending",
    isManual: false,
    isVisible: false,
  });

  notifyReviewSubmitted(review).catch((error) => {
    console.error("Review owner email notification failed:", error.message);
  });

  sendReviewSubmittedConfirmationToClient(review, req.user.email).catch(
    (error) => {
      console.error("Review client email failed:", error.message);
    }
  );

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

  const previousStatus = review.status;

  const fields = ["name", "businessName", "role", "rating", "message", "status", "isVisible"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      review[field] = req.body[field];
    }
  });

  const updatedReview = await review.save();

  if (
    req.body.status !== undefined &&
    updatedReview.status !== previousStatus &&
    updatedReview.client
  ) {
    const populatedReview = await Review.findById(updatedReview._id).populate(
      "client",
      "email"
    );

    if (populatedReview?.client?.email) {
      sendReviewDecisionToClient(updatedReview, populatedReview.client.email).catch(
        (error) => {
          console.error("Review decision email failed:", error.message);
        }
      );
    }
  }

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
