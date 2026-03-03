# 🎓 Academic Data Encryption & Audit System

A secure full-stack web application for managing academic records with encryption and audit tracking.

This system ensures that sensitive academic data is securely stored using AES encryption and all actions are tracked through an audit logging system.

---

## 🚀 Features

### 🔐 Security
- JWT Authentication
- Role-Based Access Control (Admin / Faculty)
- AES Encryption for Sensitive Academic Data
- Secure HTTP Headers using Helmet
- Express Rate Limiting
- Input Validation
- Global Error Handling Middleware

### 📊 Admin Dashboard
- Total Users
- Total Admins
- Total Faculty
- Total Records
- Total Audit Logs
- Records per Department Chart
- Audit Actions Distribution Chart

### 👨‍🏫 Faculty Dashboard
- Create Academic Records
- View Academic Records
- Update Records
- Delete Records
- Search Records

### 📜 Audit Logging System
- Tracks CREATE, UPDATE, DELETE, VIEW actions
- Role-based visibility (Admin only)
- Filter by action type
- Pagination support
- Export logs as CSV

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- bcrypt Password Hashing
- AES Encryption
- Helmet (Security Headers)
- Express Rate Limit

---

## 📂 Project Structure

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository


git clone https://github.com/akjs-jothi-suhitha/Academic-Data-Encryption-Audit-System.git
cd Academic-Data-Encryption-Audit-System

###2️⃣ Backend Setup
cd server
npm install

Create a .env file inside the server folder:

PORT=5000
DB_NAME=academic_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
AES_SECRET=your_aes_secret

Start the backend server:

npm run dev

Backend runs on:

http://localhost:5000

###3️⃣ Frontend Setup
cd ../client
npm install
npm run dev

Frontend runs on:

http://localhost:5173

###🔌 API Endpoints

Authentication

POST /api/auth/register
POST /api/auth/login

Academic Records

GET /api/records
POST /api/records
PUT /api/records/:id
DELETE /api/records/:id

Audit Logs (Admin Only)
GET /api/audit
GET /api/audit/export

Admin Dashboard
GET /api/admin/dashboard

###🔒 Security Features Implemented

Password hashing using bcrypt
JWT token-based authentication
Role-based authorization
AES encryption for sensitive academic fields
Secure HTTP headers using Helmet
Express rate limiting
Server-side input validation
Global error handling middleware

###📊 System Architecture
Frontend (React)
⬇
Axios API Calls
⬇
Backend (Express.js)
⬇
Sequelize ORM
⬇
MySQL Database (Encrypted Fields)

###🚀 Future Improvements
Deploy application to cloud (Render / Railway)
Add email verification system
Add password reset functionality
Advanced analytics dashboard
Real-time activity monitoring
Department-level access restrictions

###📌 Project Status

✅ Phase 2 Completed
🔐 Fully Functional Full-Stack Application
🛡️ Security Implemented
📊 Dashboard Integrated
📜 Audit Logging Enabled
