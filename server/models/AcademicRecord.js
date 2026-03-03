const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AcademicRecord = sequelize.define(
  "AcademicRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roll_number: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gpa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    tableName: "academic_records",
  }
);

module.exports = AcademicRecord;