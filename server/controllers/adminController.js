const { AcademicRecord, AuditLog, User } = require("../models");
const { Sequelize } = require("sequelize");

/*
====================================================
ADMIN DASHBOARD STATS
====================================================
*/
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAdmins = await User.count({ where: { role: "admin" } });
    const totalFaculty = await User.count({ where: { role: "faculty" } });
    const totalRecords = await AcademicRecord.count();
    const totalAuditLogs = await AuditLog.count();

    return res.json({
      success: true,
      totalUsers,
      totalAdmins,
      totalFaculty,
      totalRecords,
      totalAuditLogs,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
    });
  }
};


/*
====================================================
ADMIN ANALYTICS DASHBOARD
====================================================
*/
exports.getAnalytics = async (req, res) => {
  try {
    // 📊 Records per department
    const recordsByDepartmentRaw = await AcademicRecord.findAll({
      attributes: [
        "department",
        [Sequelize.fn("COUNT", Sequelize.col("department")), "count"],
      ],
      group: ["department"],
    });

    const recordsByDepartment = recordsByDepartmentRaw.map((item) => ({
      department: item.department,
      count: parseInt(item.dataValues.count),
    }));

    // 📈 Audit logs per action
    const auditByActionRaw = await AuditLog.findAll({
      attributes: [
        "action",
        [Sequelize.fn("COUNT", Sequelize.col("action")), "count"],
      ],
      group: ["action"],
    });

    const auditByAction = auditByActionRaw.map((item) => ({
      action: item.action,
      count: parseInt(item.dataValues.count),
    }));

    // 👥 Users per role
    const usersByRoleRaw = await User.findAll({
      attributes: [
        "role",
        [Sequelize.fn("COUNT", Sequelize.col("role")), "count"],
      ],
      group: ["role"],
    });

    const usersByRole = usersByRoleRaw.map((item) => ({
      role: item.role,
      count: parseInt(item.dataValues.count),
    }));

    // 📈 Activity over time (Group by Date)
    const activityRaw = await AuditLog.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
      limit: 14 // Last 14 days
    });

    const activityOverTime = activityRaw.map((item) => ({
      date: item.dataValues.date,
      count: parseInt(item.dataValues.count),
    }));

    return res.json({
      success: true,
      recordsByDepartment,
      auditByAction,
      usersByRole,
      activityOverTime,
    });

  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
    });
  }
};

/*
====================================================
FACULTY MANAGEMENT
====================================================
*/
const bcrypt = require("bcryptjs");

exports.getFacultyList = async (req, res) => {
  try {
    const facultyList = await User.findAll({
      where: { role: "faculty" },
      attributes: { exclude: ["password"] },
    });
    return res.json({ success: true, facultyList });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching faculty" });
  }
};

exports.addFaculty = async (req, res) => {
  try {
    const { name, email, department, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = await User.create({
      name,
      email,
      department,
      password: hashedPassword,
      role: "faculty",
    });
    return res.json({ success: true, message: "Faculty added successfully", faculty });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error adding faculty", error });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, department, password } = req.body;
    
    const user = await User.findOne({ where: { id, role: "faculty" } });
    if (!user) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.department = department || user.department;
    
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    return res.json({ success: true, message: "Faculty updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating faculty", error });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id, role: "faculty" } });
    if (!user) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    await user.destroy();
    return res.json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting faculty", error });
  }
};