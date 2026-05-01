import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters required";
    return newErrors;
  };

  // 🔥 register
  const handleRegister = async () => {
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      return setErrors(validation);
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", form);

      // optional: backend message show
      if (!res.data?.success) {
        throw new Error("Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create Account 🚀
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Start building with MeterFlow
        </p>

        {errors.general && (
          <p className="text-red-500 text-center mb-4">{errors.general}</p>
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
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
