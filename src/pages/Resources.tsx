import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Brush,
  Sparkles,
  Eye,
  Wrench,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  Layout,
  Smartphone,
  Code,
  Palette,
  Grid,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/Common/BrandLogo";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass } from "@/components/landing/pageFrame";

const ResourceCard = ({
  icon,
  title,
  description,
  isDark,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}) => (
  <motion.div
    whileHover={{ y: -6 }}
    className={cn(
      "group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border p-6 transition-all duration-500 sm:rounded-[30px] sm:p-8",
      isDark
        ? "border-slate-800 bg-slate-900/60 hover:border-slate-600"
        : "border-[#E5E7EB] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
    )}
  >
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F172A] text-white transition-transform duration-300 group-hover:scale-105 sm:mb-8 sm:h-14 sm:w-14">
      {icon}
    </div>
    <h3
      className={cn(
        "mb-3 text-xl font-bold tracking-tight transition-colors sm:text-2xl",
        isDark ? "group-hover:text-sky-400" : "text-[#0F172A] group-hover:text-sky-600",
      )}
    >
      {title}
    </h3>
    <p
      className={cn(
        "mb-6 flex-1 text-[0.95rem] leading-relaxed sm:mb-8",
        isDark ? "text-slate-400" : "text-[#747781]",
      )}
    >
      {description}
    </p>
    <div className="mt-auto flex cursor-pointer items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-500 group/link">
      Learn more{" "}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
    </div>
  </motion.div>
);

const Resources = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, isDark } = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#020617" : "#f8fafc";
  }, [isDark]);

  const mainResources = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Quickstart: Zero to Live",
      description:
        "Sign in, create a project, structure pages with Elements, edit content, check responsive views, publish, and verify the live URL.",
    },
    {
      icon: <Layout className="h-5 w-5" />,
      title: "Elements & Sections",
      description:
        "Browse the categorized library—headers, footers, hero, features, pricing, FAQ, team, CTA, contact, and more—then click or drag onto the canvas.",
    },
    {
      icon: <Grid className="h-5 w-5" />,
      title: "Template or Blank",
      description:
        "When you create a project, choose Blank to start from scratch or select a pre-built template, then open the editor automatically.",
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Global Design System",
      description:
        "Open Design to set a primary color palette and a style preset for border radii and shadow depth across every page.",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Assets Manager",
      description:
        "Upload PNG, JPG, SVG, or MP4 files, search royalty-free stock libraries, copy hosted URLs, or apply assets to selected images.",
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Preview Mode",
      description:
        "Toggle the eye icon to hide editing frames and sidebars and see visitor rendering. Publish separately before the site is public.",
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Version History",
      description:
        "Review timestamped revisions from History on the left rail and restore a prior site state when you need a rollback.",
    },
    {
      icon: <LifeBuoy className="h-5 w-5" />,
      title: "Product Tour",
      description:
        "In the editor, click the question mark icon to launch the interactive onboarding tour of the rails, canvas, and publish flow.",
    },
  ];

  const [hoveredTool, setHoveredTool] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const specializedTools = [
    {
      icon: <Layout />,
      title: "Component Catalog",
      desc: "Elements, Header presets (Simple, Classic, Centered, Split), Sections, and Footer layouts from the left rail.",
      image: "/assets/predefine.jpg",
    },
    {
      icon: <Smartphone />,
      title: "Responsive Viewports",
      desc: "Switch Desktop, Tablet, and Mobile in the top bar; viewport-specific spacing saves per device size.",
      image: "/assets/monitor.jpg",
    },
    {
      icon: <Zap />,
      title: "Publish & Domains",
      desc: "Publish to a subdomain or connect and verify a custom domain with DNS records and automated SSL.",
      image: "/assets/SEO.jpg",
    },
  ];

  useEffect(() => {
    if (hoveredTool !== null) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % specializedTools.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hoveredTool, specializedTools.length]);

  return (
    <main
      className={cn(
        "relative min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-1000",
        isDark
          ? "bg-slate-950 text-slate-100 selection:bg-white/20 selection:text-white"
          : "bg-slate-50 text-slate-900 selection:bg-[#131924]/15 selection:text-black",
      )}
    >
      <Helmet>
        <title>Resources - Web Studio</title>
        <meta
          name="description"
          content="Web Studio product guides: quickstart, elements catalog, assets, design system, preview, version history, and publishing."
        />
      </Helmet>

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
                ? "border border-slate-700/50 bg-slate-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                : "border border-slate-200/50 bg-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
            )}
          >
            <Link to="/" className="group pointer-events-auto flex min-w-0 shrink cursor-pointer items-center">
              <BrandLogo imgClassName="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110" />
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
                      item === "Resources" ? "w-full" : "w-0 group-hover:w-full",
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
                className={cn(
                  "pointer-events-auto rounded-full p-2",
                  isDark ? "text-slate-300" : "text-slate-600",
                )}
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
                        "rounded-xl p-3 text-base font-semibold transition-colors sm:text-lg",
                        isDark
                          ? "text-slate-300 hover:bg-white/5 hover:text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
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
                      isDark ? "bg-white text-slate-950" : "bg-[#0F172A] text-white",
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

      {/* ================= HERO SECTION ================= */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden pb-16 pt-28 sm:min-h-[80vh] sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            src="/assets/res.png"
            alt=""
            className={cn(
              "h-full w-full object-cover transition-all duration-1000",
              isDark ? "brightness-[0.45]" : "brightness-[0.7]",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r via-transparent to-transparent opacity-80",
              isDark ? "from-slate-950" : "from-slate-50",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b via-transparent opacity-70",
              isDark ? "to-slate-950" : "to-slate-50",
            )}
          />
        </div>

        <div className={cn(pageFrameClass, "relative z-10 w-full")}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-[2.5rem] font-bold leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="font-sans">Learn the</span>
            <br />
            <span className="font-semibold italic text-sky-300">Web Studio workflow.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-[0.95rem] font-medium leading-relaxed text-white/85 sm:mt-6 sm:text-lg"
          >
            Step-by-step guidance from the product manual—create a project, design on the canvas,
            manage pages and assets, then publish to a live address without writing code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
          >
            <Link
              to="/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#007AFF] to-[#4DA3FF] px-7 text-sm font-semibold text-white transition-shadow hover:shadow-[0_10px_25px_rgba(0,122,255,0.3)] sm:h-14 sm:w-auto"
            >
              Open the Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= RESOURCES GRID ================= */}
      <section className="py-16 sm:py-20">
        <div className={cn(pageFrameClass, "grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4")}>
          {mainResources.map((resource, i) => (
            <ResourceCard key={i} {...resource} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ================= PREDEFINED RESOURCES SHOWCASE ================= */}
      <section className={cn("py-16 sm:py-20", isDark ? "bg-slate-900/30" : "bg-[#F8FAFC]")}>
        <div className={pageFrameClass}>
          <div className="mb-12 text-center sm:mb-16">
            <h2
              className={cn(
                "mb-4 text-3xl font-bold tracking-tight sm:mb-5 sm:text-4xl md:text-5xl",
                isDark ? "text-white" : "text-[#0F172A]",
              )}
            >
              Building blocks from the editor
            </h2>
            <p
              className={cn(
                "mx-auto max-w-2xl text-[0.95rem] leading-relaxed sm:text-lg",
                isDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              Everything below maps to tools in the Web Studio left rail and top bar—documented in
              the product user guide.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <motion.div
              whileHover={{ y: -4 }}
              className={cn(
                "group relative min-w-0 overflow-hidden rounded-[22px] border p-8 transition-all duration-500 sm:rounded-[30px] sm:p-10",
                isDark
                  ? "border-slate-800 bg-slate-900/60"
                  : "border-[#E5E7EB] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.05)]",
              )}
            >
              <div className="relative z-10 max-w-md">
                <Layout className="mb-6 h-10 w-10 text-sky-500 sm:mb-8 sm:h-12 sm:w-12" />
                <h3
                  className={cn(
                    "mb-4 text-2xl font-bold tracking-tight sm:text-3xl",
                    isDark ? "text-white" : "text-[#0F172A]",
                  )}
                >
                  Pre-built page sections
                </h3>
                <p
                  className={cn(
                    "mb-6 text-[0.95rem] leading-relaxed sm:mb-8 sm:text-lg",
                    isDark ? "text-slate-400" : "text-[#747781]",
                  )}
                >
                  Insert Hero, Features, About, Services, Testimonials, Pricing, FAQ, Team, Gallery,
                  CTA, Contact, Stats, Logo Cloud, and Blog. New headers and footers replace the
                  active ones; sections append on the canvas.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Header", "Hero", "Pricing", "Footer"].map((tag) => (
                    <div
                      key={tag}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
                        isDark
                          ? "bg-sky-500/10 text-sky-400"
                          : "bg-sky-500/10 text-sky-600",
                      )}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className={cn(
                "group relative min-w-0 overflow-hidden rounded-[22px] border p-8 transition-all duration-500 sm:rounded-[30px] sm:p-10",
                isDark
                  ? "border-slate-800 bg-slate-900/60"
                  : "border-[#E5E7EB] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.05)]",
              )}
            >
              <div className="relative z-10 max-w-md">
                <Brush className="mb-6 h-10 w-10 text-slate-400 sm:mb-8 sm:h-12 sm:w-12" />
                <h3
                  className={cn(
                    "mb-4 text-2xl font-bold tracking-tight sm:text-3xl",
                    isDark ? "text-white" : "text-[#0F172A]",
                  )}
                >
                  Assets & media
                </h3>
                <p
                  className={cn(
                    "mb-6 text-[0.95rem] leading-relaxed sm:mb-8 sm:text-lg",
                    isDark ? "text-slate-400" : "text-[#747781]",
                  )}
                >
                  Upload project media or search royalty-free stock from Assets. Apply files to image
                  elements, copy hosted URLs, and remove uploads you no longer need.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["PNG", "JPG", "SVG", "MP4"].map((tag) => (
                    <div
                      key={tag}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
                        isDark
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= SPECIALIZED TOOLS SECTION ================= */}
      <section
        className={cn(
          "relative overflow-hidden py-16 sm:py-24",
          isDark ? "bg-slate-950" : "bg-slate-50",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? "white" : "black"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className={cn(pageFrameClass, "relative z-10")}>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="min-w-0"
            >
              <div className="mb-5 inline-block rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-500 sm:mb-6">
                Editor guide
              </div>
              <h2
                className={cn(
                  "mb-8 text-3xl font-bold leading-[1.05] tracking-tight sm:mb-10 sm:text-4xl md:text-5xl",
                  isDark ? "text-white" : "text-[#0F172A]",
                )}
              >
                Core editor paths <br />
                <span className="font-semibold italic text-sky-500">from the manual.</span>
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {specializedTools.map((item, i) => {
                  const isActive =
                    hoveredTool === i || (hoveredTool === null && activeIndex === i);
                  return (
                    <motion.div
                      key={i}
                      onMouseEnter={() => setHoveredTool(i)}
                      onMouseLeave={() => setHoveredTool(null)}
                      className={cn(
                        "group relative flex min-w-0 cursor-pointer gap-4 overflow-hidden rounded-[22px] border p-5 transition-all duration-500 sm:gap-5 sm:rounded-[30px] sm:p-6",
                        isActive
                          ? isDark
                            ? "scale-[1.01] border-sky-500/40 bg-sky-500/10 shadow-lg"
                            : "scale-[1.01] border-sky-300 bg-sky-50 shadow-md"
                          : isDark
                            ? "border-slate-800 bg-slate-900/50"
                            : "border-[#E5E7EB] bg-white",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 sm:h-14 sm:w-14 sm:rounded-2xl",
                          isActive
                            ? "scale-105 rotate-3 bg-sky-500 text-white"
                            : isDark
                              ? "bg-slate-800 text-sky-400"
                              : "bg-slate-50 text-sky-500",
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3
                            className={cn(
                              "text-lg font-bold tracking-tight sm:text-xl",
                              isActive && "text-sky-500",
                            )}
                          >
                            {item.title}
                          </h3>
                          <div
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider transition-colors",
                              isActive
                                ? "bg-sky-500 text-white"
                                : isDark
                                  ? "bg-slate-800 text-slate-500"
                                  : "bg-slate-100 text-[#747781]",
                            )}
                          >
                            Active
                          </div>
                        </div>
                        <p
                          className={cn(
                            "text-sm leading-relaxed sm:text-[0.95rem]",
                            isDark ? "text-slate-400" : "text-[#747781]",
                          )}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative min-w-0"
            >
              <div className="pointer-events-none absolute -inset-12 bg-sky-500/15 blur-[100px]" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredTool !== null ? `hover-${hoveredTool}` : `auto-${activeIndex}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="relative"
                >
                  <div
                    className={cn(
                      "group relative w-full overflow-hidden rounded-[22px] border p-4 shadow-[0_24px_60px_rgba(15,23,42,0.2)] transition-all duration-700 sm:rounded-[30px] sm:p-5",
                      isDark ? "border-white/10 bg-slate-900" : "border-[#E5E7EB] bg-white",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] sm:rounded-[24px]">
                      <img
                        src={
                          hoveredTool !== null
                            ? specializedTools[hoveredTool].image
                            : specializedTools[activeIndex].image
                        }
                        alt="Tool Preview"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0F172A]/80 to-transparent" />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-1 pt-5 sm:px-2 sm:pt-6">
                      <div className="min-w-0">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500">
                          Product manual
                        </div>
                        <div className="truncate text-xl font-bold leading-none sm:text-2xl">
                          {hoveredTool !== null
                            ? specializedTools[hoveredTool].title
                            : specializedTools[activeIndex].title}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border",
                          isDark
                            ? "border-white/10 bg-slate-800/60 text-white"
                            : "border-[#E5E7EB] bg-slate-50 text-[#0F172A]",
                        )}
                      >
                        <Zap className="h-5 w-5 fill-sky-500 text-sky-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden py-16 text-center sm:py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 bg-sky-500/10 blur-[100px]" />

        <div className={pageFrameClass}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              "group relative mx-auto max-w-3xl overflow-hidden rounded-[22px] border p-8 sm:rounded-[30px] sm:p-12 md:p-16",
              isDark
                ? "border-white/10 bg-slate-900"
                : "border-[#E5E7EB] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
            )}
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-500/5 to-transparent" />
            <div className="absolute right-0 top-0 p-6 opacity-[0.07] transition-transform group-hover:scale-105">
              <Sparkles className="h-40 w-40 text-sky-500 sm:h-48 sm:w-48" />
            </div>

            <h2
              className={cn(
                "relative z-10 mb-4 text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl md:text-5xl",
                isDark ? "text-white" : "text-[#0F172A]",
              )}
            >
              Ready to build?
            </h2>
            <p
              className={cn(
                "relative z-10 mx-auto mb-8 max-w-xl text-[0.95rem] font-medium leading-relaxed sm:mb-10 sm:text-lg",
                isDark ? "text-slate-300" : "text-slate-600",
              )}
            >
              Sign in, open the dashboard, create a project, and follow the eight-step path from
              authentication to a live published site.
            </p>
            <div className="relative z-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/login"
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-all sm:h-14 sm:px-8",
                  isDark
                    ? "bg-white text-slate-950 hover:bg-slate-100"
                    : "bg-[#0F172A] text-white hover:bg-[#1e293b]",
                )}
              >
                Sign In to Web Studio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
};

export default Resources;
