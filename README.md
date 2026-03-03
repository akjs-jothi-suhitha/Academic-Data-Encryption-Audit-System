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
