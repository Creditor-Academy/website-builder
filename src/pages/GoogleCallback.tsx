import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../api/auth";
import { getDashboardPath, setStoredUser } from "@/lib/authSession";
import Loading from "@/components/Common/LoadingUI";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (!accessToken) {
      setError("Google login failed. No access token received.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    googleLogin(accessToken)
      .then((res) => {
        setStoredUser(res.data.user);
        navigate(getDashboardPath(res.data.user));
      })
      .catch((err) => {
        console.error("Google login error:", err);
        setError(err.response?.data?.error || "Google login failed. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-slate-400 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <Loading fullScreen label="Signing in with Google" />;
}
