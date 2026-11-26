"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import { Globe, Sparkles, Terminal } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/cn";

export function BentoArchitecture() {
  const [routingMode, setRoutingMode] = useState<"credits" | "cliproxy">("credits");

  return (
    <section id="architecture" className="scroll-mt-20 py-28 sm:py-32">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
          01 / ARCHITECTURE
        </span>
        <h2 className="text-metallic mt-3 text-3xl font-medium tracking-[-0.04em] leading-[1.06] sm:text-4xl">
          Why modular wins.
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#a1a1aa]">
          Every Piece connects to one Shared Context Bus, one Hybrid AI Router, and one
          extensible Rust Base Harness.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Card 1 (Wide — 7 cols): Snap & Pipe */}
        <SpotlightCard className="p-7 lg:col-span-7">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-md">
              <h3 className="text-[18px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Snap &amp; Pipe
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#a1a1aa]">
                Pipe typed <code className="font-mono text-[12px] text-[#fafafa]">orthese/spec</code>{" "}
                payloads from Prompt Box directly into Website Builder and Software Engineer.
              </p>
            </div>
            <span className="hidden font-mono text-[11px] text-[#52525b] sm:inline">
              context.send()
            </span>
          </div>

          {/* Precision Silver Circuit Schematic */}
          <div className="bg-micro-grid relative mt-8 overflow-hidden rounded-xl border border-white/[0.07] bg-[#080809] px-5 py-8">
            <svg
              className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-10 w-full -translate-y-1/2 sm:block"
              viewBox="0 0 600 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Static 1px hairline rails */}
              <line
                x1="155"
                y1="20"
                x2="245"
                y2="20"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <line
                x1="355"
                y1="20"
                x2="445"
                y2="20"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              {/* Animated monochrome silver circuit pulses */}
              <motion.line
                x1="155"
                y1="20"
                x2="245"
                y2="20"
                stroke="url(#silverBeam)"
                strokeWidth="1.5"
                strokeDasharray="24 90"
                animate={{ strokeDashoffset: [114, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              />
              <motion.line
                x1="355"
                y1="20"
                x2="445"
                y2="20"
                stroke="url(#silverBeam)"
                strokeWidth="1.5"
                strokeDasharray="24 90"
                animate={{ strokeDashoffset: [114, 0] }}
                transition={{ duration: 2.2, delay: 0.7, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="silverBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
              {[
                { name: "AI Prompt Box", mime: "orthese/spec", icon: Sparkles },
                { name: "Website Builder", mime: "html-bundle", icon: Globe },
                { name: "Software Eng.", mime: "git-diff", icon: Terminal },
              ].map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.name}
                    className="rounded-xl border border-white/[0.1] bg-[#111111] p-3.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_28px_-12px_rgba(0,0,0,0.9)]"
                  >
                    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.03] text-[#fafafa]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="mt-2.5 block text-[13px] font-medium text-[#fafafa]">
                      {node.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-[#71717a]">
                      {node.mime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </SpotlightCard>

        {/* Card 2 (5 cols): Hybrid AI Routing */}
        <SpotlightCard className="p-7 lg:col-span-5">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[18px] font-medium tracking-[-0.025em] text-[#fafafa]">
                  Hybrid AI Routing
                </h3>

                {/* Tactile Motion Toggle */}
                <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#060607] p-0.5">
                  {(
                    [
                      { id: "credits", label: "Credits" },
                      { id: "cliproxy", label: "CLIProxyAPI" },
                    ] as const
                  ).map((opt) => {
                    const active = routingMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRoutingMode(opt.id)}
                        className={cn(
                          "relative rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer",
                          active ? "text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="routing-toggle-pill"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            className="absolute inset-0 rounded-md bg-white/[0.11] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                          />
                        )}
                        <span className="relative z-10">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-1.5 text-[14px] leading-relaxed text-[#a1a1aa]">
                Use managed Orthese Credits on Cloudflare Edge, or switch to your local
                CLIProxyAPI sidecar on Desktop.
              </p>
            </div>

            {/* Animated Telemetry Readout */}
            <div className="mt-8 rounded-xl border border-white/[0.07] bg-[#080809] p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#52525b]">
                  {routingMode === "credits" ? "CLOUDFLARE EDGE PROXY" : "LOCAL OAUTH SIDECAR"}
                </span>
                <span className="font-mono text-[13px] font-medium tabular-nums text-[#fafafa]">
                  <NumberFlow value={routingMode === "credits" ? 28 : 4} />
                  <span className="ml-1 text-[11px] text-[#71717a]">ms</span>
                </span>
              </div>

              <AnimatePresence mode="wait">
                {routingMode === "credits" ? (
                  <motion.div
                    key="credits-view"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="mt-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[12px] tabular-nums">
                      <span className="text-[#a1a1aa]">Remaining balance</span>
                      <span className="text-[#fafafa]">
                        <NumberFlow value={2410} /> cr
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "78%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="h-full rounded-full bg-[#fafafa]"
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-[#52525b]">
                      <span>fast · balanced · reasoning</span>
                      <span>Zero API keys required</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cliproxy-view"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="mt-4 space-y-2.5"
                  >
                    {[
                      { acct: "Claude Code OAuth", pct: 84 },
                      { acct: "Codex CLI OAuth", pct: 62 },
                      { acct: "Gemini CLI OAuth", pct: 95 },
                    ].map((row) => (
                      <div key={row.acct} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px] tabular-nums">
                          <span className="text-[#a1a1aa]">{row.acct}</span>
                          <span className="text-[#71717a]">{row.pct}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${row.pct}%` }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                            className="h-full rounded-full bg-[#d4d4d8]"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </SpotlightCard>

        {/* Card 3 (Full 12 cols): Extensible Base Harness */}
        <SpotlightCard className="p-7 lg:col-span-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.7fr]">
            <div>
              <h3 className="text-[18px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Extensible Base Harness
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#a1a1aa]">
                Configure Skills and MCP servers once. Every Piece declaring{" "}
                <code className="font-mono text-[12px] text-[#fafafa]">orthese.base-harness</code>{" "}
                inherits them automatically.
              </p>
            </div>

            <div className="grid divide-y divide-white/[0.07] rounded-xl border border-white/[0.07] bg-[#080809] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                {
                  idx: "01",
                  title: "Base Harness",
                  desc: "Streaming loop, checkpoints, retries, and per-action credit metering.",
                },
                {
                  idx: "02",
                  title: "Skills + MCP Hub",
                  desc: "Progressively loaded SKILL.md packs and scoped stdio/HTTP MCP servers.",
                },
                {
                  idx: "03",
                  title: "Any Piece",
                  desc: "Native GPUI panels or sandboxed community Pieces via piece.json.",
                },
              ].map((layer) => (
                <div key={layer.idx} className="p-5">
                  <span className="font-mono text-[10px] text-[#52525b]">{layer.idx}</span>
                  <div className="mt-2 text-[14px] font-medium text-[#fafafa]">
                    {layer.title}
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#a1a1aa]">
                    {layer.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
