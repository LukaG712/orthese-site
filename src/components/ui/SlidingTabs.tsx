"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SlidingTabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function SlidingTabs<T extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel = "Tabs",
}: SlidingTabsProps<T>) {
  const layoutGroup = useId();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5",
        className
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative inline-flex h-7 items-center gap-1.5 rounded-[6px] px-3 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
              selected ? "text-[#fafafa]" : "text-[#a1a1aa] hover:text-[#fafafa]"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`sliding-pill-${layoutGroup}`}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-[6px] border border-white/[0.1] bg-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "relative z-10 font-mono text-[10px] tabular-nums",
                  selected ? "text-[#d4d4d8]" : "text-[#52525b]"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
