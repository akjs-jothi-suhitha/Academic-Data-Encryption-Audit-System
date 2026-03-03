import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        ADEAS System
      </h1>

      <div className="flex items-center gap-6">
        {role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </button>
        )}

        {role === "faculty" && (
          <button
            onClick={() => navigate("/faculty")}
            className="text-gray-600 hover:text-blue-600"
          >
            Dashboard
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;