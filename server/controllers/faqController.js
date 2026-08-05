const FAQ = require("../models/FAQ");
const asyncHandler = require("../middleware/asyncHandler");
const { publicFaqDto } = require("../utils/responseDtos");
const { parsePagination, paginationMeta } = require("../utils/pagination");

const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer, category, order, isVisible } = req.body;

  if (!question || !answer) {
    res.status(400);
    throw new Error("Question and answer are required");
  }

  const faq = await FAQ.create({
    question,
    answer,
    category,
    order,
    isVisible,
  });

  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    faq,
  });
});

const getPublicFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({ isVisible: true }).sort({ order: 1, createdAt: -1 }).limit(100).lean();
  const publicFaqs = faqs.map(publicFaqDto);

  res.json({
    success: true,
    count: publicFaqs.length,
    faqs: publicFaqs,
  });
});

const getAllFAQs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query, { defaultLimit: 50, sortFields: ["createdAt"] });
  const [faqs, total] = await Promise.all([
    FAQ.find().sort({ order: 1, createdAt: -1, _id: 1 }).skip(skip).limit(limit).lean(),
    FAQ.countDocuments(),
  ]);

  res.json({
    success: true,
    count: faqs.length,
    data: faqs,
    faqs,
    pagination: paginationMeta({ page, limit, total }),
  });
});

const updateFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    res.status(404);
    throw new Error("FAQ not found");
  }

  const fields = ["question", "answer", "category", "order", "isVisible"];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      faq[field] = req.body[field];
    }
  });

  const updatedFAQ = await faq.save();

  res.json({
    success: true,
    message: "FAQ updated successfully",
    faq: updatedFAQ,
  });
});

const deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);

  if (!faq) {
    res.status(404);
    throw new Error("FAQ not found");
  }

  await faq.deleteOne();

  res.json({
    success: true,
    message: "FAQ deleted successfully",
  });
});

module.exports = {
  createFAQ,
  getPublicFAQs,
  getAllFAQs,
  updateFAQ,
  deleteFAQ,
};
