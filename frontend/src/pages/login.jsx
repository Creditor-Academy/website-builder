
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginbg from "../assets/login.png";

export default function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  const handleSignup = () => {
    setIsSignup(false);
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
  
  {/* BACKGROUND IMAGE */}
  <div
    className="absolute inset-0 bg-no-repeat bg-center bg-cover scale-100 blur-sm"
    style={{
      backgroundImage: `url(${loginbg})`,
    }}
  />

  {/* DARK OVERLAY (optional but recommended) */}
  <div className="absolute inset-0 bg-black/40" />
      {/* FLIP WRAPPER */}
      <div className="relative w-[600px] h-[580px] perspective">
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-preserve-3d
          ${isSignup ? "rotate-y-180" : ""}`}
        >
          {/* LOGIN SIDE */}
          <div className="absolute inset-0 bg-white/45 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-12 flex flex-col justify-center backface-hidden">
            <h2 className="text-black text-3xl text-center font-bold mb-8">Login</h2>

            <input
              type="text"
              placeholder="Username"
              className="mb-4 bg-transparent border-b border-gray-800 text-black py-2 outline-none placeholder:text-gray-800 focus:border-black transition"
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-8 bg-transparent border-b border-gray-800 text-black py-2 outline-none placeholder:text-gray-800 focus:border-black transition"
            />

            <button onClick={handleLogin} 
            className="bg-gradient-to-r from-[#5ab8dd] to-[#5A8DEE] text-white px-10 py-4 rounded-full">
              Login
            </button>

            <p className="text-black text-sm mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* SIGNUP SIDE */}
          <div className="absolute inset-0 bg-white/45 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-12 flex flex-col justify-center rotate-y-180 backface-hidden">
            <h2 className="text-black text-3xl text-center font-bold mb-8">Sign Up</h2>

            <input
              type="text"
              placeholder="Username"
              className="mb-4 bg-transparent border-b border-gray-600 text-black py-2 outline-none placeholder:text-gray-800 focus:border-black transition"
            />
            <input
              type="email"
              placeholder="Email"
              className="mb-4 bg-transparent border-b border-gray-600 text-black py-2 outline-none placeholder:text-gray-800 focus:border-black transition"
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-8 bg-transparent border-b border-gray-600 text-black py-2 outline-none placeholder:text-gray-800 focus:border-black transition"
            />

            <button onClick={handleSignup} 
            className="bg-gradient-to-r from-[#5EC9F3] to-[#5A8DEE] text-white px-10 py-4 rounded-full">
              Create Account
            </button>

            <p className="text-gray-800 text-sm mt-6">
              Already have an account?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}