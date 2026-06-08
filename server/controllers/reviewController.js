const mongoose = require("mongoose");
const Review = require("../models/Review");
const Contract = require("../models/Contract");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createValidationError,
  cleanText,
  cleanRating,
} = require("../utils/validation");
const {
  notifyReviewSubmitted,
  sendReviewDecisionToClient,
  sendReviewSubmittedConfirmationToClient,
} = require("../utils/notificationService");

const createManualReview = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const name = cleanText(body.name, "Name", {
    required: true,
    max: 80,
  });
  const businessName = cleanText(body.businessName, "Business name", {
    max: 120,
  });
  const role = cleanText(body.role ?? "Client", "Role", {
    max: 80,
  });
  const rating = cleanRating(body.rating);
  const message = cleanText(body.message, "Review message", {
    required: true,
    max: 1200,
  });
  const { status, isVisible } = body;

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
  const body = req.body || {};
  const businessName = cleanText(body.businessName, "Business name", {
    max: 120,
  });
  const role = cleanText(body.role ?? "Client", "Role", {
    max: 80,
  });
  const rating = cleanRating(body.rating);
  const message = cleanText(body.message, "Review message", {
    required: true,
    max: 1200,
  });
  const contractId = cleanText(body.contractId, "Contract ID", {
    max: 64,
  });
  const eligibleStatuses = ["Accepted", "In Progress", "Completed"];

  if (contractId && !mongoose.isValidObjectId(contractId)) {
    throw createValidationError("Contract ID is invalid");
  }

  let contract;

  if (contractId) {
    const existingReview = await Review.findOne({
      client: req.user._id,
      contract: contractId,
    }).select("_id");

    if (existingReview) {
      throw createValidationError(
        "A review has already been submitted for this contract"
      );
    }

    contract = await Contract.findOne({
      _id: contractId,
      client: req.user._id,
      status: { $in: eligibleStatuses },
    }).select("_id");
  } else {
    const reviewedContractIds = await Review.distinct("contract", {
      client: req.user._id,
      contract: { $ne: null },
    });

    contract = await Contract.findOne({
      client: req.user._id,
      status: { $in: eligibleStatuses },
      _id: { $nin: reviewedContractIds },
    })
      .sort({ updatedAt: -1 })
      .select("_id");
  }

  if (!contract) {
    res.status(403);
    throw new Error(
      "You need an eligible contract without an existing review before submitting a review"
    );
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
  const body = req.body || {};
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  const previousStatus = review.status;

  const fields = ["name", "businessName", "role", "rating", "message", "status", "isVisible"];

  fields.forEach((field) => {
    if (body[field] !== undefined) {
      review[field] = body[field];
    }
  });

  const updatedReview = await review.save();

  if (
    body.status !== undefined &&
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
