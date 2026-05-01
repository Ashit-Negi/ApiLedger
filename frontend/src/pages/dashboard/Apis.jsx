import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

function Apis() {
  const [apis, setApis] = useState([]);
  const [form, setForm] = useState({ name: "", baseUrl: "" });
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});

  // 🔥 Fetch APIs
  const fetchApis = async () => {
    try {
      const res = await api.get("/apis");
      setApis(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  // 🔥 handle input
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

      fetchApis(); // refresh
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };
  // generate api key
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
  // to copy
  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    alert("Copied!");
  };

  // to toggle key visibility
  const toggleVisibility = (apiId) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [apiId]: !prev[apiId],
    }));
  };

  // for mask key
  const maskKey = (key) => {
    if (!key) return "";
    return key.slice(0, 6) + "********" + key.slice(-4);
  };
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Your APIs</h1>

      {/* 🔥 Create API */}
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

      {/* 🔥 API List */}
      <div className="grid gap-4">
        {apis.map((apiItem) => (
          <div key={apiItem._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold">{apiItem.name}</h3>
            <p className="text-gray-500">{apiItem.baseUrl}</p>

            <button
              onClick={() => handleGenerate(apiItem._id)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Generate Key
            </button>

            {/* 🔥 KEY DISPLAY */}
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
    </DashboardLayout>
  );
}

export default Apis;
