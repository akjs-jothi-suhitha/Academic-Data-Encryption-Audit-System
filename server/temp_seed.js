require('dotenv').config();
const { User } = require("./models");
const bcrypt = require("bcryptjs");
const { connectDB } = require("./config/db");

async function seed() {
  await connectDB();
  const hp = await bcrypt.hash("123456", 10);
  
  // admin
  const admin = await User.findOne({ where: { email: "admin@test.com" } });
  if (admin) {
    admin.password = hp;
    admin.role = "admin";
    await admin.save();
  } else {
    await User.create({ email: "admin@test.com", name: "Admin", password: hp, role: "admin" });
  }

  // faculty
  const faculty = await User.findOne({ where: { email: "faculty@test.com" } });
  if (faculty) {
    faculty.password = hp;
    faculty.role = "faculty";
    await faculty.save();
  } else {
    await User.create({ email: "faculty@test.com", name: "Faculty", password: hp, role: "faculty" });
  }

  console.log("SEEDED CREDENTIALS FOR ADMIN AND FACULTY SUCCESSFULLY!");
  process.exit(0);
}

seed();
