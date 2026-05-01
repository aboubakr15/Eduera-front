import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader, ArrowLeft, Eye, EyeOff } from "lucide-react";
import log from "../assets/images/login.jpg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(email, password);
      if (result.success) {
        const access = localStorage.getItem("access_token");
        const payload = access ? JSON.parse(atob(access.split(".")[1])) : null;
        const role = payload?.primary_role || payload?.role;

        if (role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "STUDENT") {
          navigate("/student/dashboard");
        } else if (role === "PROFESSOR") {
          navigate("/instructor/dashboard");
        } else if (role === "TA") {
          navigate("/ta/dashboard");
        } else {
          setError("Access denied. Invalid role.");
          logoutUser();
          setIsLoading(false);
        }
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full bg-white grid md:grid-cols-2 min-h-screen">
        <div className="pb-10 px-10 md:px-14 flex flex-col justify-center bg-white relative order-2 md:order-1">
          <div className="mb-12 text-center md:text-left">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-500 hover:text-[#1B2036]
               mb-12 transition-all group"
            >
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-base">
              Welcome back! Please enter your info.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5 flex items-center gap-3 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 block">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3.5 pr-12 border border-gray-200 rounded-xl bg-white text-gray-700 text-sm transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#323b64] accent-[#323b64] cursor-pointer"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <span className="text-sm text-[#1B2036] font-medium cursor-pointer hover:underline underline-offset-2">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B2036] text-white h-10 rounded-xl font-semibold text-base hover:bg-[#323b64] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={22} />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <div className="hidden md:flex relative order-1 md:order-2 overflow-hidden min-h-[620px]">
          <img
            src={log}
            alt="Nature landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/10" />

          <div className="relative z-10 flex flex-col justify-end p-10 pb-24 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {[
                  "https://i.pravatar.cc/32?img=1",
                  "https://i.pravatar.cc/32?img=2",
                  "https://i.pravatar.cc/32?img=3",
                  "https://i.pravatar.cc/32?img=4",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="traveler"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-white text-sm font-medium">
                Trusted by over <span className="font-bold">500+</span> students
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold text-white leading-tight mb-3">
              Shape Your Learning
              <br />
              Journey
            </h2>
            <p className="text-white/80 text-base leading-relaxed max-w-sm font-light">
              Discover smarter studying with AI support, organized courses, and
              a university experience designed for modern students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
