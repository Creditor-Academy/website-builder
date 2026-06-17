import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JumpToTopProps {
  className?: string;
  threshold?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function JumpToTop({ className, threshold = 400, containerRef }: JumpToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = containerRef?.current 
        ? containerRef.current.scrollTop 
        : window.scrollY;
      setIsVisible(scrollY > threshold);
    };

    const target = containerRef?.current || window;
    target.addEventListener('scroll', handleScroll as any, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll as any);
  }, [threshold, containerRef]);

  const scrollToTop = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, translateY: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-[100] group flex items-center justify-center",
            "w-12 h-12 rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100",
            "text-slate-900 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]",
            "hover:border-primary/20",
            className
          )}
          aria-label="Scroll to top"
        >
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <ChevronUp className="w-6 h-6 relative z-10 group-hover:text-primary transition-colors" />
          
          {/* Tooltip on hover */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl pointer-events-none">
            Back to top
            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
