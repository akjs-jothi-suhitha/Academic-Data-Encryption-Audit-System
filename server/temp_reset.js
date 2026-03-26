require('dotenv').config();
const { sequelize } = require("./config/db");
const { User, AcademicRecord, AuditLog } = require("./models");
const bcrypt = require("bcryptjs");

async function reset() {
  console.log("Forcing table drop and recreation...");
  await sequelize.sync({ force: true });
  console.log("Tables recreated.");

  const hp = await bcrypt.hash("123456", 10);
  
  await User.create({ email: "admin@test.com", name: "System Admin", password: hp, role: "admin", department: "IT" });
  await User.create({ email: "faculty@test.com", name: "Jane Faculty", password: hp, role: "faculty", department: "CS" });
  
  console.log("SEEDED OLD CREDENTIALS SUCCESSFULLY.");
  process.exit(0);
}

reset();
