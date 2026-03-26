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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  const limit = 10;

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, startDate, endDate, userIdFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/audit", {
        params: { 
          page, 
          limit, 
          action: actionFilter || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          user_id: userIdFilter || undefined
        },
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
        params: { 
            action: actionFilter || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            user_id: userIdFilter || undefined
        },
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Audit Logs
        </h1>
        <p className="text-gray-500 mt-1">Review system activities and track data access</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => { setPage(1); setActionFilter(e.target.value); }}
                className="border p-2 rounded-lg bg-gray-50 w-36"
              >
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="VIEW">VIEW</option>
                <option value="LOGIN">LOGIN</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => {setPage(1); setStartDate(e.target.value);}} className="border p-2 rounded-lg bg-gray-50 max-w-40" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
              <input type="date" value={endDate} onChange={(e) => {setPage(1); setEndDate(e.target.value);}} className="border p-2 rounded-lg bg-gray-50 max-w-40" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">User ID</label>
              <input type="text" placeholder="ID" value={userIdFilter} onChange={(e) => {setPage(1); setUserIdFilter(e.target.value);}} className="border p-2 rounded-lg bg-gray-50 max-w-24" />
            </div>
        </div>

        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm font-medium"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <p className="text-gray-500 py-4 text-center">Loading audit logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No audit logs found matching the filters.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">User</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Data Affected (Record ID)</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">IP</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const isSuspicious = log.action === "DELETE";

                    return (
                    <tr key={log.id} className={`border-b border-gray-100 hover:bg-gray-50 transition ${isSuspicious ? "bg-red-50 hover:bg-red-100" : ""}`}>
                      <td className="py-3 px-4">
                         <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                            log.action === "DELETE" ? "bg-red-200 text-red-800" : 
                            log.action === "CREATE" ? "bg-green-200 text-green-800" : 
                            log.action === "UPDATE" ? "bg-yellow-200 text-yellow-800" : 
                            log.action === "LOGIN" ? "bg-purple-200 text-purple-800" : "bg-blue-200 text-blue-800"
                         }`}>
                           {log.action}
                         </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">{log.User?.name || "Unknown"}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.User?.role || "-"}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.record_id || "-"}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 font-mono">{log.ip_address}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition text-sm font-medium shadow-sm"
              >
                Previous
              </button>

              <span className="font-medium text-sm text-gray-600">
                Page <span className="text-gray-900">{page}</span> of <span className="text-gray-900">{totalPages}</span>
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition text-sm font-medium shadow-sm"
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