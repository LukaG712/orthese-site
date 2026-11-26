"use client";

import { useState } from "react";
import { Cpu, Globe, Layers, Radio, Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/cn";

export function BentoArchitecture() {
  const [routingMode, setRoutingMode] = useState<"credits" | "cliproxy">("credits");

  return (
    <section id="architecture" className="scroll-mt-20 py-20">
      <div className="mb-10 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          01 / Architecture
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Why modular wins over isolated tabs.
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
          Every Piece plugs into one Shared Context Bus, one Hybrid AI Router, and one
          extensible Rust Base Harness—so your tools actually talk to each other.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Card 1 (Wide): Snap & Pipe (Shared Context Bus) */}
        <div className="workstation-card workstation-card-hover overflow-hidden rounded-2xl p-6 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
              <Radio className="h-3 w-3" />
              SHARED CONTEXT BUS
            </span>
            <span className="font-mono text-[10px] text-zinc-500">orthese.context.send()</span>
          </div>

          <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
            Snap &amp; Pipe structured artifacts between Pieces
          </h3>
          <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-zinc-400">
            Draft a spec in AI Prompt Box, pipe <code className="text-zinc-200">orthese/spec</code>{" "}
            directly into Website Builder or Software Engineer, and stream diffs back without
            copy-pasting across browser tabs.
          </p>

          {/* Animated Monochrome Beam Diagram */}
          <div className="relative mt-6 rounded-xl border border-white/[0.07] bg-[#0a0a0a] p-5">
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 600 140"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 150 70 C 210 70, 220 70, 255 70"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
              />
              <path
                d="M 150 70 C 210 70, 220 70, 255 70"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.5"
                className="animate-beam"
              />
              <path
                d="M 355 70 C 400 70, 415 70, 450 70"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
              />
              <path
                d="M 355 70 C 400 70, 415 70, 450 70"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.5"
                className="animate-beam"
              />
            </svg>

            <div className="relative z-10 grid grid-cols-3 gap-3">
              {[
                { name: "AI Prompt Box", mime: "emits orthese/spec", icon: Sparkles },
                { name: "Website Builder", mime: "emits html-bundle", icon: Globe },
                { name: "Software Eng.", mime: "emits git-diff", icon: Terminal },
              ].map((node) => {
                const Icon = node.icon;
                return (
                  <div
                    key={node.name}
                    className="rounded-lg border border-white/[0.1] bg-[#121212] p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                  >
                    <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="mt-2 block text-xs font-medium text-white">
                      {node.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-zinc-500">
                      {node.mime}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: Hybrid AI Routing */}
        <div className="workstation-card workstation-card-hover flex flex-col justify-between rounded-2xl p-6 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                <Cpu className="h-3 w-3" />
                HYBRID ROUTING
              </span>
              <div className="inline-flex rounded-md border border-white/[0.1] bg-[#0a0a0a] p-0.5">
                <button
                  type="button"
                  onClick={() => setRoutingMode("credits")}
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-[10px] cursor-pointer transition-colors",
                    routingMode === "credits" ? "bg-white text-black font-semibold" : "text-zinc-400"
                  )}
                >
                  Cloud Credits
                </button>
                <button
                  type="button"
                  onClick={() => setRoutingMode("cliproxy")}
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-[10px] cursor-pointer transition-colors",
                    routingMode === "cliproxy" ? "bg-white text-black font-semibold" : "text-zinc-400"
                  )}
                >
                  CLIProxyAPI
                </button>
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold tracking-tight text-white">
              Managed Credits or local OAuth sidecar
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Start in seconds with non-expiring Orthese Credits via Cloudflare Edge—or flip to
              your local CLIProxyAPI sidecar on Desktop to reuse existing CLI subscriptions.
            </p>
          </div>

          <div className="mt-5 space-y-2.5 rounded-xl border border-white/[0.07] bg-[#0a0a0a] p-4 font-mono text-[11px]">
            {routingMode === "credits" ? (
              <>
                <div className="flex items-center justify-between text-zinc-300">
                  <span>Cloudflare Edge Proxy</span>
                  <span className="text-zinc-400">2,410 cr</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full w-[78%] rounded-full bg-white" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Tiers: fast · balanced · reasoning</span>
                  <span>tokenRevShare active</span>
                </div>
              </>
            ) : (
              <>
                {[
                  { acct: "Claude Code OAuth", pct: 84 },
                  { acct: "Codex CLI OAuth", pct: 62 },
                  { acct: "Gemini CLI OAuth", pct: 95 },
                ].map((bar) => (
                  <div key={bar.acct} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-300">
                      <span>{bar.acct}</span>
                      <span className="text-zinc-500">{bar.pct}% quota</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-zinc-200"
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Card 3 (Full Width): Built on One Core */}
        <div className="workstation-card workstation-card-hover rounded-2xl p-6 lg:col-span-12">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                <Layers className="h-3 w-3" />
                EXTENSIBLE BASE HARNESS
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
                Built on one shared runtime layer
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                Pieces declare <code className="text-zinc-200">extends: &quot;orthese.base-harness&quot;</code>{" "}
                instead of reinventing streaming, retries, Skills loading, or MCP permissions.
                Configure a Skill or MCP server once and every compatible Piece inherits it.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              {[
                {
                  step: "LAYER 01",
                  title: "Base Harness",
                  detail: "Streaming loop, token metering, checkpoints & sub-agent budgets",
                },
                {
                  step: "LAYER 02",
                  title: "Skills + MCP Hub",
                  detail: "Progressively loaded SKILL.md packs & scoped stdio/HTTP MCP servers",
                },
                {
                  step: "LAYER 03",
                  title: "Any Piece",
                  detail: "First-party GPUI views or sandboxed community Pieces via piece.json",
                },
              ].map((layer) => (
                <div
                  key={layer.step}
                  className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] p-4"
                >
                  <span className="font-mono text-[10px] text-zinc-500">{layer.step}</span>
                  <div className="mt-1.5 text-sm font-semibold text-white">{layer.title}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
                    {layer.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
