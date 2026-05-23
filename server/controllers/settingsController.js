const Settings = require("../models/Settings");
const asyncHandler = require("../middleware/asyncHandler");

const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
};

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.json({
    success: true,
    settings,
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  const fields = [
    "agencyName",
    "phone",
    "whatsapp",
    "instagram",
    "email",
    "heroHeadline",
    "heroSubtext",
    "primaryCTA",
    "secondaryCTA",
    "footerText",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  const updatedSettings = await settings.save();

  res.json({
    success: true,
    message: "Settings updated successfully",
    settings: updatedSettings,
  });
});

module.exports = {
  getPublicSettings,
  updateSettings,
};