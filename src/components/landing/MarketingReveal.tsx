import { type ReactNode } from "react";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type MarketingRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & Omit<MotionProps, "children">;

/** Subtle fade / rise for even section reveals on marketing pages. */
export default function MarketingReveal({
  children,
  className,
  delay = 0,
  y = 18,
  ...rest
}: MarketingRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("min-w-0 will-change-transform", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
