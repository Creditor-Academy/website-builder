import { useRef, type MouseEvent, type ReactNode } from "react";
import { Layers, Move, Palette, Type, Zap, Image as ImageIcon, GripVertical } from "lucide-react";
import { FeatureFlipShell } from "@/components/landing/FeatureFlipShell";
import { featureFlipBriefs, type FeatureFlipBrief } from "@/components/landing/featureFlipBriefs";

type BentoTheme = {
  cardBase: string;
  cardGlow: string;
  meshBackground: string;
  boxShadow: string;
  titleHover: string;
  iconClass: string;
};

/** Unique hues — avoids purple / amber / blue / rose / indigo used by spotlight cards. */
const bentoThemes = {
  teal: {
    cardBase: "#042f2e",
    cardGlow: "rgba(45, 212, 191, 0.35)",
    meshBackground: "radial-gradient(circle at 12% 22%, #0f766e 0%, #115e59 42%, #042f2e 92%)",
    boxShadow: "0 20px 45px -15px rgba(20, 184, 166, 0.24)",
    titleHover: "group-hover:text-teal-200",
    iconClass: "text-teal-300",
  },
  emerald: {
    cardBase: "#022c22",
    cardGlow: "rgba(52, 211, 153, 0.35)",
    meshBackground: "radial-gradient(circle at 82% 18%, #059669 0%, #065f46 48%, #022c22 100%)",
    boxShadow: "0 20px 45px -15px rgba(16, 185, 129, 0.24)",
    titleHover: "group-hover:text-emerald-200",
    iconClass: "text-emerald-300",
  },
  fuchsia: {
    cardBase: "#2e0533",
    cardGlow: "rgba(232, 121, 249, 0.35)",
    meshBackground: "radial-gradient(circle at 28% 72%, #a21caf 0%, #701a75 50%, #2e0533 100%)",
    boxShadow: "0 20px 45px -15px rgba(217, 70, 239, 0.24)",
    titleHover: "group-hover:text-fuchsia-200",
    iconClass: "text-fuchsia-300",
  },
  sky: {
    cardBase: "#0c4a6e",
    cardGlow: "rgba(56, 189, 248, 0.35)",
    meshBackground: "radial-gradient(circle at 78% 78%, #0284c7 0%, #075985 48%, #0c4a6e 100%)",
    boxShadow: "0 20px 45px -15px rgba(14, 165, 233, 0.24)",
    titleHover: "group-hover:text-sky-200",
    iconClass: "text-sky-300",
  },
} as const satisfies Record<string, BentoTheme>;

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

function BentoMeshFront({
  theme,
  purpose,
  children,
}: {
  theme: BentoTheme;
  purpose: string;
  children: ReactNode;
}) {
  const { cardRef, handlePointerMove, handlePointerLeave } = useSpotlightPointer();

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      data-purpose={purpose}
      className="spotlight-card group relative flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 shadow-2xl sm:rounded-3xl sm:p-9"
      style={{
        ["--card-base" as string]: theme.cardBase,
        ["--card-glow" as string]: theme.cardGlow,
        boxShadow: theme.boxShadow,
        backgroundColor: theme.cardBase,
      }}
    >
      <div
        className="card-mesh pointer-events-none absolute inset-0 z-0 opacity-65 transition-opacity duration-500 group-hover:opacity-90"
        style={{ background: theme.meshBackground }}
      />
      {children}
    </article>
  );
}

function BentoFlipCard({
  brief,
  className,
  backClassName,
  theme,
  purpose,
  children,
}: {
  brief: FeatureFlipBrief;
  className: string;
  backClassName: string;
  theme: BentoTheme;
  purpose: string;
  children: ReactNode;
}) {
  return (
    <FeatureFlipShell
      brief={brief}
      className={className}
      backClassName={backClassName}
      front={
        <BentoMeshFront theme={theme} purpose={purpose}>
          {children}
        </BentoMeshFront>
      }
    />
  );
}

/** Four canvas bento cards with CSS mockups (7+5 / 5+7). */
export default function CanvasBentoFeatures() {
  return (
    <section
      aria-label="Feature Bento Showcase"
      className="grid min-w-0 grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8"
    >
      {/* Visual canvas — teal */}
      <BentoFlipCard
        brief={featureFlipBriefs["visual-canvas"]}
        className="h-full min-w-0 lg:col-span-7"
        backClassName="bg-[#042f2e] shadow-2xl"
        theme={bentoThemes.teal}
        purpose="visual-canvas-card"
      >
        <div className="relative z-10">
          <div className={`mb-6 inline-flex p-3 ${bentoThemes.teal.iconClass}`}>
            <Move className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3
            className={`mb-2 text-xl font-bold tracking-tight text-white transition-colors duration-500 sm:text-3xl ${bentoThemes.teal.titleHover}`}
          >
            Visual canvas
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Reorder and reposition layout elements. Drag handles to resize, or set padding, alignment, and color
            directly in dynamic contextual properties.
          </p>
        </div>

        <div className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-3 shadow-2xl backdrop-blur-md sm:mt-8 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs text-white/55 sm:mb-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500/80" />
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500/80" />
              <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500/80" />
              <span className="ml-1 truncate font-mono text-[10px] text-white/55 sm:ml-2 sm:text-[11px]">
                Desktop • 1440px
              </span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-md border border-teal-400/30 bg-teal-500/20 px-2.5 py-0.5 font-mono text-[11px] text-teal-200 sm:flex">
              <span>flex-col</span>
              <span>gap-3</span>
            </div>
          </div>

          <div className="relative rounded-xl border-2 border-teal-400/80 bg-gradient-to-r from-teal-950/50 via-slate-950/30 to-slate-900/40 p-3 backdrop-blur-sm sm:p-4">
            <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-sm border-2 border-teal-500 bg-white shadow-md" />
            <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-sm border-2 border-teal-500 bg-white shadow-md" />
            <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-sm border-2 border-teal-500 bg-white shadow-md" />
            <span className="absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-sm border-2 border-teal-500 bg-white shadow-md" />
            <span className="absolute -top-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded bg-teal-600 px-2 py-0.5 font-mono text-[9px] font-semibold text-white shadow-md sm:left-6 sm:text-[10px]">
              Frame (w: 100%, padding: 24px)
            </span>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 p-2.5 transition hover:border-teal-400/40">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded bg-teal-400/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                  </div>
                  <div className="h-2.5 w-16 max-w-[40%] rounded-full bg-slate-300/40 sm:w-32" />
                </div>
                <div className="h-2 w-8 shrink-0 rounded-full bg-white/20 sm:w-12" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2.5 transition hover:border-teal-400/40">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded bg-slate-400/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="h-2.5 w-24 max-w-[50%] rounded-full bg-slate-300/30 sm:w-44" />
                </div>
                <div className="h-2 w-10 shrink-0 rounded-full bg-white/20 sm:w-16" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2.5 transition hover:border-teal-400/40">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded bg-emerald-400/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  </div>
                  <div className="h-2.5 w-14 max-w-[35%] rounded-full bg-slate-300/30 sm:w-24" />
                </div>
                <div className="h-2 w-6 shrink-0 rounded-full bg-white/20 sm:w-8" />
              </div>
            </div>
          </div>
        </div>
        <p className="relative z-10 mt-4 text-[10px] font-medium tracking-wide text-white/40 uppercase sm:text-[11px]">
          Click card for details
        </p>
      </BentoFlipCard>

      {/* Elements — fuchsia */}
      <BentoFlipCard
        brief={featureFlipBriefs.elements}
        className="h-full min-w-0 lg:col-span-5"
        backClassName="bg-[#2e0533] shadow-2xl"
        theme={bentoThemes.fuchsia}
        purpose="elements-card"
      >
        <div className="relative z-10">
          <div className={`mb-6 inline-flex p-3 ${bentoThemes.fuchsia.iconClass}`}>
            <Layers className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3
            className={`mb-2 text-xl font-bold tracking-tight text-white transition-colors duration-500 sm:text-3xl ${bentoThemes.fuchsia.titleHover}`}
          >
            Elements
          </h3>
          <p className="text-sm leading-relaxed text-white/75 sm:text-base">
            Add headers, hero sections, rich text, media grids, interactive buttons, forms, and navigation rails
            seamlessly.
          </p>
        </div>

        <div className="relative z-10 mt-6 flex min-h-[160px] items-center justify-center overflow-hidden sm:mt-8 sm:min-h-[190px]">
          <div
            className="absolute h-36 w-36 animate-spin rounded-full border border-dashed border-fuchsia-400/35 sm:h-44 sm:w-44"
            style={{ animationDuration: "40s" }}
          />

          <div className="animate-float-slow absolute top-2 left-1 flex max-w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-xl border border-white/20 bg-gradient-to-r from-fuchsia-600 to-pink-700 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-lg shadow-fuchsia-500/30 sm:left-2 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs">
            <Zap className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{"<InteractiveButton />"}</span>
          </div>

          <div className="z-20 flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-fuchsia-400/40 bg-black/40 px-3 py-2.5 shadow-xl shadow-fuchsia-900/40 backdrop-blur-xl sm:gap-3 sm:px-4 sm:py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fuchsia-500/25 text-xs font-bold text-fuchsia-200">
              H1
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white">Hero Showcase</div>
              <div className="text-[10px] text-fuchsia-200/80">Composite Module</div>
            </div>
            <span className="inline-flex items-center rounded border border-fuchsia-400/30 bg-fuchsia-400/20 px-1.5 py-0.5 text-[10px] font-medium text-fuchsia-100">
              Drag + Drop
            </span>
          </div>

          <div className="animate-float-delayed absolute right-1 bottom-2 flex items-center gap-2 rounded-xl border border-white/20 bg-gradient-to-r from-fuchsia-700 to-slate-800 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-lg shadow-fuchsia-500/25 sm:right-2 sm:px-3 sm:text-xs">
            <ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />
            Media Grid
          </div>

          <div className="animate-float-fast absolute bottom-1 left-2 rounded-lg border border-white/15 bg-black/45 px-2 py-1 font-mono text-[10px] text-slate-200 shadow-md sm:left-4 sm:px-2.5 sm:py-1.5 sm:text-[11px]">
            Input::Newsletter
          </div>
        </div>
        <p className="relative z-10 mt-4 text-[10px] font-medium tracking-wide text-white/40 uppercase sm:text-[11px]">
          Click card for details
        </p>
      </BentoFlipCard>

      {/* Inline edit & drag-drop — emerald */}
      <BentoFlipCard
        brief={featureFlipBriefs["inline-editing"]}
        className="h-full min-w-0 lg:col-span-5"
        backClassName="bg-[#022c22] shadow-2xl"
        theme={bentoThemes.emerald}
        purpose="inline-editing-card"
      >
        <div className="relative z-10">
          <div className={`mb-6 inline-flex p-3 ${bentoThemes.emerald.iconClass}`}>
            <Type className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3
            className={`mb-2 text-xl font-bold tracking-tight text-white transition-colors duration-500 sm:text-3xl ${bentoThemes.emerald.titleHover}`}
          >
            Inline edit & drag-drop
          </h3>
          <p className="text-sm leading-relaxed text-white/75 sm:text-base">
            Drag blocks into place, then click to format or double-click to rewrite copy directly on the canvas.
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-3 sm:mt-8">
          {/* Drag chip */}
          <div className="animate-float-slow flex w-fit max-w-full items-center gap-2 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-100 shadow-lg shadow-emerald-900/30 sm:px-3 sm:text-xs">
            <GripVertical className="h-3.5 w-3.5 shrink-0 text-emerald-300" strokeWidth={2} />
            <span className="truncate">Drag · Hero Section</span>
            <span className="rounded border border-emerald-400/30 bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-medium text-emerald-100 sm:text-[10px]">
              Drop here
            </span>
          </div>

          {/* Format bar + selected text */}
          <div>
            <div className="relative z-30 mx-auto -mb-3 flex w-fit max-w-full flex-wrap items-center justify-center gap-0.5 rounded-xl border border-white/20 bg-black/45 px-1.5 py-1.5 text-xs shadow-2xl backdrop-blur-lg sm:gap-1 sm:px-2">
              <span className="rounded px-2 py-1 font-bold text-white transition hover:bg-white/10">B</span>
              <span className="rounded px-2 py-1 italic text-slate-300 transition hover:bg-white/10">I</span>
              <span className="rounded px-2 py-1 text-slate-300 underline transition hover:bg-white/10">U</span>
              <div className="mx-1 h-3.5 w-px bg-white/20" />
              <span className="flex items-center gap-1 rounded bg-emerald-500/25 px-2 py-1 font-semibold text-emerald-200">
                Link
              </span>
              <div className="mx-1 hidden h-3.5 w-px bg-white/20 sm:block" />
              <div className="hidden h-3.5 w-3.5 cursor-pointer rounded-full border border-white/40 bg-gradient-to-r from-emerald-400 to-teal-500 sm:block" />
            </div>

            <div className="rounded-2xl border border-dashed border-emerald-400/40 bg-black/35 p-5 pt-7 text-left shadow-inner backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="font-mono text-xs font-semibold tracking-wider text-emerald-300/90 uppercase">
                  Selected Heading
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/70 sm:text-[10px]">
                  <GripVertical className="h-3 w-3" />
                  Move
                </span>
              </div>
              <div className="text-lg font-semibold text-white">
                Launch ideas with zero friction
                <span className="blinking-cursor" />
              </div>
              <p className="mt-2 text-xs leading-normal text-white/55">
                Drop sections, then edit type, spacing, and links in place—no separate dialogs.
              </p>
            </div>
          </div>
        </div>
        <p className="relative z-10 mt-4 text-[10px] font-medium tracking-wide text-white/40 uppercase sm:text-[11px]">
          Click card for details
        </p>
      </BentoFlipCard>

      {/* Design system — sky */}
      <BentoFlipCard
        brief={featureFlipBriefs["design-system"]}
        className="h-full min-w-0 lg:col-span-7"
        backClassName="bg-[#0c4a6e] shadow-2xl"
        theme={bentoThemes.sky}
        purpose="design-system-card"
      >
        <div className="relative z-10">
          <div className={`mb-6 inline-flex p-3 ${bentoThemes.sky.iconClass}`}>
            <Palette className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3
            className={`mb-2 text-xl font-bold tracking-tight text-white transition-colors duration-500 sm:text-3xl ${bentoThemes.sky.titleHover}`}
          >
            Design system
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Apply a universal color palette and a semantic style preset so radius, elevation, typography scales, and
            state tokens stay consistent across every page.
          </p>
        </div>

        <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md sm:mt-8 sm:p-5">
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-wider text-white/50 uppercase sm:text-xs">
            <span>Global Color Tokens</span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:grid-cols-4 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm sm:gap-2.5 sm:p-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0ea5e9] text-[10px] text-white shadow-inner ring-2 ring-sky-400/40">
                ✓
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white">Sky</div>
                <div className="font-mono text-[10px] text-white/50">#0ea5e9</div>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm sm:gap-2.5 sm:p-2.5">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-[#10b981] shadow-inner ring-2 ring-emerald-400/40" />
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white">Emerald</div>
                <div className="font-mono text-[10px] text-white/50">#10b981</div>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm sm:gap-2.5 sm:p-2.5">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-[#f59e0b] shadow-inner ring-2 ring-amber-400/40" />
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white">Amber</div>
                <div className="font-mono text-[10px] text-white/50">#f59e0b</div>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm sm:gap-2.5 sm:p-2.5">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-[#f43f5e] shadow-inner ring-2 ring-rose-400/40" />
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-white">Rose</div>
                <div className="font-mono text-[10px] text-white/50">#f43f5e</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-[11px] sm:pt-1 sm:text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-slate-200 sm:px-3">
              <span className="font-serif font-bold text-white">Aa</span>{" "}
              <span className="hidden sm:inline">Inter Display (32px / 1.2)</span>
              <span className="sm:hidden">Inter 32</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-slate-200 sm:px-3">
              Radius: 16px
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-slate-200 sm:px-3">
              Shadow: Elev-3D
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-sky-400/30 bg-sky-500/20 px-2.5 py-1.5 font-mono text-[11px] text-sky-200 sm:ml-auto">
              Auto-Synced
            </span>
          </div>
        </div>
        <p className="relative z-10 mt-4 text-[10px] font-medium tracking-wide text-white/40 uppercase sm:text-[11px]">
          Click card for details
        </p>
      </BentoFlipCard>
    </section>
  );
}
