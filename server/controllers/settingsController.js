const Settings = require("../models/Settings");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");

const { getEmailConfig, verifyEmailTransport } = sendEmail;

const previewEmail = (email = "") => {
  const value = String(email || "").trim();

  if (!value) return "";

  const [localPart, domain] = value.split("@");

  if (!domain) {
    return `${value.slice(0, 3)}***`;
  }

  return `${localPart.slice(0, 3)}***@${domain}`;
};

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

const getEmailStatus = asyncHandler(async (req, res) => {
  const {
    emailUser,
    emailPass,
    ownerEmail,
    fromName,
    allowSelfSigned,
  } = getEmailConfig();

  res.json({
    success: true,
    email: {
      hasEmailUser: Boolean(emailUser),
      hasEmailPass: Boolean(emailPass),
      hasOwnerEmail: Boolean(ownerEmail),
      emailUserPreview: previewEmail(emailUser),
      ownerEmailPreview: previewEmail(ownerEmail),
      allowSelfSigned: String(allowSelfSigned),
      fromName,
    },
  });
});

const sendTestEmail = asyncHandler(async (req, res) => {
  const { emailUser, ownerEmail } = getEmailConfig();
  const to = String(req.body?.to || ownerEmail || emailUser || "").trim();

  const verification = await verifyEmailTransport();

  if (!verification.success) {
    return res.status(500).json({
      success: false,
      message: "Test email failed",
      error: verification.message,
      code: verification.code || null,
      command: verification.command || null,
    });
  }

  const result = await sendEmail({
    to,
    subject: "Web District Email Test",
    text: "If you received this, Web District production email is working.",
    html: `
      <p>If you received this, Web District production email is working.</p>
    `,
  });

  if (!result.success) {
    return res.status(500).json({
      success: false,
      message: "Test email failed",
      error:
        result.message || result.error || result.reason || "Unknown email error",
      code: result.code || null,
      command: result.command || null,
    });
  }

  res.json({
    success: true,
    message: "Test email sent",
    result: {
      verification,
      send: result,
    },
  });
});

module.exports = {
  getPublicSettings,
  updateSettings,
  getEmailStatus,
  sendTestEmail,
};
