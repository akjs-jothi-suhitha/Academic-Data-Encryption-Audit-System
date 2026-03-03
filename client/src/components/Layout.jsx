import { useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          ADEAS System
        </h1>

        <div className="flex gap-6 items-center">
          {role === "admin" && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/admin/audit")}
                className="text-gray-700 hover:text-blue-600"
              >
                Audit Logs
              </button>
            </>
          )}

          {role === "faculty" && (
            <button
              onClick={() => navigate("/faculty")}
              className="text-gray-700 hover:text-blue-600"
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
      </nav>

      {/* Page Content */}
      <div className="p-8">{children}</div>
    </div>
  );
}

export default Layout;