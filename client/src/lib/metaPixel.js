const META_PIXEL_ID = String(
  import.meta.env.VITE_META_PIXEL_ID || ""
).trim();

const META_PIXEL_SCRIPT_ID = "web-district-meta-pixel";
const META_PIXEL_SCRIPT_URL =
  "https://connect.facebook.net/en_US/fbevents.js";
const INITIALIZED_PIXEL_IDS_KEY = "__webDistrictMetaPixelIds";
const SAFE_PARAM_KEYS = new Set([
  "page_path",
  "page_title",
  "content_name",
  "content_category",
  "button_name",
  "contact_method",
  "project_slug",
  "language",
  "lead_type",
]);

let initialized = false;
let scriptRequested = false;

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const hasValidPixelId = () => /^\d{5,30}$/.test(META_PIXEL_ID);

const isExcludedPath = (pathname) =>
  pathname === "/admin" ||
  pathname.startsWith("/admin/") ||
  pathname === "/account" ||
  pathname.startsWith("/account/");

const getSafePagePath = (pathname) => {
  if (pathname.startsWith("/reset-password/")) {
    return "/reset-password/:token";
  }

  return pathname;
};

const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return value.trim().slice(0, 160);
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return undefined;
};

const sanitizeParams = (params = {}) =>
  Object.entries(params).reduce((safeParams, [key, value]) => {
    if (!SAFE_PARAM_KEYS.has(key)) return safeParams;

    const safeValue = sanitizeValue(value);

    if (safeValue !== undefined && safeValue !== "") {
      safeParams[key] = safeValue;
    }

    return safeParams;
  }, {});

const withPageContext = (params = {}) => {
  if (!isBrowser()) return sanitizeParams(params);

  return sanitizeParams({
    page_path: getSafePagePath(window.location.pathname),
    page_title: document.title,
    ...params,
  });
};

const installFbqQueue = () => {
  if (typeof window.fbq === "function") return;

  const fbq = function metaPixelQueue() {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, arguments);
      return;
    }

    fbq.queue.push(arguments);
  };

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  window._fbq = window._fbq || fbq;
};

const requestPixelScript = () => {
  if (scriptRequested) return;

  const existingScript =
    document.getElementById(META_PIXEL_SCRIPT_ID) ||
    document.querySelector(
      'script[src*="connect.facebook.net"][src*="fbevents.js"]'
    );

  if (existingScript) {
    scriptRequested = true;
    return;
  }

  const script = document.createElement("script");
  script.id = META_PIXEL_SCRIPT_ID;
  script.async = true;
  script.src = META_PIXEL_SCRIPT_URL;

  const firstScript = document.getElementsByTagName("script")[0];

  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  scriptRequested = true;
};

export const initMetaPixel = () => {
  if (!isBrowser() || !hasValidPixelId()) return false;
  if (initialized) return true;

  try {
    installFbqQueue();
    requestPixelScript();

    if (typeof window.fbq !== "function") return false;

    const initializedPixelIds =
      window[INITIALIZED_PIXEL_IDS_KEY] instanceof Set
        ? window[INITIALIZED_PIXEL_IDS_KEY]
        : new Set();

    window[INITIALIZED_PIXEL_IDS_KEY] = initializedPixelIds;

    if (!initializedPixelIds.has(META_PIXEL_ID)) {
      window.fbq("init", META_PIXEL_ID);
      initializedPixelIds.add(META_PIXEL_ID);
    }

    initialized = true;
    return true;
  } catch {
    return false;
  }
};

const sendEvent = (command, eventName, params = {}) => {
  if (isBrowser() && isExcludedPath(window.location.pathname)) return false;
  if (!initMetaPixel() || typeof window.fbq !== "function") return false;

  try {
    window.fbq(command, eventName, withPageContext(params));
    return true;
  } catch {
    return false;
  }
};

export const trackPageView = (params = {}) =>
  sendEvent("track", "PageView", params);

export const trackViewContent = (name, params = {}) =>
  sendEvent("track", "ViewContent", {
    ...params,
    content_name: name,
  });

export const trackLead = (params = {}) =>
  sendEvent("track", "Lead", params);

export const trackContact = (method, params = {}) =>
  sendEvent("track", "Contact", {
    ...params,
    contact_method: method,
  });

export const trackCustomEvent = (eventName, params = {}) => {
  if (!/^[A-Za-z][A-Za-z0-9_]{0,49}$/.test(eventName)) return false;

  return sendEvent("trackCustom", eventName, params);
};
