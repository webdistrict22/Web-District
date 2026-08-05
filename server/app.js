const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { requestContext } = require("./middleware/requestContext");
const { rejectUnsafeKeys } = require("./middleware/requestSecurity");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { ready } = require("./controllers/healthController");

const app = express();
const production = process.env.NODE_ENV === "production";
const normalizeOrigin = (value) => { try { return new URL(String(value || "")).origin; } catch { return ""; } };
const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  ...String(process.env.ALLOWED_ORIGINS || "").split(","),
  ...(production ? [] : ["http://localhost:5173", "http://localhost:3000"]),
].map((value) => normalizeOrigin(value.trim())).filter(Boolean));

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(requestContext);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) return callback(null, true);
    return callback(new Error("CORS blocked origin"));
  },
  credentials: true,
  optionsSuccessStatus: 204,
  exposedHeaders: ["X-Request-ID"],
}));
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false, limit: "64kb", parameterLimit: 100 }));
app.use(rejectUnsafeKeys);
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: true, legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { success: false, code: "RATE_LIMITED", message: "Too many requests. Please try again later." },
}));

app.get("/", (req, res) => res.json({ success: true, message: "Web District API is running" }));
app.get("/api/health", ready);
app.use("/api/health", require("./routes/healthRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/contracts", require("./routes/contractRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/faqs", require("./routes/faqRoutes"));
app.use("/api/packages", require("./routes/packageRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
