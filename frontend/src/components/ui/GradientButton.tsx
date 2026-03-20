import React from 'react';
import { Sparkles } from 'lucide-react'; // Example icon, can be swapped

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactElement;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, icon, className, ...props }) => {
  return (
    <div
      className={`relative rounded-full p-[1.5px] group overflow-hidden animate-gradient-shift
        hover:scale-[1.02] transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2 focus-within:ring-offset-background`}
      style={{
        background: 'linear-gradient(to right, #84F14A, #FFD700, #4A84F1, #B24AF1, #84F14A)',
        backgroundSize: '200% auto',
      }}
    >
      <button
        className={`relative z-10 flex items-center justify-center gap-2 px-5 py-2.5
          rounded-full bg-white text-slate-800 text-sm font-semibold
          focus:outline-none focus:ring-0
          group-hover:bg-slate-50 transition-colors duration-200 ${className}`}
        {...props}
      >
        {icon || <Sparkles className="w-4 h-4 text-slate-600" />}
        {children}
      </button>
    </div>
  );
};

export default GradientButton;
