import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Zap,
  Palette,
  Smartphone,
  MousePointer2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/Common/BrandLogo";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass } from "@/components/landing/pageFrame";

// Assets
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";
import business from "../assets/Bussiness.jpg";
import school from "../assets/School.jpg";
import saasImg from "../assets/template_saas_1.png";
import templatesImg from "../assets/templates_showcase.png";

const Templates = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme, isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#020617" : "#f8fafc";
  }, [isDark]);

  const categories = ["All", "Blank", "Business", "Portfolio", "E-commerce", "Creative"];

  const templates = [
    {
      id: "blank",
      title: "Blank Canvas",
      category: "Blank",
      image: templatesImg,
      description:
        "Start from scratch on an empty canvas. Add headers, sections, and footers from the Elements rail as you build.",
      popular: true,
    },
    {
      id: "saas",
      title: "SaaS Starter",
      category: "Business",
      image: saasImg,
      description:
        "A pre-built project layout ready for product sites. Swap copy inline, swap sections, and publish to a subdomain.",
    },
    {
      id: "ecommerce",
      title: "Storefront",
      category: "E-commerce",
      image: Ecommerce,
      description:
        "Commerce-oriented starting template. Customize images from Assets, edit text inline, and connect pages from the Pages rail.",
    },
    {
      id: "portfolio",
      title: "Portfolio & Studio",
      category: "Portfolio",
      image: Portfolio,
      description:
        "Showcase work with a visual canvas layout. Reorder blocks, resize frames, and preview desktop, tablet, and mobile.",
    },
    {
      id: "business",
      title: "Business Site",
      category: "Business",
      image: business,
      description:
        "Professional starting point with header, hero, services, and footer blocks you can replace or extend from Elements.",
    },
    {
      id: "creative",
      title: "Creative Agency",
      category: "Creative",
      image: school,
      description:
        "Image-forward template for studios and agencies. Apply a global color palette and style preset from Design.",
    },
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <main
      className={cn(
        "w-full overflow-x-hidden font-sans transition-colors duration-1000",
        isDark
          ? "bg-slate-950 text-slate-100 selection:bg-white/20 selection:text-white"
          : "bg-slate-50 text-slate-900 selection:bg-[#131924]/15 selection:text-black",
      )}
    >
      <Helmet>
        <title>Templates - Web Studio</title>
        <meta
          name="description"
          content="Start from a blank canvas or choose a pre-built Web Studio template, then customize and publish without writing code."
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
                      item === "Templates" ? "w-full" : "w-0 group-hover:w-full",
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
      <section className="relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden pb-16 pt-28 sm:min-h-[75vh] sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src={templatesImg}
            alt=""
            className="h-full w-full object-cover opacity-40 transition-opacity duration-1000"
          />
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[150px]",
              isDark ? "bg-sky-500/15" : "bg-sky-300/30",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-b transition-colors duration-1000",
              isDark
                ? "from-slate-950/10 via-slate-950/40 to-slate-950"
                : "from-slate-50/10 via-slate-50/40 to-slate-50",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r transition-colors duration-1000",
              isDark
                ? "from-slate-950/20 via-transparent to-slate-950/20"
                : "from-slate-50/20 via-transparent to-slate-50/20",
            )}
          />
        </div>

        <div className={cn(pageFrameClass, "relative z-10 text-center")}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mx-auto max-w-4xl text-[2.5rem] font-bold leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
              isDark ? "text-white" : "text-[#111827]",
            )}
          >
            Start with a <br />
            <span
              className={cn(
                "relative inline-block font-semibold italic",
                isDark ? "text-slate-200" : "text-[#182848]",
              )}
            >
              blank canvas or template.
              <svg
                className="pointer-events-none absolute -bottom-2 left-0 h-3 w-[108%] max-w-none text-[#3DB7FF] opacity-80"
                viewBox="0 0 240 14"
                preserveAspectRatio="none"
                aria-hidden
              >
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
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              "mx-auto mt-5 max-w-2xl text-[0.95rem] leading-relaxed sm:mt-6 sm:text-lg",
              isDark ? "text-slate-400" : "text-slate-500",
            )}
          >
            Create a project, pick Blank or a pre-built template, design on the visual canvas, and
            publish to a Web Studio subdomain—or connect your own domain—without writing code.
          </motion.p>
        </div>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="py-16 sm:py-20">
        <div className={pageFrameClass}>
          <div className="mb-12 flex flex-wrap justify-center gap-2 sm:mb-16 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 sm:px-6",
                  selectedCategory === cat
                    ? isDark
                      ? "bg-white text-slate-950"
                      : "bg-[#0F172A] text-white"
                    : isDark
                      ? "border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                      : "border border-[#E5E7EB] bg-white text-slate-600 hover:text-slate-900",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  layout
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={cn(
                    "group/card relative min-w-0 overflow-hidden rounded-[22px] border transition-all duration-500 sm:rounded-[30px]",
                    isDark
                      ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                      : "border-[#E5E7EB] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.1)]",
                  )}
                >
                  {template.popular && (
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white sm:left-5 sm:top-5">
                      <Sparkles className="h-3 w-3" /> Recommended
                    </div>
                  )}

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/0 opacity-0 backdrop-blur-0 transition-all duration-500 group-hover/card:bg-[#0F172A]/40 group-hover/card:opacity-100 group-hover/card:backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="translate-y-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] shadow-xl transition-all duration-500 hover:bg-slate-100 group-hover/card:translate-y-0"
                      >
                        Start with This
                      </button>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{template.title}</h3>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                          isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-[#747781]",
                        )}
                      >
                        {template.category}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-[0.95rem] leading-relaxed",
                        isDark ? "text-slate-400" : "text-slate-500",
                      )}
                    >
                      {template.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGY SECTION ================= */}
      <section className={cn("py-16 sm:py-24", isDark ? "bg-slate-900/40" : "bg-[#F8FAFC]")}>
        <div className={pageFrameClass}>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <h2
                className={cn(
                  "mb-6 text-3xl font-bold leading-[1.1] tracking-tight sm:mb-8 sm:text-4xl md:text-5xl",
                  isDark ? "text-white" : "text-[#0F172A]",
                )}
              >
                Every template is <br />
                <span className="text-sky-500">ready to customize.</span>
              </h2>
              <div className="space-y-4 sm:space-y-5">
                {[
                  {
                    icon: <Zap className="text-sky-500" />,
                    title: "Publish to a live URL",
                    desc: "Publish Site assigns a subdomain (your-name.webstudio.site) or a verified custom domain, with automated SSL hosting.",
                  },
                  {
                    icon: <Palette className="text-slate-500" />,
                    title: "Global Design System",
                    desc: "From Design on the left rail, choose a primary color palette and a style preset for radii and shadows site-wide.",
                  },
                  {
                    icon: <Smartphone className="text-emerald-500" />,
                    title: "Desktop, tablet, and mobile",
                    desc: "Switch viewports in the top bar and tune spacing per device—then confirm desktop layout still holds.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 6 }}
                    className={cn(
                      "group/feature flex gap-4 rounded-2xl border p-4 transition-all duration-300 sm:gap-5 sm:rounded-3xl sm:p-5",
                      isDark
                        ? "border-slate-800 bg-slate-900/50 hover:border-slate-600"
                        : "border-[#E5E7EB] bg-white hover:border-slate-300 shadow-sm",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover/feature:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl",
                        isDark ? "bg-slate-800" : "bg-slate-50",
                      )}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={cn(
                          "mb-1 text-lg font-bold transition-colors sm:text-xl",
                          isDark
                            ? "group-hover/feature:text-sky-400"
                            : "text-[#0F172A] group-hover/feature:text-sky-600",
                        )}
                      >
                        {item.title}
                      </h3>
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
                ))}
              </div>
            </div>
            <div className="relative min-w-0">
              <div
                className={cn(
                  "absolute -inset-3 rounded-[28px] opacity-20 blur-3xl sm:rounded-[36px]",
                  isDark ? "bg-sky-500" : "bg-sky-300",
                )}
              />
              <img
                src={templatesImg}
                alt="Editor"
                className="relative w-full max-w-full rounded-[22px] border border-white/10 shadow-2xl sm:rounded-[30px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ONE-CLICK TRANSFORMATIONS ================= */}
      <section className={cn("py-16 sm:py-24", isDark ? "bg-slate-950" : "bg-white")}>
        <div className={pageFrameClass}>
          <div className="relative z-10 mb-12 text-center sm:mb-16">
            <h2
              className={cn(
                "mb-4 text-3xl font-bold tracking-tight sm:mb-5 sm:text-4xl md:text-5xl",
                isDark ? "text-white" : "text-[#0F172A]",
              )}
            >
              Build from the canvas, <br />
              not just a theme.
            </h2>
            <p
              className={cn(
                "mx-auto max-w-2xl text-[0.95rem] leading-relaxed sm:text-lg",
                isDark ? "text-slate-400" : "text-slate-500",
              )}
            >
              After you pick a starting point, use Elements, Design, and Preview exactly as described
              in the Web Studio product guide.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            {[
              {
                icon: <Palette />,
                title: "Color palette",
                desc: "Apply a primary palette so colors stay consistent across every page.",
                details:
                  "Open Design on the left rail (or the palette icon in the top toolbar). Choose a primary color palette to enforce a consistent scheme across all pages in the project.",
              },
              {
                icon: <Sparkles />,
                title: "Style presets",
                desc: "Adjust border radii, corner sharpness, and shadow depth in one place.",
                details:
                  "Select a Style Preset in Design to update site-wide corner treatment and elevation. Changes apply across sections you already placed on the canvas.",
              },
              {
                icon: <MousePointer2 />,
                title: "Inline editing",
                desc: "Click text for the format bar, or double-click to type directly on the canvas.",
                details:
                  "Click any text component to open the floating format bar (bold, italic, font, size, color). Double-click to enter inline editing, then click outside to commit.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "group/transformation relative min-w-0 overflow-hidden rounded-[22px] border p-6 text-center transition-all duration-500 sm:rounded-[30px] sm:p-8",
                  hoveredFeature !== null && hoveredFeature !== i
                    ? "scale-[0.98] opacity-40"
                    : "opacity-100",
                  isDark
                    ? "border-slate-800 bg-slate-900 hover:border-slate-600"
                    : "border-[#E5E7EB] bg-[#F8FAFC] hover:border-slate-300 shadow-sm",
                )}
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 transition-all duration-300 group-hover/transformation:scale-105 group-hover/transformation:bg-[#0F172A] group-hover/transformation:text-white sm:mb-8 sm:h-16 sm:w-16">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold sm:text-2xl">{feature.title}</h3>
                <p
                  className={cn(
                    "text-[0.95rem] leading-relaxed transition-all duration-300 group-hover/transformation:mb-5",
                    isDark ? "text-slate-400" : "text-slate-500",
                  )}
                >
                  {feature.desc}
                </p>

                <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover/transformation:max-h-40 group-hover/transformation:opacity-100">
                  <div
                    className={cn(
                      "border-t pt-5",
                      isDark ? "border-slate-800" : "border-[#E5E7EB]",
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm italic leading-relaxed",
                        isDark ? "text-slate-500" : "text-[#747781]",
                      )}
                    >
                      {feature.details}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden py-16 text-center sm:py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[min(100%,40rem)] -translate-x-1/2 -translate-y-1/2 bg-sky-500/10 blur-[100px]" />

        <div className={pageFrameClass}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              "group/cta relative mx-auto max-w-4xl overflow-hidden rounded-[22px] border p-8 sm:rounded-[30px] sm:p-12 md:p-16",
              isDark
                ? "border-white/10 bg-slate-900"
                : "border-[#E5E7EB] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
            )}
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-500/10 to-transparent" />
            <h2
              className={cn(
                "relative z-10 mb-4 text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl",
                isDark ? "text-white" : "text-[#0F172A]",
              )}
            >
              Prefer a blank start?
            </h2>
            <p
              className={cn(
                "relative z-10 mx-auto mb-8 max-w-xl text-[0.95rem] font-medium leading-relaxed sm:mb-10 sm:text-lg",
                isDark ? "text-slate-300" : "text-slate-600",
              )}
            >
              On the dashboard, click New Project, name your site, select Blank, and Web Studio
              opens the canvas editor so you can add Header, Hero, body sections, and Footer from
              Elements.
            </p>
            <div className="relative z-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/login"
                className={cn(
                  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-all sm:h-14 sm:px-8",
                  isDark
                    ? "bg-white text-slate-950 hover:bg-slate-100"
                    : "bg-[#0F172A] text-white hover:bg-[#1e293b]",
                )}
              >
                Start with Blank Canvas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
};

export default Templates;
