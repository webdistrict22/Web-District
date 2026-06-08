const asyncHandler = require("../middleware/asyncHandler");
const { uploadToCloudinary } = require("../utils/cloudinary");

const projectImageFolder = "web-district/projects";

const uploadProjectImage = asyncHandler(async (req, res) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    res.status(500);
    throw new Error("CLOUDINARY_CLOUD_NAME is missing");
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    res.status(500);
    throw new Error("CLOUDINARY_API_KEY is missing");
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    res.status(500);
    throw new Error("CLOUDINARY_API_SECRET is missing");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }

  let imageUrl;

  try {
    imageUrl = await uploadToCloudinary(req.file, projectImageFolder);
  } catch (error) {
    console.error("Cloudinary image upload failed:", {
      name: error.name || "Error",
      httpCode: error.http_code || null,
    });

    const uploadError = new Error("Image upload failed. Please try again.");
    uploadError.statusCode = 502;
    throw uploadError;
  }

  res.status(201).json({
    success: true,
    imageUrl,
  });
});

module.exports = {
  uploadProjectImage,
};
