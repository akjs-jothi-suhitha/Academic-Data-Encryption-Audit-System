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

    return res.json({
      success: true,
      recordsByDepartment,
      auditByAction,
      usersByRole,
    });

  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching analytics data",
    });
  }
};