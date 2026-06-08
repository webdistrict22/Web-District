const express = require("express");
const { uploadProjectImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  uploadSingleImage,
  validateImageSignature,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/project-image",
  protect,
  adminOnly,
  uploadSingleImage,
  validateImageSignature,
  uploadProjectImage
);

module.exports = router;
