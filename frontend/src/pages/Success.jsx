import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Success() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const sessionId = params.get("session_id");

        if (!sessionId) {
          navigate("/dashboard");
          return;
        }

        await api.get(`/payment/verify?session_id=${sessionId}`);

        // 🔥 redirect after success
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      }
    };

    verify();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-500">Redirecting to dashboard...</p>
    </div>
  );
}

export default Success;
