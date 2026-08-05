const mongoose = require("mongoose");
const Review = require("../models/Review");
const Contract = require("../models/Contract");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { createValidationError, cleanText, cleanRating, cleanEnum, cleanSearch, cleanBoolean, escapeRegex } = require("../utils/validation");
const { publicReviewDto } = require("../utils/responseDtos");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const { runIdempotentTransaction } = require("../services/idempotencyService");
const { withMongoTransaction } = require("../services/transactionService");
const { notifyReviewSubmitted, sendReviewDecisionToClient, sendReviewSubmittedConfirmationToClient } = require("../utils/notificationService");

const eligibleContractStatuses = ["Accepted", "In Progress", "Completed"];
const reviewStatuses = ["Pending", "Approved", "Rejected"];

const createManualReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    name: cleanText(req.body?.name, "Name", { required: true, max: 80 }),
    businessName: cleanText(req.body?.businessName, "Business name", { max: 120 }),
    role: cleanText(req.body?.role ?? "Client", "Role", { max: 80 }),
    rating: cleanRating(req.body?.rating),
    message: cleanText(req.body?.message, "Review message", { required: true, max: 1200 }),
    status: cleanEnum(req.body?.status || "Approved", "Status", reviewStatuses, { required: true }),
    isManual: true,
    isVisible: req.body?.isVisible === undefined ? true : Boolean(req.body.isVisible),
  });
  res.status(201).json({ success: true, message: "Manual review created successfully", review });
});

const submitReview = asyncHandler(async (req, res) => {
  const payload = {
    businessName: cleanText(req.body?.businessName, "Business name", { max: 120 }),
    role: cleanText(req.body?.role ?? "Client", "Role", { max: 80 }),
    rating: cleanRating(req.body?.rating),
    message: cleanText(req.body?.message, "Review message", { required: true, max: 1200 }),
    contractId: cleanText(req.body?.contractId, "Contract ID", { max: 24 }),
  };
  if (payload.contractId && !mongoose.isValidObjectId(payload.contractId)) throw createValidationError("Contract ID is invalid");

  const result = await runIdempotentTransaction({
    req, scope: "review:submit", actor: req.user._id, payload,
    work: async (session) => {
      let contract;
      if (payload.contractId) {
        contract = await Contract.findOne({ _id: payload.contractId, client: req.user._id, status: { $in: eligibleContractStatuses }, archivedAt: null }).select("_id").session(session);
      } else {
        const reviewed = await Review.distinct("contract", { client: req.user._id, contract: { $ne: null }, archivedAt: null }, { session });
        contract = await Contract.findOne({ client: req.user._id, status: { $in: eligibleContractStatuses }, archivedAt: null, _id: { $nin: reviewed } }).sort({ updatedAt: -1 }).select("_id").session(session);
      }
      if (!contract) { const error = new Error("You need an eligible unreviewed contract before submitting a review"); error.statusCode = 403; throw error; }
      const [review] = await Review.create([{
        client: req.user._id, contract: contract._id, name: req.user.name,
        businessName: payload.businessName || req.user.businessName, role: payload.role,
        rating: payload.rating, message: payload.message, status: "Pending", isManual: false, isVisible: false,
      }], { session });
      await Promise.all([
        notifyReviewSubmitted(review, { session }),
        sendReviewSubmittedConfirmationToClient(review, req.user.email, { session }),
      ]);
      return { review: review.toObject(), notificationStatus: "queued" };
    },
  });
  res.status(result.replayed ? 200 : 201).json({ success: true, message: "Review submitted and waiting for approval", ...result });
});

const getPublicReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ status: "Approved", isVisible: true, archivedAt: null }).sort({ createdAt: -1 }).limit(100).lean();
  const publicReviews = reviews.map(publicReviewDto);
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ success: true, count: publicReviews.length, reviews: publicReviews });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status", "rating"] });
  const query = { archivedAt: null };
  if (req.query.status) query.status = cleanEnum(req.query.status, "Status", reviewStatuses, { required: true });
  if (req.query.visibility !== undefined) query.isVisible = cleanBoolean(req.query.visibility, "Visibility");
  const search = cleanSearch(req.query.search);
  if (search) {
    const safe = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: safe }, { businessName: safe }, { role: safe }, { message: safe }];
  }
  const [reviews, total] = await Promise.all([
    Review.find(query).populate("client", "name email phone businessName").sort(sort).skip(skip).limit(limit).lean(),
    Review.countDocuments(query),
  ]);
  res.json({ success: true, data: reviews, reviews, count: reviews.length, pagination: paginationMeta({ page, limit, total }) });
});

const updateReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await withMongoTransaction(async (session) => {
    const review = await Review.findOne({ _id: id, archivedAt: null }).session(session);
    if (!review) { const error = new Error("Review not found"); error.statusCode = 404; throw error; }
    const previousStatus = review.status;
    if (req.body.name !== undefined) review.name = cleanText(req.body.name, "Name", { required: true, max: 80 });
    if (req.body.businessName !== undefined) review.businessName = cleanText(req.body.businessName, "Business name", { max: 120 });
    if (req.body.role !== undefined) review.role = cleanText(req.body.role, "Role", { max: 80 });
    if (req.body.rating !== undefined) review.rating = cleanRating(req.body.rating);
    if (req.body.message !== undefined) review.message = cleanText(req.body.message, "Review message", { required: true, max: 1200 });
    if (req.body.status !== undefined) review.status = cleanEnum(req.body.status, "Status", reviewStatuses, { required: true });
    if (req.body.isVisible !== undefined) review.isVisible = Boolean(req.body.isVisible);
    await review.save({ session });
    let notificationStatus = "not-required";
    if (review.status !== previousStatus && review.client) {
      const client = await User.findById(review.client).select("email").session(session).lean();
      if (client?.email) { await sendReviewDecisionToClient(review, client.email, { session }); notificationStatus = "queued"; }
    }
    return { review: review.toObject(), notificationStatus };
  });
  res.json({ success: true, message: "Review updated successfully", ...result });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, archivedAt: null },
    { $set: { archivedAt: new Date(), isVisible: false } },
    { new: true }
  );
  if (!review) { res.status(404); throw new Error("Review not found"); }
  res.json({ success: true, message: "Review archived successfully" });
});

module.exports = { createManualReview, submitReview, getPublicReviews, getAllReviews, updateReview, deleteReview, eligibleContractStatuses };
