const express = require("express");
const { uploadProjectImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/project-image",
  protect,
  adminOnly,
  upload.single("image"),
  uploadProjectImage
);

module.exports = router;
