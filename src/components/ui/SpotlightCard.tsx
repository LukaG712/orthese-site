"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
  children: React.ReactNode;
}

export function SpotlightCard({
  featured = false,
  className,
  children,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        featured ? "obsidian-card-featured" : "obsidian-card",
        className
      )}
      {...props}
    >
      {/* Mouse-tracking monochrome border spotlight sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.22), transparent 65%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />
      {/* Subtle interior radial surface illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.035), transparent 60%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
