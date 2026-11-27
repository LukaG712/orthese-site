"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCellProps extends React.HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
  children: React.ReactNode;
}

/**
 * BoardUI Dark Mode rounded-2xl card with mouse-tracking monochrome radial spotlight
 * sheen (`--x` / `--y`) and subtle top-edge specular highlight.
 */
export function SpotlightCell({
  featured = false,
  className,
  children,
  ...props
}: SpotlightCellProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCoords((c) => ({ ...c, active: false }))}
      style={
        {
          "--x": `${coords.x}px`,
          "--y": `${coords.y}px`,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-200",
        featured
          ? "border-white/[0.11] bg-gradient-to-b from-[#1c1c1c] to-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_14px_38px_-14px_rgba(0,0,0,0.75)] hover:border-white/[0.2]"
          : "border-white/[0.08] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_30px_-14px_rgba(0,0,0,0.65)] hover:border-white/[0.16] hover:bg-[#1a1a1a]",
        className
      )}
      {...props}
    >
      {/* Mouse-tracking radial border spotlight sheen following rounded-2xl corners */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: coords.active ? 1 : 0,
          padding: "1px",
          background:
            "radial-gradient(360px circle at var(--x) var(--y), rgba(255,255,255,0.22), transparent 65%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Faint interior cursor sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: coords.active ? 1 : 0,
          background:
            "radial-gradient(460px circle at var(--x) var(--y), rgba(255,255,255,0.045), transparent 62%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
