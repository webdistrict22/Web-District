const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const isApplyMode = () => process.argv.includes("--apply");

const requireApplyGuard = () => {
  if (!isApplyMode()) return false;
  if (process.env.ALLOW_MAINTENANCE_APPLY !== "YES") {
    throw new Error("Apply mode requires ALLOW_MAINTENANCE_APPLY=YES");
  }
  return true;
};

const connect = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
};

const finish = async () => {
  await mongoose.disconnect();
};

const run = async (work) => {
  try {
    await connect();
    await work();
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }));
    process.exitCode = 1;
  } finally {
    await finish();
  }
};

module.exports = { isApplyMode, requireApplyGuard, run };
