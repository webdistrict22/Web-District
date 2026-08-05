const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, "<br />");

const display = (value) => value === undefined || value === null || value === "" ? "Not provided" : String(value);
const clientUrl = (path) => `${String(process.env.CLIENT_URL || "").replace(/\/$/, "")}${path}`;

const emailLayout = ({ title, intro, rows = [], ctaText, ctaPath }) => {
  const rowsHtml = rows.map(({ label, value }) => `<tr><td style="padding:13px 12px;border-top:1px solid rgba(248,247,244,.12);color:#D9D4CC;font-size:14px;width:180px;vertical-align:top">${escapeHtml(label)}</td><td style="padding:13px 12px;border-top:1px solid rgba(248,247,244,.12);color:#F8F7F4;font-size:14px;font-weight:700;vertical-align:top">${escapeHtml(display(value))}</td></tr>`).join("");
  const cta = ctaText && ctaPath ? `<div style="margin-top:28px"><a href="${escapeHtml(clientUrl(ctaPath))}" style="display:inline-block;background:#A8874F;color:#F8F7F4;text-decoration:none;padding:13px 18px;border-radius:14px;font-weight:800;font-size:14px">${escapeHtml(ctaText)}</a></div>` : "";
  return `<div style="margin:0;padding:0;background:#080808;font-family:Arial,Helvetica,sans-serif;color:#F8F7F4"><div style="max-width:720px;margin:0 auto;padding:28px"><div style="background:#0B0B0B;border:1px solid rgba(196,167,125,.24);border-radius:22px;padding:28px"><p style="margin:0;color:#C4A77D;font-size:13px;font-weight:800;letter-spacing:2.4px;text-transform:uppercase">Web District</p><h1 style="margin:12px 0 0;font-size:30px;line-height:1.12;color:#F8F7F4">${escapeHtml(title)}</h1><p style="margin:16px 0 0;color:#D9D4CC;font-size:15px;line-height:1.75">${escapeHtml(intro)}</p></div><div style="background:#101010;border:1px solid rgba(248,247,244,.12);border-radius:22px;margin-top:18px;padding:24px"><table style="width:100%;border-collapse:collapse">${rowsHtml}</table>${cta}</div><p style="margin:18px 0 0;text-align:center;color:#D9D4CC;font-size:12px;line-height:1.7">This email was sent automatically from the Web District website.</p></div></div>`;
};

const descriptors = {
  "account.verification": (p) => ({ title: "Verify your email", intro: "Verify your email address to securely connect your Web District account and guest submissions.", rows: [{ label: "Name", value: p.name }], ctaText: "Verify Email", ctaPath: `/verify-email/${p.token}`, subject: "Verify your Web District email" }),
  "account.welcome": (p) => ({ title: "Welcome to Web District", intro: "Your email is verified and your account is ready.", rows: [{ label: "Name", value: p.name }, { label: "Business", value: p.businessName }], ctaText: "Open Account", ctaPath: "/account", subject: "Welcome to Web District" }),
  "account.signup-owner": (p) => ({ title: "New client account", intro: "A new client created a Web District account.", rows: [{ label: "Name", value: p.name }, { label: "Business", value: p.businessName }], ctaText: "Open Clients", ctaPath: "/admin/clients", subject: `New Client Signup — ${p.name}` }),
  "request.owner-created": (p) => ({ title: "New website request", intro: "A new website request was submitted through the Start page.", rows: p.rows, ctaText: "Open Requests", ctaPath: "/admin/requests", subject: `New website request — ${p.businessName || p.name}` }),
  "request.client-confirmation": (p) => ({ title: "Request received", intro: "Your website request was submitted successfully. We will review it and contact you with the next step.", rows: p.rows, ctaText: "Open Account", ctaPath: "/account/requests", subject: "We received your Web District request" }),
  "request.client-status": (p) => ({ title: "Request status updated", intro: "Your website request status was updated.", rows: p.rows, ctaText: "View Request", ctaPath: "/account/requests", subject: `Your Web District request is ${p.status}` }),
  "appointment.owner-created": (p) => ({ title: "New call appointment", intro: "A client booked a call appointment through the Start page.", rows: p.rows, ctaText: "Open Appointments", ctaPath: "/admin/appointments", subject: `New call appointment — ${p.businessName || p.name}` }),
  "appointment.client-confirmation": (p) => ({ title: "Your call is booked", intro: "Your call appointment with Web District has been booked successfully.", rows: p.rows, ctaText: "Open Appointments", ctaPath: "/account/appointments", subject: "Your Web District call is booked" }),
  "appointment.client-status": (p) => ({ title: "Call status updated", intro: "Your call appointment status was updated.", rows: p.rows, ctaText: "Open Appointments", ctaPath: "/account/appointments", subject: `Your Web District call is ${p.status}` }),
  "contract.client": (p) => ({ title: p.title || "Contract updated", intro: p.intro || "Your Web District contract was updated.", rows: p.rows, ctaText: "Open Contract", ctaPath: "/account/contracts", subject: p.subject || "Your Web District contract was updated" }),
  "contract.owner": (p) => ({ title: p.title || "Contract activity", intro: p.intro || "A client updated a contract.", rows: p.rows, ctaText: "Open Contracts", ctaPath: "/admin/contracts", subject: p.subject || "Web District contract activity" }),
  "review.owner": (p) => ({ title: "New review submitted", intro: "A client submitted a review. It is waiting for admin approval.", rows: p.rows, ctaText: "Review Submissions", ctaPath: "/admin/clients/reviews", subject: `New review waiting for approval — ${p.name}` }),
  "review.client": (p) => ({ title: p.title || "Review submitted", intro: p.intro || "Your review was submitted.", rows: p.rows, ctaText: "Open Reviews", ctaPath: "/account/reviews", subject: p.subject || "Your Web District review was updated" }),
};

const renderEmailTemplate = (template, payload) => {
  const descriptor = descriptors[template]?.(payload || {});
  if (!descriptor) {
    const error = new Error("Unknown email template");
    error.code = "UNKNOWN_EMAIL_TEMPLATE";
    error.permanent = true;
    throw error;
  }
  const text = [descriptor.title, descriptor.intro, ...(descriptor.rows || []).map((row) => `${row.label}: ${display(row.value)}`)].join("\n");
  return { subject: descriptor.subject, text, html: emailLayout(descriptor) };
};

module.exports = { renderEmailTemplate, emailLayout };
