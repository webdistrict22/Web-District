const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;")
  .replace(/\n/g, "<br />");

const display = (value) =>
  value === undefined || value === null || value === ""
    ? "Not provided"
    : String(value);

const subjectValue = (value, fallback) =>
  value === undefined || value === null || value === ""
    ? fallback
    : String(value);

const getClientOrigin = () => {
  const configured = String(process.env.CLIENT_URL || "").trim();
  let parsed;

  try {
    parsed = new URL(configured);
  } catch {
    const error = new Error("CLIENT_URL must be configured before rendering email links");
    error.code = "INVALID_CLIENT_URL";
    error.permanent = true;
    throw error;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    const error = new Error("CLIENT_URL must use HTTP or HTTPS");
    error.code = "INVALID_CLIENT_URL";
    error.permanent = true;
    throw error;
  }

  return parsed.origin;
};

const clientUrl = (path) => {
  const safePath = String(path || "");
  if (!safePath.startsWith("/") || safePath.startsWith("//")) {
    const error = new Error("Email CTA paths must be relative website paths");
    error.code = "INVALID_EMAIL_CTA_PATH";
    error.permanent = true;
    throw error;
  }

  return `${getClientOrigin()}${safePath}`;
};

const renderRows = (rows) => rows.map(({ label, value }, index) => `
  <tr>
    <td style="width:34%;padding:${index === 0 ? "0 12px 12px 0" : "12px 12px 12px 0"};border-top:${index === 0 ? "0" : "1px solid #D6CFC2"};color:#6D6862;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:${index === 0 ? "0 0 12px 12px" : "12px 0 12px 12px"};border-top:${index === 0 ? "0" : "1px solid #D6CFC2"};color:#171411;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1.55;vertical-align:top;word-break:break-word;">${escapeHtml(display(value))}</td>
  </tr>`).join("");

const renderCta = (ctaText, ctaPath) => {
  if (!ctaText || !ctaPath) return "";
  const href = clientUrl(ctaPath);

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;">
      <tr>
        <td bgcolor="#050505" style="border:1px solid #050505;border-radius:5px;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 19px;color:#F7F2EC;-webkit-text-fill-color:#F7F2EC;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1;text-decoration:none;">${escapeHtml(ctaText)}</a>
        </td>
      </tr>
    </table>`;
};

const emailLayout = ({
  title,
  intro,
  preheader = intro,
  rows = [],
  ctaText,
  ctaPath,
}) => {
  const rowsHtml = rows.length
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">${renderRows(rows)}</table>`
    : "";
  const cta = renderCta(ctaText, ctaPath);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#EEE8DF;color:#171411;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(preheader)}&#847;&zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#EEE8DF" style="width:100%;border-collapse:collapse;background:#EEE8DF;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;border-collapse:collapse;background:#F7F2EC;">
          <tr>
            <td bgcolor="#050505" style="padding:24px 28px;background:#050505;border-bottom:4px solid #D6A75D;">
              <p style="margin:0;color:#D6A75D;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Web District</p>
              <h1 style="margin:12px 0 0;color:#F7F2EC;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;line-height:1.16;letter-spacing:-0.6px;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 28px 28px;background:#F7F2EC;">
              <p style="max-width:540px;margin:0;color:#6D6862;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;">${escapeHtml(intro)}</p>
              ${rowsHtml ? `<div style="height:22px;line-height:22px;">&nbsp;</div>${rowsHtml}` : ""}
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:17px 28px;border-top:1px solid #D6CFC2;background:#EEE8DF;">
              <p style="margin:0;color:#6D6862;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;">Web District · Website design and development<br>This is an automated service email related to your account or request.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const contractClientDescriptor = (payload) => ({
  title: payload.title || "Contract updated",
  intro: payload.intro || "Your Web District contract was updated.",
  rows: payload.rows,
  ctaText: "Open contract",
  ctaPath: "/account/contracts",
  subject: payload.subject || "Your Web District contract was updated",
});

const contractOwnerDescriptor = (payload) => ({
  title: payload.title || "Contract activity",
  intro: payload.intro || "A client updated a contract.",
  rows: payload.rows,
  ctaText: "Open contracts",
  ctaPath: "/admin/contracts",
  subject: payload.subject || "Web District contract activity",
});

const reviewClientDescriptor = (payload) => ({
  title: payload.title || "Review updated",
  intro: payload.intro || "Your review was updated.",
  rows: payload.rows,
  ctaText: "Open reviews",
  ctaPath: "/account/reviews",
  subject: payload.subject || "Your Web District review was updated",
});

const descriptors = {
  "account.verification": (p) => ({
    title: "Verify your email",
    intro: "Confirm your email address to secure your Web District account and connect eligible guest submissions.",
    rows: [{ label: "Name", value: p.name }],
    ctaText: "Verify email",
    ctaPath: `/verify-email/${p.token || ""}`,
    subject: "Verify your Web District email",
  }),
  "account.welcome": (p) => ({
    title: "Welcome to Web District",
    intro: "Your email is verified and your client account is ready.",
    rows: [{ label: "Name", value: p.name }, { label: "Business", value: p.businessName }],
    ctaText: "Open account",
    ctaPath: "/account",
    subject: "Welcome to Web District",
  }),
  "account.password-reset": (p) => ({
    title: "Reset your password",
    intro: "We received a password reset request for your Web District account. This secure link expires in 10 minutes.",
    rows: [{ label: "Account", value: p.email }, { label: "Name", value: p.name }],
    ctaText: "Reset password",
    ctaPath: p.ctaPath,
    subject: "Reset your Web District password",
  }),
  "account.signup-owner": (p) => ({
    title: "New client account",
    intro: "A client created a Web District account.",
    rows: [{ label: "Name", value: p.name }, { label: "Business", value: p.businessName }],
    ctaText: "Open clients",
    ctaPath: "/admin/clients",
    subject: `New client signup · ${subjectValue(p.name, "Client")}`,
  }),
  "request.owner-created": (p) => ({
    title: "New website request",
    intro: "A website request was submitted through the Start page.",
    rows: p.rows,
    ctaText: "Open requests",
    ctaPath: "/admin/requests",
    subject: `New website request · ${subjectValue(p.businessName || p.name, "Client")}`,
  }),
  "request.client-confirmation": (p) => ({
    title: "Request received",
    intro: "We received your website request and will review it before contacting you with the next step.",
    rows: p.rows,
    ctaText: "View request",
    ctaPath: "/account/requests",
    subject: "We received your Web District request",
  }),
  "request.client-status": (p) => ({
    title: "Request status updated",
    intro: "The status of your website request has changed.",
    rows: p.rows,
    ctaText: "View request",
    ctaPath: "/account/requests",
    subject: `Your Web District request is ${subjectValue(p.status, "updated")}`,
  }),
  "appointment.owner-created": (p) => ({
    title: "New call appointment",
    intro: "A client booked a call through the Start page.",
    rows: p.rows,
    ctaText: "Open appointments",
    ctaPath: "/admin/appointments",
    subject: `New call appointment · ${subjectValue(p.businessName || p.name, "Client")}`,
  }),
  "appointment.client-confirmation": (p) => ({
    title: "Your call is booked",
    intro: "Your call with Web District is confirmed. The appointment details are below.",
    rows: p.rows,
    ctaText: "View appointment",
    ctaPath: "/account/appointments",
    subject: "Your Web District call is booked",
  }),
  "appointment.client-status": (p) => ({
    title: "Call status updated",
    intro: "The status of your call appointment has changed.",
    rows: p.rows,
    ctaText: "View appointment",
    ctaPath: "/account/appointments",
    subject: `Your Web District call is ${subjectValue(p.status, "updated")}`,
  }),
  "contract.client-sent": contractClientDescriptor,
  "contract.client-status": contractClientDescriptor,
  "contract.client-accepted": contractClientDescriptor,
  "contract.owner-accepted": contractOwnerDescriptor,
  "contract.owner-client-note": contractOwnerDescriptor,
  "review.owner-submitted": (p) => ({
    title: "New review submitted",
    intro: "A client submitted a review for approval.",
    rows: p.rows,
    ctaText: "Review submission",
    ctaPath: "/admin/clients/reviews",
    subject: `New review awaiting approval · ${subjectValue(p.name, "Client")}`,
  }),
  "review.client-submitted": reviewClientDescriptor,
  "review.client-decision": reviewClientDescriptor,
  // Backward-compatible renderers for already queued events.
  "contract.client": contractClientDescriptor,
  "contract.owner": contractOwnerDescriptor,
  "review.owner": (p) => descriptors["review.owner-submitted"](p),
  "review.client": reviewClientDescriptor,
};

const EMAIL_TEMPLATE_TYPES = Object.freeze(Object.keys(descriptors));

const renderEmailTemplate = (template, payload) => {
  const descriptor = descriptors[template]?.(payload || {});
  if (!descriptor) {
    const error = new Error("Unknown email template");
    error.code = "UNKNOWN_EMAIL_TEMPLATE";
    error.permanent = true;
    throw error;
  }

  const ctaHref = descriptor.ctaText && descriptor.ctaPath
    ? clientUrl(descriptor.ctaPath)
    : "";
  const text = [
    descriptor.title,
    descriptor.intro,
    "",
    ...(descriptor.rows || []).map((row) => `${row.label}: ${display(row.value)}`),
    ...(ctaHref ? ["", `${descriptor.ctaText}: ${ctaHref}`] : []),
    "",
    "Web District · Website design and development",
  ].join("\n");

  return {
    subject: descriptor.subject,
    text,
    html: emailLayout(descriptor),
  };
};

module.exports = {
  EMAIL_TEMPLATE_TYPES,
  clientUrl,
  emailLayout,
  renderEmailTemplate,
};
