import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { motionTransition } from '@/lib/motion';

/** Equal inset used by the page-name bar and the dashboard sidebar. */
export const dashboardPanelInsetClass = 'p-5 sm:p-6';

export const dashboardPageTitleClass =
  'text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-3xl';

export const dashboardHeroPrimaryClass =
  'h-10 w-full rounded-full bg-white px-4 text-xs font-semibold text-[#0F172A] shadow-none hover:scale-100 hover:bg-[#131924] hover:text-white active:scale-100 transition-all duration-500 ease-out md:h-11 md:w-auto md:px-5 md:text-sm';

export const dashboardHeroSecondaryClass =
  'h-10 w-full min-w-0 rounded-full border border-white/15 bg-white/5 px-3 text-xs font-semibold text-slate-200 shadow-none hover:scale-100 hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-100 transition-all duration-500 ease-out md:h-11 md:w-auto md:px-5 md:text-sm';

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={motionTransition}
      className={cn(
        'relative mb-6 shrink-0 overflow-hidden rounded-3xl bg-[#131924] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)]',
        dashboardPanelInsetClass,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-y-[-45%] right-[-12%] w-[72%] origin-bottom-right skew-x-[-150deg] bg-[#202838]/70" />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
        <div className="min-w-0">
          <h2 className={dashboardPageTitleClass}>
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
    </motion.div>
  );
}
