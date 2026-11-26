"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const measure = (animate: boolean) => {
    const el = tabRefs.current[value];
    if (!el) return;
    setPill((prev) => ({
      left: el.offsetLeft,
      width: el.offsetWidth,
      ready: animate ? true : prev.ready,
    }));
  };

  useLayoutEffect(() => {
    measure(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options.length]);

  useEffect(() => {
    const onResize = () => measure(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn("t-tabs", className)}
    >
      <span
        aria-hidden="true"
        className="t-tabs-pill"
        style={{
          transform: `translateX(${pill.left}px)`,
          width: `${pill.width}px`,
          opacity: pill.width > 0 ? 1 : 0,
          transition: pill.ready ? undefined : "none",
        }}
      />
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(node) => {
              tabRefs.current[opt.value] = node;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap",
              selected ? "text-[#fafafa]" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "font-mono text-[10px]",
                  selected ? "text-zinc-300" : "text-zinc-500"
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
