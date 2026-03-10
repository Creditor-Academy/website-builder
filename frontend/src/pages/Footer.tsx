import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-white pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 border-b border-white/5 pb-12">
        <div className="md:col-span-2 space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-black text-2xl shadow-xl">B</div>
            <span className="text-4xl font-black tracking-tighter">BUILDORA</span>
          </div>
          <p className="text-slate-400 text-xl max-w-md leading-relaxed font-medium">Build modern, responsive websites with powerful tools, flexible layouts, and complete creative control — no coding required.</p>
        </div>
        <div>
          <h4 className="font-black text-xl mb-10 text-white">Explore</h4>
          <ul className="space-y-5 text-slate-500 text-lg font-bold">
            {["Templates", "Features", "About Us"].map(item => (
              <li key={item} className="hover:text-blue-500 cursor-pointer transition-colors w-fit">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-black text-xl mb-10 text-white">Legal</h4>
          <ul className="space-y-5 text-slate-500 text-lg font-bold">
            <li><Link to="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-center text-slate-600 text-base font-bold gap-8">
        <p>© {new Date().getFullYear()} Buildora Inc. All rights reserved.</p>
        <p className="flex items-center gap-2">Powered by <a href="https://lmsathena.com/" className="text-blue-500 hover:text-white transition-colors">Athena LMS</a></p>
      </div>
    </footer>
  );
}
