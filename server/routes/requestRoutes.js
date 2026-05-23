const express = require("express");
const {
  createWebsiteRequest,
  getMyWebsiteRequests,
  getAllWebsiteRequests,
  getWebsiteRequestById,
  updateWebsiteRequest,
  deleteWebsiteRequest,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next();
  }

  return protect(req, res, next);
};

router.post("/", optionalProtect, createWebsiteRequest);

router.get("/my", protect, getMyWebsiteRequests);

router.get("/", protect, adminOnly, getAllWebsiteRequests);

router.get("/:id", protect, getWebsiteRequestById);

router.put("/:id", protect, adminOnly, updateWebsiteRequest);

router.delete("/:id", protect, adminOnly, deleteWebsiteRequest);

module.exports = router;