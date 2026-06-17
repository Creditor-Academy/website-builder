import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Scale, 
  ShieldAlert, 
  CreditCard, 
  Handshake, 
  Gavel, 
  UserCheck, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Footer from "./Footer";

interface TermSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const termSections: TermSection[] = [
  { id: "acceptance", title: "Acceptance", icon: <Handshake className="w-4 h-4" /> },
  { id: "usage", title: "Service Use", icon: <UserCheck className="w-4 h-4" /> },
  { id: "accounts", title: "Accounts", icon: <ShieldAlert className="w-4 h-4" /> },
  { id: "intellectual-property", title: "Intellectual Property", icon: <BookOpen className="w-4 h-4" /> },
  { id: "payments", title: "Payments", icon: <CreditCard className="w-4 h-4" /> },
  { id: "termination", title: "Termination", icon: <Gavel className="w-4 h-4" /> },
  { id: "liability", title: "Liability", icon: <Scale className="w-4 h-4" /> },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-25% 0% -40% 0%", threshold: 0.4 }
    );

    termSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg group-hover:bg-indigo-600 transition-colors">
              B
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              Buildora
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/#about" className="hover:text-indigo-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* ================= HERO HEADER ================= */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-4 block">Legal Agreement</span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8">
              Terms of <span className="text-slate-900">Service</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              By using the Buildora platform, you are agreeing to the following terms. Please read them carefully to understand your rights and obligations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-20">

        {/* ===== LEFT CONTENT ===== */}
        <section className="space-y-24">
          
          <div id="acceptance" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-sm">
                 <Handshake className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">1. Acceptance of Terms</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed pl-16">
              By accessing Buildora, you confirm that you are at least 18 years old and agree to be bound by these Terms of Service. If you are using the services on behalf of an organization, you represent that you have the authority to bind that entity to these terms.
            </p>
          </div>

          <div id="usage" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-sm">
                 <UserCheck className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">2. Use of Our Services</h2>
            </div>
            <div className="pl-16 space-y-4">
              <p className="text-slate-600 text-lg leading-relaxed">
                You may use Buildora only for lawful purposes. You agree not to:
              </p>
              <ul className="grid md:grid-cols-2 gap-3">
                {["Misuse the platform", "Interfere with operation", "Scrape content", "Unauthorized access"].map((item) => (
                  <li key={item} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-red-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="accounts" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-sm">
                 <ShieldAlert className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">3. Accounts & Security</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed pl-16">
              Account security is a shared responsibility. While we provide secure login protocols, you are responsible for maintaining the confidentiality of your credentials. Notify us immediately of any unauthorized account access.
            </p>
          </div>

          <div id="intellectual-property" className="scroll-mt-32 border-l-4 border-indigo-600 pl-8 ml-6">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
              <BookOpen className="text-indigo-600" /> 4. Intellectual Property
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              All content, templates, designs, and software provided by Buildora are owned by or licensed to us. You are granted a limited, non-exclusive license to use the templates for your personal or business website, but copying the "Buildora Engine" or reselling our core assets is strictly prohibited.
            </p>
          </div>

          <div id="payments" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-sm">
                 <CreditCard className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">5. Payments & Subscriptions</h2>
            </div>
            <div className="pl-16 p-8 bg-indigo-900 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
               <p className="leading-relaxed mb-4 text-indigo-100">
                 Paid plans are billed according to the pricing displayed at purchase. Buildora reserves the right to change pricing with 30-day prior notice. 
               </p>
               <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">Auto-renewal applies to all monthly/annual plans.</div>
            </div>
          </div>

          <div id="termination" className="scroll-mt-32">
             <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">6. Termination</h2>
             <p className="text-slate-600 text-lg leading-relaxed pl-16">
               We reserve the right to suspend your access if you engage in harmful activities. You may close your account at any time through your dashboard settings.
             </p>
          </div>

          <div id="liability" className="scroll-mt-32 border-t border-slate-200 pt-16">
             <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight ">7. Limitation of Liability</h2>
             <p className="text-slate-500 text-lg leading-relaxed pl-16 italic">
               Buildora is provided "as is". We shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform.
             </p>
          </div>

        </section>

        {/* ===== RIGHT SIDEBAR (INTERACTIVE) ===== */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-8">
                Guide to Terms
              </h3>
              <nav className="space-y-1">
                {termSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left px-5 py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                      activeSection === s.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]" 
                      : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
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

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
               <h4 className="font-black text-lg mb-2">Need a summary?</h4>
               <p className="text-slate-400 text-xs leading-relaxed mb-6">
                 If you don't want to read the legal jargon, just contact our support for a plain-English explanation.
               </p>
               <Link to="/contact" className="text-indigo-400 text-xs font-bold hover:underline">
                 Talk to us →
               </Link>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}