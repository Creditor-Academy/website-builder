import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Scale,
  ShieldAlert,
  CreditCard,
  Handshake,
  Gavel,
  UserCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass } from "@/components/landing/pageFrame";
import MarketingNav from "@/components/landing/MarketingNav";

interface TermSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const termSections: TermSection[] = [
  { id: "acceptance", title: "Acceptance", icon: <Handshake className="h-4 w-4" /> },
  { id: "usage", title: "Service Use", icon: <UserCheck className="h-4 w-4" /> },
  { id: "accounts", title: "Accounts", icon: <ShieldAlert className="h-4 w-4" /> },
  { id: "intellectual-property", title: "Intellectual Property", icon: <BookOpen className="h-4 w-4" /> },
  { id: "payments", title: "Payments", icon: <CreditCard className="h-4 w-4" /> },
  { id: "termination", title: "Termination", icon: <Gavel className="h-4 w-4" /> },
  { id: "liability", title: "Liability", icon: <Scale className="h-4 w-4" /> },
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("");
  const { setTheme, isDark } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#020617" : "#f8fafc";
  }, [isDark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-25% 0% -40% 0%", threshold: 0.4 },
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
    <div
      className={cn(
        "min-h-screen w-full overflow-x-hidden font-sans antialiased transition-colors duration-1000",
        isDark ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-[#1b1b1d]",
      )}
    >
      <Helmet>
        <title>Terms of Service — Web Studio</title>
      </Helmet>

      <motion.div
        className="fixed left-0 right-0 top-0 z-[110] h-1 origin-left bg-sky-500"
        style={{ scaleX }}
      />

      <MarketingNav isDark={isDark} setTheme={setTheme} />

      <main className="w-full">
        <section className="relative overflow-hidden bg-slate-950 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-[140px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
          </div>

          <div className={cn(pageFrameClass, "relative z-10")}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                Legal Agreement
              </span>
              <h1 className="mb-6 text-[2rem] font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Terms of Service
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                By using the Web Studio platform, you are agreeing to the following terms. Please
                read them carefully to understand your rights and obligations.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={cn("py-16 sm:py-20", isDark ? "bg-slate-950" : "bg-[#f8fafc]")}>
          <div className={cn(pageFrameClass, "mb-8 lg:hidden")}>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {termSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                    activeSection === s.id
                      ? isDark
                        ? "border-white/20 bg-white text-slate-950"
                        : "border-slate-900 bg-slate-900 text-white"
                      : isDark
                        ? "border-slate-700 bg-slate-900 text-slate-300"
                        : "border-slate-200 bg-white text-slate-600",
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          <div className={cn(pageFrameClass, "grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px] lg:gap-16")}>
            <div className="min-w-0 space-y-16 sm:space-y-20">
              <div id="acceptance" className="scroll-mt-32">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border",
                      isDark
                        ? "border-sky-500/30 bg-sky-500/15 text-sky-300"
                        : "border-sky-100 bg-sky-50 text-sky-600",
                    )}
                  >
                    <Handshake className="h-6 w-6" />
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    1. Acceptance of Terms
                  </h2>
                </div>
                <p className={cn("pl-0 text-base leading-relaxed sm:pl-16 sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  By accessing Web Studio, you confirm that you are at least 18 years old and agree
                  to be bound by these Terms of Service. If you are using the services on behalf of
                  an organization, you represent that you have the authority to bind that entity to
                  these terms.
                </p>
              </div>

              <div id="usage" className="scroll-mt-32">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border",
                      isDark
                        ? "border-sky-500/30 bg-sky-500/15 text-sky-300"
                        : "border-sky-100 bg-sky-50 text-sky-600",
                    )}
                  >
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    2. Use of Our Services
                  </h2>
                </div>
                <div className="space-y-4 sm:pl-16">
                  <p className={cn("text-base leading-relaxed sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                    You may use Web Studio only for lawful purposes. You agree not to:
                  </p>
                  <ul className="grid gap-3 md:grid-cols-2">
                    {["Misuse the platform", "Interfere with operation", "Scrape content", "Unauthorized access"].map(
                      (item) => (
                        <li
                          key={item}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold",
                            isDark
                              ? "border-slate-800 bg-slate-900/60 text-slate-200"
                              : "border-slate-200 bg-white text-slate-700",
                          )}
                        >
                          <div className="h-2 w-2 rounded-full bg-rose-400" /> {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>

              <div id="accounts" className="scroll-mt-32">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border",
                      isDark
                        ? "border-sky-500/30 bg-sky-500/15 text-sky-300"
                        : "border-sky-100 bg-sky-50 text-sky-600",
                    )}
                  >
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    3. Accounts & Security
                  </h2>
                </div>
                <p className={cn("pl-0 text-base leading-relaxed sm:pl-16 sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  Account security is a shared responsibility. While we provide secure login
                  protocols, you are responsible for maintaining the confidentiality of your
                  credentials. Notify us immediately of any unauthorized account access.
                </p>
              </div>

              <div
                id="intellectual-property"
                className={cn(
                  "scroll-mt-32 border-l-4 pl-6 sm:pl-8",
                  isDark ? "border-sky-500" : "border-sky-600",
                )}
              >
                <h2
                  className={cn(
                    "mb-6 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl",
                    isDark ? "text-white" : "text-slate-900",
                  )}
                >
                  <BookOpen className={isDark ? "text-sky-400" : "text-sky-600"} /> 4. Intellectual
                  Property
                </h2>
                <p className={cn("text-base leading-relaxed sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  All content, templates, designs, and software provided by Web Studio are owned by
                  or licensed to us. You are granted a limited, non-exclusive license to use the
                  templates for your personal or business website, but copying the &quot;Web Studio
                  Engine&quot; or reselling our core assets is strictly prohibited.
                </p>
              </div>

              <div id="payments" className="scroll-mt-32">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border",
                      isDark
                        ? "border-sky-500/30 bg-sky-500/15 text-sky-300"
                        : "border-sky-100 bg-sky-50 text-sky-600",
                    )}
                  >
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    5. Payments & Subscriptions
                  </h2>
                </div>
                <div className="relative overflow-hidden rounded-[2rem] bg-[#0F172A] p-8 text-white sm:ml-16 sm:rounded-[2.5rem]">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
                  <p className="relative z-10 mb-4 leading-relaxed text-slate-300">
                    Paid plans are billed according to the pricing displayed at purchase. Web Studio
                    reserves the right to change pricing with 30-day prior notice.
                  </p>
                  <div className="relative z-10 text-xs font-bold uppercase tracking-widest text-sky-400">
                    Auto-renewal applies to all monthly/annual plans.
                  </div>
                </div>
              </div>

              <div id="termination" className="scroll-mt-32">
                <h2 className={cn("mb-6 text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                  6. Termination
                </h2>
                <p className={cn("pl-0 text-base leading-relaxed sm:pl-16 sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  We reserve the right to suspend your access if you engage in harmful activities.
                  You may close your account at any time through your dashboard settings.
                </p>
              </div>

              <div
                id="liability"
                className={cn(
                  "scroll-mt-32 border-t pt-12 sm:pt-16",
                  isDark ? "border-slate-800" : "border-slate-200",
                )}
              >
                <h2 className={cn("mb-6 text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                  7. Limitation of Liability
                </h2>
                <p
                  className={cn(
                    "pl-0 text-base italic leading-relaxed sm:pl-16 sm:text-lg",
                    isDark ? "text-slate-500" : "text-slate-500",
                  )}
                >
                  Web Studio is provided &quot;as is&quot;. We shall not be liable for any indirect,
                  incidental, or consequential damages resulting from your use of the platform.
                </p>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-6">
                <div
                  className={cn(
                    "rounded-[1.75rem] border p-6 sm:rounded-[2rem] sm:p-8",
                    isDark
                      ? "border-slate-800 bg-slate-900/70"
                      : "border-slate-200 bg-white shadow-sm",
                  )}
                >
                  <h3
                    className={cn(
                      "mb-8 text-xs font-bold uppercase tracking-[0.2em]",
                      isDark ? "text-slate-300" : "text-slate-900",
                    )}
                  >
                    Guide to Terms
                  </h3>
                  <nav className="space-y-1">
                    {termSections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollTo(s.id)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all",
                          activeSection === s.id
                            ? isDark
                              ? "bg-white text-slate-950 shadow-lg"
                              : "bg-[#0F172A] text-white shadow-lg"
                            : isDark
                              ? "text-slate-400 hover:bg-white/5 hover:text-white"
                              : "text-slate-400 hover:bg-slate-50 hover:text-slate-700",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {s.icon}
                          {s.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "h-3 w-3 transition-transform",
                            activeSection === s.id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-2 opacity-0",
                          )}
                        />
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="rounded-[1.75rem] bg-[#0F172A] p-8 text-white sm:rounded-[2rem]">
                  <h4 className="mb-2 text-lg font-bold">Need a summary?</h4>
                  <p className="mb-6 text-xs leading-relaxed text-slate-400">
                    If you don&apos;t want to read the legal jargon, contact support for a
                    plain-English explanation.
                  </p>
                  <Link
                    to="/contact"
                    className="text-xs font-bold text-sky-400 transition-colors hover:text-sky-300"
                  >
                    Talk to us →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}
