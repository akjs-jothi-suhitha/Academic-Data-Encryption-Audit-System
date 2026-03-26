import { useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  let role = null;
  let userName = "User";

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        userName = u.name || "User";
      }
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menuItems = role === "admin" ? [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Faculty Management", path: "/admin/faculty", icon: "👥" },
    { name: "Audit Logs", path: "/admin/audit", icon: "📜" },
  ] : [
    { name: "Dashboard", path: "/faculty", icon: "📊" },
    { name: "Profile", path: "/faculty/profile", icon: "👤" },
    { name: "Students/Data", path: "/faculty/data", icon: "🎓" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col transition-all duration-300 z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">ADEAS</h1>
            <p className="text-xs text-gray-500 font-medium">Portal System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                ${location.pathname === item.path 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition duration-200 text-sm font-medium flex justify-center items-center gap-2 shadow-sm"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50/50">
        <div className="max-w-7xl mx-auto p-8 fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;