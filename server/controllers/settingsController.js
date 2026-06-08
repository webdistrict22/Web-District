const Settings = require("../models/Settings");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const {
  cleanText,
  cleanEmail,
  cleanPhone,
} = require("../utils/validation");

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
  await Settings.init();

  const existingSettings = await Settings.findOne({
    singletonKey: "primary",
  });

  if (existingSettings) {
    return existingSettings;
  }

  const legacySettings = await Settings.findOne({
    singletonKey: { $exists: false },
  })
    .sort({ _id: 1 })
    .select("+singletonKey");

  if (legacySettings) {
    try {
      const adoptedSettings = await Settings.findOneAndUpdate(
        {
          _id: legacySettings._id,
          singletonKey: { $exists: false },
        },
        {
          $set: {
            singletonKey: "primary",
          },
        },
        {
          new: true,
        }
      );

      if (adoptedSettings) {
        return adoptedSettings;
      }
    } catch (error) {
      if (error?.code !== 11000) {
        throw error;
      }
    }
  }

  try {
    return await Settings.findOneAndUpdate(
      {
        singletonKey: "primary",
      },
      {
        $setOnInsert: {
          singletonKey: "primary",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  } catch (error) {
    if (error?.code !== 11000) {
      throw error;
    }

    return Settings.findOne({ singletonKey: "primary" });
  }
};

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.json({
    success: true,
    settings,
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const settings = await getOrCreateSettings();

  const textFields = {
    agencyName: ["Agency name", 120],
    instagram: ["Instagram", 120],
    heroHeadline: ["Hero headline", 160],
    heroSubtext: ["Hero subtext", 500],
    primaryCTA: ["Primary CTA", 80],
    secondaryCTA: ["Secondary CTA", 80],
    footerText: ["Footer text", 500],
  };

  Object.entries(textFields).forEach(([field, [label, max]]) => {
    if (body[field] !== undefined) {
      settings[field] = cleanText(body[field], label, { max });
    }
  });

  if (body.phone !== undefined) {
    settings.phone = cleanPhone(body.phone, "Phone");
  }

  if (body.whatsapp !== undefined) {
    settings.whatsapp = cleanPhone(body.whatsapp, "WhatsApp");
  }

  if (body.email !== undefined) {
    settings.email = cleanEmail(body.email, "Email", {
      required: false,
    });
  }

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
  const fallbackRecipient = ownerEmail || emailUser || "";
  const to = cleanEmail(req.body?.to || fallbackRecipient, "Recipient email");

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
