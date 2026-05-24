const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access only");
  }

  next();
};

module.exports = {
  adminOnly,
};