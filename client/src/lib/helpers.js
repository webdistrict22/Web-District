const resolveDateLocale = (locale) => (locale === "ar" ? "ar-EG" : locale || "en");

export const formatDate = (date, locale = "en") => {
  if (!date) return "—";

  try {
    return new Intl.DateTimeFormat(resolveDateLocale(locale), {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return "—";
  }
};

export const formatDateTime = (date, locale = "en") => {
  if (!date) return "—";

  try {
    return new Intl.DateTimeFormat(resolveDateLocale(locale), {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  } catch {
    return "—";
  }
};

export const formatMoney = (value, currency = "EGP") => {
  const number = Number(value);

  if (!number) return "Not set";

  return `${number.toLocaleString()} ${currency}`;
};

export const getWhatsappLink = (phone, message = "") => {
  const cleanedPhone = String(phone || "")
    .replace(/\s+/g, "")
    .replace("+", "");

  const egyptFixedPhone = cleanedPhone.startsWith("0")
    ? `20${cleanedPhone.slice(1)}`
    : cleanedPhone;

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${egyptFixedPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
};

export const getInstagramLink = (username = "") => {
  const cleanUsername = username.replace("@", "").trim();

  return `https://instagram.com/${cleanUsername}`;
};

export const truncateText = (text = "", maxLength = 120) => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}...`;
};

export const slugify = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
