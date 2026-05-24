const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
};

const REQUEST_STATUSES = [
  "New",
  "Reviewed",
  "Accepted",
  "Rejected",
  "In Progress",
  "Contract Sent",
  "Completed",
];

const APPOINTMENT_STATUSES = [
  "Pending",
  "Accepted",
  "Cancelled",
  "Rescheduled",
  "Done",
];

const CONTRACT_STATUSES = [
  "Draft",
  "Sent",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

const REVIEW_STATUSES = ["Pending", "Approved", "Rejected"];

const CONTACT_MESSAGE_STATUSES = ["New", "Read", "Replied", "Archived"];

const WEBSITE_TYPES = [
  "Online Store",
  "Business Website",
  "Landing Page",
  "Custom Website",
];

module.exports = {
  USER_ROLES,
  REQUEST_STATUSES,
  APPOINTMENT_STATUSES,
  CONTRACT_STATUSES,
  REVIEW_STATUSES,
  CONTACT_MESSAGE_STATUSES,
  WEBSITE_TYPES,
};