import React from 'react';
import { Plus } from 'lucide-react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactElement;
}

/** Outline primary action button — matches admin palette (#0F172A). */
const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, icon, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 h-11
          rounded-full bg-white text-[#0F172A] text-sm font-semibold
          border border-[#E8E8E8] hover:bg-[#F4F4F5]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]/20
          transition-colors duration-200 disabled:opacity-60 ${className || ''}`}
        {...props}
      >
        {icon || <Plus className="w-4 h-4 text-[#0F172A]" />}
        {children}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;
