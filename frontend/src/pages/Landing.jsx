import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const handleStart = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) return navigate("/login");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 Navbar */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-green-600">ApiLedger</h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-700 hover:text-green-600"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* 🔥 Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Monetize Your APIs 🚀
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Track usage, apply rate limits, and generate revenue with a powerful
          API billing system.
        </p>

        <button
          onClick={handleStart}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Start Building
        </button>
      </div>

      {/* 🔥 Features */}
      <div className="grid md:grid-cols-3 gap-6 px-10 py-16">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg">API Gateway</h3>
          <p className="text-gray-600 mt-2">
            Route all API requests through a secure gateway.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg">Usage Tracking</h3>
          <p className="text-gray-600 mt-2">
            Monitor every request with detailed analytics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-lg">Billing System</h3>
          <p className="text-gray-600 mt-2">
            Automatically calculate charges based on usage.
          </p>
        </div>
      </div>

      {/* 🔥 CTA */}
      <div className="text-center py-16 bg-green-100">
        <h2 className="text-2xl font-bold">Ready to scale your APIs?</h2>

        <button
          onClick={handleStart}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Get Started Now
        </button>
      </div>

      {/* 🔥 Footer */}
      <div className="text-center py-6 text-gray-500 text-sm">
        © 2026 ApiLedger. All rights reserved.
      </div>
    </div>
  );
}

export default Landing;
