"use client";

import { useState } from "react";
import { Skeleton } from "@/components/primitives/Skeleton";
import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg";
export type AvatarStatus = "online" | "busy" | "away" | "offline";

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  status?: AvatarStatus;
  shape?: "circle" | "rounded";
  className?: string;
}

const SIZE_CLASSES: Record<AvatarSize, { box: string; text: string; dot: string }> = {
  xs: { box: "h-6 w-6", text: "text-[10px]", dot: "h-2 w-2" },
  sm: { box: "h-7 w-7", text: "text-[11px]", dot: "h-2 w-2" },
  md: { box: "h-9 w-9", text: "text-[12.5px]", dot: "h-2.5 w-2.5" },
  lg: { box: "h-11 w-11", text: "text-[14px]", dot: "h-3 w-3" },
};

const STATUS_COLORS: Record<AvatarStatus, string> = {
  online: "bg-emerald-400",
  busy: "bg-rose-400",
  away: "bg-amber-400",
  offline: "bg-[#737373]",
};

const AVATAR_TONES = [
  "from-indigo-500/35 to-sky-500/25 text-indigo-100 border-indigo-400/30",
  "from-sky-500/35 to-cyan-500/25 text-sky-100 border-sky-400/30",
  "from-fuchsia-500/35 to-indigo-500/25 text-fuchsia-100 border-fuchsia-400/30",
  "from-emerald-500/35 to-teal-500/25 text-emerald-100 border-emerald-400/30",
];

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function pickTone(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export function Avatar({
  name,
  src,
  size = "md",
  status,
  shape = "circle",
  className,
}: AvatarProps) {
  const [imgState, setImgState] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );
  const sz = SIZE_CLASSES[size];
  const radiusClass = shape === "circle" ? "rounded-full" : "rounded-lg";
  const showImg = Boolean(src) && imgState !== "error";

  return (
    <span
      className={cn("relative inline-flex shrink-0 select-none", sz.box, className)}
      title={name}
    >
      <span
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden border bg-gradient-to-br font-medium tracking-[-0.02em]",
          radiusClass,
          showImg ? "border-white/[0.14] bg-[#262626]" : pickTone(name),
          sz.text
        )}
      >
        {showImg ? (
          <>
            {imgState === "loading" && (
              <Skeleton
                rounded={shape === "circle" ? "full" : "lg"}
                className="absolute inset-0 h-full w-full"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src ?? undefined}
              alt={name}
              onLoad={() => setImgState("loaded")}
              onError={() => setImgState("error")}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-200",
                imgState === "loaded" ? "opacity-100" : "opacity-0"
              )}
            />
          </>
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
      </span>

      {status && (
        <span
          aria-label={`Status: ${status}`}
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-[#121212]",
            sz.dot,
            STATUS_COLORS[status]
          )}
        />
      )}
    </span>
  );
}
