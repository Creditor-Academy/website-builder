import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github, Chrome, ArrowLeft } from "lucide-react";
import loginbg from "../assets/login.png";

export default function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => navigate("/dashboard");
  const handleSignup = () => setIsSignup(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* BACKGROUND IMAGE WITH ZOOM EFFECT */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        className="absolute inset-0 bg-no-repeat bg-center bg-cover blur-sm opacity-60"
        style={{ backgroundImage: `url(${loginbg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-transparent to-slate-900/80" />
      
      {/* BACK BUTTON */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold group"
      >
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="hidden sm:block">Back to Home</span>
      </Link>

      {/* BOX CONTAINER */}
      <div className="relative w-full max-w-[500px] min-h-[550px] md:h-[600px] z-10 px-4 my-8" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateY: isSignup ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          {/* ================= LOGIN SIDE ================= */}
          <div 
            className="absolute inset-0 w-full h-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 flex flex-col justify-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-center mb-10">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
                <Lock className="text-white w-6 h-6" />
              </div>
              <h2 className="text-white text-3xl font-black tracking-tight">Welcome Back</h2>
              <p className="text-slate-300 text-sm mt-2">Please enter your details to sign in.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-900 focus:bg-white/10 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-900 focus:bg-white/10 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 sm:py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative px-3 bg-transparent text-xs text-slate-700 uppercase font-bold tracking-widest">Or continue with</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <Chrome className="w-4 h-4 text-white" />
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                  <Github className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <p className="text-slate-400 text-center text-sm mt-8">
              New here?{" "}
              <button onClick={() => setIsSignup(true)} className="text-blue-400 font-bold hover:underline">
                Create Account
              </button>
            </p>
          </div>

          {/* ================= SIGNUP SIDE ================= */}
          <div 
            className="absolute inset-0 w-full h-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 flex flex-col justify-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-center mb-8">
              <h2 className="text-white text-3xl font-black tracking-tight">Join Buildora</h2>
              <p className="text-slate-300 text-sm mt-2">Start your journey with us today.</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-900 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-900 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700" />
                <input
                  type="password"
                  placeholder="Create Password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-900 focus:border-blue-500 transition-all outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSignup}
              className="w-full bg-white text-slate-900 font-black py-3 sm:py-4 rounded-2xl shadow-xl hover:bg-blue-50 transition-all active:scale-95"
            >
              Get Started
            </button>

            <p className="text-slate-800 text-center text-sm mt-8">
              Joined us before?{" "}
              <button onClick={() => setIsSignup(false)} className="text-blue-400 font-bold hover:underline">
                Login here
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}