import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    avgLatency: 0,
    successRate: 0,
  });
  const [graphData, setGraphData] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [apiStats, setApiStats] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [logsRes, statsRes, graphRes, revenueRes, apiStatsRes, monthlyRes] =
        await Promise.all([
          api.get("/usage"),
          api.get("/usage/stats"),
          api.get("/usage/graph"),
          api.get("/usage/revenue"),
          api.get("/usage/api-wise"),
          api.get("/usage/monthly"),
        ]);

      setLogs(logsRes.data.data);
      setStats(statsRes.data.data);
      setGraphData(graphRes.data.data);
      setRevenue(revenueRes.data.data.revenue);
      setApiStats(apiStatsRes.data.data);
      setMonthlyData(monthlyRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 🔥 LOADING
  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20 text-gray-500">
          Loading analytics...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Analytics Dashboard
      </h1>

      {/* 🔥 CARDS */}
      <div className="grid md:grid-cols-5 gap-6 mb-8">
        <Card title="Total Requests" value={stats.total} />
        <Card title="Success" value={stats.success} color="green" />
        <Card title="Failed" value={stats.failed} color="red" />
        <Card
          title="Avg Latency"
          value={`${stats.avgLatency} ms`}
          color="blue"
        />
        <Card
          title="Revenue"
          value={`₹ ${revenue.toFixed(2)}`}
          color="yellow"
        />
        <Card
          title="Success Rate"
          value={`${stats.successRate}%`}
          color="purple"
        />
      </div>

      {/* 🔥 HOURLY GRAPH */}
      <GraphCard title="Requests Over Time" data={graphData} x="hour">
        <Line type="monotone" dataKey="requests" stroke="#6366F1" />
        <Line type="monotone" dataKey="success" stroke="#22C55E" />
        <Line type="monotone" dataKey="failed" stroke="#EF4444" />
      </GraphCard>

      {/* 🔥 MONTHLY GRAPH */}
      <GraphCard title="Monthly Growth" data={monthlyData} x="date">
        <Line type="monotone" dataKey="requests" stroke="#6366F1" />
        <Line type="monotone" dataKey="revenue" stroke="#F59E0B" />
      </GraphCard>

      {/* 🔥 LOGS TABLE */}
      <TableWrapper title="Recent Requests">
        {logs.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Endpoint</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Latency</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{log.endpoint}</td>
                  <td
                    className={`p-3 font-semibold ${
                      log.status === 200 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {log.status}
                  </td>
                  <td className="p-3">{log.latency} ms</td>
                  <td className="p-3 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableWrapper>

      {/* 🔥 API TABLE */}
      <TableWrapper title="API Performance">
        {apiStats.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">API</th>
                <th className="p-3">Requests</th>
                <th className="p-3">Success</th>
                <th className="p-3">Failed</th>
                <th className="p-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {apiStats.map((api, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 font-medium">{api.apiName}</td>
                  <td className="p-3">{api.total}</td>
                  <td className="p-3 text-green-600">{api.success}</td>
                  <td className="p-3 text-red-500">{api.failed}</td>
                  <td className="p-3 text-yellow-600">
                    ₹ {api.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableWrapper>
    </DashboardLayout>
  );
}

/* 🔥 COMPONENTS */

const Card = ({ title, value, color = "gray" }) => (
  <div className={`bg-${color}-50 p-5 rounded-xl shadow`}>
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold mt-2 text-${color}-600">{value}</h2>
  </div>
);

const GraphCard = ({ title, data, x, children }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-8">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={x} />
        <YAxis />
        <Tooltip />
        <Legend />
        {children}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const TableWrapper = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow mb-8">
    <div className="p-5 border-b font-semibold">{title}</div>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

const EmptyState = () => (
  <div className="text-center p-6 text-gray-500">No API usage yet</div>
);

export default Analytics;
