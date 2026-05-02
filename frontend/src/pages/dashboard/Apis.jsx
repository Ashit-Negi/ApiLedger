import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext"; // 🔥 ADD

function Apis() {
  const { user } = useAuth(); // 🔥 ADD

  const [apis, setApis] = useState([]);
  const [form, setForm] = useState({ name: "", baseUrl: "" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [keys, setKeys] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});
  const navigate = useNavigate();

  // 🔥 Fetch APIs
  const fetchApis = async () => {
    try {
      const res = await api.get("/apis");
      setApis(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  // 🔥 input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 create API
  const handleCreate = async () => {
    if (!form.name || !form.baseUrl) return;

    try {
      setLoading(true);
      await api.post("/apis/create", form);
      setForm({ name: "", baseUrl: "" });
      fetchApis();
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 generate key
  const handleGenerate = async (apiId) => {
    try {
      const res = await api.post("/apis/generate-key", { apiId });

      setKeys((prev) => ({
        ...prev,
        [apiId]: res.data.data.key,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // 📋 copy
  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    alert("Copied!");
  };

  // 👁 toggle visibility
  const toggleVisibility = (apiId) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [apiId]: !prev[apiId],
    }));
  };

  // 🔐 mask key
  const maskKey = (key) => {
    if (!key) return "";
    return key.slice(0, 6) + "********" + key.slice(-4);
  };

  // 🗑 delete API
  const handleDelete = async (apiId) => {
    const confirmDelete = window.confirm("Delete this API?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/apis/${apiId}`);
      setApis((prev) => prev.filter((a) => a._id !== apiId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔄 loading
  if (pageLoading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20 text-gray-500">Loading APIs...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Your APIs</h1>

      {/* 🔥 ROLE SHOW */}
      <div className="mb-4 text-sm text-gray-600">
        Role: <b className="uppercase">{user?.role}</b>
      </div>

      {/* 🔥 CREATE (HIDE FOR CONSUMER) */}
      {user?.role !== "consumer" && (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-3">Create API</h2>

          <div className="flex gap-3">
            <input
              name="name"
              placeholder="API Name"
              value={form.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />

            <input
              name="baseUrl"
              placeholder="Base URL"
              value={form.baseUrl}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />

            <button
              onClick={handleCreate}
              className="bg-green-500 text-white px-4 rounded"
            >
              {loading ? "..." : "Create"}
            </button>
          </div>
        </div>
      )}

      {/* 🔥 EMPTY */}
      {apis.length === 0 ? (
        <div className="text-gray-500">No APIs created yet</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {apis.map((apiItem) => (
            <div
              key={apiItem._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="font-bold text-lg">{apiItem.name}</h3>
              <p className="text-gray-500 text-sm">{apiItem.baseUrl}</p>

              {/* 🔥 ACTIONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/apis/${apiItem._id}`)}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm"
                >
                  View
                </button>

                {/* 🔥 ONLY OWNER/ADMIN */}
                {user?.role !== "consumer" && (
                  <>
                    <button
                      onClick={() => handleGenerate(apiItem._id)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Generate Key
                    </button>

                    <button
                      onClick={() => handleDelete(apiItem._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* 🔑 KEY */}
              {keys[apiItem._id] && (
                <div className="mt-3 p-2 bg-gray-100 rounded flex justify-between items-center">
                  <span className="text-sm break-all">
                    {visibleKeys[apiItem._id]
                      ? keys[apiItem._id]
                      : maskKey(keys[apiItem._id])}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisibility(apiItem._id)}
                      className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                    >
                      {visibleKeys[apiItem._id] ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => handleCopy(keys[apiItem._id])}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Apis;
