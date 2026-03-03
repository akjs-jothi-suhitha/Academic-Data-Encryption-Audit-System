const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    action: {
      type: DataTypes.ENUM("CREATE", "VIEW", "UPDATE", "DELETE"),
      allowNull: false,
    },

    ip_address: {
      type: DataTypes.STRING,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    record_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "audit_logs",
  }
);

module.exports = AuditLog;