const Appointment = require("../models/Appointment");
const CallSlot = require("../models/CallSlot");
const asyncHandler = require("../middleware/asyncHandler");

const {
  notifyNewAppointment,
  sendAppointmentConfirmationToClient,
  sendAppointmentStatusToClient,
} = require("../utils/notificationService");

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Public, optionally logged-in client
const createAppointment = asyncHandler(async (req, res) => {
  const { slot, name, businessName, phone, email, topic, notes } = req.body;

  if (!slot || !name || !phone || !email || !topic) {
    res.status(400);
    throw new Error("Slot, name, phone, email, and topic are required");
  }

  const selectedSlot = await CallSlot.findOneAndUpdate(
    {
      _id: slot,
      isActive: true,
      isBooked: false,
    },
    {
      isBooked: true,
    },
    {
      new: true,
    }
  );

  if (!selectedSlot) {
    const existingSlot = await CallSlot.findById(slot);

    if (!existingSlot) {
      res.status(404);
      throw new Error("Selected slot not found");
    }

    res.status(400);
    throw new Error(
      existingSlot.isBooked
        ? "This slot is already booked"
        : "This slot is not active"
    );
  }

  let appointment;

  try {
    appointment = await Appointment.create({
      client: req.user?._id || null,
      slot: selectedSlot._id,
      name,
      businessName,
      phone,
      email,
      topic,
      notes,
    });
  } catch (error) {
    await CallSlot.findByIdAndUpdate(selectedSlot._id, {
      isBooked: false,
    });

    throw error;
  }

  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate("slot")
    .populate("client", "name email phone businessName");

  notifyNewAppointment(populatedAppointment).catch((error) => {
    console.error("Appointment owner email notification failed:", error.message);
  });

  sendAppointmentConfirmationToClient(populatedAppointment).catch((error) => {
    console.error("Appointment client email confirmation failed:", error.message);
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment: populatedAppointment,
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
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
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

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Admin
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("slot")
    .populate("client", "name email phone businessName");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
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
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  const previousStatus = appointment.status;

  const allowedFields = [
    "status",
    "adminNotes",
    "notes",
    "name",
    "businessName",
    "phone",
    "email",
    "topic",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      appointment[field] = req.body[field];
    }
  });

  const updatedAppointment = await appointment.save();

  const populatedAppointment = await Appointment.findById(updatedAppointment._id)
    .populate("slot")
    .populate("client", "name email phone businessName");

  if (
    req.body.status !== undefined &&
    populatedAppointment.status !== previousStatus
  ) {
    sendAppointmentStatusToClient(populatedAppointment).catch((error) => {
      console.error("Appointment status email failed:", error.message);
    });
  }

  res.json({
    success: true,
    message: "Appointment updated successfully",
    appointment: populatedAppointment,
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Admin
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.slot) {
    await CallSlot.findByIdAndUpdate(appointment.slot, {
      isBooked: false,
    });
  }

  await appointment.deleteOne();

  res.json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

module.exports = {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
