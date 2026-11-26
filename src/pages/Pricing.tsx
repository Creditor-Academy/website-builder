import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  ChevronDown,
  Building2,
  Users,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";
import { pageFrameClass } from "@/components/landing/pageFrame";
import MarketingNav from "@/components/landing/MarketingNav";
import { RouteHeading } from "@/seo/RouteHeading";

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
  features: string[];
  highlightFeatures: string[];
}

const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Ideal for testing, portfolios, and personal projects.",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaText: "Start Free",
    ctaLink: "/login?mode=signup&plan=starter",
    features: [
      "1 Published Website",
      "Athena Subdomain (*.lmsathena.com)",
      "Standard Drag & Drop Visual Editor",
      "All 9 Responsive Templates",
      "500MB Media & Asset Storage",
      "Community & Discord Support",
    ],
    highlightFeatures: ["Free Forever", "No Credit Card Required"],
  },
  {
    id: "pro",
    name: "Creator Pro",
    tagline: "For freelancers, creators, and growing businesses.",
    monthlyPrice: 19,
    annualPrice: 15,
    popular: true,
    ctaText: "Start 14-Day Free Trial",
    ctaLink: "/login?mode=signup&plan=pro",
    features: [
      "3 Custom Domains with Auto-SSL",
      "Unlimited Live Websites & Pages",
      "Remove Athena Web Studio Badge",
      "High-Speed Global Edge CDN",
      "Form Submissions (1,000/mo to Inbox)",
      "SEO Metadata & OpenGraph Control",
      "Google Analytics & GTM Integration",
      "5GB Cloud Asset Storage",
      "Email & Priority Ticket Support",
    ],
    highlightFeatures: ["Most Popular", "Zero Platform Branding", "Custom Domains"],
  },
  {
    id: "agency",
    name: "Studio & Agency",
    tagline: "For design studios, multi-client teams, and scaling agencies.",
    monthlyPrice: 49,
    annualPrice: 39,
    ctaText: "Get Started with Agency",
    ctaLink: "/login?mode=signup&plan=agency",
    features: [
      "10 Custom Domains Included",
      "Team Collaboration (Up to 5 Seats)",
      "Custom Code Injection (HTML, CSS, JS)",
      "Client Management & Transfer Portal",
      "Unlimited Form Submissions & Webhooks",
      "25GB High-Performance Media Storage",
      "Priority Stock Assets & Photo Search",
      "99.9% Uptime SLA Guarantee",
      "Dedicated Onboarding & 24/7 Priority Support",
    ],
    highlightFeatures: ["5 Team Seats", "Custom Code Injection", "Client Portals"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For institutions, colleges, and enterprise organizations.",
    monthlyPrice: 199,
    annualPrice: 169,
    ctaText: "Contact Sales",
    ctaLink: "/contact?subject=Enterprise%20Plan%20Inquiry",
    features: [
      "Unlimited Custom Domains & Workspaces",
      "Single Sign-On (SAML / Okta / Azure SSO)",
      "Role-Based Access Control (RBAC)",
      "Custom Multi-Tenant Provisioning API",
      "Dedicated Infrastructure & Dedicated CDN",
      "Bespoke Template & Component Development",
      "Custom Legal Contract & Invoicing Support",
      "Dedicated Technical Account Manager",
      "99.99% Enterprise Uptime SLA",
    ],
    highlightFeatures: ["Institutional SSO", "Dedicated Support", "Custom Contract"],
  },
];

const COMPARISON_CATEGORIES = [
  {
    category: "Design & Builder Experience",
    items: [
      { name: "Visual Canvas & Free Movement", starter: true, pro: true, agency: true, enterprise: true },
      { name: "Responsive Breakpoints (Desktop, Tablet, Mobile)", starter: true, pro: true, agency: true, enterprise: true },
      { name: "All 9 Core Prebuilt Templates", starter: true, pro: true, agency: true, enterprise: true },
      { name: "Global Design System & Palette Styles", starter: true, pro: true, agency: true, enterprise: true },
      { name: "Custom Code Injection (Head & Body)", starter: false, pro: false, agency: true, enterprise: true },
      { name: "Bespoke Custom Template Design", starter: false, pro: false, agency: false, enterprise: true },
    ],
  },
  {
    category: "Hosting & Domains",
    items: [
      { name: "Athena Subdomain (*.lmsathena.com)", starter: true, pro: true, agency: true, enterprise: true },
      { name: "Custom Domain Connection", starter: "0", pro: "3 Domains", agency: "10 Domains", enterprise: "Unlimited" },
      { name: "Automated SSL Certificates", starter: true, pro: true, agency: true, enterprise: true },
      { name: "Global Edge Content Delivery Network (CDN)", starter: "Standard", pro: "High-Speed", agency: "Ultra High-Speed", enterprise: "Dedicated Edge" },
      { name: "Remove Athena Platform Branding", starter: false, pro: true, agency: true, enterprise: true },
      { name: "Uptime SLA Guarantee", starter: "Best Effort", pro: "99.5%", agency: "99.9%", enterprise: "99.99%" },
    ],
  },
  {
    category: "SEO & Form Management",
    items: [
      { name: "Page Metadata & Social Sharing Previews", starter: "Basic", pro: true, agency: true, enterprise: true },
      { name: "Sitemap.xml & Robots.txt Auto-Generation", starter: true, pro: true, agency: true, enterprise: true },
      { name: "Form Submissions to Dashboard Inbox", starter: "50 / mo", pro: "1,000 / mo", agency: "Unlimited", enterprise: "Unlimited" },
      { name: "Webhooks & Zapier/Make Integration", starter: false, pro: false, agency: true, enterprise: true },
      { name: "Google Analytics & Google Tag Manager", starter: false, pro: true, agency: true, enterprise: true },
    ],
  },
  {
    category: "Team & Support",
    items: [
      { name: "Team Seats", starter: "1", pro: "1", agency: "5 Seats", enterprise: "Custom / Unlimited" },
      { name: "Cloud Storage for Media & Assets", starter: "500MB", pro: "5GB", agency: "25GB", enterprise: "Dedicated Storage" },
      { name: "Support Response Time", starter: "Community", pro: "Within 24h", agency: "Within 4h Priority", enterprise: "1h Dedicated Slack/Phone" },
      { name: "Single Sign-On (SAML / Okta)", starter: false, pro: false, agency: false, enterprise: true },
    ],
  },
];

const FAQS = [
  {
    question: "Can I cancel or switch my plan at any time?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your subscription whenever you want directly from your Dashboard Billing settings. If you upgrade, the prorated difference is calculated automatically.",
  },
  {
    question: "How does the 14-day free trial for Creator Pro work?",
    answer:
      "When you choose Creator Pro, you enjoy full access to all Pro features—including custom domains, analytics, and watermark removal—for 14 days completely free. You can cancel before the trial ends without being charged.",
  },
  {
    question: "Can I connect a custom domain I bought on GoDaddy, Namecheap, or Google?",
    answer:
      "Absolutely. Connecting your domain takes under two minutes. We provide simple DNS instructions, and we automatically issue and renew a free Let's Encrypt SSL certificate for your site.",
  },
  {
    question: "What happens to my published site if I downgrade to Starter?",
    answer:
      "Your websites will remain online and intact. If you downgrade below your custom domain quota, your sites will automatically fall back to your free Athena subdomains (*.lmsathena.com) so your visitors never experience downtime.",
  },
  {
    question: "Do you offer special pricing for universities and schools?",
    answer:
      "Yes! Athena Web Studio was engineered to serve academic institutions. We offer specialized educational campus tiers and multi-tenant department licenses. Contact our sales team for an institutional demo.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and Apple Pay/Google Pay via secure Stripe checkout. Enterprise plans can also pay via wire transfer, ACH, or formal purchase orders.",
  },
];

export default function Pricing() {
  const { setTheme, isDark } = useTheme();
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#020617" : "#f8fafc";
  }, [isDark]);

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-x-hidden font-sans antialiased transition-colors duration-700",
        isDark ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-900",
      )}
    >
      <RouteHeading path="/pricing" />
      <Helmet>
        <title>Pricing Plans & Subscriptions | Athena Web Studio</title>
        <meta
          name="description"
          content="Choose the perfect plan to build, publish, and scale professional websites without code. Start free or upgrade for custom domains and team collaboration."
        />
      </Helmet>

      {/* Global Marketing Navigation */}
      <MarketingNav isDark={isDark} setTheme={setTheme} activeItem="Pricing" />

      {/* Main Content */}
      <main className="w-full pt-28 pb-20 sm:pt-36 sm:pb-32">
        {/* ── 1. Hero Header ────────────────────────────────────────── */}
        <section className={cn(pageFrameClass, "text-center mb-16 sm:mb-20")}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm",
                isDark
                  ? "bg-slate-900 border border-slate-800 text-sky-400"
                  : "bg-blue-50 border border-blue-100 text-blue-600",
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent & Scalable Pricing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
              Build without limits.{" "}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Pay as you grow.
              </span>
            </h1>

            <p
              className={cn(
                "text-lg sm:text-xl max-w-2xl leading-relaxed mb-10",
                isDark ? "text-slate-400" : "text-slate-600",
              )}
            >
              Start for free with full visual editor access. Upgrade when you need custom domains, team seats, or institutional scalability.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="flex items-center justify-center gap-4 select-none">
              <span
                className={cn(
                  "text-sm font-semibold transition-colors cursor-pointer",
                  !isAnnual
                    ? isDark
                      ? "text-white"
                      : "text-slate-900"
                    : "text-slate-400 hover:text-slate-600",
                )}
                onClick={() => setIsAnnual(false)}
              >
                Monthly Billing
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={isAnnual}
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  isAnnual ? "bg-blue-600" : isDark ? "bg-slate-800" : "bg-slate-300",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    isAnnual ? "translate-x-6" : "translate-x-0",
                  )}
                />
              </button>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors cursor-pointer",
                    isAnnual
                      ? isDark
                        ? "text-white"
                        : "text-slate-900"
                      : "text-slate-400 hover:text-slate-600",
                  )}
                  onClick={() => setIsAnnual(true)}
                >
                  Annual Billing
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Save 20%
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── 2. Pricing Cards Grid ─────────────────────────────────── */}
        <section className={cn(pageFrameClass, "mb-20 sm:mb-28")}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {PLANS.map((plan, index) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              const isPopular = plan.popular;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-300 group",
                    isPopular
                      ? isDark
                        ? "bg-slate-900/90 border-2 border-blue-500/80 shadow-[0_0_40px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/50"
                        : "bg-white border-2 border-blue-600 shadow-[0_12px_40px_rgba(37,99,235,0.15)] ring-1 ring-blue-600/30"
                      : isDark
                      ? "bg-slate-900/50 border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md"
                      : "bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md",
                  )}
                >
                  {/* Popular Floating Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                        <span>{plan.name}</span>
                        {plan.id === "enterprise" && <Building2 className="w-5 h-5 opacity-60" />}
                        {plan.id === "agency" && <Users className="w-5 h-5 opacity-60" />}
                        {plan.id === "pro" && <Zap className="w-5 h-5 text-blue-500" />}
                      </h3>
                      <p
                        className={cn(
                          "text-xs leading-relaxed min-h-[36px]",
                          isDark ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price Display */}
                    <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-black tracking-tight">
                          ${price}
                        </span>
                        <span className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>
                          {price === 0 ? "/forever" : "/month"}
                        </span>
                      </div>
                      {price > 0 && isAnnual && (
                        <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
                          Billed annually (${price * 12}/year)
                        </p>
                      )}
                      {price > 0 && !isAnnual && (
                        <p className={cn("text-[11px] mt-1.5", isDark ? "text-slate-500" : "text-slate-400")}>
                          Billed monthly
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        What's Included:
                      </p>
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                            <span
                              className={cn(
                                "flex-shrink-0 mt-0.5 rounded-full p-0.5",
                                isPopular
                                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                              )}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span className={isDark ? "text-slate-300" : "text-slate-700"}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div>
                    <Link
                      to={plan.ctaLink}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm",
                        isPopular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:shadow-blue-500/35 hover:-translate-y-0.5"
                          : isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800",
                      )}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── 3. Feature Comparison Toggle & Table ───────────────────── */}
        <section className={cn(pageFrameClass, "mb-20 sm:mb-28")}>
          <div className="text-center mb-8">
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 border",
                isDark
                  ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm",
              )}
            >
              <span>{showComparison ? "Hide Detailed Feature Comparison" : "Compare All Plan Features & Limits"}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showComparison && "rotate-180")} />
            </button>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
              >
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs uppercase tracking-wider font-bold">
                      <th className="py-4 px-6 text-slate-500">Feature</th>
                      <th className="py-4 px-4 text-center">Starter</th>
                      <th className="py-4 px-4 text-center text-blue-600 dark:text-blue-400">Creator Pro</th>
                      <th className="py-4 px-4 text-center">Studio & Agency</th>
                      <th className="py-4 px-4 text-center">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                    {COMPARISON_CATEGORIES.map((cat, cIdx) => (
                      <React.Fragment key={cIdx}>
                        <tr className="bg-slate-50/80 dark:bg-slate-950/80">
                          <td colSpan={5} className="py-3 px-6 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">
                            {cat.category}
                          </td>
                        </tr>
                        {cat.items.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 px-6 font-medium text-slate-700 dark:text-slate-300">{row.name}</td>
                            <td className="py-3.5 px-4 text-center">
                              {typeof row.starter === "boolean" ? (
                                row.starter ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <span className="text-slate-300 dark:text-slate-600">—</span>
                              ) : (
                                <span className="font-semibold">{row.starter}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center bg-blue-50/20 dark:bg-blue-950/10 font-semibold text-blue-600 dark:text-blue-400">
                              {typeof row.pro === "boolean" ? (
                                row.pro ? <Check className="w-4 h-4 mx-auto text-blue-500" /> : <span className="text-slate-300 dark:text-slate-600">—</span>
                              ) : (
                                <span>{row.pro}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-medium">
                              {typeof row.agency === "boolean" ? (
                                row.agency ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <span className="text-slate-300 dark:text-slate-600">—</span>
                              ) : (
                                <span className="font-semibold">{row.agency}</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-medium">
                              {typeof row.enterprise === "boolean" ? (
                                row.enterprise ? <Check className="w-4 h-4 mx-auto text-emerald-500" /> : <span className="text-slate-300 dark:text-slate-600">—</span>
                              ) : (
                                <span className="font-semibold">{row.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── 4. Frequently Asked Questions (FAQ) ───────────────────── */}
        <section className={cn(pageFrameClass, "mb-20 sm:mb-28 max-w-4xl")}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
              Everything you need to know about Athena Web Studio billing and subscriptions.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl border transition-all duration-200 overflow-hidden",
                    isDark
                      ? "bg-slate-900/60 border-slate-800"
                      : "bg-white border-slate-200/80 shadow-sm",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base gap-4"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-300 text-slate-400",
                        isOpen && "rotate-180 text-blue-500",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className={cn(
                          "px-4 pb-5 sm:px-5 text-xs sm:text-sm leading-relaxed border-t",
                          isDark ? "border-slate-800/80 text-slate-400" : "border-slate-100 text-slate-600",
                        )}
                      >
                        <div className="pt-3">{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Bottom Conversion Call to Action ────────────────────── */}
        <section className={cn(pageFrameClass, "mb-10")}>
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center border shadow-xl",
              isDark
                ? "bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 shadow-blue-500/5"
                : "bg-gradient-to-b from-blue-50/80 to-white border-blue-100 shadow-blue-500/5",
            )}
          >
            {/* Ambient background glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 relative z-10">
              Ready to build your masterpiece?
            </h2>
            <p
              className={cn(
                "text-sm sm:text-base max-w-xl mx-auto mb-8 relative z-10",
                isDark ? "text-slate-400" : "text-slate-600",
              )}
            >
              Start free today with no credit card required. Publish your site in minutes with intuitive drag-and-drop.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link
                to="/login?mode=signup&plan=starter"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-7 py-3.5 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/templates"
                className={cn(
                  "w-full sm:w-auto inline-flex items-center justify-center rounded-xl font-semibold text-sm px-6 py-3.5 transition-all duration-200 border",
                  isDark
                    ? "border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
                )}
              >
                Explore Templates
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer isDark={isDark} />
    </div>
  );
}
