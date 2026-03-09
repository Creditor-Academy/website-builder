import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "./footer";

const sections = [
  { id: "who-we-are", title: "Who We Are", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "info-collect", title: "Information We Collect", icon: <Eye className="w-4 h-4" /> },
  { id: "usage", title: "How We Use Your Info", icon: <FileText className="w-4 h-4" /> },
  { id: "legal", title: "Legal Basis", icon: <Lock className="w-4 h-4" /> },
  { id: "cookie", title: "Cookies & Tracking" },
  { id: "share", title: "Sharing Information" },
  { id: "security", title: "Data Security" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Rights" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");

  // Handle intersection observer to highlight sidebar on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -35% 0%", threshold: 0.5 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // Account for sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg group-hover:bg-blue-600 transition-colors">
              B
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              Buildora
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/#about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO HEADER ================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-100">
              <Lock className="w-3 h-3" /> Secure & Transparent
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Last updated: <span className="text-slate-900 font-semibold">March 2024</span>. 
              We value your trust. This policy explains how Buildora handles your data with the highest standards of security.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        
        {/* ===== LEFT CONTENT ===== */}
        <section className="space-y-20">
          <div id="who-we-are" className="scroll-mt-32 group">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
               <h2 className="text-3xl font-black text-slate-900">Who We Are</h2>
            </div>
            <div className="prose prose-slate prose-lg max-w-none text-slate-600">
              <p>
                Buildora provides high-end residential and commercial
                landscape care and digital architecture solutions. Your privacy isn't just a legal requirement for us—it's a core value.
              </p>
            </div>
          </div>

          <div id="info-collect" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
               <h2 className="text-3xl font-black text-slate-900">Information We Collect</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Contact Details", desc: "Name, phone, and professional email address." },
                { title: "Service Data", desc: "Project photos, notes, and site locations." },
                { title: "Usage Data", desc: "Analytics, browser type, and interaction patterns." },
                { title: "Device Info", desc: "IP addresses and cookie identifiers." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="usage" className="scroll-mt-32">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</div>
               <h2 className="text-3xl font-black text-slate-900">How We Use Your Info</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              We process your information to deliver our services effectively, maintain security, and improve your user experience. 
              We <span className="text-slate-900 font-bold">never sell</span> your personal information to third parties.
            </p>
          </div>

          {/* Compact Sections with Dividers */}
          {[
            { id: "legal", title: "Legal Basis", content: "We process data based on explicit consent, legitimate business interests, and contractual necessity." },
            { id: "cookie", title: "Cookies & Tracking", content: "Our site uses cookies to remember your preferences and analyze site traffic for better performance." },
            { id: "security", title: "Data Security", content: "We use AES-256 encryption and secure internal protocols to safeguard every byte of your data." },
            { id: "retention", title: "Data Retention", content: "We store data only as long as your account is active or as required by legal compliance." },
          ].map((sec) => (
            <div key={sec.id} id={sec.id} className="scroll-mt-32 border-t border-slate-200 pt-12">
               <h3 className="text-2xl font-black text-slate-900 mb-4">{sec.title}</h3>
               <p className="text-slate-600 leading-relaxed">{sec.content}</p>
            </div>
          ))}

          <div id="contact" className="scroll-mt-32 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full -mr-20 -mt-20" />
            <h2 className="text-3xl font-black mb-4 relative z-10">Questions?</h2>
            <p className="text-slate-400 mb-8 relative z-10">Our privacy team is ready to help you with any data-related concerns.</p>
            <a href="mailto:privacy@athena.lms" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all relative z-10">
              Contact Privacy Team <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* ===== RIGHT SIDEBAR (INTERACTIVE INDEX) ===== */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-6">
                Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                      activeSection === s.id 
                      ? "bg-blue-50 text-blue-600 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {s.icon}
                      {s.title}
                    </span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${activeSection === s.id ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`} />
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
               <ShieldCheck className="w-10 h-10 mb-4" />
               <h4 className="font-black text-xl mb-2">Your data is safe.</h4>
               <p className="text-blue-100 text-sm leading-relaxed">
                 We comply with global standards including GDPR and CCPA.
               </p>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}