const jwt = require("jsonwebtoken");

const generateToken = (userOrId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const rawId = userOrId?._id || userOrId;
  const id = rawId?.toString ? rawId.toString() : rawId;

  if (!id) {
    throw new Error("Token subject is missing");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

module.exports = generateToken;
