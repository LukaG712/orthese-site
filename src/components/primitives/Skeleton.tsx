"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Render a static surface without shimmer animation */
  animated?: boolean;
  /** Pill/circle shape shorthand */
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

const ROUNDED_MAP = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

export function Skeleton({
  animated = true,
  rounded = "md",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-white/[0.05]",
        animated && "skeleton-shimmer",
        ROUNDED_MAP[rounded],
        className
      )}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={cn(
            "h-3",
            idx === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "xs"
      ? "h-6 w-6"
      : size === "sm"
        ? "h-7 w-7"
        : size === "lg"
          ? "h-11 w-11"
          : "h-9 w-9";
  return <Skeleton rounded="full" className={cn(sizeClass, className)} />;
}

export function SkeletonAuthCard({ className }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      aria-label="Signing in"
      className={cn(
        "space-y-4 rounded-2xl border border-white/[0.09] bg-[#111217]/95 p-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-full" rounded="lg" />
      <Skeleton className="h-9 w-full" rounded="lg" />
      <SkeletonText lines={2} className="pt-1" />
    </div>
  );
}
