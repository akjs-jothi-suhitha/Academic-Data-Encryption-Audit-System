const express = require("express");
const router = express.Router();

const auditController = require("../controllers/auditController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

/*
====================================================
AUDIT ROUTES (Admin Protected)
====================================================
*/

// Get paginated logs with filter
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  auditController.getAuditLogs
);

// Export filtered logs as CSV
router.get(
  "/export",
  verifyToken,
  authorizeRoles("admin"),
  auditController.exportAuditLogs
);

module.exports = router;