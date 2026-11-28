import React from 'react';
import { pageFrameClass } from "@/components/landing/pageFrame";
import ctaBg from "@/assets/CTA.webp";
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function HeroCTASection({ isDark: propIsDark }: { isDark?: boolean } = {}) {
  const { isDark: themeIsDark } = useTheme();
  const isDark = propIsDark ?? themeIsDark;

  return (
    <>
      {/* Styles & Animation Definitions */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.75; }
          50% { transform: scale(1.15) translate(-10px, 15px); opacity: 0.95; }
        }
        @keyframes shimmerSweep {
          0% { transform: translateX(-120%) skewX(-20deg); }
          100% { transform: translateX(220%) skewX(-20deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          50% { transform: scale(1.25) rotate(18deg); opacity: 1; }
        }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        .animate-glow-pulse { animation: glowPulse 8s ease-in-out infinite; }
        .animate-shimmer-sweep { animation: shimmerSweep 3s infinite linear; }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 2.5s ease-in-out infinite; }
        .animate-text-shimmer { animation: textShimmer 6s ease-in-out infinite alternate; }

        /* Specular physical glass border using CSS mask gradient */
        .glass-specular-border {
          position: relative;
        }

        .glass-specular-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(192, 132, 252, 0.45) 35%, rgba(56, 189, 248, 0.15) 60%, rgba(255, 255, 255, 0.05) 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Ambient chromatic gradient text animation */
        .animated-gradient-text {
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
        }

        /* Subtle backdrop noise pattern overlay for photorealistic glass realism */
        .glass-backdrop-noise {
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="font-sans antialiased bg-slate-950 text-slate-800 min-h-0 flex items-center justify-center p-0 m-0 overflow-x-hidden selection:bg-indigo-500 selection:text-white">
        {/* BEGIN: MainHeroCTASection */}
        <main
          className="relative flex min-h-0 w-full max-w-full items-center justify-center overflow-hidden bg-slate-950 py-12 sm:py-16 md:min-h-[min(100vh,900px)] md:py-24"
          data-purpose="cta-showcase-container"
        >
          {/* Atmospheric Photography Background with rich depth */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" data-purpose="background-layers">
            {/* High-res modern creator studio environment */}
            <img
              alt="Creator workspace atmosphere"
              className="h-full w-full scale-105 object-cover object-center opacity-40 brightness-90 contrast-125 mix-blend-luminosity blur-sm filter"
              src={ctaBg}
              width={1408}
              height={768}
              loading="lazy"
              decoding="async"
            />
            {/* Multi-tier modern dark atmospheric gradient vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60 mix-blend-multiply" />
            <div
              className="absolute inset-0 opacity-80"
              style={{ background: 'radial-gradient(circle at 50% 50%, transparent 20%, #020617 90%)' }}
            />
            {/* Subtle spatial depth grid dots */}
            <div className="glass-backdrop-noise absolute inset-0 opacity-25" />
            {/* Ambient Glowing Orbs Behind Card */}
            <div className="animate-glow-pulse pointer-events-none absolute top-1/2 left-1/2 h-80 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-600 to-fuchsia-500 opacity-40 blur-3xl sm:h-96" />
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/3 -translate-y-1/2 rounded-full bg-cyan-400 opacity-30 blur-[110px]" />
            <div className="pointer-events-none absolute right-1/3 bottom-1/4 h-96 w-96 rounded-full bg-purple-600 opacity-25 blur-[130px]" />
            {/* Floating Ambient Particle Accents */}
            <div className="animate-float-slow absolute top-1/4 left-[15%] h-2 w-2 rounded-full bg-sky-300 opacity-70 blur-[0.5px]" />
            <div className="animate-sparkle absolute right-[18%] bottom-1/3 h-2.5 w-2.5 rounded-full bg-indigo-300 opacity-60 blur-[1px]" />
            <div className="absolute top-2/3 left-[22%] h-1.5 w-1.5 rounded-full bg-fuchsia-300 opacity-80 blur-[0.5px]" />
          </div>

          {/* BEGIN: GlassmorphicCTACard — same content width as hero */}
          <div className={`${pageFrameClass} relative z-10 min-w-0`} data-purpose="interactive-cta-card">
            <div className="relative w-full min-w-0 max-w-full">
              {/* Floating 3D Glass Accent Badge (Top-Right Dimension Breaker) */}


              {/* Main Frosted Glass Card Container */}
              <div className="glass-specular-border relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl p-5 sm:p-10 md:p-12 shadow-2xl shadow-indigo-950/50 text-center transition-all duration-300 hover:shadow-indigo-500/20">
                {/* Subtle Top Glass Refraction Highlight */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-white/40 to-transparent blur-xl pointer-events-none" />

                {/* Optional Top Navigation Corner Utility */}
                <div className="absolute top-3 right-3 hidden items-center gap-2 sm:top-7 sm:right-7 sm:flex" data-purpose="window-controls">
                  <button
                    aria-label="Dismiss view"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </button>
                </div>

                {/* BEGIN: Action Pill Badge */}
                <div className="inline-flex items-center justify-center mb-4 sm:mb-6" data-purpose="status-badge">
                  <div className="relative group inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-sky-400/30 transition-all duration-300 shadow-sm shadow-indigo-500/10">
                    <svg className="w-4 h-4 text-sky-500 dark:text-sky-400 animate-sparkle shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
                      <path d="M19 16L19.9 19.1L23 20L19.9 20.9L19 24L18.1 20.9L15 20L18.1 19.1L19 16Z" opacity="0.6" />
                    </svg>
                    <span className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      Zero to Live
                    </span>
                  </div>
                </div>

                {/* BEGIN: Headline & Typographic Treatment */}
                <div className="mb-5 space-y-1 sm:mb-6" data-purpose="hero-title-block">
                  <h2 className="text-slate-950 dark:text-white font-extrabold tracking-tight text-[1.65rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl px-1">
                    Publish to a{' '}
                    <span className="inline italic font-black bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 animated-gradient-text animate-text-shimmer drop-shadow-sm">
                      live address.
                    </span>
                  </h2>
                </div>

                {/* BEGIN: High-Converting Feature Checklist */}
                <div className="max-w-2xl mx-auto mb-6 text-left sm:mb-7 sm:px-4" data-purpose="value-proposition-checklist">
                  <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        Publish directly to a <strong className="text-slate-900 dark:text-white font-semibold">Web Studio subdomain</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        Connect your own <strong className="text-slate-900 dark:text-white font-semibold">custom apex domain or subdomain</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd" />
                        </svg>
                      </span>
                      <span className="min-w-0">
                        Automatic <strong className="text-slate-900 dark:text-white font-semibold">SSL certificates &amp; static site hosting</strong> included
                      </span>
                    </li>
                  </ul>
                </div>

                {/* BEGIN: High-Converting Radiant Action Button */}
                <div className="mt-6 mb-6 flex w-full items-center justify-center sm:mt-7 sm:mb-7">
                  <Link
                    to="/login"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] sm:h-13 sm:px-9 sm:text-base cursor-pointer"
                  >
                    <span>Start building</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Platform highlights */}
                <div className="pt-4 sm:pt-5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Visual Canvas</span>
                  <span aria-hidden className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Responsive Breakpoints</span>
                  <span aria-hidden className="text-slate-300 dark:text-slate-700">·</span>
                  <span>Static Site Export</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}