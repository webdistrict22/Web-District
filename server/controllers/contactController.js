const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");
const { notifyContactMessage } = require("../utils/notificationService");

// @desc    Create contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
  });

  notifyContactMessage(contactMessage).catch((error) => {
    console.error("Contact message email notification failed:", error.message);
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    contactMessage,
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
const getAllContactMessages = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: messages.length,
    messages,
  });
});

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Admin
const getContactMessageById = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  res.json({
    success: true,
    message,
  });
});

// @desc    Update contact message status/notes
// @route   PUT /api/contact/:id
// @access  Admin
const updateContactMessage = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  if (status !== undefined) message.status = status;
  if (adminNotes !== undefined) message.adminNotes = adminNotes;

  const updatedMessage = await message.save();

  res.json({
    success: true,
    message: "Contact message updated successfully",
    contactMessage: updatedMessage,
  });
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  await message.deleteOne();

  res.json({
    success: true,
    message: "Contact message deleted successfully",
  });
});

module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
};