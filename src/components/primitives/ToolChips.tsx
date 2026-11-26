import { CheckCircle2, Cpu, Radio } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ToolChipItem {
  label: string;
  kind: "bus" | "ai" | "done";
}

interface ToolChipsProps {
  items: ToolChipItem[];
  className?: string;
}

export function ToolChips({ items, className }: ToolChipsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((item, idx) => (
        <span
          key={`${item.label}-${idx}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-zinc-300"
        >
          {item.kind === "bus" && <Radio className="h-3 w-3 text-zinc-400" />}
          {item.kind === "ai" && <Cpu className="h-3 w-3 text-zinc-400" />}
          {item.kind === "done" && <CheckCircle2 className="h-3 w-3 text-zinc-200" />}
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}
