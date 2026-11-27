import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface OrbitGradientTextProps {
  children: React.ReactNode;
  /**
   * "neutral" is the default BoardUI Dark Mode tonal accent.
   * "prismatic" / "purple" are reserved for future Orthese Pro subscription themes.
   */
  variant?: "neutral" | "prismatic" | "purple" | "silver";
  durationSec?: number;
  className?: string;
}

export function OrbitGradientText({
  children,
  variant = "neutral",
  durationSec = 4,
  className,
}: OrbitGradientTextProps) {
  if (variant === "neutral") {
    return (
      <span
        className={cn(
          "bg-gradient-to-b from-[#fafafa] via-[#d4d4d4] to-[#a3a3a3] bg-clip-text text-transparent",
          className
        )}
      >
        {children}
      </span>
    );
  }

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
