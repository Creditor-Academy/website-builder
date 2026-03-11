import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ArrowRight,
  MessageSquare,
  Clock,
  Globe
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc';
  }, [isDark]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  const contactMethods = [
    { 
      icon: <Phone className="w-6 h-6" />, 
      title: "Call Us", 
      value: "+1 (123) 456 7890",
      description: "Mon-Fri from 8am to 5pm.",
      color: "blue"
    },
    { 
      icon: <Mail className="w-6 h-6" />, 
      title: "Email Us", 
      value: "hello@buildora.com",
      description: "Our friendly team is here to help.",
      color: "indigo"
    },
    { 
      icon: <MapPin className="w-6 h-6" />, 
      title: "Visit Us", 
      value: "San Francisco, CA",
      description: "Come say hello at our HQ.",
      color: "purple"
    }
  ];

  return (
    <main className={cn(
      "w-full min-h-screen transition-colors duration-1000 selection:bg-blue-500/30 relative overflow-hidden",
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    )}>
      <Helmet>
        <title>Contact Us - Buildora</title>
        <meta name="description" content="Get in touch with the Buildora team for support, partnerships, or any questions." />
      </Helmet>

      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={cn("absolute inset-0 bg-gradient-to-b opacity-40", isDark ? "from-slate-950 via-slate-950/20 to-slate-950" : "from-slate-50 via-slate-50/20 to-slate-50")} />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "w-full max-w-6xl pointer-events-auto backdrop-blur-2xl rounded-full px-6 py-3 flex items-center justify-between border transition-all duration-500",
            isDark
              ? "bg-slate-900/60 border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "bg-white/60 border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          )}
        >
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform duration-300 shadow-lg">B</div>
            <span className={cn("text-xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>Buildora</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Features", "Templates", "Resources"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className={cn(
                "relative group transition-colors",
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              )}>
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full rounded-full"></span>
              </Link>
            ))}
            <div className={cn("h-4 w-px", isDark ? "bg-slate-600/50" : "bg-slate-300")} />

            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-200 text-slate-600")}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link to="/login" className={isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}>Log in</Link>
          </div>

          <button className="md:hidden p-2 pointer-events-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>

        {/* Mobile Menu Overlay omitted for brevity, but could be included */}
      </nav>

      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full blur-[120px]", isDark ? "bg-blue-600/20" : "bg-blue-400/20")}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-500 font-bold text-5xl md:text-7xl tracking-tighter uppercase mb-6"
            >
              Get in touch
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={cn("text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}
            >
              Have a question or a project in mind? Our team is ready to help you turn your vision into reality.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* LEFT: INFO & CONTACT CARDS */}
            <div className="lg:col-span-5 space-y-8">
              {contactMethods.map((method, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className={cn(
                    "p-8 rounded-[2.5rem] border transition-all duration-300",
                    isDark 
                      ? "bg-slate-900/50 border-white/5 hover:border-blue-500/30 hover:bg-slate-900/80 shadow-2xl shadow-black/20" 
                      : "bg-white border-slate-200 hover:border-blue-500/30 hover:shadow-xl shadow-lg shadow-slate-200/50"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6",
                    isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                  )}>
                    {method.icon}
                  </div>
                  <h3 className={cn("text-2xl font-black mb-2", isDark ? "text-white" : "text-slate-900")}>{method.title}</h3>
                  <p className={cn("text-lg font-bold mb-2", isDark ? "text-blue-400" : "text-blue-600")}>{method.value}</p>
                  <p className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{method.description}</p>
                </motion.div>
              ))}

              <div className={cn(
                "p-8 rounded-[2.5rem] border overflow-hidden relative group",
                isDark ? "bg-indigo-600 border-indigo-500" : "bg-slate-900 border-slate-800"
              )}>
                <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-110">
                  <Globe className="w-32 h-32 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 relative z-10">Global Support</h3>
                <p className="text-indigo-100 font-medium mb-6 relative z-10">We support creators from 150+ countries. Our team is fully remote and distributed.</p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-500" />
                    ))}
                  </div>
                  <span className="text-white text-sm font-bold">24/7 Available</span>
                </div>
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={cn(
                "lg:col-span-7 p-10 md:p-16 rounded-[4rem] border relative overflow-hidden",
                isDark 
                  ? "bg-slate-900/40 border-white/5 backdrop-blur-3xl shadow-2xl" 
                  : "bg-white border-slate-200 shadow-2xl"
              )}
            >
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <MessageSquare className="w-64 h-64 text-blue-500" />
              </div>

              <div className="relative z-10 mb-12">
                <h2 className={cn("text-4xl md:text-5xl font-black mb-4", isDark ? "text-white" : "text-slate-900")}>Send a Message</h2>
                <div className="flex items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-1.5 text-green-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Fast Response
                  </div>
                  <div className={cn("h-4 w-px", isDark ? "bg-slate-700" : "bg-slate-200")} />
                  <div className={isDark ? "text-slate-400" : "text-slate-500"}>Typically responds in 2 hours</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className={cn("text-sm font-black uppercase tracking-widest ml-1", isDark ? "text-slate-500" : "text-slate-400")}>Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className={cn(
                        "w-full h-16 px-8 rounded-2xl border-2 outline-none transition-all font-bold text-lg",
                        isDark 
                          ? "bg-slate-950/50 border-white/5 focus:border-blue-500/50 text-white placeholder:text-slate-700" 
                          : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-300"
                      )}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className={cn("text-sm font-black uppercase tracking-widest ml-1", isDark ? "text-slate-500" : "text-slate-400")}>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className={cn(
                        "w-full h-16 px-8 rounded-2xl border-2 outline-none transition-all font-bold text-lg",
                        isDark 
                          ? "bg-slate-950/50 border-white/5 focus:border-blue-500/50 text-white placeholder:text-slate-700" 
                          : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-300"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={cn("text-sm font-black uppercase tracking-widest ml-1", isDark ? "text-slate-500" : "text-slate-400")}>How can we help?</label>
                  <select 
                    className={cn(
                      "w-full h-16 px-8 rounded-2xl border-2 outline-none transition-all font-bold text-lg appearance-none",
                      isDark 
                        ? "bg-slate-950/50 border-white/5 focus:border-blue-500/50 text-white" 
                        : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900"
                    )}
                  >
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={cn("text-sm font-black uppercase tracking-widest ml-1", isDark ? "text-slate-500" : "text-slate-400")}>Message</label>
                  <textarea 
                    rows={6}
                    placeholder="Tell us about your project..." 
                    className={cn(
                      "w-full p-8 rounded-3xl border-2 outline-none transition-all font-bold text-lg resize-none",
                      isDark 
                        ? "bg-slate-950/50 border-white/5 focus:border-blue-500/50 text-white placeholder:text-slate-700" 
                        : "bg-slate-50 border-transparent focus:border-blue-500 text-slate-900 placeholder:text-slate-300"
                    )}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || isSent}
                  className={cn(
                    "w-full h-20 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl",
                    isSent 
                      ? "bg-green-500 text-white" 
                      : (isDark ? "bg-white text-slate-950 hover:bg-blue-50" : "bg-slate-900 text-white hover:bg-blue-600")
                  )}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="submitting"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-6 h-6 border-4 border-slate-950/20 border-t-slate-950 rounded-full"
                      />
                    ) : isSent ? (
                      <motion.span key="sent" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" /> Message Sent
                      </motion.span>
                    ) : (
                      <motion.span key="default" className="flex items-center gap-2">
                        Send Message <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
}
