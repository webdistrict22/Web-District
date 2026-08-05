const crypto = require("crypto");
const { log } = require("../utils/logger");
const { recordRequest } = require("../services/metricsService");

const safeId = (value) => /^[A-Za-z0-9._:-]{8,100}$/.test(String(value || "")) ? String(value) : "";

const requestContext = (req, res, next) => {
  req.requestId = safeId(req.get("X-Request-ID")) || crypto.randomUUID();
  res.set("X-Request-ID", req.requestId);
  const started = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - started) / 1e6;
    recordRequest(res.statusCode, durationMs);
    log(res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info", "http_request", {
      requestId: req.requestId, method: req.method, route: req.route?.path || req.path,
      status: res.statusCode, durationMs: Math.round(durationMs * 100) / 100,
    });
  });
  next();
};

module.exports = { requestContext, safeId };
