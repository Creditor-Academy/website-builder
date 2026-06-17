import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutTemplate, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "../api/auth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing verification token.");
      setLoading(false);
      return;
    }

    verifyEmail(token)
      .then(() => setSuccess(true))
      .catch((err: any) => {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Verification failed. The link may have expired."
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

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
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-slate-100 text-center"
      >
        {loading ? (
          <div className="py-8">
            <Loader2 className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Verifying your email...</p>
          </div>
        ) : success ? (
          <div className="py-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
            <p className="text-slate-500 text-sm mb-6">
              Your email has been verified successfully. You can now log in.
            </p>
            <Link
              to="/login"
              className="inline-block w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="py-4">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <Link
              to="/login"
              className="inline-block w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all"
            >
              Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
