import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid || !token) {
      setStatus("error");
      setMessage("Invalid password reset link.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      await authApi.resetPassword({ uid, token, new_password: password });
      setStatus("success");
      setMessage("Your password has been successfully reset.");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Failed to reset password. The link might be expired.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Set New Password</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please enter your new password below.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <h3 className="text-green-800 font-semibold mb-1">Password Reset!</h3>
            <p className="text-green-600 text-sm mb-6">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#1B2036] hover:bg-[#2A314E] text-white py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-600 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{message}</p>
              </div>
            )}

            {!uid || !token ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-700 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>Missing reset token. Please use the exact link sent to your email.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D67A1E] focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D67A1E] focus:border-transparent transition-all outline-none"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !password}
                  className="w-full bg-[#1B2036] hover:bg-[#2A314E] text-white py-3 mt-2 rounded-xl font-medium transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#1B2036]/20"
                >
                  {status === "loading" ? (
                    <><Loader2 className="animate-spin" size={18} /> Resetting...</>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
