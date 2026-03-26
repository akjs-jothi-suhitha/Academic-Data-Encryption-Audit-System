const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { connectDB } = require("./config/db");
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const academicRoutes = require("./routes/academicRoutes");
const auditRoutes = require("./routes/auditRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/*
==================================================
SECURITY & GLOBAL MIDDLEWARE
==================================================
*/

// Secure HTTP headers
app.use(helmet());

// CORS configuration for React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});

app.use(limiter);

/*
==================================================
API ROUTES
==================================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/records", academicRoutes);
app.use("/api/audit", auditRoutes);   // ✅ Updated route
app.use("/api/admin", adminRoutes);

/*
==================================================
HEALTH CHECK ROUTE
==================================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Academic Data Encryption & Audit System API Running",
  });
});

/*
==================================================
GLOBAL ERROR HANDLER (Optional but Professional)
==================================================
*/

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/*
==================================================
DATABASE CONNECTION & SERVER START
==================================================
*/

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await sequelize.sync({ alter: true });
    console.log("✅ Database connected & tables synced");

    // Auto-seed admin user if none exists
    const { User } = require("./models");
    const bcrypt = require("bcryptjs");
    const adminExists = await User.findOne({ where: { role: "admin" } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "System Admin",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Default Admin created: admin@test.com / admin123");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();