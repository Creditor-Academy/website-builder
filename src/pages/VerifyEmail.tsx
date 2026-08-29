import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { BrandLogo } from "@/components/Common/BrandLogo";
import Loading from "@/components/Common/LoadingUI";
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

  if (loading) {
    return <Loading fullScreen label="Verifying your email" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-10">
        <BrandLogo
          imgClassName="h-10 w-10"
        />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl border border-slate-100 text-center"
      >
        {success ? (
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
