const express = require("express");
const router = express.Router();

const academicController = require("../controllers/academicController");
const { verifyToken } = require("../middleware/authMiddleware");

// CREATE
router.post("/", verifyToken, academicController.createRecord);

// READ
router.get("/", verifyToken, academicController.getRecords);

// UPDATE
router.put("/:id", verifyToken, academicController.updateRecord);

// DELETE
router.delete("/:id", verifyToken, academicController.deleteRecord);

module.exports = router;