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

  console.log(`MongoDB connected: ${conn.connection.host}`);

  return conn;
};

module.exports = connectDB;
