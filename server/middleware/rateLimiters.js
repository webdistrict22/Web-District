const rateLimit = require("express-rate-limit");
const MongoRateLimitStore = require("../services/mongoRateLimitStore");

const windowMs = 15 * 60 * 1000;

const createPublicActionLimiter = (name, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    store: new MongoRateLimitStore(name),
    passOnStoreError: false,
    message: {
      success: false,
      message,
    },
  });

const authLimiter = createPublicActionLimiter(
  "auth",
  20,
  "Too many authentication attempts. Please try again later."
);

const websiteRequestLimiter = createPublicActionLimiter(
  "website-request",
  10,
  "Too many website requests. Please try again later."
);

const appointmentLimiter = createPublicActionLimiter(
  "appointment",
  10,
  "Too many appointment attempts. Please try again later."
);

const reviewLimiter = createPublicActionLimiter(
  "review",
  8,
  "Too many review submissions. Please try again later."
);

const verificationLimiter = createPublicActionLimiter(
  "verification",
  5,
  "Too many verification attempts. Please try again later."
);

module.exports = {
  authLimiter,
  websiteRequestLimiter,
  appointmentLimiter,
  reviewLimiter,
  verificationLimiter,
};
