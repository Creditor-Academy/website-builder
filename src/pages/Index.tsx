import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Menu, X, LayoutTemplate, Layers, Palette, Sun, Moon, Play, Check, Image as ImageIcon, Settings, Plus, MousePointer2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/Common/BrandLogo";
import Loading from "@/components/Common/LoadingUI";
import { getDashboardPath, validateSession } from "@/lib/authSession";
import FeaturesCards from "@/components/ui/feature-shader-cards";
import ProductVideo from "@/components/ui/productvideo";
import TemplatesScroll from "@/components/landing/TemplatesScroll";
import LandingCta from "@/components/landing/LandingCta";
import { pageFrameClass } from "@/components/landing/pageFrame";
import { useTheme } from "@/hooks/useTheme";

// Assets
import business from "../assets/Bussiness.jpg";
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";
import school from "../assets/School.jpg";

function HeroProductMockup({ isDark }: { isDark: boolean }) {
  const thumbs = [business, Portfolio, school, Ecommerce];
  const rail = [
    { icon: Plus, label: "Add" },
    { icon: Layers, label: "Layers" },
    { icon: LayoutTemplate, label: "Pages" },
    { icon: ImageIcon, label: "Assets" },
    { icon: Palette, label: "Design" },
    { icon: Settings, label: "Settings" },
  ];
  return (
    <div className="relative mx-auto h-full w-full max-w-full overflow-hidden sm:overflow-visible">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative z-10 flex h-full min-h-[18rem] flex-col overflow-hidden rounded-[22px] border border-white shadow-[0_40px_80px_rgba(15,23,42,0.22)] sm:min-h-[22rem] sm:rounded-[30px] lg:min-h-0",
          isDark ? "border-white/10 bg-slate-900" : "border-white bg-white",
        )}
      >
        <div className={cn("flex items-center border-b px-3 py-2.5 sm:px-5 sm:py-3.5", isDark ? "border-white/10" : "border-slate-100")}>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="flex w-12 shrink-0 flex-col items-center gap-0.5 bg-[#0F172A] px-1 py-3 sm:w-[4.75rem] sm:gap-1 sm:px-1.5 sm:py-4">
            {rail.map((item, i) => (
              <span
                key={item.label}
                className={cn(
                  "flex w-full flex-col items-center gap-0.5 rounded-lg px-0.5 py-1.5 sm:gap-1 sm:rounded-xl sm:px-1 sm:py-2",
                  i === 0 ? "bg-white/15 text-white" : "text-slate-300",
                )}
              >
                <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
                <span className="hidden text-[8px] font-medium leading-none tracking-wide sm:block">{item.label}</span>
              </span>
            ))}
          </div>

          <div className={cn("relative flex min-h-0 min-w-0 flex-1 flex-col", isDark ? "bg-slate-950" : "bg-white")}>
            <div className="flex shrink-0 items-center justify-between gap-2 bg-[#0B1220] px-2.5 py-2.5 text-[10px] text-white sm:gap-3 sm:px-5 sm:py-3 sm:text-[11px]">
              <span className="flex min-w-0 items-center gap-1.5 font-semibold tracking-tight sm:gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[9px] font-bold sm:h-6 sm:w-6 sm:text-[10px]">A</span>
                <span className="truncate">Apex</span>
              </span>
              <span className="hidden items-center gap-4 text-white/75 sm:flex">
                <span className="font-semibold text-white underline decoration-white/80 underline-offset-4">Home</span>
                <span>About</span>
                <span>Services</span>
                <span className="hidden md:inline">Portfolio</span>
                <span className="hidden lg:inline">Contact</span>
              </span>
              <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-[#0F172A] sm:px-3 sm:py-1.5 sm:text-[10px]">
                Get started
              </span>
            </div>
            <div className="relative min-h-0 flex-1">
              <img src={business} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/75 via-[#0F172A]/10 to-transparent" />
              <div className="absolute bottom-4 left-3 right-3 text-white sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 sm:text-[11px] sm:tracking-[0.22em]">Explore the World</p>
              </div>
              <div className="absolute left-[32%] top-[36%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-dashed border-sky-400 bg-sky-400/10 sm:h-10 sm:w-10" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Image drag chip — clipped on small screens via parent overflow */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{
          x: [0, 0, 12, 168, 168, 0],
          y: [0, 0, 0, -24, -24, 0],
          scale: [1, 1, 0.95, 1, 1, 1],
        }}
        transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.22, 0.34, 0.62, 0.78, 1], ease: "easeInOut" }}
        className={cn(
          "absolute left-2 top-[46%] z-20 hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-xl sm:left-0 sm:flex md:-left-6",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600">
          <ImageIcon className="h-4 w-4" />
        </span>
        <span className="text-xs font-semibold">Image</span>
      </motion.div>

      <motion.div
        aria-hidden
        animate={{
          x: [18, 18, 36, 196, 196, 18],
          y: [18, 18, 16, -8, -8, 18],
          opacity: [0, 1, 1, 1, 0, 0],
        }}
        transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.12, 0.34, 0.62, 0.78, 1], ease: "easeInOut" }}
        className="pointer-events-none absolute left-2 top-[46%] z-30 hidden text-[#0F172A] sm:left-0 sm:block md:-left-6"
      >
        <MousePointer2 className="h-5 w-5" />
      </motion.div>

      <motion.div
        aria-hidden
        animate={{ scale: [0.2, 0.2, 1.7, 1.7], opacity: [0, 0, 0.55, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.58, 0.72, 1] }}
        className="pointer-events-none absolute left-[34%] top-[38%] z-20 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/70 blur-md sm:block"
      />


      {/* Asset tray */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute bottom-2 left-1/2 z-20 flex max-w-[calc(100%-1rem)] -translate-x-1/2 gap-1.5 rounded-2xl border border-white p-1.5 shadow-xl sm:bottom-4 sm:left-10 sm:max-w-none sm:translate-x-0 sm:gap-2 sm:p-2",
          isDark ? "border-white/40 bg-slate-900" : "bg-white",
        )}
      >
        {thumbs.map((src, i) => (
          <img key={i} src={src} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover sm:h-12 sm:w-12 sm:rounded-xl" />
        ))}
      </motion.div>

      {/* Published toast */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute bottom-14 right-2 z-30 flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-lg sm:bottom-6 sm:right-2 sm:gap-2 sm:px-3 sm:py-2",
          isDark ? "border-emerald-400/20 bg-slate-900 text-emerald-300" : "border-emerald-100 bg-white text-emerald-700",
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span className="text-[10px] font-semibold sm:text-[11px]">Published</span>
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const { setTheme, isDark } = useTheme();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [5, -5]), { stiffness: 140, damping: 18 });
  const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-5, 5]), { stiffness: 140, damping: 18 });

  // Toggle Body Background based on Theme
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc'; // slate-950 or slate-50
  }, [isDark]);

  // If session cookie is still valid, go straight to the dashboard
  useEffect(() => {
    void validateSession().then(({ valid, user }) => {
      if (valid && user) {
        navigate(getDashboardPath(user), { replace: true });
        return;
      }
      setIsCheckingSession(false);
    });
  }, [navigate]);

  if (isCheckingSession) {
    return <Loading fullScreen label="Checking session" />;
  }

  return (
    <main
      className={cn(
        "w-full overflow-x-hidden font-sans transition-colors duration-1000",
        isDark
          ? "bg-slate-950 text-slate-100 selection:bg-white/20 selection:text-white"
          : "bg-slate-50 text-slate-900 selection:bg-[#131924]/15 selection:text-black",
      )}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-[100] pt-3 sm:pt-6">
        <div className={cn(pageFrameClass, "relative")}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "pointer-events-auto flex w-full min-w-0 items-center justify-between rounded-full px-3.5 py-2.5 backdrop-blur-2xl transition-all duration-500 sm:px-6 sm:py-3",
            isDark
              ? "bg-slate-900/80 border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "bg-white/90 border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          )}
        >
          <Link to="/" className="flex min-w-0 shrink items-center cursor-pointer group pointer-events-auto">
            <BrandLogo
              imgClassName="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110"
            />
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

            <Link to="/login" className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95",
              isDark ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-[#0F172A] text-white hover:bg-[#1e293b]",
            )}>
              Login <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-0.5 md:hidden">
            <button
              type="button"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn("pointer-events-auto rounded-full p-2", isDark ? "text-slate-300" : "text-slate-600")}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className={cn("pointer-events-auto p-2", isDark ? "text-white" : "text-slate-900")}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "pointer-events-auto absolute left-0 right-0 top-[calc(100%+0.75rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border p-4 backdrop-blur-3xl sm:rounded-3xl sm:p-6 md:hidden",
                isDark ? "bg-slate-900/95 border-slate-700 shadow-2xl" : "bg-white/95 border-slate-200 shadow-xl"
              )}
            >
              <div className="flex flex-col gap-2">
                {["Features", "Templates", "Resources"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "rounded-xl p-3 text-base font-semibold transition-colors sm:text-lg",
                      isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {item}
                  </Link>
                ))}
                <div className={cn("my-2 h-px w-full", isDark ? "bg-slate-800" : "bg-slate-100")} />
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "mt-1 w-full rounded-2xl py-3.5 text-center text-base font-bold sm:py-4 sm:text-lg",
                    isDark ? "bg-white text-slate-950" : "bg-slate-900 text-white",
                  )}
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className={cn(
          "relative min-h-[100svh] overflow-visible",
          isDark ? "bg-slate-950" : "bg-[#F4F7FC]",
        )}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          tiltX.set((event.clientX - rect.left) / rect.width - 0.5);
          tiltY.set((event.clientY - rect.top) / rect.height - 0.5);
        }}
        onMouseLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
      >
        {/* Soft atmosphere blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className={cn("absolute -right-24 top-10 h-[min(28rem,70vw)] w-[min(28rem,70vw)] rounded-full blur-3xl", isDark ? "bg-sky-500/15" : "bg-sky-300/40")} />
          <div className={cn("absolute bottom-0 right-1/4 h-[min(22rem,55vw)] w-[min(22rem,55vw)] rounded-full blur-3xl", isDark ? "bg-violet-500/10" : "bg-violet-300/30")} />
          <div className={cn("absolute left-[-8%] top-1/3 h-48 w-48 rounded-full blur-3xl sm:h-64 sm:w-64", isDark ? "bg-blue-500/10" : "bg-blue-200/35")} />
        </div>

        <div className={cn(pageFrameClass, "relative z-10 grid min-w-0 items-stretch gap-8 pb-4 pt-24 sm:gap-10 sm:pb-5 sm:pt-28 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-8 lg:pb-6 lg:pt-32")}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-w-0 flex-col items-start self-start"
          >
            <h1 className={cn("w-full max-w-full", isDark ? "text-white" : "text-[#111827]")}>
              <span className="block text-[2.5rem] font-bold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Design.<br />Build.<br />Publish.
              </span>
              <span className={cn("relative mt-3 inline-block max-w-full font-['Caveat',cursive] text-[1.85rem] font-bold leading-none sm:text-4xl md:text-5xl", isDark ? "text-slate-100" : "text-[#182848]")}>
                All in one studio.
                <svg className="pointer-events-none absolute -bottom-2 left-0 h-3 w-[108%] max-w-none text-[#3DB7FF]" viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden>
                  <motion.path
                    d="M2 11 C 70 12, 120 4, 238 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                  />
                </svg>
              </span>
            </h1>

            <p className={cn("mt-4 max-w-md text-[0.95rem] leading-relaxed sm:mt-5 sm:text-lg", isDark ? "text-slate-400" : "text-slate-500")}>
              Create a project, design pages on a visual canvas, and publish to a live address without writing code.
            </p>

            <div className="mt-5 flex w-full max-w-md flex-col gap-3 sm:mt-6 sm:max-w-none sm:flex-row sm:items-center">
              <Link
                to="/login"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#007AFF] to-[#4DA3FF] px-7 text-sm font-semibold text-white transition-shadow hover:shadow-[0_10px_25px_rgba(0,122,255,0.3)] sm:h-14 sm:w-auto"
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/features"
                className={cn(
                  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors sm:w-auto",
                  isDark
                    ? "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Watch quick tour
              </Link>
            </div>
          </motion.div>
          

          <div className="relative min-h-[18rem] min-w-0 w-full max-w-full sm:min-h-[22rem] lg:col-start-2 lg:row-start-1 lg:h-auto lg:min-h-0 lg:self-stretch">
            <motion.div
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              className="h-full max-w-full [transform-style:preserve-3d] lg:absolute lg:inset-0"
            >
              <HeroProductMockup isDark={isDark} />
            </motion.div>
          </div>


          <div className="min-w-0 max-w-full lg:col-span-2 lg:row-start-2">
            <ProductVideo />
          </div>
        </div>

        {/* Features — same horizontal padding as hero / pageFrame */}
        <div className={cn(pageFrameClass, "relative z-10 pb-8 sm:pb-10 lg:pb-12")}>
          <FeaturesCards />
        </div>
      </section>


      <TemplatesScroll />

      <LandingCta />

      <Footer isDark={isDark} />
    </main>
  );
}
