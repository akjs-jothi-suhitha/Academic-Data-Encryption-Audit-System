const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Registration disabled for public
// router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get Profile
const { verifyToken } = require("../middleware/authMiddleware");
router.get("/profile", verifyToken, authController.getProfile);

module.exports = router;