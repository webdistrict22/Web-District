require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const seedAdmin = require("../utils/seedAdmin");

const runSeed = async () => {
  try {
    await connectDB();

    await seedAdmin();

    console.log("Seed completed successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeed();