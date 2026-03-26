import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchAnalytics();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/admin/analytics");
      if (res.data.success) {
        setAnalytics(res.data);
      }
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats || !analytics) {
    return (
      <Layout>
        <div className="text-center mt-20 text-gray-600">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b"];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-700 mb-8">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard title="Total Users" value={stats.totalUsers} />
        <DashboardCard title="Total Admins" value={stats.totalAdmins} />
        <DashboardCard title="Total Faculty" value={stats.totalFaculty} />
        <DashboardCard title="Total Records" value={stats.totalRecords} />
        <DashboardCard title="Total Audit Logs" value={stats.totalAuditLogs} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Records Per Department */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="font-semibold mb-4">
            Records per Department
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.recordsByDepartment}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audit Actions Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="font-semibold mb-4">
            Audit Actions Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.auditByAction}
                dataKey="count"
                nameKey="action"
                outerRadius={100}
                label
              >
                {analytics.auditByAction.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Users By Role */}
        <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
          <h2 className="font-semibold mb-4">
            Users by Role
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.usersByRole}>
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
          <h2 className="font-semibold mb-4">Activity Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.activityOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </Layout>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;