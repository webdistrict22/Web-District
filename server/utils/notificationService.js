const sendEmail = require("./sendEmail");
const { enqueueEmail } = require("../services/outboxService");
const { renderEmailTemplate } = require("./emailTemplates");
const { formatSlotDisplay } = require("./slotTime");

const ownerEmail = () => String(process.env.OWNER_EMAIL || process.env.EMAIL_USER || "").trim();
const rows = (entries) => entries.map(([label, value]) => ({ label, value }));
const slotLabel = (slot) => formatSlotDisplay(slot);

const queue = (event, options) => enqueueEmail(event, options);

const notifyNewClientSignup = (user, options) => queue({
  eventType: "account.signup", idempotencyKey: `user:${user._id}:owner-signup`, relatedEntityType: "User", relatedEntityId: user._id,
  recipientType: "owner", recipient: ownerEmail(), template: "account.signup-owner",
  templatePayload: { name: user.name, businessName: user.businessName }, priority: 7,
}, options);

const queueVerificationEmail = (user, token, version, options) => queue({
  eventType: "account.verification", idempotencyKey: `verification:${user._id}:${version}`, relatedEntityType: "User", relatedEntityId: user._id,
  recipientType: "client", recipient: user.email, template: "account.verification", templatePayload: { name: user.name }, priority: 10,
  sensitivePayload: { token },
}, options);

const sendWelcomeEmailToClient = (user, options) => queue({
  eventType: "account.welcome", idempotencyKey: `user:${user._id}:welcome:${user.emailVerificationVersion || 1}`, relatedEntityType: "User", relatedEntityId: user._id,
  recipientType: "client", recipient: user.email, template: "account.welcome", templatePayload: { name: user.name, businessName: user.businessName }, priority: 7,
}, options);

const notifyNewWebsiteRequest = (request, options) => queue({
  eventType: "request.created.owner", idempotencyKey: `request:${request._id}:owner-created`, relatedEntityType: "WebsiteRequest", relatedEntityId: request._id,
  recipientType: "owner", recipient: ownerEmail(), template: "request.owner-created", priority: 8,
  templatePayload: { name: request.name, businessName: request.businessName, rows: rows([["Name", request.name], ["Business", request.businessName], ["Phone", request.phone], ["Email", request.email], ["Website type", request.websiteType], ["Budget", request.budgetRange], ["Deadline", request.deadline], ["Project details", request.projectDetails]]) },
}, options);

const sendWebsiteRequestConfirmationToClient = (request, options) => queue({
  eventType: "request.created.client", idempotencyKey: `request:${request._id}:customer-confirmation`, relatedEntityType: "WebsiteRequest", relatedEntityId: request._id,
  recipientType: "client", recipient: request.email, template: "request.client-confirmation",
  templatePayload: { rows: rows([["Name", request.name], ["Business", request.businessName], ["Website type", request.websiteType], ["Preferred contact", request.preferredContactMethod]]) },
}, options);

const sendWebsiteRequestStatusToClient = (request, version, options) => queue({
  eventType: "request.status", idempotencyKey: `request:${request._id}:status:${request.status}:${version}`, relatedEntityType: "WebsiteRequest", relatedEntityId: request._id,
  recipientType: "client", recipient: request.email, template: "request.client-status", templatePayload: { status: request.status, rows: rows([["Website type", request.websiteType], ["Status", request.status], ["Admin note", request.adminNotes]]) },
}, options);

const notifyNewAppointment = (appointment, options) => queue({
  eventType: "appointment.created.owner", idempotencyKey: `appointment:${appointment._id}:owner-created`, relatedEntityType: "Appointment", relatedEntityId: appointment._id,
  recipientType: "owner", recipient: ownerEmail(), template: "appointment.owner-created", priority: 8,
  templatePayload: { name: appointment.name, businessName: appointment.businessName, rows: rows([["Name", appointment.name], ["Business", appointment.businessName], ["Phone", appointment.phone], ["Email", appointment.email], ["Topic", appointment.topic], ["Notes", appointment.notes], ["Slot", slotLabel(appointment.slot)]]) },
}, options);

const sendAppointmentConfirmationToClient = (appointment, options) => queue({
  eventType: "appointment.created.client", idempotencyKey: `appointment:${appointment._id}:customer-confirmation`, relatedEntityType: "Appointment", relatedEntityId: appointment._id,
  recipientType: "client", recipient: appointment.email, template: "appointment.client-confirmation",
  templatePayload: { rows: rows([["Name", appointment.name], ["Business", appointment.businessName], ["Topic", appointment.topic], ["Slot", slotLabel(appointment.slot)]]) },
}, options);

const sendAppointmentStatusToClient = (appointment, options) => queue({
  eventType: "appointment.status", idempotencyKey: `appointment:${appointment._id}:status:${appointment.status}:${appointment.statusVersion}`, relatedEntityType: "Appointment", relatedEntityId: appointment._id,
  recipientType: "client", recipient: appointment.email, template: "appointment.client-status", templatePayload: { status: appointment.status, rows: rows([["Topic", appointment.topic], ["Status", appointment.status], ["Admin note", appointment.adminNotes], ["Slot", slotLabel(appointment.slot)]]) },
}, options);

const notifyReviewSubmitted = (review, options) => queue({ eventType: "review.submitted.owner", idempotencyKey: `review:${review._id}:owner-submitted`, relatedEntityType: "Review", relatedEntityId: review._id, recipientType: "owner", recipient: ownerEmail(), template: "review.owner-submitted", templatePayload: { name: review.name, rows: rows([["Name", review.name], ["Business", review.businessName], ["Rating", review.rating], ["Review", review.message]]) } }, options);
const sendReviewSubmittedConfirmationToClient = (review, email, options) => queue({ eventType: "review.submitted.client", idempotencyKey: `review:${review._id}:client-submitted`, relatedEntityType: "Review", relatedEntityId: review._id, recipientType: "client", recipient: email, template: "review.client-submitted", templatePayload: { title: "Review submitted", intro: "Thank you for sharing your review. It will appear after approval.", subject: "Your Web District review was submitted", rows: rows([["Rating", review.rating], ["Status", review.status]]) } }, options);
const sendReviewDecisionToClient = (review, email, options) => queue({ eventType: "review.decision", idempotencyKey: `review:${review._id}:decision:${review.status}:${review.updatedAt?.getTime?.() || Date.now()}`, relatedEntityType: "Review", relatedEntityId: review._id, recipientType: "client", recipient: email, template: "review.client-decision", templatePayload: { title: "Review status updated", intro: "Your review status was updated.", subject: `Your Web District review is ${review.status}`, rows: rows([["Rating", review.rating], ["Status", review.status]]) } }, options);

const contractClientEvent = (contract, kind, payload, options) => queue({ eventType: `contract.${kind}.client`, idempotencyKey: `contract:${contract._id}:client:${kind}:${contract.status}:${contract.statusVersion || 0}`, relatedEntityType: "Contract", relatedEntityId: contract._id, recipientType: "client", recipient: contract.clientEmail, template: `contract.client-${kind}`, templatePayload: payload }, options);
const contractOwnerEvent = (contract, kind, payload, options) => queue({ eventType: `contract.${kind}.owner`, idempotencyKey: `contract:${contract._id}:owner:${kind}:${contract.status}:${contract.statusVersion || 0}`, relatedEntityType: "Contract", relatedEntityId: contract._id, recipientType: "owner", recipient: ownerEmail(), template: `contract.owner-${kind}`, templatePayload: payload }, options);
const contractRows = (contract) => rows([["Contract", contract.title], ["Client", contract.clientName], ["Business", contract.businessName], ["Website type", contract.websiteType], ["Status", contract.status], ["Total price", contract.totalPrice], ["Client note", contract.clientNotes]]);
const sendContractToClient = (contract, options) => contractClientEvent(contract, "sent", { title: "Your proposal is ready", intro: "A Web District proposal is ready in your account.", subject: `Your Web District proposal — ${contract.title}`, rows: contractRows(contract) }, options);
const sendContractStatusToClient = (contract, options) => contractClientEvent(contract, "status", { title: "Contract status updated", subject: `Your Web District contract is ${contract.status}`, rows: contractRows(contract) }, options);
const notifyContractAccepted = (contract, options) => contractOwnerEvent(contract, "accepted", { title: "Contract accepted", subject: `Contract accepted — ${contract.businessName || contract.clientName}`, rows: contractRows(contract) }, options);
const sendContractAcceptedToClient = (contract, options) => contractClientEvent(contract, "accepted", { title: "Contract accepted", subject: "Your Web District contract was accepted", rows: contractRows(contract) }, options);
const notifyContractClientNote = (contract, options) => contractOwnerEvent(contract, "client-note", { title: "Client contract note", subject: `Client note on contract — ${contract.title}`, rows: contractRows(contract) }, options);

const sendPasswordResetEmail = async (user, resetUrl) => {
  const rendered = renderEmailTemplate("account.password-reset", {
    email: user.email,
    name: user.name,
    ctaPath: new URL(resetUrl).pathname,
  });
  await sendEmail({ to: user.email, ...rendered });
  return { success: true };
};

module.exports = { notifyNewClientSignup, queueVerificationEmail, sendWelcomeEmailToClient, sendPasswordResetEmail, notifyNewWebsiteRequest, sendWebsiteRequestConfirmationToClient, sendWebsiteRequestStatusToClient, notifyNewAppointment, sendAppointmentConfirmationToClient, sendAppointmentStatusToClient, notifyReviewSubmitted, sendReviewSubmittedConfirmationToClient, sendReviewDecisionToClient, sendContractToClient, sendContractStatusToClient, notifyContractAccepted, sendContractAcceptedToClient, notifyContractClientNote };
