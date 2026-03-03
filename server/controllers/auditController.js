const { AuditLog, User } = require("../models");

/*
====================================================
GET ALL AUDIT LOGS (Admin Only)
====================================================
*/
exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { action } = req.query;

    let whereCondition = {};

    if (action) {
      whereCondition.action = action;
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      success: true,
      totalLogs: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });

  } catch (error) {
    console.error("AUDIT GET ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching audit logs",
    });
  }
};

/*
====================================================
EXPORT AUDIT LOGS (CSV)
====================================================
*/
exports.exportAuditLogs = async (req, res) => {
  try {
    const { action } = req.query;

    let whereCondition = {};
    if (action) {
      whereCondition.action = action;
    }

    const logs = await AuditLog.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ["name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    let csv =
      "Action,User Name,User Email,Role,Record ID,IP Address,Date\n";

    logs.forEach((log) => {
      csv += `${log.action},${log.User?.name || ""},${log.User?.email || ""},${log.User?.role || ""},${log.record_id || ""},${log.ip_address || ""},${log.createdAt}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("audit_logs.csv");
    res.send(csv);

  } catch (error) {
    console.error("AUDIT EXPORT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error exporting audit logs",
    });
  }
};