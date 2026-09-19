import React from 'react';
import { cn } from '@/lib/utils';
import { DashboardHeroHeader } from '@/components/dashboard/DashboardHeroHeader';

export const dashboardSearchInputClass =
  'pl-10 h-11 w-full rounded-lg bg-white border-[#c6c6cd] shadow-sm focus:ring-2 focus:ring-black/20 focus:border-black transition-all';

export const dashboardFilterPillClass = (active: boolean) =>
  cn(
    'py-1.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-500 ease-out border whitespace-nowrap shrink-0',
    active
      ? 'bg-[#131b2e] text-white border-transparent'
      : 'bg-[#f6f3f5] text-[#45464d] border-[#c6c6cd] hover:bg-[#eae7e9]'
  );

/** Header action buttons — full width stacked on mobile */
export const dashboardActionsClass =
  'flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto';

/** Search + filters toolbar below the page header */
export const dashboardToolbarClass =
  'flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center mb-6 sm:mb-8';

/** Horizontally scrollable filter pill row on small screens */
export const dashboardFilterScrollClass =
  'flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden';

/** Table wrapper — edge-to-edge horizontal scroll on mobile */
export const dashboardTableWrapClass =
  'overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0';

interface DashboardPageShellProps {
  title: string;
  description?: string;
  pageLabel?: string;
  breadcrumbSuffix?: React.ReactNode;
  basePath?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function DashboardPageShell({
  title,
  description,
  actions,
  className,
  children,
}: DashboardPageShellProps) {
  return (
    <div className={cn('w-full min-w-0 relative font-sans bg-dashboard', className)}>
      <div className="w-full min-w-0">
        <DashboardHeroHeader title={title} description={description} actions={actions} />
        {children}
      </div>
    </div>
  );
}
