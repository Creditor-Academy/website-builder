import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Footer({ isDark = true }: { isDark?: boolean }) {
  return (
    <footer className={cn("pt-16 pb-12 px-6 transition-colors duration-1000", isDark ? "bg-[#020617] text-white" : "bg-slate-50 text-slate-950")}>
      <div className={cn("max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b pb-12 transition-colors duration-1000", isDark ? "border-white/5" : "border-slate-200")}>
        <div className="md:col-span-2 space-y-10">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl transition-colors duration-1000", isDark ? "bg-white text-black" : "bg-slate-950 text-white")}>B</div>
            <span className="text-4xl font-black tracking-tighter">BUILDORA</span>
          </div>
          <p className={cn("text-xl max-w-md leading-relaxed font-medium transition-colors duration-1000", isDark ? "text-slate-400" : "text-slate-600")}>Build modern, responsive websites with powerful tools, flexible layouts, and complete creative control — no coding required.</p>
        </div>
        <div>
          <h4 className={cn("font-black text-xl mb-10 transition-colors duration-1000", isDark ? "text-white" : "text-slate-900")}>Explore</h4>
          <ul className={cn("space-y-5 text-lg font-bold transition-colors duration-1000", isDark ? "text-slate-500" : "text-slate-500")}>
            {["Templates", "Features", "About Us"].map(item => (
              <li key={item} className={cn("cursor-pointer transition-colors w-fit", isDark ? "hover:text-blue-500" : "hover:text-blue-600")}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={cn("font-black text-xl mb-10 transition-colors duration-1000", isDark ? "text-white" : "text-slate-900")}>Legal</h4>
          <ul className={cn("space-y-5 text-lg font-bold transition-colors duration-1000", isDark ? "text-slate-500" : "text-slate-500")}>
            <li><Link to="/privacy-policy" className={cn("transition-colors", isDark ? "hover:text-blue-500" : "hover:text-blue-600")}>Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className={cn("transition-colors", isDark ? "hover:text-blue-500" : "hover:text-blue-600")}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className={cn("max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-center text-base font-bold gap-8 transition-colors duration-1000", isDark ? "text-slate-600" : "text-slate-500")}>
        <p>© {new Date().getFullYear()} Buildora Inc. All rights reserved.</p>
        <p className="flex items-center gap-2">Powered by <a href="https://lmsathena.com/" className={cn("transition-colors", isDark ? "text-blue-500 hover:text-white" : "text-blue-600 hover:text-slate-950")}>Athena LMS</a></p>
      </div>
    </footer>
  );
}
