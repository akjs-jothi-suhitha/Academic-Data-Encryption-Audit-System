const { sequelize } = require("../config/db");

const User = require("./User");
const AcademicRecord = require("./AcademicRecord");
const AuditLog = require("./AuditLog");

/*
=====================================
RELATIONSHIPS
=====================================
*/

// 🔹 User → Academic Records
User.hasMany(AcademicRecord, {
  foreignKey: "created_by",
  onDelete: "CASCADE",
});

AcademicRecord.belongsTo(User, {
  foreignKey: "created_by",
});

// 🔹 User → Audit Logs
User.hasMany(AuditLog, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

AuditLog.belongsTo(User, {
  foreignKey: "user_id",
});

// 🔹 Academic Record → Audit Logs
AcademicRecord.hasMany(AuditLog, {
  foreignKey: "record_id",
  onDelete: "CASCADE",
});

AuditLog.belongsTo(AcademicRecord, {
  foreignKey: "record_id",
});

module.exports = {
  sequelize,
  User,
  AcademicRecord,
  AuditLog,
};