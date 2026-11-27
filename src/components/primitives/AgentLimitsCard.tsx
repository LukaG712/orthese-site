"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ContextTokenSegment {
  label: string;
  tokens: number;
  color: string;
  deferred?: boolean;
}

export interface ContextMemberGroup {
  label: string;
  tokens: number;
  items: { label: string; tokens: number }[];
}

export interface PlanUsageLimit {
  label: string;
  used: number; // 0..1
  resets: string;
}

export interface AgentLimitsCardProps {
  context: {
    max: number;
    segments: ContextTokenSegment[];
    groups?: ContextMemberGroup[];
  };
  plan: string;
  planHref?: string;
  limits: PlanUsageLimit[];
  defaultExpanded?: boolean;
  className?: string;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${k >= 100 || Number.isInteger(k) ? Math.round(k) : k.toFixed(1)}k`;
  }
  return String(n);
}

export function AgentLimitsCard({
  context,
  plan,
  planHref,
  limits,
  defaultExpanded = false,
  className,
}: AgentLimitsCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const activeSegments = context.segments.filter((s) => !s.deferred);
  const deferredSegments = context.segments.filter((s) => s.deferred);
  const usedTokens = activeSegments.reduce((sum, s) => sum + s.tokens, 0);
  const freeTokens = Math.max(0, context.max - usedTokens);
  const usedPct = Math.min(100, Math.round((usedTokens / context.max) * 100));

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <div
      data-testid="agent-limits-card"
      className={cn(
        "rounded-xl border border-white/[0.09] bg-[#171717]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_18px_48px_-20px_rgba(0,0,0,0.85)] overflow-hidden",
        className
      )}
    >
      {/* Context Window Section */}
      <div className="p-4 sm:p-5">
        <button
          type="button"
          data-testid="agent-limits-expand"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="group flex w-full items-center justify-between gap-3 text-left cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#fafafa]">
            <span>Context window</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-[#737373] transition-transform duration-200 group-hover:text-[#fafafa]",
                expanded && "rotate-180 text-[#fafafa]"
              )}
            />
          </span>
          <span className="font-mono text-[12px] tabular-nums text-[#a3a3a3]">
            <span className="text-[#fafafa]">{formatTokens(usedTokens)}</span>
            <span className="mx-1 text-[#737373]">/</span>
            <span>{formatTokens(context.max)}</span>
            <span className="ml-1.5 text-[#a1a6b0]">({usedPct}%)</span>
          </span>
        </button>

        {/* Segmented Context Bar */}
        <div
          className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-white/[0.06] gap-[1.5px]"
          role="img"
          aria-label={`Context window ${usedPct}% used (${formatTokens(usedTokens)} of ${formatTokens(context.max)} tokens)`}
        >
          {activeSegments.map((seg) => {
            const widthPct = (seg.tokens / context.max) * 100;
            return (
              <div
                key={seg.label}
                title={`${seg.label}: ${formatTokens(seg.tokens)} (${widthPct.toFixed(1)}%)`}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: seg.color,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
              />
            );
          })}
        </div>

        {/* Expandable Breakdown + Deferred Buckets + Collapsible Member Lists */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              data-testid="agent-limits-breakdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3.5">
                {activeSegments.map((seg) => {
                  const pct = ((seg.tokens / context.max) * 100).toFixed(1);
                  return (
                    <div
                      key={seg.label}
                      className="flex items-center justify-between gap-2 text-[12px]"
                    >
                      <span className="flex items-center gap-2 text-[#d4d4d4] min-w-0">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: seg.color }}
                        />
                        <span className="truncate">{seg.label}</span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0 font-mono text-[11.5px] tabular-nums">
                        <span className="text-[#fafafa]">{formatTokens(seg.tokens)}</span>
                        <span className="w-11 text-right text-[#737373]">{pct}%</span>
                      </span>
                    </div>
                  );
                })}

                {deferredSegments.map((seg) => (
                  <div
                    key={seg.label}
                    className="flex items-center justify-between gap-2 text-[12px] text-[#737373]"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 shrink-0 rounded-full border border-white/20 bg-transparent" />
                      <span className="truncate">{seg.label}</span>
                    </span>
                    <span className="flex items-center gap-3 shrink-0 font-mono text-[11.5px] tabular-nums">
                      <span>{formatTokens(seg.tokens)}</span>
                      <span className="w-11 text-right">—</span>
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-2 pt-1 text-[12px]">
                  <span className="flex items-center gap-2 text-[#a3a3a3]">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white/[0.12]" />
                    <span>Free space</span>
                  </span>
                  <span className="flex items-center gap-3 shrink-0 font-mono text-[11.5px] tabular-nums">
                    <span className="text-[#d4d4d4]">{formatTokens(freeTokens)}</span>
                    <span className="w-11 text-right text-[#737373]">
                      {((freeTokens / context.max) * 100).toFixed(1)}%
                    </span>
                  </span>
                </div>
              </div>

              {/* Collapsible Member Lists (MCP tools, Memory files, Custom agents) */}
              {context.groups && context.groups.length > 0 && (
                <div className="mt-3.5 space-y-1 border-t border-white/[0.06] pt-3">
                  {context.groups.map((group) => {
                    const isOpen = !!openGroups[group.label];
                    return (
                      <div key={group.label}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.label)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-[12px] text-[#d4d4d4] hover:bg-white/[0.04] hover:text-[#fafafa] transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <ChevronRight
                              className={cn(
                                "h-3 w-3 text-[#737373] transition-transform duration-150",
                                isOpen && "rotate-90 text-[#fafafa]"
                              )}
                            />
                            <span>{group.label}</span>
                          </span>
                          <span className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                            <span className="text-[#a3a3a3]">{formatTokens(group.tokens)}</span>
                            <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-[#a1a6b0]">
                              {group.items.length}
                            </span>
                          </span>
                        </button>

                        {isOpen && (
                          <div className="ml-5 mt-1 space-y-1 border-l border-white/[0.08] pl-3 pb-1">
                            {group.items.map((member) => (
                              <div
                                key={member.label}
                                className="flex items-center justify-between gap-2 text-[11.5px]"
                              >
                                <span className="truncate font-mono text-[#a3a3a3]">
                                  {member.label}
                                </span>
                                <span className="font-mono text-[11px] tabular-nums text-[#737373]">
                                  {formatTokens(member.tokens)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Plan Usage Limits Section */}
      <div className="border-t border-white/[0.07] bg-[#171717]/80 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-[#d4d4d4]">
            Plan usage limits ·{" "}
            {planHref ? (
              <Link
                href={planHref}
                className="text-[#fafafa] underline decoration-white/25 underline-offset-2 hover:decoration-white/70 transition-colors"
              >
                {plan}
              </Link>
            ) : (
              <span className="text-[#fafafa]">{plan}</span>
            )}
          </span>
        </div>

        <div className="mt-3.5 space-y-3">
          {limits.map((lim) => {
            const pct = Math.min(100, Math.max(0, Math.round(lim.used * 100)));
            return (
              <div key={lim.label} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 text-[12px]">
                  <span className="text-[#fafafa]">{lim.label}</span>
                  <div className="flex items-baseline gap-2.5 shrink-0">
                    <span className="text-[11px] text-[#737373]">{lim.resets}</span>
                    <span className="w-8 text-right font-mono text-[11.5px] tabular-nums text-[#d4d4d4]">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "h-full rounded-full",
                      pct >= 80
                        ? "bg-amber-400"
                        : pct >= 45
                          ? "bg-[#818cf8]"
                          : "bg-[#fafafa]/80"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
