import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // Send the current origin so the backend can build the reset link
      const frontend_url = window.location.origin;
      const res = await authApi.forgotPassword({ email, frontend_url });
      setStatus("success");
      setMessage(res.data.message || "Reset link sent!");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back to Login
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Forgot Password?</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <h3 className="text-green-800 font-semibold mb-1">Check your email</h3>
            <p className="text-green-600 text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-600 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{message}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D67A1E] focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="w-full bg-[#1B2036] hover:bg-[#2A314E] text-white py-3 rounded-xl font-medium transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#1B2036]/20"
            >
              {status === "loading" ? (
                <><Loader2 className="animate-spin" size={18} /> Sending...</>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
