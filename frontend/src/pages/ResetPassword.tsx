import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutTemplate, Eye, CheckCircle2 } from "lucide-react";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center">
          <LayoutTemplate className="w-6 h-6" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-slate-900">Buildora</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-slate-100"
      >
        {success ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm mb-6">Your password has been updated successfully.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Set new password</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your new password below.</p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  className="w-full bg-slate-100 rounded-xl px-5 py-4 pr-12 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600"
                />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                className="w-full bg-slate-100 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium mt-4 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 11z" />
                </svg>
                {error}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all mt-6 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Remember your password?{" "}
              <Link to="/login" className="text-slate-900 font-semibold hover:underline">Login</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
