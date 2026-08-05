export const ANALYTICS_CONSENT_KEY = "webDistrictAnalyticsConsent";
export const ANALYTICS_CONSENT_EVENT = "webDistrictAnalyticsConsentChanged";

export const getAnalyticsConsent = () => {
  if (typeof window === "undefined") return "unset";
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return ["accepted", "rejected"].includes(value) ? value : "unset";
};

export const setAnalyticsConsent = (value) => {
  if (!["accepted", "rejected"].includes(value)) return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
};

export const clearAnalyticsConsent = () => {
  window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: "unset" }));
};

export const isPrivatePath = (path = window.location.pathname) =>
  path === "/admin" || path.startsWith("/admin/") || path === "/account" || path.startsWith("/account/");
