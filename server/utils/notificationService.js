const sendEmail = require("./sendEmail");

const getOwnerEmail = () => {
  return process.env.OWNER_EMAIL || process.env.EMAIL_USER;
};

const layout = ({ title, intro, rows = [], ctaText, ctaUrl }) => {
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 0;color:#64748b;font-size:14px;width:160px;vertical-align:top;">
            ${row.label}
          </td>
          <td style="padding:10px 0;color:#0f172a;font-size:14px;font-weight:600;vertical-align:top;">
            ${row.value || "—"}
          </td>
        </tr>
      `
    )
    .join("");

  const ctaHtml =
    ctaText && ctaUrl
      ? `
        <div style="margin-top:28px;">
          <a href="${ctaUrl}" style="display:inline-block;background:#C69A4E;color:#020817;text-decoration:none;padding:12px 18px;border-radius:14px;font-weight:700;font-size:14px;">
            ${ctaText}
          </a>
        </div>
      `
      : "";

  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:680px;margin:0 auto;padding:28px;">
        <div style="background:#020817;border-radius:22px;padding:28px;color:#ffffff;">
          <p style="margin:0;color:#C69A4E;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
            Web District
          </p>
          <h1 style="margin:12px 0 0;font-size:28px;line-height:1.15;color:#ffffff;">
            ${title}
          </h1>
          <p style="margin:16px 0 0;color:#94a3b8;font-size:15px;line-height:1.7;">
            ${intro}
          </p>
        </div>

        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:22px;margin-top:18px;padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${rowsHtml}
          </table>

          ${ctaHtml}
        </div>

        <p style="margin:18px 0 0;text-align:center;color:#94a3b8;font-size:12px;">
          This email was sent automatically from the Web District website.
        </p>
      </div>
    </div>
  `;
};

const safeSend = async (payload) => {
  try {
    return await sendEmail(payload);
  } catch (error) {
    console.error("Email notification failed:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

const notifyNewWebsiteRequest = async (request) => {
  return safeSend({
    to: getOwnerEmail(),
    subject: `New Website Request — ${request.businessName || request.name}`,
    html: layout({
      title: "New website request",
      intro:
        "A new website request was submitted through the Web District website.",
      rows: [
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
      ],
    }),
    text: `New website request from ${request.name}`,
  });
};

const notifyNewAppointment = async (appointment) => {
  return safeSend({
    to: getOwnerEmail(),
    subject: `New Call Appointment — ${appointment.businessName || appointment.name}`,
    html: layout({
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
            ? `${appointment.slot.date} — ${appointment.slot.startTime} to ${appointment.slot.endTime}`
            : "Slot not loaded",
        },
      ],
    }),
    text: `New appointment from ${appointment.name}`,
  });
};

const notifyContactMessage = async (message) => {
  return safeSend({
    to: getOwnerEmail(),
    subject: `New Contact Message — ${message.subject || "Website inquiry"}`,
    html: layout({
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
  });
};

const notifyContractAccepted = async (contract) => {
  return safeSend({
    to: getOwnerEmail(),
    subject: `Contract Accepted — ${contract.businessName || contract.clientName}`,
    html: layout({
      title: "Contract accepted",
      intro: "A client accepted a proposal/contract from their dashboard.",
      rows: [
        { label: "Contract", value: contract.title },
        { label: "Client", value: contract.clientName },
        { label: "Business", value: contract.businessName },
        { label: "Email", value: contract.clientEmail },
        { label: "Phone", value: contract.clientPhone },
        { label: "Website type", value: contract.websiteType },
        {
          label: "Total price",
          value: contract.totalPrice
            ? `${contract.totalPrice.toLocaleString()} EGP`
            : "Not set",
        },
        {
          label: "Deposit",
          value: contract.depositAmount
            ? `${contract.depositAmount.toLocaleString()} EGP`
            : "Not set",
        },
        { label: "Client note", value: contract.clientNotes },
      ],
    }),
    text: `Contract accepted by ${contract.clientName}`,
  });
};

const sendAppointmentConfirmationToClient = async (appointment) => {
  return safeSend({
    to: appointment.email,
    subject: "Your Web District call appointment is booked",
    html: layout({
      title: "Your call is booked",
      intro:
        "Your call appointment with Web District has been booked successfully. We’ll use the call to understand your business and website direction.",
      rows: [
        { label: "Name", value: appointment.name },
        { label: "Business", value: appointment.businessName },
        { label: "Topic", value: appointment.topic },
        {
          label: "Slot",
          value: appointment.slot
            ? `${appointment.slot.date} — ${appointment.slot.startTime} to ${appointment.slot.endTime}`
            : "Slot not loaded",
        },
      ],
    }),
    text: "Your Web District call appointment is booked.",
  });
};

module.exports = {
  notifyNewWebsiteRequest,
  notifyNewAppointment,
  notifyContactMessage,
  notifyContractAccepted,
  sendAppointmentConfirmationToClient,
};