import React, { useRef, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import CanvasBentoFeatures from "@/components/landing/CanvasBentoFeatures";
import { FeatureFlipShell } from "@/components/landing/FeatureFlipShell";
import { featureFlipBriefs, type FeatureFlipBrief } from "@/components/landing/featureFlipBriefs";

// Types for Card Configuration
interface CardTheme {
  cardBase: string;
  cardGlow: string;
  meshBackground: string;
  boxShadow: string;
  iconBgBorder: string;
  badgeBgTextBorder: string;
  titleHover: string;
  footerText: string;
}

interface FeatureCardProps {
  colSpan?: string;
  heroTag?: string;
  heroBadge?: boolean;
  icon: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  subText: string;
  theme: CardTheme;
  brief: FeatureFlipBrief;
}

function useSpotlightPointer() {
  const cardRef = useRef<HTMLElement>(null);

  const handlePointerMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  const handlePointerLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--mouse-x", `50%`);
    cardRef.current.style.setProperty("--mouse-y", `50%`);
  };

  return { cardRef, handlePointerMove, handlePointerLeave };
}

// Sub-Component: Interactive Mouse-Tracking Spotlight Card
const SpotlightCard: React.FC<FeatureCardProps> = ({
  colSpan = "col-span-1",
  heroBadge = false,
  icon,
  badgeText,
  title,
  description,
  subText,
  theme,
  brief,
}) => {
  const { cardRef, handlePointerMove, handlePointerLeave } = useSpotlightPointer();

  return (
    <FeatureFlipShell
      brief={brief}
      className={`${colSpan} h-full min-w-0`}
      backClassName="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0f172a] shadow-2xl"
      front={
        <article
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="spotlight-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 shadow-2xl sm:rounded-3xl sm:p-8 md:p-10"
          style={{
            ["--card-base" as string]: theme.cardBase,
            ["--card-glow" as string]: theme.cardGlow,
            boxShadow: theme.boxShadow,
            backgroundColor: theme.cardBase,
          }}
        >
          <div
            className="card-mesh absolute inset-0 z-0 opacity-65 transition-opacity duration-500 pointer-events-none group-hover:opacity-90"
            style={{ background: theme.meshBackground }}
          />

          <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 sm:gap-4">
            <div
              className={`flex h-12 min-w-12 w-auto shrink-0 items-center justify-center rounded-2xl px-2.5 py-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 sm:h-14 sm:min-w-14 sm:px-3 sm:py-3.5 ${theme.iconBgBorder}`}
            >
              {icon}
            </div>
            <span
              className={`inline-flex max-w-[55%] shrink-0 items-center gap-1.5 truncate rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur-md sm:max-w-none sm:px-3 sm:text-xs ${theme.badgeBgTextBorder}`}
            >
              {heroBadge && (
                <svg className="h-3.5 w-3.5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
                </svg>
              )}
              {badgeText}
            </span>
          </div>

          <div className="relative z-10 mt-8 min-w-0 sm:mt-12">
            <h2
              className={`mb-2 break-words text-lg font-extrabold tracking-tight text-white transition-colors duration-500 sm:mb-3 sm:text-2xl lg:text-3xl ${theme.titleHover}`}
            >
              {title}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base lg:text-lg">{description}</p>
          </div>

          <div
            className={`relative z-10 mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs font-medium sm:mt-6 sm:pt-5 ${theme.footerText}`}
          >
            <span className="min-w-0 break-words">{subText}</span>
          </div>
        </article>
      }
    />
  );
};

function ReadyToLiveCard() {
  const { cardRef, handlePointerMove, handlePointerLeave } = useSpotlightPointer();

  return (
    <FeatureFlipShell
      brief={featureFlipBriefs["ready-live"]}
      className="col-span-1 h-full min-w-0 md:col-span-2 lg:col-span-3"
      backClassName="bg-[#0f172a] shadow-2xl"
      front={
        <article
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="spotlight-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 shadow-2xl sm:rounded-3xl sm:p-8 md:p-10"
          style={{
            ["--card-base" as string]: "#0f172a",
            ["--card-glow" as string]: "rgba(99, 102, 241, 0.35)",
            boxShadow: "rgba(99, 102, 241, 0.22) 0px 20px 45px -15px",
            backgroundColor: "#0f172a",
          }}
        >
          <div
            className="card-mesh absolute inset-0 z-0 opacity-65 transition-opacity duration-500 pointer-events-none group-hover:opacity-90"
            style={{
              background:
                "radial-gradient(circle at 75% 30%, #312e81 0%, #1e1b4b 50%, #0f172a 100%)",
            }}
          />
          <div className="relative z-10 flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl p-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 sm:h-14 sm:w-14 sm:p-3.5">
              <svg
                className="h-6 w-6 text-indigo-400 sm:h-7 sm:w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>
          <div className="relative z-10 mt-6 flex flex-col justify-between gap-4 sm:mt-10 sm:gap-6 md:flex-row md:items-end">
            <div className="min-w-0 max-w-lg space-y-2">
              <h2 className="text-xl font-extrabold tracking-tight text-white transition-colors duration-500 group-hover:text-blue-200 sm:text-3xl">
                Ready to see your site live?
              </h2>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                No credit card required. Build with standard features completely free.
              </p>
            </div>
            <div
              className="flex w-full flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center md:w-auto md:shrink-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Link
                to="/login"
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-white/10 transition-all duration-300 ease-out hover:scale-[1.03] hover:bg-slate-100 active:scale-95 sm:w-auto"
              >
                Launch Editor Now
              </Link>
            </div>
          </div>
          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/70 sm:mt-6 sm:pt-5">
            <span>Start instantly in browser</span>
          </div>
        </article>
      }
    />
  );
}

// Main Component
export default function FeaturesShowcase() {
  return (
    <>
      {/* Inline Styles & Keyframe Injection for Spotlights & Blobs */}
      <style>{`
        @keyframes blobPulse {
          0% { transform: scale(1) translate(0px, 0px); opacity: 0.45; }
          50% { transform: scale(1.18) translate(30px, -20px); opacity: 0.65; }
          100% { transform: scale(0.92) translate(-25px, 25px); opacity: 0.45; }
        }
        @keyframes blobFloat {
          0% { transform: rotate(0deg) translate(-20px, 0px); }
          50% { transform: rotate(180deg) translate(25px, 15px); }
          100% { transform: rotate(360deg) translate(-20px, 0px); }
        }
        .animate-blob-pulse {
          animation: blobPulse 14s ease-in-out infinite alternate;
        }
        .animate-blob-float {
          animation: blobFloat 18s ease-in-out infinite alternate;
        }
        .bg-grid-pattern {
          background-size: 32px 32px;
          background-image:
            linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
        }
        .spotlight-card {
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.45s ease,
            box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        .spotlight-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: radial-gradient(360px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.16), transparent 65%);
          opacity: 0;
          transition: opacity 0.55s ease;
          pointer-events: none;
          z-index: 2;
        }
        .spotlight-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--card-glow, rgba(255, 255, 255, 0.2)), transparent 75%);
          opacity: 0;
          transition: opacity 0.55s ease;
          pointer-events: none;
          z-index: 1;
        }
        .spotlight-card:hover::before,
        .spotlight-card:hover::after {
          opacity: 1;
        }
        .spotlight-card:hover {
          transform: translateY(-6px) scale(1.012);
          border-color: rgba(255, 255, 255, 0.28);
        }
        @media (max-width: 639px) {
          .spotlight-card:hover {
            transform: translateY(-3px) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spotlight-card,
          .spotlight-card::before,
          .spotlight-card::after {
            transition: none;
          }
          .spotlight-card:hover {
            transform: none;
          }
        }
      `}</style>

      {/* Main Full-Width Wrapper — overflow visible so hover lift/scale isn't clipped */}
      <main
        id="features"
        className="relative w-full max-w-full min-w-0 overflow-x-hidden bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 bg-grid-pattern py-6 text-slate-900 antialiased sm:py-8 lg:py-10"
      >
        {/* Animated Background Blobs (clipped so they don't spill the page) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(700px,120vw)] h-[min(450px,60vw)] bg-gradient-to-tr from-indigo-400/20 via-purple-400/25 to-cyan-300/20 blur-[130px] rounded-full animate-blob-pulse"
          />
          <div
            className="absolute top-1/3 left-1/3 w-[min(450px,90vw)] h-[min(350px,50vw)] bg-gradient-to-br from-pink-400/15 via-violet-500/20 to-teal-300/15 blur-[110px] rounded-full animate-blob-float"
          />
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-full">
          {/* Header — same typography as TemplatesScroll, right-aligned */}
          <header className="mb-8 flex flex-col items-end sm:mb-10 lg:mb-12">
            <div className="w-full max-w-2xl min-w-0 space-y-2 text-left sm:text-right">
              <h2 className="text-[1.65rem] font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Design on a canvas.
                <br />
                <span className="italic font-bold shimmer-gradient-text">
                  Publish live.
                </span>
              </h2>
              <p className="ml-auto max-w-xl pt-1 text-sm leading-relaxed text-slate-600 sm:text-lg">
                Precision layout, unified design, and frictionless publishing-all on one canvas.
              </p>
            </div>
          </header>

          {/* Canvas bento mockups — Visual canvas, Elements, Inline editing, Design system */}
          <div className="mb-4 min-w-0 py-2 sm:mb-5 sm:py-3">
            <CanvasBentoFeatures />
          </div>

          {/* Remaining unique spotlight cards (no overlap with bento) */}
          <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-4 py-2 sm:gap-5 sm:py-3 sm:auto-rows-[minmax(330px,auto)] md:grid-cols-2 lg:grid-cols-3">
            {/* Blank canvas or templates */}
            <SpotlightCard
              brief={featureFlipBriefs.templates}
              colSpan="col-span-1 md:col-span-2 lg:col-span-2"
              heroBadge={true}
              badgeText="Hero Feature"
              title="Blank canvas or templates"
              description="Start from a blank canvas or jumpstart with designer-crafted templates. Tailor every pixel instantly or let your brand identity guide the foundation."
              subText="Unlimited canvas versatility"
              icon={
                <svg
                  className="w-7 h-7 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect height="7" rx="1.5" width="18" x="3" y="3" />
                  <rect height="9" rx="1.5" width="8" x="3" y="14" />
                  <rect height="9" rx="1.5" width="7" x="14" y="14" />
                </svg>
              }
              theme={{
                cardBase: "#170d2b",
                cardGlow: "rgba(168, 85, 247, 0.35)",
                meshBackground:
                  "radial-gradient(circle at 10% 20%, #4c1d95 0%, #2e1065 40%, #170d2b 90%)",
                boxShadow: "0 20px 45px -15px rgba(168, 85, 247, 0.22)",
                iconBgBorder: "group-hover:opacity-90",
                badgeBgTextBorder:
                  "bg-purple-500/20 text-purple-200 border-purple-400/30",
                titleHover: "group-hover:text-purple-200",
                footerText: "text-purple-300/80",
              }}
            />

            {/* Multi-Device Responsive */}
            <SpotlightCard
              brief={featureFlipBriefs.responsive}
              colSpan="col-span-1"
              badgeText="Fluid Adaptive"
              title="Desktop, tablet, and mobile"
              description="Preview each viewport and adjust layout, spacing, and sizing. Breakpoint overrides save selectively for each precise screen size."
              subText="Pixel-perfect responsiveness"
              icon={
                <div className="flex items-center gap-1 text-amber-300" aria-hidden>
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                  <Tablet className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                  <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                </div>
              }
              theme={{
                cardBase: "#251203",
                cardGlow: "rgba(245, 158, 11, 0.35)",
                meshBackground:
                  "radial-gradient(circle at 80% 20%, #b45309 0%, #451a03 50%, #251203 100%)",
                boxShadow: "0 20px 45px -15px rgba(245, 158, 11, 0.22)",
                iconBgBorder: "group-hover:opacity-90",
                badgeBgTextBorder:
                  "bg-amber-500/20 text-amber-200 border-amber-400/30",
                titleHover: "group-hover:text-amber-200",
                footerText: "text-amber-200/70",
              }}
            />

            {/* Assets and Stock */}
            <SpotlightCard
              brief={featureFlipBriefs.assets}
              colSpan="col-span-1"
              badgeText="Royalty-Free"
              title="Assets and stock"
              description="Upload PNG, JPG, SVG, and MP4 files, or search millions of curated royalty-free stock assets and apply them directly to your project canvas."
              subText="Global CDN asset optimization"
              icon={
                <svg
                  className="w-6 h-6 text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              }
              theme={{
                cardBase: "#172554",
                cardGlow: "rgba(59, 130, 246, 0.35)",
                meshBackground:
                  "radial-gradient(circle at 30% 70%, #1d4ed8 0%, #1e1b4b 60%, #0f172a 100%)",
                boxShadow: "rgba(59, 130, 246, 0.22) 0px 20px 45px -15px",
                iconBgBorder: "group-hover:opacity-90",
                badgeBgTextBorder:
                  "bg-blue-500/20 text-blue-200 border-blue-400/30",
                titleHover: "group-hover:text-blue-200",
                footerText: "text-blue-200/70",
              }}
            />

            {/* Publish Live Address */}
            <SpotlightCard
              brief={featureFlipBriefs.publish}
              colSpan="col-span-1 md:col-span-1 lg:col-span-2"
              badgeText="Instant Deploy"
              title="Publish to a live address"
              description="Deploy to a free Web Studio subdomain or connect your own domain instantly with automatic SSL certificates and edge routing included."
              subText="Edge SSL & zero-config hosting"
              icon={
                <svg
                  className="w-6 h-6 text-rose-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" x2="22" y1="12" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
              theme={{
                cardBase: "#2a0410",
                cardGlow: "rgba(244, 63, 94, 0.35)",
                meshBackground:
                  "radial-gradient(circle at 80% 80%, #be123c 0%, #4c0519 50%, #2a0410 100%)",
                boxShadow: "rgba(244, 63, 94, 0.22) 0px 20px 45px -15px",
                iconBgBorder: "group-hover:opacity-90",
                badgeBgTextBorder:
                  "bg-rose-500/20 text-rose-200 border-rose-400/30",
                titleHover: "group-hover:text-rose-200",
                footerText: "text-rose-200/70",
              }}
            />

            <ReadyToLiveCard />
          </div>
        </div>
      </main>
    </>
  );
}