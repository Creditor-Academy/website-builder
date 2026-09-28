import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/Common/BrandLogo";
import { pageFrameClass } from "@/components/landing/pageFrame";

const exploreLinks = [
  { label: "Features", to: "/features" },
  { label: "Templates", to: "/templates" },
  { label: "Resources", to: "/resources" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
];

export default function Footer({ isDark = true }: { isDark?: boolean }) {
  return (
    <footer
      className={cn(
        "border-t transition-colors duration-1000",
        isDark
          ? "border-white/10 bg-[#0F172A] text-white"
          : "border-[#E5E7EB] bg-[#F8FAFC] text-[#0F172A]",
      )}
    >
      <div className={cn(pageFrameClass, "py-10 sm:py-16")}>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-5 sm:col-span-2 lg:col-span-5 min-w-0">
            <BrandLogo
              className={cn("min-w-0", isDark ? "text-white" : "text-[#0F172A]")}
              imgClassName="h-9 w-9 sm:h-11 sm:w-11"
            />
            <p
              className={cn(
                "max-w-md text-sm leading-relaxed sm:text-[15px]",
                isDark ? "text-slate-400" : "text-[#747781]",
              )}
            >
              Build modern, responsive websites with powerful tools, flexible layouts, and complete
              creative control — no coding required.
            </p>
          </div>

          {/* Explore */}
          <div className="min-w-0 lg:col-span-3 lg:col-start-7">
            <h4
              className={cn(
                "mb-3 text-xs font-bold tracking-[0.14em] uppercase sm:mb-4",
                isDark ? "text-slate-300" : "text-[#0F172A]",
              )}
            >
              Explore
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-[#747781] hover:text-[#0F172A]",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="min-w-0 lg:col-span-3">
            <h4
              className={cn(
                "mb-3 text-xs font-bold tracking-[0.14em] uppercase sm:mb-4",
                isDark ? "text-slate-300" : "text-[#0F172A]",
              )}
            >
              Legal
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-[#747781] hover:text-[#0F172A]",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={cn(
            "mt-8 flex flex-col items-start justify-between gap-2 border-t pt-5 text-xs font-medium sm:mt-12 sm:flex-row sm:items-center sm:gap-4 sm:pt-6",
            isDark ? "border-white/10 text-slate-500" : "border-[#E5E7EB] text-[#747781]",
          )}
        >
          <p className="min-w-0">© {new Date().getFullYear()} Web Studio. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-1.5">
            Powered by{" "}
            <a
              href="https://lmsathena.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-semibold transition-colors",
                isDark ? "text-white hover:text-slate-200" : "text-[#0F172A] hover:text-[#1E293B]",
              )}
            >
              Athena LMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
