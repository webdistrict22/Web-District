const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const objectIdPattern = /^[a-f\d]{24}$/i;
const unsafeKeyPattern = /(^|\.)\$|\./;

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const cleanText = (
  value,
  field,
  { required = false, max, min = 0, lowercase = false } = {}
) => {
  if (value === undefined || value === null) {
    if (required) {
      throw createValidationError(`${field} is required`);
    }

    return "";
  }

  if (typeof value !== "string") {
    throw createValidationError(`${field} must be text`);
  }

  let cleaned = value.trim();

  if (required && !cleaned) {
    throw createValidationError(`${field} is required`);
  }

  if (cleaned && min && cleaned.length < min) {
    throw createValidationError(
      `${field} must be at least ${min} characters`
    );
  }

  if (max && cleaned.length > max) {
    throw createValidationError(`${field} must be ${max} characters or fewer`);
  }

  if (lowercase) {
    cleaned = cleaned.toLowerCase();
  }

  return cleaned;
};

const cleanEmail = (value, field = "Email", { required = true } = {}) => {
  const email = cleanText(value, field, {
    required,
    max: 160,
    lowercase: true,
  });

  if (email && !emailPattern.test(email)) {
    throw createValidationError(`${field} must be a valid email address`);
  }

  return email;
};

const cleanPhone = (value, field = "Phone", { required = false } = {}) => {
  const phone = cleanText(value, field, {
    required,
    max: 40,
  });

  if (phone && phone.length < 5) {
    throw createValidationError(`${field} must be at least 5 characters`);
  }

  return phone;
};

const cleanPassword = (
  value,
  field = "Password",
  { min = 1, max = 128 } = {}
) => {
  if (typeof value !== "string" || !value) {
    throw createValidationError(`${field} is required`);
  }

  if (value.length < min) {
    throw createValidationError(
      `${field} must be at least ${min} characters`
    );
  }

  if (value.length > max) {
    throw createValidationError(`${field} must be ${max} characters or fewer`);
  }

  return value;
};

const cleanRating = (value) => {
  const rating = Number(value === undefined ? 5 : value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw createValidationError("Rating must be a whole number from 1 to 5");
  }

  return rating;
};

const assertSafeObject = (value, field = "Request body") => {
  if (value === undefined || value === null) return;

  if (Array.isArray(value)) {
    value.forEach((item) => assertSafeObject(item, field));
    return;
  }

  if (typeof value !== "object") return;

  for (const [key, nestedValue] of Object.entries(value)) {
    if (unsafeKeyPattern.test(key)) {
      throw createValidationError(`${field} contains an unsupported field`);
    }

    assertSafeObject(nestedValue, field);
  }
};

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cleanSearch = (value, field = "Search", { max = 100 } = {}) => {
  const search = cleanText(value, field, { max });
  return search ? escapeRegex(search.normalize("NFKC")) : "";
};

const cleanObjectId = (value, field = "ID", { required = true } = {}) => {
  const id = cleanText(value, field, { required, max: 24 });

  if (id && !objectIdPattern.test(id)) {
    throw createValidationError(`${field} is invalid`);
  }

  return id;
};

const cleanEnum = (value, field, allowed, { required = false } = {}) => {
  const cleaned = cleanText(value, field, { required, max: 80 });

  if (cleaned && !allowed.includes(cleaned)) {
    throw createValidationError(`${field} is invalid`);
  }

  return cleaned;
};

const cleanBoolean = (value, field) => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (typeof value !== "boolean") {
    throw createValidationError(`${field} must be true or false`);
  }

  return value;
};

module.exports = {
  createValidationError,
  cleanText,
  cleanEmail,
  cleanPhone,
  cleanPassword,
  cleanRating,
  assertSafeObject,
  escapeRegex,
  cleanSearch,
  cleanObjectId,
  cleanEnum,
  cleanBoolean,
};
