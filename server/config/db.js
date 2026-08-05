const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  let conn;

  try {
    conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    throw new Error(
      `MongoDB connection failed (${error.name || "connection error"})`
    );
  }

  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: "info", event: "mongodb_connected" }));

  return conn;
};

module.exports = connectDB;
