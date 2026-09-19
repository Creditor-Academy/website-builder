import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const COMPACT_BREAKPOINT = 1024;

function useBreakpoint(maxWidth: number) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth < maxWidth : false
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
    const onChange = () => setMatches(window.innerWidth < maxWidth);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [maxWidth]);

  return matches;
}

export function useIsMobile() {
  return useBreakpoint(MOBILE_BREAKPOINT);
}

/** Phone + tablet: sidebar should overlay instead of shrinking the canvas. */
export function useIsCompact() {
  return useBreakpoint(COMPACT_BREAKPOINT);
}
