const { AcademicRecord } = require("../models");
const { encrypt, decrypt } = require("../utils/encryption");

/*
====================================================
CREATE RECORD
====================================================
*/
exports.createRecord = async (req, res) => {
  try {
    const {
      student_name,
      roll_number,
      department,
      semester,
      gpa,
      remarks,
    } = req.body;

    // ✅ Input validation
    if (!student_name || !roll_number || !department || !semester || !gpa) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newRecord = await AcademicRecord.create({
      student_name: encrypt(student_name),
      roll_number: encrypt(roll_number),
      department,
      semester,
      gpa,
      remarks: remarks || "",
    });

    res.status(201).json({
      success: true,
      message: "Record created successfully",
      data: newRecord,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating record",
    });
  }
};

/*
====================================================
GET RECORDS
====================================================
*/
exports.getRecords = async (req, res) => {
  try {
    const records = await AcademicRecord.findAll({
      order: [["createdAt", "DESC"]],
    });

    const decrypted = records.map((r) => ({
      id: r.id,
      student_name: decrypt(r.student_name),
      roll_number: decrypt(r.roll_number),
      department: r.department,
      semester: r.semester,
      gpa: r.gpa,
      remarks: r.remarks,
    }));

    res.json({
      success: true,
      data: decrypted,
    });

  } catch (error) {
    console.error("GET ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching records",
    });
  }
};

/*
====================================================
UPDATE RECORD
====================================================
*/
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await AcademicRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    const {
      student_name,
      roll_number,
      department,
      semester,
      gpa,
      remarks,
    } = req.body;

    if (!student_name || !roll_number || !department || !semester || !gpa) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    await record.update({
      student_name: encrypt(student_name),
      roll_number: encrypt(roll_number),
      department,
      semester,
      gpa,
      remarks: remarks || "",
    });

    res.json({
      success: true,
      message: "Record updated successfully",
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating record",
    });
  }
};

/*
====================================================
DELETE RECORD
====================================================
*/
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await AcademicRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await record.destroy();

    res.json({
      success: true,
      message: "Record deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting record",
    });
  }
};