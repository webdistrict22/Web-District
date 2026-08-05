const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("JWT_SECRET is missing");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: "web-district-api", audience: "web-district-web" });
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }

  const user = await User.findById(decoded.id).select("-password +tokenVersion");

  if (!user || !user.isActive || Number(decoded.ver || 0) !== Number(user.tokenVersion || 0)) {
    res.status(401);
    throw new Error("Not authorized, user not found");
  }

  req.user = user;

  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  if (!process.env.JWT_SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { issuer: "web-district-api", audience: "web-district-web" });

    const user = await User.findById(decoded.id).select("-password +tokenVersion");

    if (user && user.isActive && Number(decoded.ver || 0) === Number(user.tokenVersion || 0)) {
      req.user = user;
    }
  } catch (error) {
    req.user = null;
  }

  next();
});

module.exports = {
  protect,
  optionalAuth,
};
