import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
  });

  const [invoices, setInvoices] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [activeApis, setActiveApis] = useState(0);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const [statsRes, revenueRes, invoiceRes, apiCountRes] = await Promise.all(
        [
          api.get("/usage/stats"),
          api.get("/usage/revenue"),
          api.get("/payment/invoices"),
          api.get("/apis/count"),
        ],
      );

      setStats({
        total: statsRes.data.data.total,
        revenue: revenueRes.data.data.revenue,
      });

      setActiveApis(apiCountRes.data.data);
      setInvoices(invoiceRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🚀 GENERATE INVOICE
  const handleGenerateInvoice = async () => {
    try {
      const res = await api.post("/payment/generate");

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

      alert(`Invoice Created ₹${res.data.data.amount}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // 🚀 PAY INVOICE
  const handlePay = async (invoiceId) => {
    try {
      setLoadingId(invoiceId);

      const res = await api.post("/payment/checkout", { invoiceId });

      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment failed");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // 📄 DOWNLOAD PDF
  const handleDownload = async (invoiceId) => {
    try {
      const res = await api.get(`/payment/invoice/${invoiceId}/pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">Overview</h1>

      {/* 🔥 ROLE DISPLAY */}
      <div className="mb-4 text-sm text-gray-600">
        Role: <b className="uppercase">{user?.role}</b>
        {/* 🔥 ADMIN BADGE */}
        {user?.role === "admin" && (
          <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
            Admin
          </span>
        )}
      </div>

      {/* 🔥 PLAN */}
      <div className="mb-6">
        {user?.isPro ? (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl">
            You are on <b>Pro Plan</b> 🚀
          </div>
        ) : (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl">
            Free Plan
          </div>
        )}
      </div>

      {/* 🔥 BILLING NOTICE */}
      <div className="mb-4 bg-yellow-50 text-yellow-700 p-3 rounded-xl text-sm">
        Free: 1000 requests | After that ₹0.01/request | Pro: ₹0.005/request
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3>Total Requests</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3>Usage Value</h3>
          <p className="text-2xl font-bold">₹ {stats.revenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3>Active APIs</h3>
          <p className="text-2xl font-bold">{activeApis}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3>Billing</h3>
          <button
            onClick={handleGenerateInvoice}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Generate Bill
          </button>
        </div>
      </div>

      {/* 🔥 INVOICES */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Invoices</h2>

        {invoices.length === 0 ? (
          <p>No invoices yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Requests</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b">
                  <td className="p-2">{inv.totalRequests}</td>

                  <td className="p-2">₹ {inv.amount.toFixed(2)}</td>

                  <td className="p-2">
                    {inv.status === "paid" ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500">Pending</span>
                    )}
                  </td>

                  <td className="p-2 flex gap-2">
                    {inv.status === "pending" && user?.role !== "consumer" && (
                      <button
                        onClick={() => handlePay(inv._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        {loadingId === inv._id ? "Processing..." : "Pay"}
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(inv._id)}
                      className="bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
