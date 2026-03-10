import { useEffect, useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { ChevronDown, ArrowRight, MousePointer2, Sparkles, Menu, X, Zap, LayoutTemplate, Layers, Palette, MonitorPlay, Move, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useBuilderStore, { BuilderState } from "@/store/useBuilderStore";
import Footer from "./Footer";
import { cn } from "@/lib/utils";

// Assets
import brand from "../assets/brand.mp4";
import business from "../assets/Bussiness.jpg";
import create from "../assets/create.mp4";
import library from "../assets/Libaray.mp4";
import Drag from "../assets/Drag.gif";
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";
import school from "../assets/School.jpg";
import CTA from "../assets/CTA.png";



interface Template {
  id: string;
  title: string;
  image: string;
}



const templates: Template[] = [
  { id: "ecommerce", title: "eCommerce", image: Ecommerce },
  { id: "portfolio", title: "Portfolio", image: Portfolio },
  { id: "business", title: "Business", image: business },
  { id: "consultant", title: "Consultant", image: business },
  { id: "blank", title: "Blank Canvas", image: school },
];

const FloatingElement = ({ children, x, y, delay = 0, className, isDark }: any) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
      style={{ x, y }}
      className={cn(
        "absolute hidden lg:flex flex-col gap-2 p-4 backdrop-blur-2xl border rounded-2xl shadow-2xl transition-colors duration-1000",
        isDark ? "bg-white/5 border-white/10" : "bg-white/70 border-slate-200/50 shadow-[0_20px_40px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const createWebsite = useBuilderStore((state: BuilderState) => state.createWebsite);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  // Toggle Body Background based on Theme
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc'; // slate-950 or slate-50
  }, [isDark]);

  // Scroll Animations
  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // Magnetic Parallax for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / 15; // Increased sensitivity
    const y = (e.clientY - innerHeight / 2) / 15;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleSelectTemplate = (templateId: string, title: string) => {
    const id = createWebsite(`My ${title}`, templateId);
    navigate(`/builder/${id}`);
  };

  // Carousel auto scroll
  useEffect(() => {
    let rafId: number;
    let scrollAmount = 0;
    let isHovered = false;
    const el = carouselRef.current;

    if (!el) return;

    const handleEnter = () => { isHovered = true; };
    const handleLeave = () => { isHovered = false; };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    const autoScroll = () => {
      if (!isHovered && el) {
        scrollAmount += 1;
        el.scrollLeft = scrollAmount;
        if (scrollAmount >= el.scrollWidth / 2) {
          scrollAmount = 0;
        }
      }
      rafId = requestAnimationFrame(autoScroll);
    };

    autoScroll();

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <main
      className={cn("w-full overflow-x-hidden selection:bg-blue-500/30 font-sans transition-colors duration-1000", isDark ? "bg-slate-950 text-slate-100 selection:text-white" : "bg-slate-50 text-slate-900 selection:text-black")}
      onMouseMove={handleMouseMove}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "w-full max-w-6xl pointer-events-auto backdrop-blur-2xl rounded-full px-6 py-3 flex items-center justify-between transition-all duration-500",
            isDark
              ? "bg-slate-900/60 border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-slate-900/80"
              : "bg-white/60 border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:bg-white/80"
          )}
        >
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">B</div>
            <span className={cn("text-xl font-bold tracking-tight transition-colors", isDark ? "text-white group-hover:text-blue-200" : "text-slate-900 group-hover:text-blue-600")}>Buildora</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Features", "Templates", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={cn("relative group transition-colors", isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900")}>
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full rounded-full"></span>
              </a>
            ))}
            <div className={cn("h-4 w-px", isDark ? "bg-slate-600/50" : "bg-slate-300")} />

            {/* Theme Toggle */}
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-200 text-slate-600")}>
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun className="w-4 h-4" /></motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon className="w-4 h-4" /></motion.div>
                )}
              </AnimatePresence>
            </button>

            <Link to="/login" className={cn("transition-colors", isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900")}>Log in</Link>
            <Link to="/contact" className={cn("px-5 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-95 font-semibold", isDark ? "bg-white text-slate-950 hover:bg-blue-50 hover:text-blue-600" : "bg-slate-900 text-white hover:bg-blue-600")}>
              Get started
            </Link>
          </div>

          <button className={cn("md:hidden p-2", isDark ? "text-white" : "text-slate-900")} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-20">
        <div className={cn("absolute inset-0 z-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000", isDark ? "opacity-30 mix-blend-screen" : "opacity-40 mix-blend-multiply")}>
          {/* Animated Background Orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={cn("w-[1000px] h-[1000px] rounded-full blur-[150px]", isDark ? "bg-blue-600/30" : "bg-blue-400/40")}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, 100, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={cn("w-[800px] h-[800px] rounded-full blur-[120px] absolute -top-40 -left-20", isDark ? "bg-indigo-500/30" : "bg-purple-300/40")}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], y: [0, -100, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className={cn("w-[600px] h-[600px] rounded-full blur-[120px] absolute bottom-0 right-0", isDark ? "bg-purple-600/30" : "bg-blue-300/40")}
          />
        </div>

        {/* Floating Mock UI Elements for "Builder" Context */}
        <FloatingElement
          x={useTransform(smoothX, (v) => v * -2.5)}
          y={useTransform(smoothY, (v) => v * -2.5)}
          delay={0.2}
          isDark={isDark}
          className="top-[20%] left-[5%] w-48 z-10"
        >
          <div className={cn("flex items-center gap-2 mb-2 pb-2 border-b", isDark ? "border-white/10" : "border-slate-200")}>
            <Layers className="w-4 h-4 text-blue-500" />
            <span className={cn("text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>Layers</span>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={cn("h-6 w-full rounded-md border opacity-80", isDark ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-200")} />
            ))}
          </div>
        </FloatingElement>

        <FloatingElement
          x={useTransform(smoothX, (v) => v * 1.8)}
          y={useTransform(smoothY, (v) => v * 1.8)}
          delay={0.4}
          isDark={isDark}
          className="bottom-[25%] right-[8%] w-56 z-10"
        >
          <div className={cn("flex items-center gap-2 mb-2 pb-2 border-b", isDark ? "border-white/10" : "border-slate-200")}>
            <Palette className="w-4 h-4 text-purple-500" />
            <span className={cn("text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>Styles</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {['bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500'].map((color, i) => (
              <div key={i} className={`h-8 w-full rounded-md ${color} shadow-sm`} />
            ))}
          </div>
          <div className={cn("h-2 w-full rounded-full mt-3", isDark ? "bg-white/10" : "bg-slate-200")} />
        </FloatingElement>

        <FloatingElement
          x={useTransform(smoothX, (v) => v * 2.5)}
          y={useTransform(smoothY, (v) => v * -1)}
          delay={0.6}
          isDark={isDark}
          className="top-[30%] right-[10%] w-40 z-10 p-3"
        >
          <span className={cn("text-xs font-semibold block mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Typography</span>
          <div className={cn("text-2xl font-black leading-none", isDark ? "text-white" : "text-slate-900")}>Inter</div>
          <div className={cn("text-sm font-medium mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Weight: 800</div>
        </FloatingElement>

        <motion.div
          style={{ opacity: opacityHero, scale: scaleHero }}
          className="relative z-20 max-w-5xl mx-auto px-6 text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full border text-xs font-bold mb-8 backdrop-blur-xl transition-all cursor-pointer group shadow-[0_0_20px_rgba(0,0,0,0.1)]",
              isDark
                ? "bg-slate-800/60 border-slate-600/50 text-blue-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:border-blue-500/50"
                : "bg-white/80 border-blue-200 text-blue-800 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400"
            )}
          >
            <Sparkles className="w-4 h-4 text-blue-500 group-hover:text-indigo-500 transition-colors" />
            <span className={cn("bg-clip-text text-transparent", isDark ? "bg-gradient-to-r from-blue-200 to-indigo-200" : "bg-gradient-to-r from-blue-700 to-indigo-700")}>Defining the future of web creation</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={cn("text-[4.5rem] sm:text-[6rem] md:text-[7.5rem] font-bold tracking-tighter leading-[0.9] mb-8 transition-colors duration-1000", isDark ? "text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" : "text-slate-900 drop-shadow-xl")}
          >
            Design exactly <br />
            <span className={cn("italic font-serif font-light relative", isDark ? "text-blue-200" : "text-blue-900")}>
              what you imagine.
              <svg className="absolute w-[110%] h-6 -bottom-4 -left-[5%] text-blue-500 opacity-70 drop-shadow-lg" viewBox="0 0 100 20" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={cn("text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium transition-colors duration-1000", isDark ? "text-slate-300" : "text-slate-600")}
          >
            Buildora is an advanced website builder giving you absolute creative freedom.
            Drag, drop, and publish professional, stunning websites in minutes.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto z-50 relative"
          >
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })}
              className={cn(
                "h-16 px-10 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 group shadow-lg pointer-events-auto",
                isDark
                  ? "bg-white text-slate-950 hover:bg-blue-50 hover:text-blue-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
                  : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
              )}
            >
              Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={cn(
                "h-16 px-10 backdrop-blur-md border rounded-full font-bold text-lg flex items-center justify-center transition-all duration-300 group shadow-lg pointer-events-auto",
                isDark
                  ? "bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  : "bg-white/80 border-slate-300 text-slate-900 hover:bg-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]"
              )}
            >
              <MonitorPlay className="w-5 h-5 mr-3 text-blue-500 group-hover:scale-125 transition-transform duration-300" /> Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Interactive Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className={cn("absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-1000", isDark ? "opacity-60" : "opacity-40")}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={cn("w-1 h-12 rounded-full overflow-hidden", isDark ? "bg-white/20" : "bg-slate-900/20")}
          >
            <motion.div
              animate={{ y: [-24, 48] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className={cn("w-full h-1/2 rounded-full", isDark ? "bg-white" : "bg-slate-900")}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ================= BENTO GRID FEATURES ================= */}
      <section id="features" className={cn("py-24 relative z-10 transition-colors duration-1000", isDark ? "bg-slate-950/50" : "bg-slate-100")}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center md:text-left">
            <h2 className={cn("text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-md transition-colors duration-1000", isDark ? "text-white" : "text-slate-900")}>Limitless possibilities. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Zero compromises.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[400px] gap-6">
            {/* Feature 1 (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
              className="md:col-span-2 relative rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden group flex flex-col hover:border-blue-500/50 transition-colors duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-10 pb-0 z-10 relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <Move className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold mb-3 text-white">Absolute Freedom</h3>
                <p className="text-slate-300 text-lg max-w-sm font-medium">Drag and drop elements anywhere on the canvas with pixel-perfect control.</p>
              </div>
              <div className="flex-1 mt-6 relative w-full translate-y-8 group-hover:translate-y-2 group-hover:scale-[1.02] transition-all duration-700 ease-out">
                <img src={Drag} alt="Drag Interface" className="absolute right-0 bottom-0 w-[90%] md:w-[75%] rounded-tl-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-l border-slate-600 opacity-90 group-hover:opacity-100" />
              </div>
            </motion.div>

            {/* Feature 2 (Small) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.1 }}
              className="relative rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden group flex flex-col hover:border-purple-500/50 transition-colors duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 z-10 relative flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <Layers className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Smart Library</h3>
                <p className="text-slate-300 font-medium leading-relaxed">Pre-designed sections and blocks that adapt to your brand automatically.</p>
                <div className="mt-auto relative w-full h-44 rounded-2xl overflow-hidden border border-slate-700 shadow-lg translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-50" />
                  <video src={library} autoPlay muted loop className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>

            {/* Feature 3 (Small) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
              className="relative rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden group flex flex-col hover:border-emerald-500/50 transition-colors duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 z-10 relative flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <LayoutTemplate className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Visual Editing</h3>
                <p className="text-slate-300 font-medium leading-relaxed">Edit content directly in place. WYSIWYG re-imagined for the modern era.</p>
                <div className="mt-auto relative w-full h-44 rounded-2xl overflow-hidden border border-slate-700 shadow-lg translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-50" />
                  <video src={create} autoPlay muted loop className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                </div>
              </div>
            </motion.div>

            {/* Feature 4 (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.1 }}
              className="md:col-span-2 relative rounded-[2.5rem] border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden group flex flex-col md:flex-row hover:border-orange-500/50 transition-colors duration-500 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
              <video src={brand} autoPlay muted loop className="absolute right-0 top-0 h-full w-[70%] object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700 mix-blend-screen" />

              <div className="p-10 z-20 relative flex flex-col justify-center max-w-md h-full">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                  <Palette className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Define your brand</h3>
                <p className="text-slate-300 text-lg font-medium">Set up global styles, tokens, and typography once. Keep everything perfectly consistent across your entire site.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ================= TEMPLATES SCROLL ================= */}
      <section id="templates" className={cn("py-32 relative overflow-hidden transition-colors duration-1000", isDark ? "bg-slate-950" : "bg-white")}>
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-[1000px] h-[500px] bg-indigo-600 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 mb-20 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <div>
            <h2 className={cn("text-5xl md:text-7xl font-bold tracking-tight transition-colors duration-1000", isDark ? "text-white" : "text-slate-900")}>
              Start with brilliant <br /><span className="text-blue-400 italic font-serif font-medium">templates.</span>
            </h2>
          </div>
          <button className={cn("px-8 py-4 rounded-full font-bold transition-all border shadow-lg active:scale-95 duration-1000", isDark ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-600 hover:border-blue-500 hover:shadow-blue-500/20" : "bg-white hover:bg-slate-50 text-slate-950 border-slate-200 hover:border-blue-500 hover:shadow-blue-500/20")}>
            View all templates
          </button>
        </div>

        {/* Carousel */}
        <div
          className="flex gap-10 overflow-x-hidden px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2))] pb-16 relative z-10"
          ref={carouselRef}
        >
          {templates.concat(templates).map((tpl, i) => (
            <div key={i} className="relative shrink-0 w-[85vw] md:w-[450px] aspect-[4/5] group rounded-[3rem] overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] hover:border-blue-500/50 transition-all duration-500 cursor-pointer">
              <img src={tpl.image} alt={tpl.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-lighten" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-4xl font-bold mb-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">{tpl.title}</h3>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white text-slate-950 py-4 px-6 rounded-2xl font-bold w-full transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 hover:bg-blue-50 hover:text-blue-600 shadow-xl"
                >
                  Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ================= FINAL CTA ================= */}
      <section className={cn("relative py-32 flex items-center justify-center text-center px-6 overflow-hidden transition-colors duration-1000", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <div className="absolute inset-0 z-0">
          <img src={CTA} alt="CTA" className="w-full h-full object-cover opacity-30 scale-105 filter blur-[2px]" />
          <div className={cn("absolute inset-0 bg-gradient-to-t transition-colors duration-1000", isDark ? "from-slate-950 via-slate-950/80 to-transparent" : "from-slate-50 via-slate-50/80 to-transparent")} />
          <div className={cn("absolute inset-0 bg-gradient-to-b transition-colors duration-1000", isDark ? "from-slate-950 via-transparent to-slate-950" : "from-slate-50 via-transparent to-slate-50")} />
        </div>

        <div className={cn("relative z-10 max-w-4xl mx-auto backdrop-blur-3xl border p-12 md:p-20 rounded-[4rem] shadow-2xl transition-colors duration-1000", isDark ? "bg-slate-900/40 border-slate-700" : "bg-white/60 border-slate-200")}>
          <h2 className={cn("text-5xl md:text-7xl font-bold tracking-tight mb-8 drop-shadow-lg transition-colors duration-1000", isDark ? "text-white" : "text-slate-900")}>
            Ready to build <br /> your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">masterpiece?</span>
          </h2>
          <p className={cn("text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-1000", isDark ? "text-slate-300" : "text-slate-600")}>
            Join thousands of creators producing high-performance, dynamic websites without writing a single line of code.
          </p>
          <Link to="/login" className={cn("inline-flex h-16 px-10 items-center justify-center gap-4 font-bold rounded-full text-xl hover:scale-105 transition-all duration-300 group shadow-xl", isDark ? "bg-white text-slate-950 hover:bg-blue-50 hover:text-blue-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]" : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-[0_0_40px_rgba(15,23,42,0.4)]")}>
            Get Started for Free <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
}
