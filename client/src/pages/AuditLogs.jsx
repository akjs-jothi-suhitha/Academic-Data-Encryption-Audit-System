import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const limit = 5;

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/audit", {
        params: { page, limit, action: actionFilter || undefined },
      });

      setLogs(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await API.get("/audit/export", {
        params: { action: actionFilter || undefined },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "audit_logs.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Audit logs exported successfully");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Audit Logs
      </h1>

      <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 flex justify-between items-center">
        <select
          value={actionFilter}
          onChange={(e) => {
            setPage(1);
            setActionFilter(e.target.value);
          }}
          className="border p-2 rounded-lg"
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="VIEW">VIEW</option>
        </select>

        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No audit logs found.</p>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Action</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Record ID</th>
                  <th className="py-2">IP</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-semibold">{log.action}</td>
                    <td className="py-2">{log.User?.name || "Unknown"}</td>
                    <td className="py-2">{log.User?.role || "-"}</td>
                    <td className="py-2">{log.record_id || "-"}</td>
                    <td className="py-2">{log.ip_address}</td>
                    <td className="py-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default AuditLogs;