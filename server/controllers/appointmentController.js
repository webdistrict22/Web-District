const Appointment = require("../models/Appointment");
const CallSlot = require("../models/CallSlot");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Book call appointment
// @route   POST /api/appointments
// @access  Public or Client
const bookAppointment = asyncHandler(async (req, res) => {
  const { slot, name, businessName, phone, email, topic, notes } = req.body;

  if (!slot || !name || !phone || !email || !topic) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const selectedSlot = await CallSlot.findById(slot);

  if (!selectedSlot) {
    res.status(404);
    throw new Error("Selected slot not found");
  }

  if (!selectedSlot.isActive) {
    res.status(400);
    throw new Error("This slot is not available");
  }

  if (selectedSlot.isBooked) {
    res.status(400);
    throw new Error("This slot is already booked");
  }

  const appointment = await Appointment.create({
    client: req.user ? req.user._id : null,
    slot,
    name,
    businessName,
    phone,
    email,
    topic,
    notes,
  });

  selectedSlot.isBooked = true;
  await selectedSlot.save();

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate("slot")
    .populate("client", "name email phone businessName");

  res.status(201).json({
    success: true,
    message: "Call appointment booked successfully",
    appointment: populatedAppointment,
  });
});

// @desc    Get my appointments
// @route   GET /api/appointments/my
// @access  Client
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ client: req.user._id })
    .populate("slot")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { businessName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { topic: { $regex: search, $options: "i" } },
    ];
  }

  const appointments = await Appointment.find(query)
    .populate("slot")
    .populate("client", "name email phone businessName")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: appointments.length,
    appointments,
  });
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Admin or owner client
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("slot")
    .populate("client", "name email phone businessName");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner =
    appointment.client &&
    appointment.client._id.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error("You are not allowed to view this appointment");
  }

  res.json({
    success: true,
    appointment,
  });
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Admin
const updateAppointment = asyncHandler(async (req, res) => {
  const { status, adminNotes, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id).populate("slot");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (status !== undefined) appointment.status = status;
  if (adminNotes !== undefined) appointment.adminNotes = adminNotes;
  if (notes !== undefined) appointment.notes = notes;

  const updatedAppointment = await appointment.save();

  res.json({
    success: true,
    message: "Appointment updated successfully",
    appointment: updatedAppointment,
  });
});

// @desc    Cancel appointment and free slot
// @route   DELETE /api/appointments/:id
// @access  Admin
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const slot = await CallSlot.findById(appointment.slot);

  if (slot) {
    slot.isBooked = false;
    await slot.save();
  }

  await appointment.deleteOne();

  res.json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};