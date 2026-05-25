const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file, folder) => {
  const base64File = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  const result = await cloudinary.uploader.upload(base64File, {
    folder,
    resource_type: "image",
    format: "webp",
    quality: "auto",
  });

  return result.secure_url;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
