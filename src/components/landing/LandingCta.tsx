import React, { useState } from 'react';
import { pageFrameClass } from "@/components/landing/pageFrame";

export default function HeroCTASection() {
  const [isPressed, setIsPressed] = useState(false);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      console.log('Publish flow initialized.');
    }, 150);
  };

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
          className="relative flex min-h-[min(100vh,900px)] w-full max-w-full items-center justify-center overflow-hidden bg-slate-950 py-12 sm:py-16 md:py-24"
          data-purpose="cta-showcase-container"
        >
          {/* Atmospheric Photography Background with rich depth */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" data-purpose="background-layers">
            {/* High-res modern creator studio environment */}
            <img
              alt="Creator workspace atmosphere"
              className="h-full w-full scale-105 object-cover object-center opacity-40 brightness-90 contrast-125 mix-blend-luminosity blur-sm filter"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuASrYyywOi6Yb_6jwvberyJ6UNuR-txWpjNZMLdG2JeRctdxrPBxO5JPylzt1orOOu2oKgpjq1fpr8Rj6WU264_6gnhj25PJypNc41PQRh1pSEGVI1r8B8kLWW_e8Z6EImKYVc-task4BYBRthmbqmA0CwrUceiK3oLnqCv-Jv6TTm5fGE2dgCU9-oNqXLjki_4GNI-1YKqYQx8GA3QPHIez-oxL6XLFg21Y7_LZZ9E_6vL3JGAFPaLSifnMJsH_TKhNf4"
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
              <div className="absolute top-3 right-3 sm:top-7 sm:right-7 flex items-center gap-2" data-purpose="window-controls">
                <button
                  aria-label="Dismiss view"
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {/* BEGIN: Action Pill Badge */}
              <div className="inline-flex items-center justify-center mb-4 sm:mb-6" data-purpose="status-badge">
                <div className="relative group cursor-pointer inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-sky-400/30 transition-all duration-300 shadow-sm shadow-indigo-500/10">
                  <svg className="w-4 h-4 text-sky-500 dark:text-sky-400 animate-sparkle shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
                    <path d="M19 16L19.9 19.1L23 20L19.9 20.9L19 24L18.1 20.9L15 20L18.1 19.1L19 16Z" opacity="0.6" />
                  </svg>
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Zero to Live
                  </span>
                </div>
              </div>

              {/* BEGIN: Headline & Typographic Treatment */}
              <div className="mb-5 space-y-1 sm:mb-6" data-purpose="hero-title-block">
                <h1 className="text-slate-950 dark:text-white font-extrabold tracking-tight text-[1.75rem] sm:text-5xl md:text-6xl leading-[1.15]">
                  Publish to a{' '}
                  <span className="inline italic font-black bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 animated-gradient-text animate-text-shimmer drop-shadow-sm">
                    live address.
                  </span>
                </h1>
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
                      Publish instantly to a blazing-fast <strong className="text-slate-900 dark:text-white font-semibold">Web Studio subdomain</strong>
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
                      Zero setup: Automatic <strong className="text-slate-900 dark:text-white font-semibold">SSL certificates &amp; edge cache</strong> included
                    </span>
                  </li>
                </ul>
              </div>

              {/* BEGIN: High-Converting Radiant Action Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-6 sm:mb-7" data-purpose="cta-button-group">
                <a
                  className={`group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white tracking-wide rounded-full overflow-hidden transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 ${
                    isPressed ? 'scale-95' : ''
                  }`}
                  data-purpose="primary-action-button"
                  href="#start-building"
                  onClick={handleCtaClick}
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-shimmer-sweep pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-3">
                    <span>Start building</span>
                    <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                    </svg>
                  </span>
                </a>
              </div>

              {/* BEGIN: Social Proof & Trust Elements */}
              <div className="pt-4 sm:pt-5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left" data-purpose="social-proof-section">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                    MK
                  </span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white">
                    TL
                  </span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-gradient-to-tr from-fuchsia-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                    AS
                  </span>
                  <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-200">
                    +10k
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-start min-w-0">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">5.0 / 5.0</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
                    Join <span className="font-semibold text-slate-800 dark:text-slate-200">10,000+ creators &amp; designers</span> publishing live
                  </p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}