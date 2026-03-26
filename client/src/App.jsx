import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyManagement from "./pages/FacultyManagement";
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyOverview from "./pages/FacultyOverview";
import FacultyProfile from "./pages/FacultyProfile";
import AuditLogs from "./pages/AuditLogs";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ========================================= */}
      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      {/* ========================================= */}
      {/* Admin Routes */}
      {/* ========================================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute role="admin">
            <FacultyManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute role="admin">
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* ========================================= */}
      {/* Faculty Routes */}
      {/* ========================================= */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute role="faculty">
            <FacultyOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/profile"
        element={
          <ProtectedRoute role="faculty">
            <FacultyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/data"
        element={
          <ProtectedRoute role="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      {/* ========================================= */}

      {/* ========================================= */}
      {/* Fallback Route */}
      {/* ========================================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;