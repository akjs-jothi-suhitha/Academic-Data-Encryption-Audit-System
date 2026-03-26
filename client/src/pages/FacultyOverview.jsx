import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function FacultyOverview() {
  const [stats, setStats] = useState({ totalActive: 0, actions: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      // Removed audit log query since only Admins should see audit logs
      setStats({ totalActive: 0, actions: 0 });
    } catch (error) {
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Faculty Overview</h1>
        <p className="text-gray-500 mt-1">Summary of your recent activities and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
            📈
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Activities</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? "..." : stats.totalActive}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl">
            ✅
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Recent Updates</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? "..." : stats.actions}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Welcome to your Dashboard</h2>
        </div>
        <div className="p-6">
           <p className="text-gray-500">
              From here, you can manage your students, view academic data, and update your profile. 
              Use the sidebar to navigate through the application.
           </p>
        </div>
      </div>
    </Layout>
  );
}

export default FacultyOverview;
