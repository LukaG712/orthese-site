import { cn } from "@/lib/cn";

function Crosshair({ className }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      <path
        d="M5.5 0V11M0 5.5H11"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * Full-bleed 1px horizontal blueprint hairline with crisp 11px '+' crosshair markers
 * aligned precisely on the left and right edges of the centered 1200px structural rail.
 */
export function BlueprintDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-px w-full bg-white/[0.06]", className)}
    >
      <div className="relative mx-auto h-px max-w-[1200px]">
        <Crosshair className="absolute -left-[5px] -top-[5px]" />
        <Crosshair className="absolute -right-[5px] -top-[5px]" />
      </div>
    </div>
  );
}
