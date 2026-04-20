import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../api/auth";

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
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
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

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-slate-600 font-medium">Signing in with Google...</p>
      </div>
    </div>
  );
}
