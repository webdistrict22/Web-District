const isEmail = (value = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
};

const isPhone = (value = "") => {
  const cleaned = String(value).replace(/\s+/g, "");
  return /^(\+?\d{8,15})$/.test(cleaned);
};

const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return String(value ?? "").trim().length > 0;
};

const minLength = (value = "", length = 1) => {
  return String(value).trim().length >= length;
};

const maxLength = (value = "", length = 255) => {
  return String(value).trim().length <= length;
};

const isPositiveNumber = (value) => {
  return Number(value) > 0;
};

const normalizeString = (value = "") => {
  return String(value ?? "").trim();
};

const normalizeEmail = (value = "") => {
  return normalizeString(value).toLowerCase();
};

const buildValidationError = (errors = {}) => {
  const cleanErrors = Object.entries(errors).reduce((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});

  return {
    hasErrors: Object.keys(cleanErrors).length > 0,
    errors: cleanErrors,
  };
};

module.exports = {
  isEmail,
  isPhone,
  isRequired,
  minLength,
  maxLength,
  isPositiveNumber,
  normalizeString,
  normalizeEmail,
  buildValidationError,
};