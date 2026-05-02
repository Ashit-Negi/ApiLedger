import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD USER ON APP START
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/auth/me"); // 🔥 backend route hona chahiye
      setUser(res.data.user);
    } catch (err) {
      console.error("Auth fetch error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔐 LOGIN
  const login = (data) => {
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
