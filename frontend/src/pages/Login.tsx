import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, LayoutTemplate } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import loginbg from "../assets/login.png";

const LoginForm = ({ email, setEmail, password, setPassword, loading, error, isSignup, handleLogin, toggleMode, onGoogleSuccess }: any) => {
  const [showPassword, setShowPassword] = useState(false);
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Input your email"
            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
          />
        </div>
        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-2 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Input your password"
              className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 select-none">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0" />
            Remember Me
          </label>
          <a href="#" className="text-sm font-medium text-slate-400 hover:text-slate-800 transition-colors">Forgot Password?</a>
        </div>
      </div>

      {error && !isSignup && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={() => handleLogin()}
        disabled={loading}
        className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] mb-8 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <span className="relative px-4 bg-white text-xs text-slate-400">Or continue with</span>
      </div>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => { }}
          useOneTap
          theme="outline"
          shape="circle"
          size="large"
          text="continue_with"
        />
      </div>

      <p className="text-slate-500 text-center text-sm mt-8 hidden md:block">
        Don't have an account?{" "}
        <button onClick={() => toggleMode(true)} className="text-slate-950 font-bold hover:underline">
          Sign up here
        </button>
      </p>
    </div>
  );
};

const SignupForm = ({ name, setName, email, setEmail, password, setPassword, loading, error, isSignup, handleSignup, toggleMode, onGoogleSuccess }: any) => {
  const [showPassword, setShowPassword] = useState(false);
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
          />
        </div>
        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Input your email"
            className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
          />
        </div>
        <div className="relative group">
          <label className="text-xs font-bold text-slate-800 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 pl-1">
            Min. 8 characters, must include uppercase, lowercase and a number.
          </p>
        </div>
      </div>

      {error && isSignup && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        onClick={() => handleSignup()}
        disabled={loading}
        className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all active:scale-[0.98] mb-8 disabled:opacity-50"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <span className="relative px-4 bg-white text-xs text-slate-400">Or continue with</span>
      </div>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => { }}
          useOneTap
          theme="outline"
          shape="circle"
          size="large"
          text="continue_with"
        />
      </div>

      <p className="text-slate-500 text-center text-sm mt-8 hidden md:block">
        Joined us before?{" "}
        <button onClick={() => toggleMode(false)} className="text-slate-950 font-bold hover:underline">
          Login here
        </button>
      </p>
    </div>
  );
};

export default function LoginSignup() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed");

      // Cache user data so dashboard can hydrate instantly
      if (data.user) localStorage.setItem('buildora_user', JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors ? data.errors.join(", ") : (data.error || data.message || "Login failed");
        throw new Error(errorMsg);
      }

      // Cache user data so dashboard can hydrate instantly
      if (data.user) localStorage.setItem('buildora_user', JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors ? data.errors.join(", ") : (data.error || data.message || "Registration failed");
        throw new Error(errorMsg);
      }

      setIsSignup(false);
      alert(data.message || "Registration successful! Please check your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (signup: boolean) => {
    setIsSignup(signup);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
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

      {isMobile && (
        <div className="md:hidden flex flex-col w-full h-full items-center justify-center p-4 z-20 relative pt-24 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-2xl">
            <AnimatePresence mode="wait">
              {!isSignup ? (
                <motion.div key="m-login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <LoginForm
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    loading={loading} error={error} isSignup={isSignup}
                    handleLogin={handleLogin} toggleMode={toggleMode}
                    onGoogleSuccess={handleGoogleSuccess}
                  />
                  <p className="text-slate-500 text-center text-sm mt-8 block md:hidden">
                    Don't have an account?{" "}
                    <button onClick={() => toggleMode(true)} className="text-slate-950 font-bold hover:underline">
                      Sign up here
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div key="m-signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <SignupForm
                    name={name} setName={setName}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    loading={loading} error={error} isSignup={isSignup}
                    handleSignup={handleSignup} toggleMode={toggleMode}
                    onGoogleSuccess={handleGoogleSuccess}
                  />
                  <p className="text-slate-500 text-center text-sm mt-8 block md:hidden">
                    Joined us before?{" "}
                    <button onClick={() => toggleMode(false)} className="text-slate-950 font-bold hover:underline">
                      Login here
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {!isMobile && (
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
                  <LoginForm
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    loading={loading} error={error} isSignup={isSignup}
                    handleLogin={handleLogin} toggleMode={toggleMode}
                    onGoogleSuccess={handleGoogleSuccess}
                  />
                </motion.div>
              ) : (
                <motion.div key="form-signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="w-full flex justify-center">
                  <SignupForm
                    name={name} setName={setName}
                    email={email} setEmail={setEmail}
                    password={password} setPassword={setPassword}
                    loading={loading} error={error} isSignup={isSignup}
                    handleSignup={handleSignup} toggleMode={toggleMode}
                    onGoogleSuccess={handleGoogleSuccess}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
