import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
      {/* 🔥 BRAND */}
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-xl font-bold text-green-600 cursor-pointer"
      >
        ApiLedger
      </h1>

      {/* 🔥 RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden md:block">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
