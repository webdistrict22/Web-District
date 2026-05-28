const sendEmail = require("./sendEmail");

const cleanEnv = (key) => (process.env[key] || "").trim();

const getOwnerEmail = () => cleanEnv("OWNER_EMAIL") || cleanEnv("EMAIL_USER");

const previewEmail = (email = "") => {
  const value = String(email || "").trim();

  if (!value) return "missing";

  const [localPart, domain] = value.split("@");

  if (!domain) {
    return `${value.slice(0, 3)}***`;
  }

  return `${localPart.slice(0, 3)}***@${domain}`;
};

const getClientUrl = (path = "") => {
  const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
};

const formatMoney = (value) => {
  const amount = Number(value) || 0;

  return amount ? `${amount.toLocaleString()} EGP` : "Not set";
};

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();

  return Number.isNaN(date.getTime()) ? "Not available" : date.toISOString();
};

const rowsToText = (title, rows = []) =>
  [
    title,
    ...rows.map((row) => `${row.label}: ${formatDisplayValue(row.value)}`),
  ].join("\n");

const formatDisplayValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Not provided";
  }

  return String(value);
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br />");

const emailLayout = ({ title, intro, rows = [], ctaText, ctaUrl }) => {
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:13px 12px;border-top:1px solid rgba(248,247,244,0.12);color:#D9D4CC;font-size:14px;width:180px;vertical-align:top;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding:13px 12px;border-top:1px solid rgba(248,247,244,0.12);color:#F8F7F4;font-size:14px;font-weight:700;vertical-align:top;">
            ${escapeHtml(formatDisplayValue(row.value))}
          </td>
        </tr>
      `
    )
    .join("");

  const ctaHtml =
    ctaText && ctaUrl
      ? `
        <div style="margin-top:28px;">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#A8874F;color:#F8F7F4;text-decoration:none;padding:13px 18px;border-radius:14px;font-weight:800;font-size:14px;">
            ${escapeHtml(ctaText)}
          </a>
        </div>
      `
      : "";

  return `
    <div style="margin:0;padding:0;background:#080808;font-family:Arial,Helvetica,sans-serif;color:#F8F7F4;">
      <div style="max-width:720px;margin:0 auto;padding:28px;">
        <div style="background:#0B0B0B;border:1px solid rgba(196,167,125,0.24);border-radius:22px;padding:28px;">
          <p style="margin:0;color:#C4A77D;font-size:13px;font-weight:800;letter-spacing:2.4px;text-transform:uppercase;">
            Web District
          </p>
          <h1 style="margin:12px 0 0;font-size:30px;line-height:1.12;color:#F8F7F4;">
            ${escapeHtml(title)}
          </h1>
          <p style="margin:16px 0 0;color:#D9D4CC;font-size:15px;line-height:1.75;">
            ${escapeHtml(intro)}
          </p>
        </div>

        <div style="background:#101010;border:1px solid rgba(248,247,244,0.12);border-radius:22px;margin-top:18px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${rowsHtml}
          </table>

          ${ctaHtml}
        </div>

        <p style="margin:18px 0 0;text-align:center;color:#D9D4CC;font-size:12px;line-height:1.7;">
          This email was sent automatically from the Web District website.
        </p>
      </div>
    </div>
  `;
};

const logEmailResult = (label, result) => {
  if (result?.success) {
    console.log(`[Email] ${label} sent:`, {
      success: true,
      messageId: result.messageId,
    });
    return;
  }

  if (result?.skipped) {
    console.warn(`[Email] ${label} skipped:`, {
      reason: result.reason,
    });
    return;
  }

  console.error(`[Email] ${label} failed:`, {
    message: result?.message || result?.error || "Unknown email error",
    code: result?.code || null,
    command: result?.command || null,
  });
};

const safeSend = async (payload, label = "Email notification") => {
  try {
    console.log(`[Email] Sending ${label}...`, {
      to: previewEmail(payload.to),
      subject: payload.subject,
    });

    const result = await sendEmail(payload);

    logEmailResult(label, result);

    return result;
  } catch (error) {
    console.error(`[Email] ${label} failed:`, {
      message: error.message,
      code: error.code || null,
      command: error.command || null,
    });
    return {
      success: false,
      message: error.message,
      error: error.message,
      code: error.code || null,
      command: error.command || null,
    };
  }
};

const notifyNewClientSignup = async (user) => {
  const rows = [
    { label: "Name", value: user.name },
    { label: "Business name", value: user.businessName },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Role", value: user.role },
    { label: "Created date", value: formatDate(user.createdAt) },
  ];

  return safeSend(
    {
      to: getOwnerEmail(),
      subject: `New Client Signup \u2014 ${user.name}`,
      html: emailLayout({
        title: "New client account",
        intro: "A new client created a Web District account.",
        rows,
        ctaText: "Open Admin",
        ctaUrl: getClientUrl("/admin/clients"),
      }),
      text: rowsToText("New client signup", rows),
    },
    "new client signup notification"
  );
};

const sendWelcomeEmailToClient = async (user) =>
  safeSend(
    {
      to: user.email,
      subject: "Welcome to Web District",
      html: emailLayout({
        title: "Welcome to Web District",
        intro:
          "Your account is ready. You can use it to track requests, appointments, contracts, project status, and reviews.",
        rows: [
          { label: "Name", value: user.name },
          { label: "Business", value: user.businessName },
          { label: "Email", value: user.email },
        ],
        ctaText: "Open Account",
        ctaUrl: getClientUrl("/account"),
      }),
      text: "Welcome to Web District. Your account is ready.",
    },
    "client welcome email"
  );

const sendPasswordResetEmail = async (user, resetUrl) =>
  safeSend(
    {
      to: user.email,
      subject: "Reset your Web District password",
      html: emailLayout({
        title: "Reset your password",
        intro:
          "We received a request to reset your Web District account password. This link expires in 10 minutes.",
        rows: [
          { label: "Account", value: user.email },
          { label: "Name", value: user.name },
        ],
        ctaText: "Reset Password",
        ctaUrl: resetUrl,
      }),
      text: `Reset your Web District password: ${resetUrl}`,
    },
    "password reset email"
  );

const notifyNewWebsiteRequest = async (request) => {
  const rows = [
    { label: "Name", value: request.name },
    { label: "Business", value: request.businessName },
    { label: "Phone", value: request.phone },
    { label: "Email", value: request.email },
    { label: "Website type", value: request.websiteType },
    { label: "Brand identity", value: request.hasBrandIdentity },
    { label: "Content ready", value: request.hasContentReady },
    { label: "Budget", value: request.budgetRange },
    { label: "Deadline", value: request.deadline },
    { label: "Preferred contact", value: request.preferredContactMethod },
    { label: "Project details", value: request.projectDetails },
    { label: "Created date", value: formatDate(request.createdAt) },
  ];

  return safeSend(
    {
      to: getOwnerEmail(),
      subject: `New website request - ${request.businessName || request.name}`,
      html: emailLayout({
        title: "New website request",
        intro: "A new website request was submitted through the Start page.",
        rows,
        ctaText: "Open Requests",
        ctaUrl: getClientUrl("/admin/requests"),
      }),
      text: rowsToText("New website request", rows),
    },
    "new website request notification"
  );
};

const sendWebsiteRequestConfirmationToClient = async (request) =>
  safeSend({
    to: request.email,
    subject: "We received your Web District request",
    html: emailLayout({
      title: "Request received",
      intro:
        "Your website request was submitted successfully. We will review it and contact you with the next step.",
      rows: [
        { label: "Name", value: request.name },
        { label: "Business", value: request.businessName },
        { label: "Website type", value: request.websiteType },
        { label: "Preferred contact", value: request.preferredContactMethod },
      ],
      ctaText: "Open Account",
      ctaUrl: getClientUrl("/account/requests"),
    }),
    text: "Your Web District website request was submitted successfully.",
  });

const sendWebsiteRequestStatusToClient = async (request) =>
  safeSend({
    to: request.email,
    subject: `Your Web District request is ${request.status}`,
    html: emailLayout({
      title: "Request status updated",
      intro: "Your website request status was updated.",
      rows: [
        { label: "Website type", value: request.websiteType },
        { label: "Status", value: request.status },
        { label: "Admin note", value: request.adminNotes },
      ],
      ctaText: "View Request",
      ctaUrl: getClientUrl("/account/requests"),
    }),
    text: `Your Web District request status is ${request.status}.`,
  });

const notifyNewAppointment = async (appointment) =>
  safeSend(
    {
      to: getOwnerEmail(),
      subject: `New call appointment - ${appointment.businessName || appointment.name}`,
      html: emailLayout({
        title: "New call appointment",
        intro: "A client booked a call appointment through the Start page.",
        rows: [
          { label: "Name", value: appointment.name },
          { label: "Business", value: appointment.businessName },
          { label: "Phone", value: appointment.phone },
          { label: "Email", value: appointment.email },
          { label: "Topic", value: appointment.topic },
          { label: "Notes", value: appointment.notes },
          {
            label: "Slot",
            value: appointment.slot
              ? `${appointment.slot.date} - ${appointment.slot.startTime} to ${appointment.slot.endTime}`
              : "Slot not loaded",
          },
        ],
        ctaText: "Open Appointments",
        ctaUrl: getClientUrl("/admin/appointments"),
      }),
      text: `New appointment from ${appointment.name}`,
    },
    "new appointment notification"
  );

const sendAppointmentConfirmationToClient = async (appointment) =>
  safeSend(
    {
      to: appointment.email,
      subject: "Your Web District call is booked",
      html: emailLayout({
        title: "Your call is booked",
        intro:
          "Your call appointment with Web District has been booked successfully. We will use the call to understand your business and website direction.",
        rows: [
          { label: "Name", value: appointment.name },
          { label: "Business", value: appointment.businessName },
          { label: "Topic", value: appointment.topic },
          {
            label: "Slot",
            value: appointment.slot
              ? `${appointment.slot.date} - ${appointment.slot.startTime} to ${appointment.slot.endTime}`
              : "Slot not loaded",
          },
        ],
        ctaText: "Open Appointments",
        ctaUrl: getClientUrl("/account/appointments"),
      }),
      text: "Your Web District call appointment is booked.",
    },
    "appointment confirmation email"
  );

const sendAppointmentStatusToClient = async (appointment) =>
  safeSend({
    to: appointment.email,
    subject: `Your Web District call is ${appointment.status}`,
    html: emailLayout({
      title: "Call status updated",
      intro: "Your call appointment status was updated.",
      rows: [
        { label: "Topic", value: appointment.topic },
        { label: "Status", value: appointment.status },
        { label: "Admin note", value: appointment.adminNotes },
        {
          label: "Slot",
          value: appointment.slot
            ? `${appointment.slot.date} - ${appointment.slot.startTime} to ${appointment.slot.endTime}`
            : "Slot not loaded",
        },
      ],
      ctaText: "Open Appointments",
      ctaUrl: getClientUrl("/account/appointments"),
    }),
    text: `Your Web District call status is ${appointment.status}.`,
  });

const notifyContactMessage = async (message) =>
  safeSend(
    {
      to: getOwnerEmail(),
      subject: `New contact message - ${message.subject || "Website inquiry"}`,
      html: emailLayout({
        title: "New contact message",
        intro: "A new message was submitted through the Contact page.",
        rows: [
          { label: "Name", value: message.name },
          { label: "Email", value: message.email },
          { label: "Phone", value: message.phone },
          { label: "Subject", value: message.subject },
          { label: "Message", value: message.message },
        ],
      }),
      text: `New contact message from ${message.name}`,
    },
    "contact message notification"
  );

const notifyReviewSubmitted = async (review) =>
  safeSend({
    to: getOwnerEmail(),
    subject: `New review waiting for approval - ${review.name}`,
    html: emailLayout({
      title: "New review submitted",
      intro: "A client submitted a review. It is waiting for admin approval.",
      rows: [
        { label: "Name", value: review.name },
        { label: "Business", value: review.businessName },
        { label: "Role", value: review.role },
        { label: "Rating", value: `${review.rating || 5}/5` },
        { label: "Review", value: review.message },
      ],
      ctaText: "Review Submissions",
      ctaUrl: getClientUrl("/admin/clients/reviews"),
    }),
    text: `New review submitted by ${review.name}`,
  });

const sendReviewSubmittedConfirmationToClient = async (review, email) =>
  safeSend({
    to: email,
    subject: "Your Web District review was submitted",
    html: emailLayout({
      title: "Review submitted",
      intro:
        "Thank you for sharing your review. It will appear on the website after admin approval.",
      rows: [
        { label: "Name", value: review.name },
        { label: "Rating", value: `${review.rating || 5}/5` },
        { label: "Status", value: review.status },
      ],
      ctaText: "Open Reviews",
      ctaUrl: getClientUrl("/account/reviews"),
    }),
    text: "Your Web District review was submitted and is waiting for approval.",
  });

const sendReviewDecisionToClient = async (review, email) =>
  safeSend({
    to: email,
    subject: `Your Web District review is ${review.status}`,
    html: emailLayout({
      title: "Review status updated",
      intro: "Your review status was updated by Web District.",
      rows: [
        { label: "Rating", value: `${review.rating || 5}/5` },
        { label: "Status", value: review.status },
      ],
      ctaText: "Open Reviews",
      ctaUrl: getClientUrl("/account/reviews"),
    }),
    text: `Your Web District review is ${review.status}.`,
  });

const sendContractToClient = async (contract) =>
  safeSend({
    to: contract.clientEmail,
    subject: `Your Web District proposal - ${contract.title}`,
    html: emailLayout({
      title: "Your proposal is ready",
      intro:
        "A Web District proposal/contract is ready in your client account.",
      rows: [
        { label: "Contract", value: contract.title },
        { label: "Website type", value: contract.websiteType },
        { label: "Status", value: contract.status },
        { label: "Total price", value: formatMoney(contract.totalPrice) },
        { label: "Deposit", value: formatMoney(contract.depositAmount) },
        { label: "Deadline", value: contract.deadline },
      ],
      ctaText: "Open Contract",
      ctaUrl: getClientUrl("/account/contracts"),
    }),
    text: `Your Web District proposal is ready: ${contract.title}`,
  });

const sendContractStatusToClient = async (contract) =>
  safeSend({
    to: contract.clientEmail,
    subject: `Your Web District contract is ${contract.status}`,
    html: emailLayout({
      title: "Contract status updated",
      intro: "Your Web District contract status was updated.",
      rows: [
        { label: "Contract", value: contract.title },
        { label: "Status", value: contract.status },
        { label: "Total price", value: formatMoney(contract.totalPrice) },
        { label: "Admin note", value: contract.adminNotes },
      ],
      ctaText: "Open Contract",
      ctaUrl: getClientUrl("/account/contracts"),
    }),
    text: `Your Web District contract status is ${contract.status}.`,
  });

const notifyContractAccepted = async (contract) =>
  safeSend(
    {
      to: getOwnerEmail(),
      subject: `Contract accepted - ${contract.businessName || contract.clientName}`,
      html: emailLayout({
        title: "Contract accepted",
        intro: "A client accepted a proposal/contract from their dashboard.",
        rows: [
          { label: "Contract", value: contract.title },
          { label: "Client", value: contract.clientName },
          { label: "Business", value: contract.businessName },
          { label: "Email", value: contract.clientEmail },
          { label: "Phone", value: contract.clientPhone },
          { label: "Website type", value: contract.websiteType },
          { label: "Total price", value: formatMoney(contract.totalPrice) },
          { label: "Deposit", value: formatMoney(contract.depositAmount) },
          { label: "Client note", value: contract.clientNotes },
        ],
        ctaText: "Open Contracts",
        ctaUrl: getClientUrl("/admin/contracts"),
      }),
      text: `Contract accepted by ${contract.clientName}`,
    },
    "contract accepted notification"
  );

const sendContractAcceptedToClient = async (contract) =>
  safeSend({
    to: contract.clientEmail,
    subject: "Your Web District contract was accepted",
    html: emailLayout({
      title: "Contract accepted",
      intro:
        "Your proposal is now marked as accepted. Web District will follow up with the next project step.",
      rows: [
        { label: "Contract", value: contract.title },
        { label: "Status", value: contract.status },
        { label: "Total price", value: formatMoney(contract.totalPrice) },
        { label: "Deposit", value: formatMoney(contract.depositAmount) },
      ],
      ctaText: "Open Contract",
      ctaUrl: getClientUrl("/account/contracts"),
    }),
    text: "Your Web District contract was accepted.",
  });

const notifyContractClientNote = async (contract) =>
  safeSend({
    to: getOwnerEmail(),
    subject: `Client note on contract - ${contract.title}`,
    html: emailLayout({
      title: "Client contract note",
      intro: "A client added or updated a note on their contract.",
      rows: [
        { label: "Contract", value: contract.title },
        { label: "Client", value: contract.clientName },
        { label: "Business", value: contract.businessName },
        { label: "Email", value: contract.clientEmail },
        { label: "Note", value: contract.clientNotes },
      ],
      ctaText: "Open Contracts",
      ctaUrl: getClientUrl("/admin/contracts"),
    }),
    text: `Client note on contract: ${contract.title}`,
  });

module.exports = {
  notifyNewClientSignup,
  sendWelcomeEmailToClient,
  sendPasswordResetEmail,
  notifyNewWebsiteRequest,
  sendWebsiteRequestConfirmationToClient,
  sendWebsiteRequestStatusToClient,
  notifyNewAppointment,
  sendAppointmentConfirmationToClient,
  sendAppointmentStatusToClient,
  notifyContactMessage,
  notifyReviewSubmitted,
  sendReviewSubmittedConfirmationToClient,
  sendReviewDecisionToClient,
  sendContractToClient,
  sendContractStatusToClient,
  notifyContractAccepted,
  sendContractAcceptedToClient,
  notifyContractClientNote,
};
