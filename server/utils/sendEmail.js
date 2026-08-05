const nodemailer = require("nodemailer");

let transporter = null;
let transporterFingerprint = "";

const cleanEnv = (key) => String(process.env[key] || "").trim();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getEmailConfig = () => {
  const emailUser = cleanEnv("EMAIL_USER");
  const emailPass = cleanEnv("EMAIL_PASS");
  const ownerEmail = cleanEnv("OWNER_EMAIL") || emailUser;
  const fromName = cleanEnv("EMAIL_FROM_NAME") || "Web District";
  const allowSelfSigned = cleanEnv("EMAIL_ALLOW_SELF_SIGNED") === "true";

  return { emailUser, emailPass, ownerEmail, fromName, allowSelfSigned };
};

const isEmailConfigured = () => {
  const { emailUser, emailPass, ownerEmail, allowSelfSigned } = getEmailConfig();
  return Boolean(
    emailPattern.test(emailUser) &&
      emailPass &&
      emailPattern.test(ownerEmail) &&
      !(process.env.NODE_ENV === "production" && allowSelfSigned)
  );
};

const getTransporter = () => {
  const config = getEmailConfig();
  if (!isEmailConfigured()) {
    const error = new Error("Email transport is not configured safely");
    error.code = "EMAIL_NOT_CONFIGURED";
    error.permanent = true;
    throw error;
  }

  const fingerprint = `${config.emailUser}:${config.allowSelfSigned}`;
  if (!transporter || transporterFingerprint !== fingerprint) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      auth: { user: config.emailUser, pass: config.emailPass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      tls: { rejectUnauthorized: !config.allowSelfSigned },
    });
    transporterFingerprint = fingerprint;
  }

  return transporter;
};

const redactEmailError = (error) => {
  const raw = String(error?.message || "Email provider error")
    .replace(/(?:smtp|https?):\/\/\S+/gi, "[redacted-endpoint]")
    .replace(/[^\s]+@[^\s]+/g, "[redacted-email]")
    .slice(0, 500);

  return {
    code: String(error?.code || "EMAIL_SEND_FAILED").slice(0, 80),
    message: raw,
    responseCode: Number(error?.responseCode) || null,
  };
};

const verifyEmailTransport = async () => {
  try {
    await getTransporter().verify();
    return { success: true, message: "Email transporter verified" };
  } catch (error) {
    return { success: false, ...redactEmailError(error) };
  }
};

const sendEmail = async ({ to, subject, html, text, messageId }) => {
  const recipient = String(to || "").trim().toLowerCase();
  if (!emailPattern.test(recipient)) {
    const error = new Error("Recipient address is invalid");
    error.code = "INVALID_RECIPIENT";
    error.permanent = true;
    throw error;
  }

  const { emailUser, fromName } = getEmailConfig();
  const info = await getTransporter().sendMail({
    from: `"${fromName}" <${emailUser}>`,
    to: recipient,
    subject,
    text,
    html,
    messageId,
  });

  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
module.exports.verifyEmailTransport = verifyEmailTransport;
module.exports.getEmailConfig = getEmailConfig;
module.exports.isEmailConfigured = isEmailConfigured;
module.exports.redactEmailError = redactEmailError;
module.exports.resetTransporterForTests = () => {
  transporter = null;
  transporterFingerprint = "";
};
