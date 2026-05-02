import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext"; // 🔥 ADD
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ApiDetails() {
  const { apiId } = useParams();
  const { user } = useAuth(); // 🔥 ADD

  const [data, setData] = useState(null);
  const [loadingKey, setLoadingKey] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/apis/${apiId}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // 🔥 REVOKE HANDLER
  const handleRevoke = async (keyId) => {
    try {
      setLoadingKey(keyId);

      await api.patch(`/apis/revoke/${keyId}`);

      alert("API Key revoked");
      fetchDetails();
    } catch (err) {
      console.error(err);
      alert("Failed to revoke key");
    } finally {
      setLoadingKey(null);
    }
  };

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20 text-gray-500">
          Loading API details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">{data.api.name}</h1>

      {/* 🔥 ROLE SHOW */}
      <div className="mb-4 text-sm text-gray-600">
        Role: <b className="uppercase">{user?.role}</b>
      </div>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Stat title="Requests" value={data.stats.total} />
        <Stat title="Success" value={data.stats.success} />
        <Stat title="Failed" value={data.stats.failed} />
        <Stat title="Revenue" value={`₹ ${data.stats.revenue.toFixed(2)}`} />
      </div>

      {/* 🔥 GRAPH */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="mb-3 font-semibold">Usage</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.graph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="requests" stroke="#6366F1" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔑 KEYS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="mb-3 font-semibold">API Keys</h2>

        {data.keys.map((k) => (
          <div
            key={k._id}
            className="flex justify-between items-center border-b py-2 gap-4"
          >
            <div className="text-sm break-all flex-1">{k.key}</div>

            {/* 🔥 STATUS */}
            <div className="text-sm">
              {k.status === "active" ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-500">Revoked</span>
              )}
            </div>

            {/* 🔥 REVOKE BUTTON (ROLE BASED) */}
            {user?.role !== "consumer" && k.status === "active" && (
              <button
                onClick={() => handleRevoke(k._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                {loadingKey === k._id ? "..." : "Revoke"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 📜 LOGS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Recent Logs</h2>

        {data.logs.map((log) => (
          <div key={log._id} className="text-sm border-b py-2">
            {log.endpoint} - {log.status}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

const Stat = ({ title, value }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

export default ApiDetails;
