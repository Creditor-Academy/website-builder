import { useState, type KeyboardEvent, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeatureFlipBrief } from "@/components/landing/featureFlipBriefs";

type FeatureFlipShellProps = {
  brief: FeatureFlipBrief;
  front: ReactNode;
  className?: string;
  /** Extra classes for the back panel (background/border). */
  backClassName?: string;
};

export function FeatureFlipShell({
  brief,
  front,
  className,
  backClassName,
}: FeatureFlipShellProps) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((v) => !v);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? `${brief.title}: details. Activate to flip back.` : `${brief.title}. Activate to flip for details.`}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={cn(
        "feature-flip group/flip min-w-0 cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:rounded-3xl",
        className,
      )}
    >
      <div className={cn("feature-flip-inner", flipped && "is-flipped")}>
        <div className="feature-flip-face feature-flip-front min-w-0">{front}</div>
        <div
          className={cn(
            "feature-flip-face feature-flip-back flex min-h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0f172a] p-5 sm:rounded-3xl sm:p-8 md:p-9",
            backClassName,
          )}
        >
          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-sky-300/90 uppercase sm:text-xs">
              {brief.eyebrow}
            </p>
            <h3 className="mb-3 text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              {brief.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 sm:text-base">{brief.summary}</p>
            <ul className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 text-sm leading-relaxed text-slate-300/95 sm:text-[15px]">
              {brief.points.map((point) => (
                <li key={point} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            {brief.tip ? (
              <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
                <span className="font-semibold text-sky-300">Tip: </span>
                {brief.tip}
              </p>
            ) : null}
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <RotateCcw className="h-3.5 w-3.5" />
              Click to flip back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
