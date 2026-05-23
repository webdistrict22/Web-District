const CallSlot = require("../models/CallSlot");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Create call slot
// @route   POST /api/slots
// @access  Admin
const createCallSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, notes } = req.body;

  if (!date || !startTime || !endTime) {
    res.status(400);
    throw new Error("Date, start time, and end time are required");
  }

  const slot = await CallSlot.create({
    date,
    startTime,
    endTime,
    notes,
  });

  res.status(201).json({
    success: true,
    message: "Call slot created successfully",
    slot,
  });
});

// @desc    Get public available slots
// @route   GET /api/slots/available
// @access  Public
const getAvailableSlots = asyncHandler(async (req, res) => {
  const slots = await CallSlot.find({
    isActive: true,
    isBooked: false,
  }).sort({ date: 1, startTime: 1 });

  res.json({
    success: true,
    count: slots.length,
    slots,
  });
});

// @desc    Get all slots
// @route   GET /api/slots
// @access  Admin
const getAllSlots = asyncHandler(async (req, res) => {
  const slots = await CallSlot.find().sort({ date: 1, startTime: 1 });

  res.json({
    success: true,
    count: slots.length,
    slots,
  });
});

// @desc    Update call slot
// @route   PUT /api/slots/:id
// @access  Admin
const updateCallSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, isActive, isBooked, notes } = req.body;

  const slot = await CallSlot.findById(req.params.id);

  if (!slot) {
    res.status(404);
    throw new Error("Call slot not found");
  }

  if (date !== undefined) slot.date = date;
  if (startTime !== undefined) slot.startTime = startTime;
  if (endTime !== undefined) slot.endTime = endTime;
  if (isActive !== undefined) slot.isActive = isActive;
  if (isBooked !== undefined) slot.isBooked = isBooked;
  if (notes !== undefined) slot.notes = notes;

  const updatedSlot = await slot.save();

  res.json({
    success: true,
    message: "Call slot updated successfully",
    slot: updatedSlot,
  });
});

// @desc    Delete call slot
// @route   DELETE /api/slots/:id
// @access  Admin
const deleteCallSlot = asyncHandler(async (req, res) => {
  const slot = await CallSlot.findById(req.params.id);

  if (!slot) {
    res.status(404);
    throw new Error("Call slot not found");
  }

  if (slot.isBooked) {
    res.status(400);
    throw new Error("Cannot delete a booked slot");
  }

  await slot.deleteOne();

  res.json({
    success: true,
    message: "Call slot deleted successfully",
  });
});

module.exports = {
  createCallSlot,
  getAvailableSlots,
  getAllSlots,
  updateCallSlot,
  deleteCallSlot,
};