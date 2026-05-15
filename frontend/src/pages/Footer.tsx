import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Footer({ isDark = true }: { isDark?: boolean }) {
  return (
    <footer className={cn("pt-16 pb-12 px-6 transition-colors duration-1000", isDark ? "bg-[#020617] text-white" : "bg-blue-900 text-white")}>
       <div className={cn("max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b pb-12 transition-colors duration-1000", isDark ? "border-white/5" : "border-white/20")}> 
        <div className="md:col-span-2 space-y-10">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl transition-colors duration-1000", isDark ? "bg-white text-black" : "bg-white text-blue-600")}>B</div>
            <span className="text-2xl md:text-4xl font-black tracking-tighter">BUILDORA</span>
          </div>
          <p className={cn("text-base md:text-xl max-w-md leading-relaxed font-medium transition-colors duration-1000", isDark ? "text-slate-400" : "text-blue-50")}>Build modern, responsive websites with powerful tools, flexible layouts, and complete creative control — no coding required.</p>
        </div>
        <div>
          <h4 className={cn("font-black text-lg md:text-xl mb-6 md:mb-10 transition-colors duration-1000", isDark ? "text-white" : "text-white")}>Explore</h4>
          <ul className={cn("space-y-5 text-lg font-bold transition-colors duration-1000", isDark ? "text-slate-500" : "text-blue-100")}>
            <li><Link to="/templates" className={cn("cursor-pointer transition-colors w-fit", isDark ? "hover:text-blue-500" : "hover:text-white")}>Templates</Link></li>
            <li><Link to="/features" className={cn("cursor-pointer transition-colors w-fit", isDark ? "hover:text-blue-500" : "hover:text-white")}>Features</Link></li>
            <li><Link to="/resources" className={cn("cursor-pointer transition-colors w-fit", isDark ? "hover:text-blue-500" : "hover:text-white")}>Resources</Link></li>
          </ul>
        </div> 
        <div>
          <h4 className={cn("font-black text-lg md:text-xl mb-6 md:mb-10 transition-colors duration-1000", isDark ? "text-white" : "text-white")}>Legal</h4>
          <ul className={cn("space-y-5 text-lg font-bold transition-colors duration-1000", isDark ? "text-slate-500" : "text-blue-100")}>
            <li><Link to="/privacy-policy" className={cn("transition-colors", isDark ? "hover:text-blue-500" : "hover:text-white")}>Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className={cn("transition-colors", isDark ? "hover:text-blue-500" : "hover:text-white")}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className={cn("max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-center text-base font-bold gap-8 transition-colors duration-1000", isDark ? "text-slate-600" : "text-blue-200")}>
        <p>© {new Date().getFullYear()} Buildora Inc. All rights reserved.</p>
        <p className="flex items-center gap-2">Powered by <a href="https://lmsathena.com/" className={cn("transition-colors text-white", isDark ? "text-blue-500 hover:text-white" : "hover:text-blue-100")}>Athena LMS</a></p>
      </div>
    </footer>
  );
}
