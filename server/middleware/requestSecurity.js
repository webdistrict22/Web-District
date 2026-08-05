const { assertSafeObject, createValidationError } = require("../utils/validation");

const rejectUnsafeKeys = (req, res, next) => {
  assertSafeObject(req.body, "Request body");
  assertSafeObject(req.query, "Query");
  next();
};

const rejectHoneypot = (req, res, next) => {
  const value = req.body?.companyWebsite;
  if (value !== undefined && (typeof value !== "string" || value.trim())) {
    return next(createValidationError("Submission could not be accepted"));
  }
  next();
};

module.exports = { rejectUnsafeKeys, rejectHoneypot };
