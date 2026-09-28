import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/Common/BrandLogo";
import { pageFrameClass } from "@/components/landing/pageFrame";

const NAV_ITEMS = ["Features", "Templates", "Resources"] as const;

export type MarketingNavItem = (typeof NAV_ITEMS)[number];

type MarketingNavProps = {
  isDark: boolean;
  setTheme: (theme: "light" | "dark") => void;
  activeItem?: MarketingNavItem | null;
};

export default function MarketingNav({
  isDark,
  setTheme,
  activeItem = null,
}: MarketingNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-[100] pt-3 sm:pt-6">
      <div className={cn(pageFrameClass, "relative")}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "pointer-events-auto flex w-full min-w-0 items-center justify-between rounded-full px-3.5 py-2.5 backdrop-blur-2xl transition-all duration-500 sm:px-6 sm:py-3",
            isDark
              ? "border border-slate-700/50 bg-slate-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "border border-slate-200/50 bg-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
          )}
        >
          <Link to="/" className="group pointer-events-auto flex min-w-0 shrink cursor-pointer items-center">
            <BrandLogo imgClassName="h-7 w-7 transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
          </Link>

          <div className="hidden items-center gap-5 text-sm font-medium lg:flex xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className={cn(
                  "relative group transition-colors",
                  isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900",
                )}
              >
                {item}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-[2px] rounded-full bg-blue-500 transition-all",
                    item === activeItem ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}
            <div className={cn("h-4 w-px", isDark ? "bg-slate-600/50" : "bg-slate-300")} />

            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn(
                "rounded-full p-2 transition-colors",
                isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-200",
              )}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <Link
              to="/login"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95",
                isDark
                  ? "bg-white text-slate-950 hover:bg-slate-100"
                  : "bg-[#0F172A] text-white hover:bg-[#1e293b]",
              )}
            >
              Login <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-0.5 lg:hidden">
            <button
              type="button"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={cn("pointer-events-auto rounded-full p-2", isDark ? "text-slate-300" : "text-slate-600")}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className={cn("pointer-events-auto p-2", isDark ? "text-white" : "text-slate-900")}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "pointer-events-auto absolute left-0 right-0 top-[calc(100%+0.75rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border p-4 backdrop-blur-3xl sm:rounded-3xl sm:p-6 lg:hidden",
                isDark
                  ? "border-slate-700 bg-slate-900/95 shadow-2xl"
                  : "border-slate-200 bg-white/95 shadow-xl",
              )}
            >
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                      isDark ? "text-slate-200 hover:bg-white/5" : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    {item}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "mt-2 rounded-2xl py-4 text-center text-lg font-bold",
                    isDark ? "bg-white text-slate-950" : "bg-slate-900 text-white",
                  )}
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
