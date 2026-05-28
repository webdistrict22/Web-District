const nodemailer = require("nodemailer");

const cleanEnv = (key) => (process.env[key] || "").trim();

const isEmailConfigured = () => {
  return Boolean(cleanEnv("EMAIL_USER") && cleanEnv("EMAIL_PASS"));
};

const getEmailConfig = () => {
  const emailUser = cleanEnv("EMAIL_USER");
  const emailPass = cleanEnv("EMAIL_PASS");
  const ownerEmail = cleanEnv("OWNER_EMAIL");
  const fromName = cleanEnv("EMAIL_FROM_NAME") || "Web District";
  const allowSelfSigned = cleanEnv("EMAIL_ALLOW_SELF_SIGNED") === "true";

  return {
    emailUser,
    emailPass,
    ownerEmail,
    fromName,
    allowSelfSigned,
  };
};

const createTransporter = () => {
  const { emailUser, emailPass, allowSelfSigned } = getEmailConfig();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: !allowSelfSigned,
    },
  });
};

const formatEmailError = (error) => {
  const parts = [
    error.code,
    error.command,
    error.responseCode,
    error.message,
  ].filter(Boolean);

  return parts.join(" | ");
};

const normalizeEmailResultError = (error) => ({
  success: false,
  message: error.message,
  error: error.message,
  code: error.code || null,
  command: error.command || null,
  responseCode: error.responseCode || null,
});

const verifyEmailTransport = async () => {
  if (!isEmailConfigured()) {
    return {
      success: false,
      message: "EMAIL_USER or EMAIL_PASS missing",
      code: null,
      command: null,
    };
  }

  try {
    const transporter = createTransporter();

    await transporter.verify();

    return {
      success: true,
      message: "Email transporter verified",
    };
  } catch (error) {
    console.error("Email transporter verify failed:", formatEmailError(error));

    return {
      success: false,
      message: error.message,
      code: error.code || null,
      command: error.command || null,
    };
  }
};

const sendEmail = async ({ to, subject, html, text }) => {
  const { emailUser, fromName } = getEmailConfig();

  if (!isEmailConfigured()) {
    console.warn("Email skipped: EMAIL_USER or EMAIL_PASS missing");
    return {
      success: false,
      skipped: true,
      reason: "EMAIL_USER or EMAIL_PASS missing",
    };
  }

  const recipient = String(to || "").trim();

  if (!recipient) {
    console.warn("Email skipped: recipient is missing.");
    return {
      success: false,
      skipped: true,
      reason: "Recipient is missing",
    };
  }

  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${emailUser}>`,
      to: recipient,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email send failed:", formatEmailError(error));

    return normalizeEmailResultError(error);
  }
};

module.exports = sendEmail;
module.exports.verifyEmailTransport = verifyEmailTransport;
module.exports.getEmailConfig = getEmailConfig;
