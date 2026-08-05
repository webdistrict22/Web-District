const crypto = require("crypto");

const REFRESH_COOKIE = "wd_refresh";
const CSRF_COOKIE = "wd_csrf";

const parseCookies = (req) => String(req.headers.cookie || "").split(";").reduce((cookies, part) => {
  const index = part.indexOf("=");
  if (index > 0) cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
  return cookies;
}, {});

const refreshDays = () => {
  const value = Number(process.env.REFRESH_TOKEN_DAYS || 30);
  return Number.isInteger(value) && value >= 1 && value <= 90 ? value : 30;
};

const baseOptions = () => {
  const production = process.env.NODE_ENV === "production";
  return { secure: production, sameSite: production ? "none" : "lax", path: "/api/auth" };
};

const serializeCookie = (name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite[0].toUpperCase()}${options.sameSite.slice(1)}`);
  if (options.path) parts.push(`Path=${options.path}`);
  return parts.join("; ");
};

const appendCookie = (res, cookie) => {
  const current = res.getHeader("Set-Cookie");
  res.setHeader("Set-Cookie", current ? [...(Array.isArray(current) ? current : [current]), cookie] : [cookie]);
};

const setRefreshCookie = (res, token) => appendCookie(res, serializeCookie(REFRESH_COOKIE, token, { ...baseOptions(), httpOnly: true, maxAge: refreshDays() * 86400000 }));
const clearRefreshCookie = (res) => appendCookie(res, serializeCookie(REFRESH_COOKIE, "", { ...baseOptions(), httpOnly: true, expires: new Date(0), maxAge: 0 }));
const issueCsrfToken = (res) => {
  const token = crypto.randomBytes(32).toString("base64url");
  appendCookie(res, serializeCookie(CSRF_COOKIE, token, { ...baseOptions(), httpOnly: false, maxAge: refreshDays() * 86400000 }));
  return token;
};
const clearCsrfCookie = (res) => appendCookie(res, serializeCookie(CSRF_COOKIE, "", { ...baseOptions(), httpOnly: false, expires: new Date(0), maxAge: 0 }));

module.exports = { REFRESH_COOKIE, CSRF_COOKIE, parseCookies, refreshDays, setRefreshCookie, clearRefreshCookie, issueCsrfToken, clearCsrfCookie };
