import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, LayoutTemplate } from "lucide-react";
import loginbg from "../assets/login.png";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, registerUser, forgotPassword, googleLogin } from "../api/auth";

// ── Moved outside so React never sees a new component type on re-render ────────

const GoogleSVG = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

interface LoginFormProps {
  loginData: { email: string; password: string };
  setLoginData: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  handleLogin: () => void;
  setIsSignup: (v: boolean) => void;
  isLoadingLogin: boolean;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  loginError: string;
  setLoginError: (v: string) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  onForgotPassword: () => void;
  onGoogleLogin: () => void;
}

const LoginForm = ({
  loginData,
  setLoginData,
  handleLogin,
  setIsSignup,
  isLoadingLogin,
  showPassword,
  setShowPassword,
  loginError,
  setLoginError,
  rememberMe,
  setRememberMe,
  onForgotPassword,
  onGoogleLogin,
}: LoginFormProps) => {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col justify-center h-full mx-auto">
      <div className="mb-10 text-left">
        <h2 className="text-slate-950 text-[2.5rem] font-bold tracking-tight mb-2">Welcome Back!</h2>
        <p className="text-slate-500 text-sm font-medium">Log in to start creating stunning websites with ease.</p>
      </div>

      <div className="space-y-5 mb-8">
        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-2 block">Email</label>
          <input
            type="email"
            placeholder="Input your email"
            value={loginData.email}
            onKeyDown={handleKey}
            onChange={(e) => {
              setLoginData({ ...loginData, email: e.target.value });
              if (loginError) setLoginError("");
            }}
            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
          />
        </div>

        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-2 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Input your password"
              value={loginData.password}
              onKeyDown={handleKey}
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
                if (loginError) setLoginError("");
              }}
              className={`w-full bg-white border rounded-xl py-4 pl-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-1 transition-all outline-none ${
                loginError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              }`}
            />
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600"
            />
          </div>

          {loginError && (
            <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 11z" />
              </svg>
              {loginError}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0 cursor-pointer"
            />
            Remember Me
          </label>
          <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-slate-400 hover:text-slate-800 transition-colors">Forgot Password?</button>
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoadingLogin}
        className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingLogin ? "Logging in..." : "Login"}
      </button>

      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <span className="relative px-4 bg-white text-xs text-slate-400">Or continue with</span>
      </div>

      <button onClick={onGoogleLogin} className="flex items-center justify-center gap-3 py-4 w-full bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 active:scale-[0.98]">
        <GoogleSVG />
        Continue with Google
      </button>

      <p className="text-slate-500 text-center text-sm mt-8 hidden md:block">
        Don't have an account?{" "}
        <button onClick={() => setIsSignup(true)} className="text-slate-950 font-bold hover:underline">
          Sign up here
        </button>
      </p>
    </div>
  );
};

interface SignupFormProps {
  signupData: { name: string; email: string; password: string };
  setSignupData: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
  handleSignup: () => void;
  setIsSignup: (v: boolean) => void;
  isLoadingSignup: boolean;
  showSignupPassword: boolean;
  setShowSignupPassword: (v: boolean) => void;
  signupError: string;
  setSignupError: (v: string) => void;
  onGoogleLogin: () => void;
}

const SignupForm = ({
  signupData,
  setSignupData,
  handleSignup,
  setIsSignup,
  isLoadingSignup,
  showSignupPassword,
  setShowSignupPassword,
  signupError,
  setSignupError,
  onGoogleLogin,
}: SignupFormProps) => {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <div className="w-full max-w-[400px] flex flex-col justify-center h-full mx-auto">
      <div className="mb-10 text-left">
        <h2 className="text-slate-950 text-[2.5rem] font-bold tracking-tight mb-2">Create Account</h2>
        <p className="text-slate-500 text-sm font-medium">Start building your masterpiece today.</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-1 block">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={signupData.name}
            onKeyDown={handleKey}
            onChange={(e) => {
              setSignupData({ ...signupData, name: e.target.value });
              if (signupError) setSignupError("");
            }}
            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
          />
        </div>

        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-1 block">Email</label>
          <input
            type="email"
            value={signupData.email}
            onKeyDown={handleKey}
            onChange={(e) => {
              setSignupData({ ...signupData, email: e.target.value });
              if (signupError) setSignupError("");
            }}
            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
          />
        </div>

        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={showSignupPassword ? "text" : "password"}
              value={signupData.password}
              onKeyDown={handleKey}
              onChange={(e) => {
                setSignupData({ ...signupData, password: e.target.value });
                if (signupError) setSignupError("");
              }}
              className={`w-full bg-white border rounded-xl py-4 pl-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-1 transition-all outline-none ${
                signupError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-400"
              }`}
            />
            <Eye
              onClick={() => setShowSignupPassword(!showSignupPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
            />
          </div>

          {signupError && (
            <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 11z" />
              </svg>
              {signupError}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSignup}
        disabled={isLoadingSignup}
        className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoadingSignup ? "Creating account..." : "Sign Up"}
      </button>

      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <span className="relative px-4 bg-white text-xs text-slate-400">Or continue with</span>
      </div>

      <button onClick={onGoogleLogin} className="flex items-center justify-center gap-3 py-4 w-full bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 active:scale-[0.98]">
        <GoogleSVG />
        Continue with Google
      </button>

      <p className="text-slate-500 text-center text-sm mt-8 hidden md:block">
        Joined us before?{" "}
        <button onClick={() => setIsSignup(false)} className="text-slate-950 font-bold hover:underline">
          Login here
        </button>
      </p>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function LoginSignup() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignup, setIsLoadingSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotError, setForgotError] = useState("");

  // ── On mount: restore remembered email + skip login if session exists ────────
  useEffect(() => {
    // Auto-fill email if user previously checked Remember Me
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setLoginData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }

    // If user is already logged in and chose Remember Me, go straight to dashboard
    const savedUser = localStorage.getItem("user");
    const wasRemembered = localStorage.getItem("rememberMe") === "true";
    if (savedUser && wasRemembered) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoginError("");
    try {
      setIsLoadingLogin(true);
      const res = await loginUser(loginData);

      // Always save the user session
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (rememberMe) {
        // Save email for auto-fill + flag to skip login next visit
        localStorage.setItem("rememberedEmail", loginData.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        // User didn't check Remember Me — clear any saved data
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.message || err.response?.data?.error || "Incorrect email or password.");
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleSignup = async () => {
    setSignupError("");
    try {
      setIsLoadingSignup(true);
      await registerUser(signupData);
      alert("Registered! Check your email.");
      setIsSignup(false);
    } catch (err) {
      console.error(err);
      setSignupError(err.response?.data?.message || err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoadingSignup(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoginError("");
      try {
        setIsLoadingLogin(true);
        const res = await googleLogin(tokenResponse.access_token);
        
        // Save user session
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // Google auth doesn't have a "Remember me" option technically, 
        // but we can just set it to skip login next time
        localStorage.setItem("rememberMe", "true");
        
        navigate("/dashboard");
      } catch (err: any) {
        console.error(err);
        setLoginError(err.response?.data?.message || err.response?.data?.error || "Google login failed.");
      } finally {
        setIsLoadingLogin(false);
      }
    }
  });

  const handleForgotPassword = async () => {
    setForgotError("");
    setForgotMsg("");
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address.");
      return;
    }
    try {
      setForgotLoading(true);
      await forgotPassword(forgotEmail.trim());
      setForgotMsg("If an account with that email exists, a password reset link has been sent. Check your inbox.");
    } catch (err: any) {
      setForgotError(err.response?.data?.message || err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const loginProps = {
    loginData,
    setLoginData,
    handleLogin,
    setIsSignup,
    isLoadingLogin,
    showPassword,
    setShowPassword,
    loginError,
    setLoginError,
    rememberMe,
    setRememberMe,
    onForgotPassword: () => {
      setForgotEmail(loginData.email);
      setForgotMsg("");
      setForgotError("");
      setShowForgot(true);
    },
    onGoogleLogin: handleGoogleLogin,
  };

  const signupProps = {
    signupData,
    setSignupData,
    handleSignup,
    setIsSignup,
    isLoadingSignup,
    showSignupPassword,
    setShowSignupPassword,
    signupError,
    setSignupError,
    onGoogleLogin: handleGoogleLogin,
  };

  return (
    <div className="relative min-h-[100svh] w-full flex overflow-hidden bg-slate-950">

      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-90"
        style={{ backgroundImage: `url(${loginbg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/20" />

      <div className={`absolute top-8 left-8 right-8 z-50 flex items-center justify-between pointer-events-none ${isSignup ? "md:justify-end" : "md:justify-start"}`}>
        <motion.div layout transition={{ type: "spring", stiffness: 220, damping: 28 }} className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-3 text-white pointer-events-auto hover:opacity-80 transition-opacity drop-shadow-lg">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-2xl flex items-center justify-center">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Buildora</span>
          </Link>
          <Link to="/" className="md:ml-20 flex items-center justify-end gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium pointer-events-auto drop-shadow-md">
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </Link>
        </motion.div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col w-full h-full items-center justify-center p-4 z-20 relative pt-24 overflow-y-auto">
        <div className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-2xl">
          <AnimatePresence mode="wait">
            {!isSignup ? (
              <motion.div key="m-login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <LoginForm {...loginProps} />
                <p className="text-slate-500 text-center text-sm mt-8 block md:hidden">
                  Don't have an account?{" "}
                  <button onClick={() => setIsSignup(true)} className="text-slate-950 font-bold hover:underline">Sign up here</button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="m-signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SignupForm {...signupProps} />
                <p className="text-slate-500 text-center text-sm mt-8 block md:hidden">
                  Joined us before?{" "}
                  <button onClick={() => setIsSignup(false)} className="text-slate-950 font-bold hover:underline">Login here</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block absolute inset-0 z-10 p-4">

        <AnimatePresence>
          {!isSignup && (
            <motion.div
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-0 left-0 w-1/2 h-full flex flex-col justify-end p-20 pb-24 z-10"
            >
              <h1 className="text-5xl lg:text-[4rem] font-bold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-xl text-left">
                Design Smarter. <br /> Build Faster. <br /> Launch Anywhere.
              </h1>
              <p className="text-slate-300 text-lg max-w-lg leading-relaxed drop-shadow-md text-left">
                Create stunning websites with absolute ease. Our intuitive builder provides pixel-perfect design control without a single line of code.
              </p>
              <div className="w-12 h-1 bg-white mt-12 rounded-full opacity-50" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSignup && (
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-0 right-0 w-1/2 h-full flex flex-col justify-end p-20 pb-24 items-end text-right z-10"
            >
              <h1 className="text-5xl lg:text-[4rem] font-bold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-xl text-right">
                Join the revolution. <br /> Start Building <br /> today.
              </h1>
              <p className="text-slate-300 text-lg max-w-lg leading-relaxed drop-shadow-md text-right">
                Create an account to gain absolutely unfettered semantic control and an infinite array of beautiful layout components.
              </p>
              <div className="w-12 h-1 bg-white mt-12 rounded-full opacity-50 ml-auto" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={{ x: isSignup ? "0%" : "calc(100% + 2rem)" }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className="absolute top-4 bottom-4 left-4 w-[calc(50%-1rem)] bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex items-center justify-center p-12 overflow-hidden z-30"
        >
          <AnimatePresence mode="wait">
            {!isSignup ? (
              <motion.div key="form-login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="w-full flex justify-center">
                <LoginForm {...loginProps} />
              </motion.div>
            ) : (
              <motion.div key="form-signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="w-full flex justify-center">
                <SignupForm {...signupProps} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowForgot(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Reset your password</h3>
              <p className="text-slate-500 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>

              <input
                type="email"
                placeholder="Email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                className="w-full bg-slate-100 rounded-xl px-5 py-4 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900 transition-all mb-4"
              />

              {forgotError && (
                <p className="text-red-500 text-xs font-medium mb-4 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5zm0 6.5a.875.875 0 1 1 0-1.75A.875.875 0 0 1 8 11z" />
                  </svg>
                  {forgotError}
                </p>
              )}

              {forgotMsg && (
                <p className="text-emerald-600 text-sm font-medium mb-4 bg-emerald-50 rounded-xl px-4 py-3">{forgotMsg}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="flex-1 py-3 rounded-xl bg-slate-950 text-white font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}