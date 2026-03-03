const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

/*
====================================================
ADMIN ROUTES (Protected)
====================================================
*/

// 📊 Dashboard summary stats
router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("admin"),
  adminController.getDashboardStats
);

// 📈 Analytics endpoint
router.get(
  "/analytics",
  verifyToken,
  authorizeRoles("admin"),
  adminController.getAnalytics
);

module.exports = router;