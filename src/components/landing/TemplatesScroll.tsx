import React, { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_CARDS = 6;
const AUTO_PLAY_DELAY = 3600;

export default function TemplateShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const hasMovedRef = useRef(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Responsive window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL_CARDS);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL_CARDS) % TOTAL_CARDS);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_DELAY);
  }, [nextSlide]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoPlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, startAutoPlay]);

  // Autoplay setup
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // Drag & Swipe Handlers
  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = clientX;
    currentXRef.current = clientX;
    stopAutoPlay();
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = clientX;
    const diffX = currentXRef.current - startXRef.current;
    if (Math.abs(diffX) > 8) {
      hasMovedRef.current = true;
    }
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const diffX = currentXRef.current - startXRef.current;
    const dragThreshold = 55;

    if (Math.abs(diffX) >= dragThreshold) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else if (!hasMovedRef.current) {
      // Click left/right half of the stage (mousedown preventDefault blocks click)
      const rect = stageRef.current?.getBoundingClientRect();
      if (rect) {
        const mid = rect.left + rect.width / 2;
        if (startXRef.current < mid) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
    }
    hasMovedRef.current = false;
    startAutoPlay();
  };

  // Compute 3D styles per card index based on distance from active card
  const getCardStyle = (index: number): React.CSSProperties => {
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth < 1024;

    // Only center + immediate left/right neighbors are shown, fully in-frame
    const cardW = isMobile ? 300 : isTablet ? 340 : 380;
    const sideScale = 0.9;
    const stagePad = isMobile ? 20 : 40;
    const maxSideX = Math.max(
      120,
      windowWidth / 2 - stagePad - (cardW * sideScale) / 2,
    );
    const xSpacing = Math.min(
      isMobile ? 135 : isTablet ? 190 : 260,
      maxSideX,
    );
    const zOffset = isMobile ? -100 : isTablet ? -140 : -180;
    const rotateYDeg = isMobile ? 14 : isTablet ? 20 : 24;

    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);

    if (absDiff > 1) {
      return {
        transform: `translateX(${diff * xSpacing}px) translateZ(${absDiff * zOffset}px) rotateY(0deg) scale(0.75)`,
        zIndex: 0,
        opacity: 0,
        visibility: "hidden" as const,
        pointerEvents: "none",
        filter: "none",
        boxShadow: "none",
      };
    }

    if (diff === 0) {
      return {
        transform: "translateX(0px) translateZ(48px) rotateY(0deg) scale(1.02)",
        zIndex: 30,
        opacity: 1,
        visibility: "visible" as const,
        filter: "none",
        boxShadow: "0 28px 60px -18px rgba(15, 23, 42, 0.45)",
        pointerEvents: "none",
      };
    }

    const xPos = diff * xSpacing;
    const zPos = absDiff * zOffset;
    const rotY = diff < 0 ? rotateYDeg : -rotateYDeg;

    return {
      transform: `translateX(${xPos}px) translateZ(${zPos}px) rotateY(${rotY}deg) scale(${sideScale})`,
      zIndex: 20,
      opacity: 0.92,
      visibility: "visible" as const,
      filter: "brightness(0.9)",
      boxShadow: "0 18px 40px -16px rgba(15, 23, 42, 0.35)",
      pointerEvents: "none",
    };
  };


  return (
    <>
      <style>{`
        /* Custom animations */
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0.45; transform: scale(0.96); }
          100% { opacity: 0.8; transform: scale(1.04); }
        }

        .animate-text-shimmer {
          animation: textShimmer 3.5s ease-in-out infinite alternate;
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite alternate;
        }

        /* Subtle dot grid matrix backdrop matching Buildora Bento UI */
        .bg-grid-dots {
          background-image: radial-gradient(rgba(100, 116, 139, 0.16) 1.25px, transparent 1.25px);
          background-size: 24px 24px;
        }

        /* Gradient animated title */
        .shimmer-gradient-text {
          background: linear-gradient(110deg, #3b82f6 0%, #06b6d4 28%, #8b5cf6 55%, #3b82f6 85%, #06b6d4 100%);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* 3D Perspective container */
        .perspective-stage {
          perspective: 1600px;
          perspective-origin: center 45%;
          cursor: grab;
          user-select: none;
        }
        .perspective-stage:active {
          cursor: grabbing;
        }

        /* Smooth 3D transforms transition */
        .carousel-card {
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), 
                      opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.55s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s ease,
                      visibility 0.55s;
          will-change: transform, opacity, filter;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          touch-action: pan-y;
        }

        /* Reflection highlights on card glass borders */
        .glass-border-sheen {
          position: relative;
        }
        .glass-border-sheen::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Scroll preview content effect */
        .template-mockup-scroll {
          transition: transform 5s ease-in-out;
        }
        .carousel-card:hover .template-mockup-scroll {
          transform: translateY(-8%);
        }

        /* Hide standard scrollbars */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="bg-[#f8fafc] text-slate-900 antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans">
        {/* BEGIN: TemplateShowcaseSection */}
        <section
          className="relative overflow-hidden bg-grid-dots px-4 py-12 sm:px-6 sm:py-16 md:py-24 lg:px-8"
          id="templates-section"
        >
          {/* Ambient Mesh Radial Glows (Buildora Aura) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden flex items-center justify-center -z-10"
          >
            <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse-glow" />
            <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-purple-400/25 rounded-full blur-[140px] mix-blend-multiply" />
            <div className="absolute bottom-10 left-1/3 w-[650px] h-[450px] bg-indigo-300/20 rounded-full blur-[130px]" />
          </div>

          {/* Maximum Width Container */}
          <div className="max-w-7xl mx-auto">
            {/* BEGIN: SectionHeader */}
            <header className="mb-12 flex flex-col gap-6 lg:mb-16 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl">
                  Start from a template
                  <br />
                  <span className="italic font-bold shimmer-gradient-text animate-text-shimmer">
                    or a blank canvas.
                  </span>
                </h2>
                <p className="max-w-xl pt-1 text-base leading-relaxed text-slate-600 sm:text-lg">
                  Jumpstart your workflow with hand-crafted, fully reactive compositions or orchestrate every layout element from ground zero in spatial freeform.
                </p>
              </div>
            </header>
            {/* END: SectionHeader */}

            {/* BEGIN: 3D Coverflow Deck Stage */}
            <div
              ref={stageRef}
              className="perspective-stage relative w-full max-w-full select-none overflow-hidden pb-6 pt-2 sm:pb-8 sm:pt-4"
              id="carousel-stage"
              onMouseEnter={stopAutoPlay}
              onMouseLeave={() => {
                if (!isDraggingRef.current) startAutoPlay();
              }}
            >
              {/* Track Container */}
              <div
                className="relative flex h-[min(480px,70svh)] w-full max-w-full cursor-ew-resize touch-pan-y items-center justify-center px-2 sm:h-[580px] sm:px-4 md:h-[640px] lg:h-[680px]"
                id="carousel-track"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleDragStart(e.clientX);
                }}
                onMouseMove={(e) => {
                  if (isDraggingRef.current) handleDragMove(e.clientX);
                }}
                onMouseUp={handleDragEnd}
                onTouchCancel={handleDragEnd}
                onTouchEnd={handleDragEnd}
                onTouchMove={(e) => {
                  if (isDraggingRef.current && e.touches.length === 1) {
                    handleDragMove(e.touches[0].clientX);
                  }
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    handleDragStart(e.touches[0].clientX);
                  }
                }}
              >
                {/* CARD 0: Blank Canvas */}
                <div
                  className="carousel-card group absolute h-[min(440px,62svh)] w-[78vw] max-w-[300px] cursor-pointer overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] sm:h-[520px] sm:max-w-[340px] sm:rounded-[1.75rem] md:max-w-[380px] md:h-[580px] lg:max-w-[400px] lg:h-[620px]"
                  data-index="0"
                  data-purpose="template-card"
                  style={getCardStyle(0)}
                >
                  <div className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden bg-slate-950">
                    <div className="relative flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">Canvas · Artboard</span>
                      </div>
                      <div className="my-auto space-y-3 py-4">
                        <div className="h-7 w-3/4 animate-pulse rounded-lg border border-indigo-500/30 bg-indigo-500/20" />
                        <div className="h-3.5 w-1/2 rounded bg-slate-800" />
                        <div className="grid grid-cols-3 gap-2.5 pt-2">
                          {['Section', 'Grid', 'Embed'].map((label) => (
                            <div
                              key={label}
                              className="flex h-[4.5rem] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/40 text-[10px] text-slate-500"
                            >
                              + {label}
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-indigo-800/60 bg-indigo-950/60 px-3 py-1.5 text-[11px] font-medium text-indigo-300">
                        Freeform Spatial Layout
                      </span>
                    </div>
                    <div className="relative z-20 mx-4 mb-4 rounded-2xl border border-white/15 bg-black/70 px-4 py-3 shadow-2xl backdrop-blur-xl sm:mx-5 sm:mb-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold tracking-tight text-white">Blank Canvas</h3>
                          <p className="text-xs text-slate-400">Pure custom architectural freedom</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-indigo-600">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 1: Portfolio */}
                <div
                  className="carousel-card group absolute h-[min(440px,62svh)] w-[78vw] max-w-[300px] cursor-pointer overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] sm:h-[520px] sm:max-w-[340px] sm:rounded-[1.75rem] md:max-w-[380px] md:h-[580px] lg:max-w-[400px] lg:h-[620px]"
                  data-index="1"
                  data-purpose="template-card"
                  style={getCardStyle(1)}
                >
                  <div className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden bg-[#0b0f19]">
                    <div className="template-mockup-scroll absolute inset-0 h-[140%] overflow-hidden">
                      <div className="w-full pb-28 text-white">
                        <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5 sm:px-6">
                          <span className="text-xs font-bold tracking-wider text-indigo-400">ALEXA.STUDIO</span>
                          <span className="rounded-full bg-indigo-600/90 px-2.5 py-1 text-[10px] text-white">Contact</span>
                        </div>
                        <div className="px-5 py-5 text-center sm:px-6">
                          <span className="mb-3 inline-block rounded-full border border-indigo-800/60 bg-indigo-950/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-indigo-400">
                            Available For Commission
                          </span>
                          <h4 className="mb-2 text-2xl font-black leading-none tracking-tight">CREATIVE PORTFOLIO</h4>
                          <p className="mx-auto max-w-[260px] text-[11px] leading-relaxed text-slate-400">
                            Curated visual galleries, editorial case studies &amp; experimental interactive design.
                          </p>
                          <div className="relative mx-auto my-5 h-28 w-28">
                            <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl" />
                            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-400/40 bg-gradient-to-tr from-indigo-900 to-slate-800">
                              <svg className="h-16 w-16 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                              </svg>
                            </div>
                          </div>
                          <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2.5">
                            <div>
                              <div className="text-xs font-extrabold text-white">140+</div>
                              <div className="text-[9px] text-slate-400">Projects Done</div>
                            </div>
                            <div className="border-x border-slate-800">
                              <div className="text-xs font-extrabold text-white">12+</div>
                              <div className="text-[9px] text-slate-400">Years Active</div>
                            </div>
                            <div>
                              <div className="text-xs font-extrabold text-white">38+</div>
                              <div className="text-[9px] text-slate-400">Design Honors</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-20 mx-4 mt-auto mb-4 rounded-2xl border border-purple-500/30 bg-slate-950/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:mx-5 sm:mb-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">Portfolio &amp; Studio</h3>
                          <p className="text-xs text-slate-400">Personal showcases, bios &amp; galleries</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600/90 text-white shadow-md transition-transform group-hover:scale-110">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 2: eCommerce — matches screenshot exactly */}
                <div
                  className="carousel-card group absolute h-[520px] w-[82vw] max-w-[340px] cursor-pointer overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_70px_-18px_rgba(15,23,42,0.4)] sm:max-w-[380px] sm:h-[580px] md:max-w-[400px] md:h-[620px]"
                  data-index="2"
                  data-purpose="template-card"
                  style={getCardStyle(2)}
                >
                  <div className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden bg-white">
                    <div className="template-mockup-scroll absolute inset-0 h-[140%] overflow-hidden">
                      <div className="w-full bg-[#f8fafc] pb-28 text-slate-900">
                        {/* Hero */}
                        <div className="relative bg-gradient-to-br from-[#0c1b4d] via-[#1e1b6b] to-[#312e81] px-5 pb-5 pt-4 text-white sm:px-6 sm:pb-6 sm:pt-5">
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
                              Soundcraft Pro
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d4ed8]/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                              eCommerce Suite
                            </span>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">Live Storefront</p>
                          <h4 className="mt-1.5 max-w-[15rem] text-[1.35rem] font-extrabold leading-tight tracking-tight sm:text-xl">
                            Elevate Your Audio Journey
                          </h4>
                          <p className="mt-2 max-w-[16rem] text-[11px] leading-relaxed text-slate-300">
                            Experience Sound in Its Purest Form with Spatial Earbuds.
                          </p>
                          <div className="mt-4 flex gap-2">
                            <span className="rounded-lg bg-white px-3.5 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm">
                              Shop Now
                            </span>
                            <span className="rounded-lg border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
                              Checkout
                            </span>
                          </div>
                        </div>

                        {/* Collection */}
                        <div className="bg-white px-5 py-4 sm:px-6">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Curated Collection</span>
                            <span className="text-[10px] font-semibold text-blue-600">Filter By Tags</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                            {[
                              { icon: '🎧', name: 'Earbuds Spatial Y16', price: '$270 USD' },
                              { icon: '🎧', name: 'Headphones Pro X168A', price: '$250 USD' },
                              { icon: '🔊', name: 'HiFi Dock Acoustic X', price: '$240 USD' },
                            ].map((item) => (
                              <div
                                key={item.name}
                                className="flex flex-col items-center rounded-xl bg-[#f1f5f9] px-1.5 py-2.5 text-center sm:px-2"
                              >
                                <div className="mb-1.5 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-base shadow-sm sm:h-12 sm:w-12 sm:text-lg">
                                  {item.icon}
                                </div>
                                <span className="line-clamp-2 text-[10px] font-bold leading-tight text-slate-900 sm:text-[11px]">
                                  {item.name}
                                </span>
                                <span className="mt-1 text-[10px] font-semibold text-blue-600">{item.price}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-800">Integrated Stripe Checkout</p>
                              <p className="text-[9px] text-slate-500">Digital &amp; physical delivery workflows</p>
                            </div>
                            <span className="shrink-0 text-xs font-bold text-blue-600">Active →</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer CTA — dark rounded bar */}
                    <div className="relative z-20 mx-4 mt-auto mb-4 rounded-2xl bg-[#0f172a] px-4 py-3.5 shadow-2xl sm:mx-5 sm:mb-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">eCommerce</h3>
                          <p className="text-xs text-slate-400">Storefronts, inventory &amp; checkouts</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-blue-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: Business & Agency */}
                <div
                  className="carousel-card group absolute h-[min(440px,62svh)] w-[78vw] max-w-[300px] cursor-pointer overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] sm:h-[520px] sm:max-w-[340px] sm:rounded-[1.75rem] md:max-w-[380px] md:h-[580px] lg:max-w-[400px] lg:h-[620px]"
                  data-index="3"
                  data-purpose="template-card"
                  style={getCardStyle(3)}
                >
                  <div className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden bg-[#051332]">
                    <div className="template-mockup-scroll absolute inset-0 h-[140%] overflow-hidden">
                      <div className="w-full pb-28 text-white">
                        <div className="flex items-center justify-between border-b border-blue-900/50 px-5 py-3.5 text-[10px] sm:px-6">
                          <span className="font-bold tracking-wider text-cyan-400">APEX ENTERPRISE</span>
                          <span className="rounded-full bg-cyan-500/20 px-2.5 py-1 text-cyan-200">SaaS Tier</span>
                        </div>
                        <div className="px-5 py-5 sm:px-6">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                            Cloud Infrastructure
                          </span>
                          <h4 className="mt-1 mb-2 text-2xl font-black leading-tight tracking-tight">
                            Innovate.
                            <br />
                            Transform.
                            <br />
                            Thrive.
                          </h4>
                          <p className="mb-4 text-[11px] leading-relaxed text-slate-300">
                            Enterprise telemetry, autonomous scaling infrastructure and client onboarding.
                          </p>
                          <span className="mb-6 inline-block rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-md">
                            Explore Platform →
                          </span>
                          <div className="relative flex h-36 items-end justify-center gap-2 overflow-hidden rounded-2xl border border-blue-900/60 bg-gradient-to-t from-slate-900 via-blue-950 to-transparent p-4">
                            <div className="h-20 w-6 rounded-t-md bg-blue-600/80 shadow-lg" />
                            <div className="flex h-28 w-8 items-center justify-center rounded-t-md bg-cyan-500/90 font-mono text-[9px] shadow-xl">
                              B2B
                            </div>
                            <div className="h-16 w-6 rounded-t-md bg-blue-700/80 shadow-lg" />
                            <div className="h-24 w-7 rounded-t-md bg-indigo-600/80 shadow-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-20 mx-4 mt-auto mb-4 rounded-2xl border border-white/15 bg-slate-950/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:mx-5 sm:mb-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">Business &amp; Agency</h3>
                          <p className="text-xs text-slate-400">Corporate platforms &amp; consulting</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-cyan-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 4: Cafe & Bistro */}
                <div
                  className="carousel-card group absolute h-[min(440px,62svh)] w-[78vw] max-w-[300px] cursor-pointer overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] sm:h-[520px] sm:max-w-[340px] sm:rounded-[1.75rem] md:max-w-[380px] md:h-[580px] lg:max-w-[400px] lg:h-[620px]"
                  data-index="4"
                  data-purpose="template-card"
                  style={getCardStyle(4)}
                >
                  <div className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden bg-[#f5efe6]">
                    <div className="template-mockup-scroll absolute inset-0 h-[140%] overflow-hidden">
                      <div className="w-full pb-28 text-[#2c2118]">
                        <div className="flex items-center justify-between border-b border-amber-900/10 bg-[#efe6d8] px-5 py-3.5 text-[10px] sm:px-6">
                          <span className="font-bold tracking-wider text-amber-800">AURELIA BISTRO</span>
                          <span className="rounded-full bg-amber-900/10 px-2.5 py-1 text-amber-900/70">Reserve Table</span>
                        </div>
                        <div className="px-5 py-5 sm:px-6">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                            Artisanal Dining
                          </span>
                          <h4 className="mt-1 mb-2 text-2xl font-black tracking-tight">Farm-to-Table Gastronomy</h4>
                          <p className="mb-4 text-[11px] leading-relaxed text-amber-950/60">
                            Handcrafted seasonal menus, curated natural wine pairings and private salon bookings.
                          </p>
                          <div className="relative mb-4 flex h-36 flex-col justify-end rounded-2xl border border-amber-900/10 bg-gradient-to-t from-[#c4a574] via-[#d4b896] to-[#e8d9c0] p-4">
                            <div className="text-xs font-bold text-[#2c2118]">Tasting Experience</div>
                            <div className="text-[10px] text-[#2c2118]/70">Chef de Cuisine Tasting Menu · 7 Courses</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-xl border border-amber-900/10 bg-white/70 p-2.5 text-xs">
                              <span>Truffle &amp; Chanterelle Risotto</span>
                              <span className="font-bold text-amber-800">$34</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-amber-900/10 bg-white/70 p-2.5 text-xs">
                              <span>Dry-Aged Wagyu Tartare</span>
                              <span className="font-bold text-amber-800">$38</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-20 mx-4 mt-auto mb-4 rounded-2xl bg-[#1c1410] px-4 py-3 shadow-2xl sm:mx-5 sm:mb-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">Cafe &amp; Bistro</h3>
                          <p className="text-xs text-white/55">Menus, reservations &amp; dining</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-amber-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 5: Chronicle Blog */}
                <div
                  className="carousel-card group absolute h-[min(440px,62svh)] w-[78vw] max-w-[300px] cursor-pointer overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] sm:h-[520px] sm:max-w-[340px] sm:rounded-[1.75rem] md:max-w-[380px] md:h-[580px] lg:max-w-[400px] lg:h-[620px]"
                  data-index="5"
                  data-purpose="template-card"
                  style={getCardStyle(5)}
                >
                  <div className="pointer-events-none relative flex h-full w-full flex-col overflow-hidden bg-[#121214]">
                    <div className="template-mockup-scroll absolute inset-0 h-[140%] overflow-hidden">
                      <div className="w-full pb-28 text-white">
                        <div className="p-5 sm:p-6">
                          <div className="mb-2 flex justify-between font-mono text-[10px] text-emerald-400">
                            <span>THE CHRONICLE</span>
                            <span>ISSUE Nº 42</span>
                          </div>
                          <h4 className="mb-3 text-2xl font-black">The Future of Autonomous Interfaces</h4>
                          <div className="relative mb-4 flex h-40 items-end overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-t from-slate-950 via-slate-900 to-emerald-950/40 p-4">
                            <div>
                              <span className="block text-xs font-bold text-white">By Elena Vance</span>
                              <span className="text-[10px] text-slate-400">6 min read · Design Systems</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-xs">
                              <span className="text-slate-300">Curated Weekly Newsletter</span>
                              <span className="font-bold text-emerald-400">Join 24k</span>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-xs">
                              <span className="text-slate-300">Deep Dives &amp; Essays</span>
                              <span className="font-bold text-emerald-400">Explore</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-20 mx-4 mt-auto mb-4 rounded-2xl border border-white/15 bg-slate-950/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:mx-5 sm:mb-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">Chronicle Blog</h3>
                          <p className="text-xs text-slate-400">Essays, publications &amp; newsletters</p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-emerald-600">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* END: 3D Coverflow Deck Stage */}

            {/* BEGIN: Carousel Navigation Indicators (Pills & CTA) */}
            <div className="mt-8 flex flex-col items-center gap-6 border-t border-slate-200/70 pt-8">
              <div
                aria-label="Template slides"
                className="flex items-center justify-center gap-2.5 mx-auto"
                id="pagination-pills"
                role="tablist"
              >
                {Array.from({ length: TOTAL_CARDS }).map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to slide ${idx + 1}${idx === activeIndex ? ' (active)' : ''}`}
                    className={`rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'h-2.5 bg-indigo-600 w-8 shadow-sm shadow-indigo-500/50'
                        : 'h-2 bg-slate-300 w-2 hover:bg-slate-400'
                    }`}
                    onClick={() => {
                      setActiveIndex(idx);
                      startAutoPlay();
                    }}
                    type="button"
                  />
                ))}
              </div>
              <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                <a
                  className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-slate-700 transition-colors hover:text-indigo-600 group sm:justify-start sm:text-left sm:text-sm"
                  href="#templates-library"
                >
                  Browse All 120+ Templates{' '}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <button
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-600 active:scale-[0.98] sm:text-sm"
                  type="button"
                >
                  Use Active Blueprint
                </button>
              </div>
            </div>
            {/* END: Carousel Navigation Indicators */}
          </div>
        </section>
        {/* END: TemplateShowcaseSection */}
      </div>
    </>
  );
}
