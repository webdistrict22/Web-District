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
    tls: {
      rejectUnauthorized: !allowSelfSigned,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!isEmailConfigured()) {
    console.warn("Email skipped: EMAIL_USER or EMAIL_PASS is missing.");
    return {
      success: false,
      skipped: true,
      reason: "Email is not configured",
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
};

module.exports = sendEmail;