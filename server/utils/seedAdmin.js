const User = require("../models/User");

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log("Admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD missing");
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  await User.create({
    name: process.env.ADMIN_FULL_NAME || "Web District Admin",
    email: adminEmail,
    phone: process.env.ADMIN_PHONE || "",
    password: adminPassword,
    role: "admin",
    isActive: true,
  });

  console.log("Admin created successfully");
};

module.exports = seedAdmin;