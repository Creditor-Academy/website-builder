import React from 'react';

import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';



export const dashboardSearchInputClass =

  'pl-10 h-11 w-full rounded-lg bg-white border-[#c6c6cd] shadow-sm focus:ring-2 focus:ring-black/20 focus:border-black transition-all';



export const dashboardFilterPillClass = (active: boolean) =>

  cn(

    'py-1.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-colors border whitespace-nowrap shrink-0',

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

  pageLabel,

  breadcrumbSuffix,

  basePath = '/dashboard',

  actions,

  className,

  children,

}: DashboardPageShellProps) {

  const label = pageLabel ?? title;



  return (

    <div className={cn('bg-[#fcf8fa] text-[#1b1b1d] w-full min-h-full relative font-sans', className)}>

      <div className="w-full min-w-0 overflow-x-hidden">

        <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-[#45464d] truncate">

          <Link to={basePath} className="hover:underline">

            Dashboard

          </Link>

          {' / '}

          <span className="font-semibold text-[#1b1b1d]">

            {breadcrumbSuffix ?? label}

          </span>

        </div>



        <div className="mb-6 sm:mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">

          <div className="min-w-0">

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#000000] mb-1 sm:mb-2 break-words">

              {title}

            </h2>

            {description && (

              <p className="text-sm sm:text-base text-[#45464d] max-w-2xl leading-relaxed">{description}</p>

            )}

          </div>

          {actions && (

            <div className={dashboardActionsClass}>{actions}</div>

          )}

        </div>



        {children}

      </div>

    </div>

  );

}

