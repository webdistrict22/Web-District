export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const getWhatsappLink = (phone, message = "") => {
  const cleanPhone = phone.startsWith("2") ? phone : `2${phone}`;
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ""}`;
};

export const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};