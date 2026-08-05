const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { validateEnvironment } = require("./config/env");
const { setEnvironmentStatus } = require("./controllers/healthController");
const { startOutboxWorker, stopOutboxWorker } = require("./services/outboxWorker");
const { startSlotMaintenance, stopSlotMaintenance } = require("./services/slotMaintenanceService");
const { log } = require("./utils/logger");

let server = null;
let shuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  log("info", "shutdown_started", { signal });
  try {
    const shutdownWork = (async () => {
      stopSlotMaintenance();
      await Promise.all([
        stopOutboxWorker(),
        server ? new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) : Promise.resolve(),
      ]);
      await mongoose.disconnect();
    })();
    const deadline = new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        server?.closeAllConnections?.();
        const error = new Error("Graceful shutdown exceeded 15 seconds");
        error.code = "SHUTDOWN_TIMEOUT";
        reject(error);
      }, 15000);
      timeout.unref?.();
    });
    await Promise.race([shutdownWork, deadline]);
    log("info", "shutdown_complete");
  } catch (error) {
    log("error", "shutdown_failed", { code: error.code || error.name });
    process.exitCode = 1;
  }
};

const startServer = async () => {
  try {
    const environment = validateEnvironment();
    setEnvironmentStatus(environment);
    await connectDB();
    const app = require("./app");
    startOutboxWorker();
    startSlotMaintenance();
    const port = Number(process.env.PORT || 5000);
    server = app.listen(port, () => log("info", "server_started", { port, degraded: environment.degraded }));
    process.once("SIGTERM", () => void gracefulShutdown("SIGTERM"));
    process.once("SIGINT", () => void gracefulShutdown("SIGINT"));
  } catch (error) {
    log("error", "server_startup_failed", { code: error.code || error.name, message: error.message });
    process.exitCode = 1;
  }
};

void startServer();
module.exports = { startServer, gracefulShutdown };
