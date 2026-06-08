const rateLimit = require("express-rate-limit");

const windowMs = 15 * 60 * 1000;

const createPublicActionLimiter = (limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });

const authLimiter = createPublicActionLimiter(
  20,
  "Too many authentication attempts. Please try again later."
);

const websiteRequestLimiter = createPublicActionLimiter(
  10,
  "Too many website requests. Please try again later."
);

const appointmentLimiter = createPublicActionLimiter(
  10,
  "Too many appointment attempts. Please try again later."
);

module.exports = {
  authLimiter,
  websiteRequestLimiter,
  appointmentLimiter,
};
