import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔥 handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  // 🔥 validation
  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email required";
    if (!form.password) newErrors.password = "Password required";
    return newErrors;
  };

  // 🔥 login
  const handleLogin = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      return setErrors(validation);
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      if (!res.data?.data?.accessToken) {
        throw new Error("Invalid response");
      }

      login(res.data.data);

      navigate("/dashboard");
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to continue to MeterFlow
        </p>

        {errors.general && (
          <p className="text-red-500 text-center mb-4">
            {errors.general}
          </p>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;