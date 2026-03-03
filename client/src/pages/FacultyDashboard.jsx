import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";

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
  }, [search]);

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

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Faculty Academic Records
        </h1>

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
              {records.map((r) => (
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