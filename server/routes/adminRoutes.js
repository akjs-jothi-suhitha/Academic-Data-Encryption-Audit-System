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

// 👥 Faculty Management Routes
router.get("/faculty", verifyToken, authorizeRoles("admin"), adminController.getFacultyList);
router.post("/faculty", verifyToken, authorizeRoles("admin"), adminController.addFaculty);
router.put("/faculty/:id", verifyToken, authorizeRoles("admin"), adminController.updateFaculty);
router.delete("/faculty/:id", verifyToken, authorizeRoles("admin"), adminController.deleteFaculty);

module.exports = router;