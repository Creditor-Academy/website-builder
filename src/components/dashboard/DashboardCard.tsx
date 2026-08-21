import React from 'react';

import { cn } from '@/lib/utils';



/* ── Shared class tokens ─────────────────────────────────────────────────── */



export const dashboardCardClass =

  'group relative bg-[#fcf8fa] border border-[#c6c6cd] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col';



export const dashboardCardInteractiveClass = cn(dashboardCardClass, 'cursor-pointer');



export const dashboardCardMediaClass =

  'relative h-48 sm:h-56 md:h-64 w-full bg-[#eae7e9] overflow-hidden border-b border-[#c6c6cd]';



export const dashboardCardMediaAspectClass =

  'relative aspect-[16/10] w-full bg-[#eae7e9] overflow-hidden border-b border-[#c6c6cd]';



export const dashboardCardBodyClass = 'p-4 sm:p-6 flex-1 flex flex-col min-w-0';



export const dashboardCardTitleClass =

  'text-lg sm:text-xl md:text-[22px] font-semibold text-[#000000] leading-snug tracking-tight break-words';



export const dashboardCardDescriptionClass =

  'text-[13px] sm:text-[14px] text-[#45464d] leading-normal';



export const dashboardCardFooterClass =

  'flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between mt-auto pt-2 gap-2 sm:gap-3';



export const dashboardCardPrimaryBtnClass =

  'bg-[#000000] text-white text-[13px] sm:text-[14px] font-medium py-2 px-3 sm:px-4 rounded hover:bg-[#000000]/90 transition-colors shadow-sm w-full sm:w-auto text-center';



export const dashboardCardSecondaryBtnClass =

  'text-[13px] sm:text-[14px] font-medium text-[#000000] hover:text-[#000000]/70 transition-colors w-full sm:w-auto text-center';



export const dashboardCardBadgeClass =

  'bg-[#fcf8fa]/90 backdrop-blur-sm px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-[12px] font-semibold text-[#1b1b1d] border border-[#c6c6cd]';



export const dashboardCardOverlayClass =

  'absolute inset-0 flex flex-col sm:flex-row items-center justify-center gap-2 z-20 bg-black/20 backdrop-blur-[2px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 p-3 sm:p-0';



export const dashboardCardHoverTintClass =

  'absolute inset-0 bg-black/0 sm:group-hover:bg-black/10 transition-colors duration-300 pointer-events-none';



export const dashboardCardDashedClass =

  'group relative bg-[#f6f3f5] border border-dashed border-[#c6c6cd] rounded-lg overflow-hidden hover:border-[#000000] transition-all duration-300 flex flex-col justify-center items-center p-6 sm:p-10 cursor-pointer min-h-[200px] sm:min-h-0';



export const dashboardStatCardClass =

  'bg-[#fcf8fa] border border-[#c6c6cd] rounded-lg p-4 sm:p-5 min-w-0';



export const dashboardListCardClass =

  'border rounded-lg p-4 sm:p-6 bg-[#fcf8fa] border-[#c6c6cd] cursor-pointer transition-all hover:shadow-lg min-w-0';



export const dashboardPanelClass =

  'bg-[#fcf8fa] border border-[#c6c6cd] rounded-lg overflow-hidden min-w-0';



export const dashboardCardActionPrimaryClass =

  'bg-[#131b2e] text-white font-semibold rounded-lg px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm shadow-lg hover:bg-[#252f4a] transition-all w-full sm:w-auto';



export const dashboardCardActionSecondaryClass =

  'bg-white text-[#1b1b1d] font-semibold rounded-lg px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm shadow-lg border border-[#c6c6cd] hover:bg-[#eae7e9] transition-all w-full sm:w-auto';



export const dashboardCardActionDangerClass =

  'bg-[#ba1a1a] text-white font-semibold rounded-lg px-3 h-9 sm:h-10 text-xs sm:text-sm shadow-lg hover:bg-[#93000a] transition-all w-full sm:w-auto';



export const dashboardCardTagClass =

  'text-[10px] font-semibold bg-[#dedfeb] text-[#191b24] px-2 py-0.5 rounded';



/* ── Compound components ─────────────────────────────────────────────────── */



type DivProps = React.ComponentProps<'div'>;

type ButtonProps = React.ComponentProps<'button'>;



export function DashboardCard({ className, interactive, ...props }: DivProps & { interactive?: boolean }) {

  return (

    <div

      className={cn(interactive ? dashboardCardInteractiveClass : dashboardCardClass, className)}

      {...props}

    />

  );

}



export function DashboardCardMedia({ className, aspect, ...props }: DivProps & { aspect?: boolean }) {

  return (

    <div

      className={cn(aspect ? dashboardCardMediaAspectClass : dashboardCardMediaClass, className)}

      {...props}

    />

  );

}



export function DashboardCardBody({ className, ...props }: DivProps) {

  return <div className={cn(dashboardCardBodyClass, className)} {...props} />;

}



export function DashboardCardTitle({ className, ...props }: React.ComponentProps<'h3'>) {

  return <h3 className={cn(dashboardCardTitleClass, className)} {...props} />;

}



export function DashboardCardDescription({ className, ...props }: React.ComponentProps<'p'>) {

  return <p className={cn(dashboardCardDescriptionClass, 'flex-1 mb-4 sm:mb-6', className)} {...props} />;

}



export function DashboardCardFooter({ className, ...props }: DivProps) {

  return <div className={cn(dashboardCardFooterClass, className)} {...props} />;

}



export function DashboardCardBadge({

  className,

  position = 'top-right',

  ...props

}: DivProps & { position?: 'top-right' | 'top-left' }) {

  return (

    <div

      className={cn(

        dashboardCardBadgeClass,

        'absolute z-10',

        position === 'top-right' ? 'top-2 right-2 sm:top-4 sm:right-4' : 'top-2 left-2 sm:top-4 sm:left-4',

        className

      )}

      {...props}

    />

  );

}



export function DashboardCardOverlay({ className, ...props }: DivProps) {

  return <div className={cn(dashboardCardOverlayClass, className)} {...props} />;

}



export function DashboardCardHoverTint({ className, ...props }: DivProps) {

  return <div className={cn(dashboardCardHoverTintClass, className)} {...props} />;

}



export function DashboardCardPrimaryAction({ className, ...props }: ButtonProps) {

  return <button type="button" className={cn(dashboardCardPrimaryBtnClass, className)} {...props} />;

}



export function DashboardCardSecondaryAction({ className, ...props }: ButtonProps) {

  return <button type="button" className={cn(dashboardCardSecondaryBtnClass, className)} {...props} />;

}



export function DashboardCardDashed({ className, ...props }: DivProps) {

  return <div className={cn(dashboardCardDashedClass, className)} {...props} />;

}



export function DashboardStatCard({ className, ...props }: DivProps) {

  return <div className={cn(dashboardStatCardClass, className)} {...props} />;

}



export function DashboardListCard({ className, ...props }: DivProps) {

  return <div className={cn(dashboardListCardClass, className)} {...props} />;

}



export function DashboardPanel({ className, ...props }: DivProps) {

  return <div className={cn(dashboardPanelClass, className)} {...props} />;

}

