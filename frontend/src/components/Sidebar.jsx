import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Key, BarChart } from "lucide-react";

function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
      pathname === path
        ? "bg-green-500 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h1 className="text-xl font-bold mb-6">MeterFlow</h1>

      <nav className="space-y-2">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/apis" className={linkClass("/apis")}>
          <Key size={18} />
          APIs
        </Link>

        <Link to="/analytics" className={linkClass("/analytics")}>
          <BarChart size={18} />
          Analytics
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
