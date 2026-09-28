import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass } from "@/components/landing/pageFrame";
import MarketingNav from "@/components/landing/MarketingNav";

interface Section {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

const sections: Section[] = [
  { id: "who-we-are", title: "Who We Are", icon: <ShieldCheck className="h-4 w-4" /> },
  { id: "info-collect", title: "Information We Collect", icon: <Eye className="h-4 w-4" /> },
  { id: "usage", title: "How We Use Your Info", icon: <FileText className="h-4 w-4" /> },
  { id: "legal", title: "Legal Basis", icon: <Lock className="h-4 w-4" /> },
  { id: "cookie", title: "Cookies & Tracking" },
  { id: "share", title: "Sharing Information" },
  { id: "security", title: "Data Security" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Rights" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");
  const { setTheme, isDark } = useTheme();

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
      { rootMargin: "-20% 0% -35% 0%", threshold: 0.5 },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
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
        <title>Privacy Policy — Web Studio</title>
      </Helmet>

      <MarketingNav isDark={isDark} setTheme={setTheme} />

      <main className="w-full">
        <section className="relative overflow-hidden bg-slate-950 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-[140px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />
          </div>

          <div className={cn(pageFrameClass, "relative z-10")}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Lock className="h-3.5 w-3.5" /> Secure & Transparent
              </div>
              <h1 className="mb-5 text-[2rem] font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Last updated: <span className="font-semibold text-white">March 2024</span>. We value
                your trust. This policy explains how Web Studio handles your data with the highest
                standards of security.
              </p>
            </motion.div>
          </div>
        </section>

        <section className={cn("py-16 sm:py-20", isDark ? "bg-slate-950" : "bg-[#f8fafc]")}>
          <div className={cn(pageFrameClass, "mb-8 lg:hidden")}>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {sections.map((s) => (
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
              <div id="who-we-are" className="scroll-mt-32">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold",
                      isDark ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700",
                    )}
                  >
                    1
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    Who We Are
                  </h2>
                </div>
                <p className={cn("text-base leading-relaxed sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  Web Studio provides high-end residential and commercial landscape care and digital
                  architecture solutions. Your privacy isn&apos;t just a legal requirement for us—it&apos;s a
                  core value.
                </p>
              </div>

              <div id="info-collect" className="scroll-mt-32">
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold",
                      isDark ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700",
                    )}
                  >
                    2
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    Information We Collect
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { title: "Contact Details", desc: "Name, phone, and professional email address." },
                    { title: "Service Data", desc: "Project photos, notes, and site locations." },
                    { title: "Usage Data", desc: "Analytics, browser type, and interaction patterns." },
                    { title: "Device Info", desc: "IP addresses and cookie identifiers." },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={cn(
                        "rounded-2xl border p-6 transition-colors",
                        isDark
                          ? "border-slate-800 bg-slate-900/60 hover:border-slate-600"
                          : "border-slate-200 bg-white shadow-sm hover:border-sky-300",
                      )}
                    >
                      <h4 className={cn("mb-2 font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {item.title}
                      </h4>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div id="usage" className="scroll-mt-32">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold",
                      isDark ? "bg-sky-500/15 text-sky-300" : "bg-sky-100 text-sky-700",
                    )}
                  >
                    3
                  </div>
                  <h2 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", isDark ? "text-white" : "text-slate-900")}>
                    How We Use Your Info
                  </h2>
                </div>
                <p className={cn("text-base leading-relaxed sm:text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  We process your information to deliver our services effectively, maintain security,
                  and improve your user experience. We{" "}
                  <span className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>never sell</span>{" "}
                  your personal information to third parties.
                </p>
              </div>

              {[
                {
                  id: "legal",
                  title: "Legal Basis",
                  content:
                    "We process data based on explicit consent, legitimate business interests, and contractual necessity.",
                },
                {
                  id: "cookie",
                  title: "Cookies & Tracking",
                  content:
                    "Our site uses cookies to remember your preferences and analyze site traffic for better performance.",
                },
                {
                  id: "share",
                  title: "Sharing Information",
                  content:
                    "We share data only with trusted processors who help operate Web Studio, under strict confidentiality agreements.",
                },
                {
                  id: "security",
                  title: "Data Security",
                  content:
                    "We use AES-256 encryption and secure internal protocols to safeguard every byte of your data.",
                },
                {
                  id: "retention",
                  title: "Data Retention",
                  content:
                    "We store data only as long as your account is active or as required by legal compliance.",
                },
                {
                  id: "rights",
                  title: "Your Rights",
                  content:
                    "You may request access, correction, export, or deletion of your personal data by contacting our privacy team.",
                },
              ].map((sec) => (
                <div
                  key={sec.id}
                  id={sec.id}
                  className={cn(
                    "scroll-mt-32 border-t pt-12",
                    isDark ? "border-slate-800" : "border-slate-200",
                  )}
                >
                  <h3 className={cn("mb-4 text-xl font-bold tracking-tight sm:text-2xl", isDark ? "text-white" : "text-slate-900")}>
                    {sec.title}
                  </h3>
                  <p className={cn("leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                    {sec.content}
                  </p>
                </div>
              ))}

              <div
                id="contact"
                className="scroll-mt-32 relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white sm:rounded-[2.5rem] sm:p-10"
              >
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
                <h2 className="relative z-10 mb-4 text-2xl font-bold sm:text-3xl">Questions?</h2>
                <p className="relative z-10 mb-8 text-slate-400">
                  Our privacy team is ready to help you with any data-related concerns.
                </p>
                <a
                  href="mailto:privacy@athena.lms"
                  className="relative z-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100"
                >
                  Contact Privacy Team <ChevronRight className="h-4 w-4" />
                </a>
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
                      "mb-6 text-xs font-bold uppercase tracking-[0.18em]",
                      isDark ? "text-slate-300" : "text-slate-900",
                    )}
                  >
                    Contents
                  </h3>
                  <nav className="space-y-1">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollTo(s.id)}
                        className={cn(
                          "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all",
                          activeSection === s.id
                            ? isDark
                              ? "bg-white/10 text-white"
                              : "bg-sky-50 text-sky-700 shadow-sm"
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

                <div className="rounded-[1.75rem] bg-[#0F172A] p-8 text-white shadow-xl sm:rounded-[2rem]">
                  <ShieldCheck className="mb-4 h-10 w-10 text-sky-400" />
                  <h4 className="mb-2 text-xl font-bold">Your data is safe.</h4>
                  <p className="text-sm leading-relaxed text-slate-400">
                    We comply with global standards including GDPR and CCPA.
                  </p>
                  <Link
                    to="/contact"
                    className="mt-5 inline-flex text-sm font-semibold text-sky-400 transition-colors hover:text-sky-300"
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
