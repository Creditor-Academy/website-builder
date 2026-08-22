import React from 'react';
import { cn } from '@/lib/utils';

export const dashboardHeroPrimaryClass =
  'h-10 w-full rounded-full bg-white px-4 text-xs font-semibold text-[#0F172A] shadow-none hover:scale-100 hover:bg-slate-100 hover:text-[#0F172A] active:scale-100 md:h-11 md:w-auto md:px-5 md:text-sm';

export const dashboardHeroSecondaryClass =
  'h-10 w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold text-slate-200 shadow-none hover:scale-100 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-100 md:h-11 md:w-auto md:px-5 md:text-sm';

interface DashboardHeroHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardHeroHeader({
  title,
  description,
  actions,
  className,
}: DashboardHeroHeaderProps) {
  return (
    <div
      className={cn(
        'relative mb-6 overflow-hidden rounded-2xl bg-[#0F172A] px-4 py-5  sm:px-7',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,163,184,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-bottom-right skew-x-[-12deg] bg-gradient-to-l from-white/[0.07] to-transparent" />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center md:w-auto md:justify-end md:gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
