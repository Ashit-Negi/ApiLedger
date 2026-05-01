import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Total Requests</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Active APIs</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">₹0</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
