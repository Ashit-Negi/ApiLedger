import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Landing from "./pages/Landing";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Apis from "./pages/dashboard/Apis";
import Analytics from "./pages/dashboard/Analytics";
import ApiDetails from "./pages/dashboard/ApiDetails";

// 🔥 NEW IMPORTS (Stripe)
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 Stripe Routes (NO ProtectedRoute) */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apis"
          element={
            <ProtectedRoute>
              <Apis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apis/:apiId"
          element={
            <ProtectedRoute>
              <ApiDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
