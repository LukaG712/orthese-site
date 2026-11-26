import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface OrbitGradientTextProps {
  children: React.ReactNode;
  variant?: "prismatic" | "purple" | "silver";
  durationSec?: number;
  className?: string;
}

/**
 * Animated display text where layered radial colour washes orbit smoothly
 * around the glyphs on a continuous loop, with prefers-reduced-motion support.
 */
export function OrbitGradientText({
  children,
  variant = "prismatic",
  durationSec = 4,
  className,
}: OrbitGradientTextProps) {
  return (
    <span
      style={{ "--orbit-dur": `${durationSec}s` } as CSSProperties}
      className={cn(
        "orbit-gradient-text",
        variant === "purple" && "orbit-gradient-text--purple",
        variant === "silver" && "orbit-gradient-text--silver",
        className
      )}
    >
      {children}
    </span>
  );
}
