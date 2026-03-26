import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function FacultyDashboard() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [gpa, setGpa] = useState("");
  const [remarks, setRemarks] = useState("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get("/records", {
        params: { search },
      });
      setRecords(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStudentName("");
    setRollNumber("");
    setDepartment("");
    setSemester("");
    setGpa("");
    setRemarks("");
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!studentName || !rollNumber || !department || !semester || !gpa) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      setCreating(true);

      if (editId) {
        await API.put(`/records/${editId}`, {
          student_name: studentName,
          roll_number: rollNumber,
          department,
          semester,
          gpa,
          remarks,
        });
        toast.success("Record updated successfully");
      } else {
        await API.post("/records", {
          student_name: studentName,
          roll_number: rollNumber,
          department,
          semester,
          gpa,
          remarks,
        });
        toast.success("Record created successfully");
      }

      resetForm();
      setShowForm(false);
      fetchRecords();
    } catch (error) {
      toast.error("Error saving record");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (record) => {
    setStudentName(record.student_name);
    setRollNumber(record.roll_number);
    setDepartment(record.department);
    setSemester(record.semester);
    setGpa(record.gpa);
    setRemarks(record.remarks || "");
    setEditId(record.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?"))
      return;

    try {
      await API.delete(`/records/${id}`);
      toast.success("Record deleted successfully");
      fetchRecords();
    } catch (error) {
      toast.error("Error deleting record");
    }
  };

  // Derived Statistics
  const totalStudents = records.length;
  const avgGpa = totalStudents > 0 
    ? (records.reduce((acc, curr) => acc + Number(curr.gpa), 0) / totalStudents).toFixed(2)
    : 0;
  
  // Data for chart (Top 5 or maybe all if few)
  const chartData = records.slice(0, 10).map((r) => ({
    name: r.student_name,
    gpa: Number(r.gpa),
  }));

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Faculty Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage academic records and view student performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl">
            🎓
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? "..." : totalStudents}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl">
            📈
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average GPA</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? "..." : avgGpa}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl">
            📝
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Records Uploaded</p>
            <p className="text-2xl font-bold text-gray-800">{loading ? "..." : totalStudents}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Student Performance (GPA)</h2>
          {records.length > 0 ? (
            <div className="h-64 mt-4 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                   <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                   <YAxis tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                   <Bar dataKey="gpa" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Academic Records
        </h2>

        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          {showForm ? "Close Form" : "+ Add Record"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Record" : "Create Record"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-2 rounded-lg" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
            <input className="border p-2 rounded-lg" placeholder="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
            <input className="border p-2 rounded-lg" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
            <input type="number" className="border p-2 rounded-lg" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
            <input className="border p-2 rounded-lg" placeholder="GPA" value={gpa} onChange={(e) => setGpa(e.target.value)} />
          </div>

          <textarea className="border p-2 rounded-lg mt-4 w-full" placeholder="Remarks (Optional)" value={remarks} onChange={(e) => setRemarks(e.target.value)} />

          <button
            onClick={handleSubmit}
            disabled={creating}
            className="bg-green-600 text-white px-6 py-2 rounded-xl mt-4 hover:bg-green-700 transition shadow-md disabled:opacity-50"
          >
            {creating ? "Saving..." : editId ? "Update Record" : "Save Record"}
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
        <input
          placeholder="Search by name, roll number, department..."
          className="w-full border p-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {loading ? (
          <p className="text-gray-500">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500">No records found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Student</th>
                <th className="py-2">Roll</th>
                <th className="py-2">Dept</th>
                <th className="py-2">Sem</th>
                <th className="py-2">GPA</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.filter(r => 
                (r.student_name && r.student_name.toLowerCase().includes(search.toLowerCase())) ||
                (r.roll_number && r.roll_number.toLowerCase().includes(search.toLowerCase())) ||
                (r.department && r.department.toLowerCase().includes(search.toLowerCase()))
              ).map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{r.student_name}</td>
                  <td className="py-2">{r.roll_number}</td>
                  <td className="py-2">{r.department}</td>
                  <td className="py-2">{r.semester}</td>
                  <td className="py-2">{r.gpa}</td>
                  <td className="py-2 text-center space-x-2">
                    <button onClick={() => handleEdit(r)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default FacultyDashboard;