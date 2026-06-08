const DEFAULT_API_BASE_URL = "http://localhost:5000/api";
const DEFAULT_TIMEOUT_MS = 30000;

const normalizeBaseUrl = (value) =>
  String(value || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");

const API_BASE_URL = normalizeBaseUrl(process.env.API_BASE_URL);

const getTimeoutMs = () => {
  const configured = Number(process.env.QA_REQUEST_TIMEOUT_MS);

  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_TIMEOUT_MS;
};

const getUrl = (path) =>
  `${API_BASE_URL}/${String(path || "").replace(/^\/+/, "")}`;

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  let data = null;

  if (text && contentType.includes("application/json")) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  return {
    response,
    status: response.status,
    contentType,
    text,
    data,
  };
};

const request = async (
  path,
  { method = "GET", token, body, headers = {}, timeoutMs } = {}
) => {
  const controller = new AbortController();
  const timerId = setTimeout(
    () => controller.abort(),
    timeoutMs || getTimeoutMs()
  );

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(getUrl(path), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    return await parseResponse(response);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        `${method} ${path} timed out after ${timeoutMs || getTimeoutMs()}ms`
      );
    }

    throw new Error(`${method} ${path} failed: ${error.message}`);
  } finally {
    clearTimeout(timerId);
  }
};

const assertJson = (result, label) => {
  if (!result.contentType.includes("application/json") || result.data === null) {
    const preview = result.text.trim().slice(0, 120);
    throw new Error(
      `${label} returned non-JSON content (${result.contentType || "unknown"})${
        preview ? `: ${preview}` : ""
      }`
    );
  }
};

const assertOkJson = (result, label) => {
  assertJson(result, label);

  if (!result.response.ok) {
    throw new Error(
      `${label} returned ${result.status}: ${
        result.data?.message || "request failed"
      }`
    );
  }
};

const assertArray = (value, label) => {
  if (!Array.isArray(value)) {
    throw new Error(`${label} was expected to be an array`);
  }
};

const printHeader = (title) => {
  console.log(`\n${title}`);
  console.log("=".repeat(title.length));
};

const printResult = ({ label, passed, detail }) => {
  const marker = passed ? "PASS" : "FAIL";
  console.log(`[${marker}] ${label}${detail ? ` - ${detail}` : ""}`);
};

const runChecks = async (title, checks) => {
  printHeader(title);

  const results = [];

  for (const check of checks) {
    try {
      const detail = await check.run();
      const result = {
        label: check.label,
        passed: true,
        detail,
      };
      results.push(result);
      printResult(result);
    } catch (error) {
      const result = {
        label: check.label,
        passed: false,
        detail: error.message,
      };
      results.push(result);
      printResult(result);
    }
  }

  const passed = results.filter((result) => result.passed).length;
  const failed = results.length - passed;

  console.log(`\nSummary: ${passed} passed, ${failed} failed`);

  if (failed) {
    const error = new Error(`${title} failed`);
    error.results = results;
    throw error;
  }

  return results;
};

const isTrue = (value) => String(value || "").toLowerCase() === "true";

const isProductionTarget = () => {
  try {
    const hostname = new URL(API_BASE_URL).hostname.toLowerCase();

    return (
      hostname === "web-district.onrender.com" ||
      hostname === "www.web-district.com" ||
      hostname === "web-district.com"
    );
  } catch {
    return false;
  }
};

const getAdminCredentials = () => ({
  email: String(process.env.QA_ADMIN_EMAIL || "").trim(),
  password: String(process.env.QA_ADMIN_PASSWORD || ""),
});

const loginAdmin = async () => {
  const credentials = getAdminCredentials();

  if (!credentials.email || !credentials.password) {
    return {
      skipped: true,
      reason: "QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD are not both configured",
    };
  }

  const result = await request("/auth/login", {
    method: "POST",
    body: credentials,
  });

  assertOkJson(result, "Admin login");

  if (!result.data?.token) {
    throw new Error("Admin login did not return a token");
  }

  if (result.data?.user?.role !== "admin") {
    throw new Error("Configured QA credentials do not belong to an admin");
  }

  return {
    skipped: false,
    token: result.data.token,
    user: result.data.user,
  };
};

module.exports = {
  API_BASE_URL,
  assertArray,
  assertJson,
  assertOkJson,
  getAdminCredentials,
  isProductionTarget,
  isTrue,
  loginAdmin,
  printHeader,
  printResult,
  request,
  runChecks,
};
