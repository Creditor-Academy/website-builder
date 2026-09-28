import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Brush,
  Eye,
  Wrench,
  ArrowRight,
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
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass, sectionYClass } from "@/components/landing/pageFrame";
import MarketingReveal from "@/components/landing/MarketingReveal";
import MarketingNav from "@/components/landing/MarketingNav";
import LandingCta from "@/components/landing/LandingCta";

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
      "marketing-surface group relative flex min-w-0 flex-col overflow-hidden rounded-[22px] border p-6 transition-all duration-500 sm:rounded-[30px] sm:p-8",
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
    <div
      className={cn(
        "relative min-h-screen w-full overflow-x-hidden font-sans antialiased transition-colors duration-1000",
        isDark ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-[#1b1b1d]",
      )}
    >
      <Helmet>
        <title>Resources - Web Studio</title>
        <meta
          name="description"
          content="Web Studio product guides: quickstart, elements catalog, assets, design system, preview, version history, and publishing."
        />
      </Helmet>

      <MarketingNav isDark={isDark} setTheme={setTheme} activeItem="Resources" />

      <main className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-slate-950 pb-16 pt-28 sm:min-h-[75svh] sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <img
            src="/assets/res.png"
            alt=""
            className="h-full w-full object-cover opacity-40 brightness-[0.55]"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/25 blur-[140px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/70 to-slate-950" />
        </div>

        <div className={cn(pageFrameClass, "relative z-10 flex flex-col items-center text-center")}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 max-w-4xl text-[1.75rem] font-bold leading-[1.2] tracking-tight text-white drop-shadow-sm sm:mb-6 sm:text-4xl sm:leading-[1.18] md:text-[3.25rem] md:leading-[1.15]"
          >
            Learn the Web Studio workflow.
            <span className="mt-2 block text-slate-400 sm:mt-3">
              From blank canvas to a live published site.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mb-10 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            Step-by-step guidance from the product manual—create a project, design on the canvas,
            manage pages and assets, then publish without writing code.
          </motion.p>
          <div className="flex w-full flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="#resources-grid"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl transition-all hover:bg-slate-200 sm:w-auto"
            >
              Browse guides <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
            >
              Open the Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ================= RESOURCES GRID ================= */}
      <section id="resources-grid" className={cn(sectionYClass, isDark ? "bg-slate-950" : "bg-[#f8fafc]")}>
        <MarketingReveal className={cn(pageFrameClass, "grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4")}>
          {mainResources.map((resource, i) => (
            <ResourceCard key={i} {...resource} isDark={isDark} />
          ))}
        </MarketingReveal>
      </section>

      {/* ================= PREDEFINED RESOURCES SHOWCASE ================= */}
      <section className={cn(sectionYClass, isDark ? "bg-slate-900/50" : "bg-white")}>
        <div className={pageFrameClass}>
          <MarketingReveal>
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
          </MarketingReveal>
        </div>
      </section>

      {/* ================= SPECIALIZED TOOLS SECTION ================= */}
      <section
        className={cn(
          "relative overflow-hidden",
          sectionYClass,
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
          <MarketingReveal>
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
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <h3
                            className={cn(
                              "min-w-0 text-lg font-bold tracking-tight sm:text-xl",
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
          </MarketingReveal>
        </div>
      </section>

      <LandingCta />
      </main>

      <Footer isDark={isDark} />
    </div>
  );
};

export default Resources;
