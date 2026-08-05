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

  const version = Number(userOrId?.tokenVersion || 0);
  return jwt.sign({ id, ver: version }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m",
    issuer: "web-district-api",
    audience: "web-district-web",
  });
};

module.exports = generateToken;
