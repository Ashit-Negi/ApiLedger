import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="font-semibold">Dashboard</h2>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
