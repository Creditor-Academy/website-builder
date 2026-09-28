import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, Moon, Move, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/Common/BrandLogo";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass } from "@/components/landing/pageFrame";
import LandingCta from "@/components/landing/LandingCta";

import dragDropImg from "../assets/drag_drop.png";
import templatesImg from "../assets/templates_showcase.png";
import componentsImg from "../assets/components_palette.png";
import uiShowcase1 from "../assets/ui_showcase_1.png";
import featureImg1 from "../assets/1.png";
import featureImg2 from "../assets/2.png";
import featureImg3 from "../assets/3.png";
import featureImg4 from "../assets/4.png";
import featureImg5 from "../assets/5.png";

const heroScrollImages = [dragDropImg, templatesImg, uiShowcase1, componentsImg] as const;
const featureCardImages = [featureImg1, featureImg2, featureImg3, featureImg4, featureImg5] as const;

export default function FeaturesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, isDark } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#020617" : "#f8fafc";
  }, [isDark]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const targetId = anchor.getAttribute("href");
        if (targetId && targetId !== "#") {
          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            e.preventDefault();
            targetElem.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div
      className={cn(
        "w-full overflow-x-hidden font-sans antialiased transition-colors duration-1000",
        isDark ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-[#1b1b1d]",
      )}
    >
      <Helmet>
        <title>Features — Web Studio</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </Helmet>

      {/* ================= NAVBAR (homepage-aligned) ================= */}
      <nav className="pointer-events-none fixed inset-x-0 top-0 z-[100] pt-3 sm:pt-6">
        <div className={cn(pageFrameClass, "relative")}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto flex w-full min-w-0 items-center justify-between rounded-full px-3.5 py-2.5 backdrop-blur-2xl transition-all duration-500 sm:px-6 sm:py-3",
              isDark
                ? "border border-slate-700/50 bg-slate-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                : "border border-slate-200/50 bg-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
            )}
          >
            <Link to="/" className="group pointer-events-auto flex min-w-0 shrink cursor-pointer items-center">
              <BrandLogo imgClassName="h-7 w-7 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
            </Link>

            <div className="hidden items-center gap-8 text-sm font-medium md:flex">
              {["Features", "Templates", "Resources"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={cn(
                    "relative group transition-colors",
                    isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900",
                  )}
                >
                  {item}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-[2px] rounded-full bg-blue-500 transition-all",
                      item === "Features" ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              ))}
              <div className={cn("h-4 w-px", isDark ? "bg-slate-600/50" : "bg-slate-300")} />

              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-200",
                )}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <Link
                to="/login"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95",
                  isDark
                    ? "bg-white text-slate-950 hover:bg-slate-100"
                    : "bg-[#0F172A] text-white hover:bg-[#1e293b]",
                )}
              >
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
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "pointer-events-auto absolute left-0 right-0 top-[calc(100%+0.75rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border p-4 backdrop-blur-3xl sm:rounded-3xl sm:p-6 md:hidden",
                  isDark
                    ? "border-slate-700 bg-slate-900/95 shadow-2xl"
                    : "border-slate-200 bg-white/95 shadow-xl",
                )}
              >
                <div className="flex flex-col gap-2">
                  {["Features", "Templates", "Resources"].map((item) => (
                    <Link
                      key={item}
                      to={`/${item.toLowerCase()}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                        isDark ? "text-slate-200 hover:bg-white/5" : "text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      {item}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "mt-2 rounded-2xl py-4 text-center text-lg font-bold",
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

      <main className="w-full">
        {/* ================= HERO ================= */}
        <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-950">
          {/* Tilted scrolling image columns */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-[150px]"
            />
            <div className="absolute top-1/2 left-1/2 flex h-[150vh] w-[150vw] -translate-x-1/2 -translate-y-1/2 -rotate-[12deg] skew-x-[12deg] items-center justify-center gap-8 opacity-70 md:opacity-90">
              <div className="animate-infinite-scroll-vertical flex flex-col gap-8">
                {[...heroScrollImages, ...heroScrollImages].map((img, i) => (
                  <div
                    key={`col-a-${i}`}
                    className="aspect-video w-[220px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl sm:w-[320px] md:w-[420px]"
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="animate-infinite-scroll-vertical-reverse mt-40 flex flex-col gap-8">
                {[...heroScrollImages].reverse().concat([...heroScrollImages].reverse()).map((img, i) => (
                  <div
                    key={`col-b-${i}`}
                    className="aspect-video w-[220px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl sm:w-[320px] md:w-[420px]"
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="animate-infinite-scroll-vertical hidden flex-col gap-8 lg:flex">
                {[componentsImg, dragDropImg, templatesImg, uiShowcase1, componentsImg, dragDropImg].map((img, i) => (
                  <div
                    key={`col-c-${i}`}
                    className="aspect-video w-[420px] overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
          </div>

          <div className={cn(pageFrameClass, "relative z-10 flex flex-col items-center text-center")}>
            <h1 className="mb-4 max-w-4xl text-[2rem] font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-[3.5rem]">
              Everything you need to design, build, and publish.{" "}
              <span className="text-slate-400">Without writing a single line of code.</span>
            </h1>

            <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Explore how Web Studio brings spatial freeform design, production-grade modular components, and global
              edge publishing together into one seamless studio.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#canvas"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition-all hover:bg-slate-200"
              >
                Explore Architecture
                <span className="material-symbols-outlined text-[18px]">south</span>
              </a>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                Open Web Studio Free
              </Link>
            </div>
          </div>
        </section>

        {/* Drag & Drop bento */}
        <section className="relative w-full bg-slate-950 pb-16 pt-4 sm:pb-20 sm:pt-6">
          <div className={pageFrameClass}>
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 text-left shadow-2xl backdrop-blur-xl sm:rounded-[2rem]">
              <div className="flex flex-col items-stretch gap-0 md:flex-row">
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-10">
                  <Move className="mb-4 h-9 w-9 text-blue-400 sm:mb-5 sm:h-10 sm:w-10" />
                  <h2 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                    Intuitive Drag &amp; Drop
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-slate-300 sm:text-base">
                    Build your dream website with a drag-and-drop interface. Pixel-perfect positioning, magnetic
                    alignment, real-time resizing—no coding required.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Pixel-perfect positioning", "Magnetic grid alignment", "Real-time resizing", "Layer management"].map(
                      (label) => (
                        <span
                          key={label}
                          className="rounded-full bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-300 sm:text-sm"
                        >
                          {label}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
                  <img
                    src={dragDropImg}
                    alt="Drag and drop canvas preview"
                    className="w-full max-w-md rotate-2 rounded-2xl shadow-2xl transition-transform duration-700 hover:rotate-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex w-full flex-col">
          {/* FEATURE 1 — Visual Canvas */}
          <section className="w-full bg-[#f8fafc] py-16 sm:py-20" id="canvas">
            <div className={pageFrameClass}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#1a1f4a] via-[#252b68] to-[#3530a0] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_50px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                    <div>
                      <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[40px]">
                        The Infinite Visual Canvas &amp; Dynamic Layers Hierarchy
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-300/85">
                        A spatial multi-rail design studio configured for surgical accuracy. Elements mount directly into dynamic DOM trees while vector bounding boxes deliver zero-lag fluid manipulation.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-indigo-400/25 to-indigo-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-200">
                          <span className="material-symbols-outlined text-[18px]">account_tree</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Hierarchical DOM Tree</div>
                          <div className="text-xs text-slate-400">Nested routes, layers, and instant node reordering</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-indigo-400/25 to-indigo-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/30 text-indigo-200">
                          <span className="material-symbols-outlined text-[18px]">pan_tool</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">8-Handle Vector Geometry</div>
                          <div className="text-xs text-slate-400">Pixel-snap guides and live flexbox alignment</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="inline-flex items-center rounded-md border border-indigo-400/40 bg-indigo-500/25 px-3 py-1 font-mono text-xs text-indigo-200">
                        Auto-Fit Zoom
                      </span>
                      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-slate-200">
                        Zero Synthetic Delay
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:col-span-7">
                    <div className="group/img relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/25 bg-slate-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_40px_rgba(255,255,255,0.08)] lg:min-h-0 lg:h-full">
                      <img
                        alt="Visual canvas workspace interface"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                        src={featureCardImages[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 2 */}
          <section className="w-full bg-slate-950 py-16 sm:py-20" id="components">
            <div className={pageFrameClass}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#0d2f2e] via-[#14524a] to-[#1a6b5e] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_50px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="order-2 flex lg:order-1 lg:col-span-7">
                    <div className="group/img relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/25 bg-slate-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_40px_rgba(255,255,255,0.08)] lg:min-h-0 lg:h-full">
                      <img
                        alt="Modular block system UI showcase"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                        src={featureCardImages[1]}
                      />
                    </div>
                  </div>

                  <div className="order-1 flex flex-col justify-between space-y-6 lg:order-2 lg:col-span-5">
                    <div>
                      <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[40px]">
                        120+ Modular Blocks &amp; Smart Section Swapping
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-300/85">
                        Eliminate blank-page intimidation. Buildora automatically understands layout semantics—replacing headers or footers in-place without disrupting active body content.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-emerald-400/25 to-emerald-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-200">
                          <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Intelligent In-Place Swapping</div>
                          <div className="text-xs text-slate-400">
                            Exchange hero, pricing, or nav blocks without breaking DOM hierarchy
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-emerald-400/25 to-emerald-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-200">
                          <span className="material-symbols-outlined text-[18px]">dashboard_customize</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">14 Functional Section Categories</div>
                          <div className="text-xs text-slate-400">
                            Bento cards, FAQs, tiered pricing, team rosters, and mega footers
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="inline-flex items-center rounded-md border border-emerald-400/40 bg-emerald-500/25 px-3 py-1 font-mono text-xs text-emerald-200">
                        Auto-Token Binding
                      </span>
                      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-slate-200">
                        Zero Manual CSS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 3 */}
          <section className="w-full bg-[#f8fafc] py-16 sm:py-20" id="typography">
            <div className={pageFrameClass}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#0f2744] via-[#163a5c] to-[#1d4f78] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_50px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                    <div>
                      <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[40px]">
                        Real-Time Inline Typography &amp; Media Engine
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-300/85">
                        Format copy instantly directly on the canvas. Markdown shortcuts trigger rapid headings and links, while high-throughput WebP pipelines and responsive video players auto-embed smoothly.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-sky-400/25 to-sky-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/30 text-sky-200">
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Direct-DOM Inline Editing</div>
                          <div className="text-xs text-slate-400">
                            Contextual format bubble, markdown tokens, and zero synthetic latency
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-sky-400/25 to-sky-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/30 text-sky-200">
                          <span className="material-symbols-outlined text-[18px]">video_file</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Rich Media &amp; Auto-Routing</div>
                          <div className="text-xs text-slate-400">
                            YouTube, MP4 canvas preview, and automatic route scaffold resolvers
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="inline-flex items-center rounded-md border border-sky-400/40 bg-sky-500/25 px-3 py-1 font-mono text-xs text-sky-200">
                        Auto Srcset Generation
                      </span>
                      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-slate-200">
                        Global Scale Sync
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:col-span-7">
                    <div className="group/img relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/25 bg-slate-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_40px_rgba(255,255,255,0.08)] lg:min-h-0 lg:h-full">
                      <img
                        alt="Live typography and inline content editor"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                        src={featureCardImages[2]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 4 */}
          <section className="w-full bg-slate-950 py-16 sm:py-20" id="tokens">
            <div className={pageFrameClass}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#3a280c] via-[#4e3612] to-[#6a4a18] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_50px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="order-2 flex lg:order-1 lg:col-span-7">
                    <div className="group/img relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/25 bg-slate-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_40px_rgba(255,255,255,0.08)] lg:min-h-0 lg:h-full">
                      <img
                        alt="Design token engine and responsive preview"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                        src={featureCardImages[3]}
                      />
                    </div>
                  </div>

                  <div className="order-1 flex flex-col justify-between space-y-6 lg:order-2 lg:col-span-5">
                    <div>
                      <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[40px]">
                        Global Design Tokens &amp; Dynamic Viewports
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-300/85">
                        Configure once, broadcast instantly. Unified radius presets, semantic color tokens, elevation shadows, and automated mobile breakpoint overrides keep design consistency ironclad across all screens.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-amber-400/25 to-amber-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/30 text-amber-200">
                          <span className="material-symbols-outlined text-[18px]">palette</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Centralized Token Compiler</div>
                          <div className="text-xs text-slate-400">
                            Radii, palette values, and elevation compile straight into CSS custom properties
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-amber-400/25 to-amber-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/30 text-amber-200">
                          <span className="material-symbols-outlined text-[18px]">devices</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Fluid Viewport Overrides</div>
                          <div className="text-xs text-slate-400">
                            Target Desktop (1440px), Tablet (768px), and Phone (390px) independently
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="inline-flex items-center rounded-md border border-amber-400/40 bg-amber-500/25 px-3 py-1 font-mono text-xs text-amber-200">
                        Auto-Stacked Breakpoints
                      </span>
                      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-slate-200">
                        Single Source of Truth
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 5 */}
          <section className="w-full bg-[#f8fafc] py-16 sm:py-20" id="publishing">
            <div className={pageFrameClass}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-br from-[#321848] via-[#42205e] to-[#5a2a7a] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_50px_rgba(255,255,255,0.12)] transition-all duration-300 hover:-translate-y-2 sm:p-10 lg:p-12">
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-400/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                    <div>
                      <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[40px]">
                        Version Snapshots &amp; Enterprise Cloud Publishing
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-slate-300/85">
                        Continuous immutable snapshot trees protect every design mutation. Deploy immediately to edge CDN subdomains or attach custom Apex domains with automated SSL provisioning.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-purple-400/25 to-purple-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/30 text-purple-200">
                          <span className="material-symbols-outlined text-[18px]">history</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Immutable Git-Style Rollbacks</div>
                          <div className="text-xs text-slate-400">
                            Timestamped DOM state clones with single-click zero-downtime restore
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-white/25 bg-gradient-to-br from-purple-400/25 to-purple-950/35 p-3 shadow-[0_0_24px_rgba(255,255,255,0.1)] backdrop-blur-md transition hover:border-white/40">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/30 text-purple-200">
                          <span className="material-symbols-outlined text-[18px]">lock</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">Automated SSL &amp; Global CDN</div>
                          <div className="text-xs text-slate-400">
                            Sub-38ms TTFB edge distribution and automated Let's Encrypt certificates
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="inline-flex items-center rounded-md border border-purple-400/40 bg-purple-500/25 px-3 py-1 font-mono text-xs text-purple-200">
                        99.9% Cloud SLA
                      </span>
                      <span className="inline-flex items-center rounded-md border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-slate-200">
                        Brotli Edge Compression
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:col-span-7">
                    <div className="group/img relative min-h-[240px] w-full overflow-hidden rounded-2xl border border-white/25 bg-slate-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_40px_rgba(255,255,255,0.08)] lg:min-h-0 lg:h-full">
                      <img
                        alt="Cloud deployment dashboard"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                        src={featureCardImages[4]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUICKSTART 8-STEP WORKFLOW BANNER */}
          <section className="w-full bg-slate-950 py-16 sm:py-20" id="pipeline">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-8 lg:px-10">
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 className="text-[36px] font-bold text-white">
                  Zero to Live in{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    8 Precision Milestones
                  </span>
                </h2>
                <p className="mt-3 text-[16px] text-slate-300">
                  The chronological engineering workflow from initial authentication to edge cache replication and live apex domain routing.
                </p>
              </div>

              {/* 8-Step Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 01 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-cyan-700">Zero Friction</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">Auth &amp; Identity</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-2">
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/10 border border-white/10 font-mono">
                          <span className="w-3.5 h-3.5 rounded-full bg-red-500/90 text-[9px] font-bold flex items-center justify-center text-white">G</span>
                          <span>Google Auth</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-slate-300 text-[10px]">
                          Magic Link
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-emerald-400">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">verified_user</span> Encrypted 256-bit
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">Zero-Trust</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      Instant session initiation via Google or Magic Link with zero-trust token exchange and encrypted team access.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-cyan-700">P0 IDENTITY</span>
                    <span className="material-symbols-outlined text-[16px] text-cyan-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-indigo-700">Spatial DOM</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">Canvas Init</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-center">
                        <div className="py-1 rounded bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 font-semibold flex items-center justify-center gap-1">
                          <span>+</span> Blank Canvas
                        </div>
                        <div className="py-1 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center gap-1 text-[10px]">
                          <span>★</span> Starter Kits
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                        <span className="text-slate-400 font-mono">Viewport Base</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] border border-indigo-400/30">
                          1440px Fluid
                        </span>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      Choose a blank architectural canvas or clone an enterprise baseline boilerplate with ready-made CSS tokens.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-indigo-700">PROJECT MOUNT</span>
                    <span className="material-symbols-outlined text-[16px] text-indigo-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-violet-700">Smart Snapping</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">Section Assembly</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-white/10 border border-white/10">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          Navbar Block
                        </span>
                        <span className="material-symbols-outlined text-[13px] text-slate-400">drag_indicator</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-violet-500/25 border border-violet-400/40 text-violet-200">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
                          Hero Bento
                        </span>
                        <span className="material-symbols-outlined text-[13px] text-violet-300">magnet</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-white/10 border border-white/10">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          Feature Grid
                        </span>
                        <span className="material-symbols-outlined text-[13px] text-slate-400">check_circle</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      Stack headers, feature blocks, and footers with auto-repositioning DOM logic and intelligent layout flow.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-violet-700">DOM REFLOW</span>
                    <span className="material-symbols-outlined text-[16px] text-violet-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 04 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-rose-700">Zero Lag</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">WYSIWYG Engine</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-2">
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-white/10 text-[10px] font-mono text-slate-300">
                        <span className="font-bold text-white">B</span>
                        <span className="italic text-white">I</span>
                        <span className="underline">U</span>
                        <span className="text-rose-400">Link</span>
                        <span className="px-1 rounded bg-rose-500/30 text-rose-200 font-bold">H1</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1.5 rounded bg-slate-950/70 border border-white/5 font-mono text-[11px]">
                        <span className="text-slate-200 font-semibold">Live Typography</span>
                        <span className="w-1.5 h-3.5 bg-rose-400 animate-pulse inline-block" />
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      Format typography directly on the canvas and drop media assets into the pipeline with instant WebP compression.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-rose-700">INLINE DIRECT</span>
                    <span className="material-symbols-outlined text-[16px] text-rose-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 05 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-amber-700">Auto-Resolvers</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">Router &amp; Linking</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Home (/)
                        </span>
                        <span className="text-amber-400">───►</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          /templates
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-amber-400">link</span> Anchor Binding
                        </span>
                        <span className="text-amber-300">/pricing #tier2</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      Connect navigation paths, configure CTA routes, and bind in-page scroll anchors with auto-route scaffolding.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-amber-700">STATIC DISPATCH</span>
                    <span className="material-symbols-outlined text-[16px] text-amber-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 06 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-emerald-700">Auto-Breakpoints</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">Responsive Audit</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-1.5">
                      <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                        <div className="py-1 px-1 rounded bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center gap-0.5">
                          <span>🖥</span> 1440 <span className="text-emerald-400 text-[9px]">✓</span>
                        </div>
                        <div className="py-1 px-1 rounded bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 flex items-center justify-center gap-0.5 font-semibold">
                          <span>📱</span> 768 <span className="text-emerald-400 text-[9px]">✓</span>
                        </div>
                        <div className="py-1 px-1 rounded bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center gap-0.5">
                          <span>📲</span> 390 <span className="text-emerald-400 text-[9px]">✓</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-slate-400">
                        <span>Parity Score</span>
                        <span className="text-emerald-300 font-mono font-bold">100% Validated</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      Audit Tablet and Phone viewports with targeted override styling adjustments that preserve widescreen parity.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-emerald-700">FLUID TEST</span>
                    <span className="material-symbols-outlined text-[16px] text-emerald-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 07 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-[#c6c6cd]/50 bg-white p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-500/50 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-sky-700">One-Click Edge</span>
                    </div>
                    <h4 className="text-[18px] text-[#1b1b1d] font-semibold mb-2">Immutable Deploy</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-slate-900 text-white shadow-inner border border-white/10 space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[13px] text-sky-400">commit</span>
                          <span>v2.4 Prod</span>
                        </span>
                        <span className="text-[9px] text-slate-400">#8f4c2</span>
                      </div>
                      <div className="flex items-center justify-between px-2 py-1 rounded bg-sky-500/20 border border-sky-400/30 text-sky-200 text-[10px]">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                          <span>Deploy to Edge</span>
                        </span>
                        <span className="material-symbols-outlined text-[13px]">cloud_upload</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-[#45464d] leading-relaxed">
                      One-click publish generates an immutable snapshot, treeshakes unused styles, and distributes static bundles.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#c6c6cd]/30 flex items-center justify-between text-xs text-[#45464d]">
                    <span className="font-mono text-[10px] text-sky-700">STATIC BUNDLER</span>
                    <span className="material-symbols-outlined text-[16px] text-sky-600 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>

                {/* Step 08 */}
                <div className="group flex flex-col justify-between rounded-2xl border border-emerald-500/40 bg-slate-950 p-5 text-white transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-lg">
                  <div>
                    <div className="mb-3 flex items-center justify-end">
                      <span className="text-[11px] font-semibold text-emerald-300">Active Anycast</span>
                    </div>
                    <h4 className="text-[18px] text-white font-semibold mb-2">Worldwide Live</h4>
                    <div className="my-3 p-2.5 rounded-xl bg-black/40 text-white shadow-inner border border-emerald-500/30 space-y-1.5 font-mono text-[10px]">
                      <div className="flex items-center justify-between text-emerald-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>buildora.site/my-site</span>
                        </span>
                        <span className="material-symbols-outlined text-[13px] text-emerald-400">lock</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[9px] text-slate-300">
                        <span className="text-emerald-400 font-bold">14ms Global TTFB</span>
                        <span className="text-slate-400">99.9% Cloud SLA</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-slate-300 leading-relaxed">
                      Instant worldwide discovery with automated SSL encryption, edge caching, and 99.9% uptime SLA.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono text-[10px] text-emerald-300 font-semibold">PRODUCTION ACTIVE</span>
                    <span className="material-symbols-outlined text-[16px] text-emerald-400 group-hover:translate-x-1 transition-transform">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <LandingCta />
        </div>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}
