const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const CallSlot = require("../models/CallSlot");
const asyncHandler = require("../middleware/asyncHandler");
const { cleanText, cleanEmail, cleanPhone, cleanSearch, cleanEnum, cleanObjectId, escapeRegex } = require("../utils/validation");
const { parsePagination, paginationMeta } = require("../utils/pagination");
const { bookingWindowEnd, isFutureSlot } = require("../utils/slotTime");
const { runIdempotentTransaction } = require("../services/idempotencyService");
const { withMongoTransaction } = require("../services/transactionService");
const { notifyNewAppointment, sendAppointmentConfirmationToClient, sendAppointmentStatusToClient } = require("../utils/notificationService");

const statuses = ["Pending", "Accepted", "Cancelled", "Rescheduled", "Done"];
const holdingStatuses = new Set(["Pending", "Accepted", "Done"]);

const parsePayload = (body = {}) => ({
  slot: cleanObjectId(body.slot, "Slot"),
  name: cleanText(body.name, "Name", { required: true, max: 80 }),
  businessName: cleanText(body.businessName, "Business name", { max: 120 }),
  phone: cleanPhone(body.phone, "Phone", { required: true }),
  email: cleanEmail(body.email),
  topic: cleanText(body.topic, "Discussion topic", { required: true, max: 160 }),
  notes: cleanText(body.notes, "Notes", { max: 500 }),
});

const createAppointment = asyncHandler(async (req, res) => {
  const payload = parsePayload(req.body);
  const result = await runIdempotentTransaction({
    req, scope: "appointment:create", actor: req.user?._id || payload.email, payload,
    work: async (session) => {
      const appointmentId = new mongoose.Types.ObjectId();
      const now = new Date();
      const selectedSlot = await CallSlot.findOneAndUpdate(
        { _id: payload.slot, isActive: true, isBooked: false, bookedBy: null, startsAt: { $gt: now, $lte: bookingWindowEnd(now) } },
        { $set: { isBooked: true, bookedBy: appointmentId } },
        { new: true, session }
      );
      if (!selectedSlot) {
        const existing = await CallSlot.findById(payload.slot).session(session);
        const error = new Error(!existing ? "Selected slot not found" : !isFutureSlot(existing) ? "This slot is in the past and can no longer be booked" : existing.isBooked ? "This slot is already booked" : "This slot is not available");
        error.statusCode = existing ? 409 : 404;
        throw error;
      }
      const [appointment] = await Appointment.create([{
        _id: appointmentId, client: req.user?._id || null, ...payload,
        slot: selectedSlot._id, holdsSlot: true, slotReleased: false,
      }], { session });
      const appointmentForEmail = { ...appointment.toObject(), slot: selectedSlot.toObject() };
      await Promise.all([
        notifyNewAppointment(appointmentForEmail, { session }),
        sendAppointmentConfirmationToClient(appointmentForEmail, { session }),
      ]);
      return { appointment: appointmentForEmail, notificationStatus: "queued" };
    },
  });
  res.status(result.replayed ? 200 : 201).json({ success: true, message: "Appointment booked successfully", ...result });
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status", "name"] });
  const query = { archivedAt: null };
  if (req.query.includeArchived === "true") delete query.archivedAt;
  if (req.query.status) query.status = cleanEnum(req.query.status, "Status", statuses, { required: true });
  const search = cleanSearch(req.query.search);
  if (search) query.$or = ["name", "businessName", "phone", "email", "topic"].map((field) => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));
  const [appointments, total] = await Promise.all([
    Appointment.find(query).populate("slot").populate("client", "name email phone businessName").sort(sort).skip(skip).limit(limit).lean(),
    Appointment.countDocuments(query),
  ]);
  res.json({ success: true, data: appointments, appointments, count: appointments.length, pagination: paginationMeta({ page, limit, total }) });
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePagination(req.query, { sortFields: ["createdAt", "updatedAt", "status"] });
  const query = { client: req.user._id, archivedAt: null };
  const [appointments, total] = await Promise.all([
    Appointment.find(query).populate("slot").sort(sort).skip(skip).limit(limit).lean(),
    Appointment.countDocuments(query),
  ]);
  res.json({ success: true, data: appointments, appointments, count: appointments.length, pagination: paginationMeta({ page, limit, total }) });
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate("slot").populate("client", "name email phone businessName");
  if (!appointment) { res.status(404); throw new Error("Appointment not found"); }
  res.json({ success: true, appointment });
});

const updateAppointment = asyncHandler(async (req, res) => {
  const result = await withMongoTransaction(async (session) => {
    const appointment = await Appointment.findOne({ _id: req.params.id, archivedAt: null }).select("+slotReleased").session(session);
    if (!appointment) { const error = new Error("Appointment not found"); error.statusCode = 404; throw error; }
    const previousStatus = appointment.status;
    const nextStatus = req.body.status === undefined ? previousStatus : cleanEnum(req.body.status, "Status", statuses, { required: true });
    const wasHolding = Boolean(appointment.holdsSlot);
    const willHold = holdingStatuses.has(nextStatus);

    if (wasHolding && !willHold) {
      await CallSlot.updateOne(
        { _id: appointment.slot, $or: [{ bookedBy: appointment._id }, { bookedBy: null }] },
        { $set: { isBooked: false, bookedBy: null } },
        { session }
      );
      appointment.holdsSlot = false;
      appointment.slotReleased = true;
    } else if (!wasHolding && willHold) {
      const reclaimed = await CallSlot.findOneAndUpdate(
        { _id: appointment.slot, isActive: true, isBooked: false, bookedBy: null },
        { $set: { isBooked: true, bookedBy: appointment._id } },
        { new: true, session }
      );
      if (!reclaimed) { const error = new Error("The original slot is now held by another appointment"); error.statusCode = 409; error.code = "SLOT_RECLAIM_CONFLICT"; throw error; }
      appointment.holdsSlot = true;
      appointment.slotReleased = false;
    }

    const textFields = { adminNotes: 1500, notes: 500, name: 80, businessName: 120, topic: 160 };
    for (const [field, max] of Object.entries(textFields)) if (req.body[field] !== undefined) appointment[field] = cleanText(req.body[field], field, { max });
    if (req.body.phone !== undefined) appointment.phone = cleanPhone(req.body.phone, "Phone", { required: true });
    if (req.body.email !== undefined) appointment.email = cleanEmail(req.body.email);
    appointment.status = nextStatus;
    if (nextStatus !== previousStatus) appointment.statusVersion += 1;
    await appointment.save({ session });
    const slot = await CallSlot.findById(appointment.slot).session(session).lean();
    const forEmail = { ...appointment.toObject(), slot };
    if (nextStatus !== previousStatus) await sendAppointmentStatusToClient(forEmail, { session });
    return { appointmentId: appointment._id, notificationStatus: nextStatus !== previousStatus ? "queued" : "not-required" };
  });
  const appointment = await Appointment.findById(result.appointmentId).populate("slot").populate("client", "name email phone businessName");
  res.json({ success: true, message: "Appointment updated successfully", appointment, notificationStatus: result.notificationStatus });
});

const deleteAppointment = asyncHandler(async (req, res) => {
  await withMongoTransaction(async (session) => {
    const appointment = await Appointment.findOne({ _id: req.params.id, archivedAt: null }).select("+slotReleased").session(session);
    if (!appointment) { const error = new Error("Appointment not found"); error.statusCode = 404; throw error; }
    if (appointment.holdsSlot) {
      await CallSlot.updateOne({ _id: appointment.slot, bookedBy: appointment._id }, { $set: { isBooked: false, bookedBy: null } }, { session });
    }
    appointment.holdsSlot = false;
    appointment.slotReleased = true;
    appointment.archivedAt = new Date();
    appointment.archivedBy = req.user._id;
    appointment.archiveReason = cleanText(req.body?.archiveReason, "Archive reason", { max: 500 }) || "Archived by admin";
    await appointment.save({ session });
  });
  res.json({ success: true, message: "Appointment archived successfully" });
});

module.exports = { createAppointment, getAllAppointments, getMyAppointments, getAppointmentById, updateAppointment, deleteAppointment, holdingStatuses };
