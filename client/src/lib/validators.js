export const isEmail = (value = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
};

export const isPhone = (value = "") => {
  const cleaned = String(value).replace(/\s+/g, "");
  return /^(\+?\d{8,15})$/.test(cleaned);
};

export const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return String(value ?? "").trim().length > 0;
};

export const minLength = (value = "", length = 1) => {
  return String(value).trim().length >= length;
};

export const maxLength = (value = "", length = 255) => {
  return String(value).trim().length <= length;
};

export const isPositiveNumber = (value) => {
  return Number(value) > 0;
};

export const validateEmailField = (value, label = "Email") => {
  if (!isRequired(value)) return `${label} is required.`;
  if (!isEmail(value)) return `Please enter a valid ${label.toLowerCase()}.`;
  return "";
};

export const validateRequiredField = (value, label = "Field") => {
  if (!isRequired(value)) return `${label} is required.`;
  return "";
};

export const validatePhoneField = (value, label = "Phone") => {
  if (!isRequired(value)) return `${label} is required.`;
  if (!isPhone(value)) return `Please enter a valid ${label.toLowerCase()} number.`;
  return "";
};

export const validatePasswordField = (value) => {
  if (!isRequired(value)) return "Password is required.";
  if (!minLength(value, 6)) return "Password must be at least 6 characters.";
  return "";
};

export const validateWebsiteRequest = (form) => {
  const errors = {};

  if (!isRequired(form.name)) errors.name = "Name is required.";
  if (!isRequired(form.phone)) errors.phone = "Phone is required.";
  if (!isEmail(form.email)) errors.email = "Valid email is required.";
  if (!isRequired(form.websiteType)) errors.websiteType = "Website type is required.";
  if (!isRequired(form.projectDetails)) {
    errors.projectDetails = "Project details are required.";
  }

  return errors;
};

export const validateAppointment = (form, selectedSlot) => {
  const errors = {};

  if (!selectedSlot) errors.slot = "Please choose a call slot.";
  if (!isRequired(form.name)) errors.name = "Name is required.";
  if (!isRequired(form.phone)) errors.phone = "Phone is required.";
  if (!isEmail(form.email)) errors.email = "Valid email is required.";
  if (!isRequired(form.topic)) errors.topic = "Discussion topic is required.";

  return errors;
};

export const hasErrors = (errors = {}) => {
  return Object.values(errors).some(Boolean);
};