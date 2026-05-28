const nodemailer = require("nodemailer");

const isEmailConfigured = () => {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
};

const createTransporter = () => {
  const allowSelfSigned = process.env.EMAIL_ALLOW_SELF_SIGNED === "true";

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    console.warn("Email skipped: EMAIL_USER or EMAIL_PASS missing");
    return {
      success: false,
      skipped: true,
      reason: "EMAIL_USER or EMAIL_PASS missing",
    };
  }

  if (!to) {
    console.warn("Email skipped: recipient is missing.");
    return {
      success: false,
      skipped: true,
      reason: "Recipient is missing",
    };
  }

  const transporter = createTransporter();

  const fromName = process.env.EMAIL_FROM_NAME || "Web District";

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
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

    return {
      success: false,
      error: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
    };
  }
};

module.exports = sendEmail;
