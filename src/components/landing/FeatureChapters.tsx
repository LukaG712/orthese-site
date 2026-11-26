"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Check,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  Globe,
  Minus,
  Sparkles,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { cn } from "@/lib/cn";

function ChapterHeader({
  titleLine1,
  titleLine2,
  description,
  href,
}: {
  titleLine1: string;
  titleLine2: string;
  description: string;
  href: string;
}) {
  return (
    <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
      <div className="md:col-span-5">
        <h2 className="text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#f7f8f8] md:text-[38px]">
          {titleLine1}
          <br />
          <OrbitGradientText>{titleLine2}</OrbitGradientText>
        </h2>
      </div>
      <div className="md:col-span-7 md:pl-8">
        <p className="max-w-lg text-[15px] leading-relaxed text-[#8a8f98]">
          {description}
        </p>
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-medium text-[#f7f8f8] hover:opacity-80 transition-opacity"
        >
          <span>Learn more</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#8a8f98]" />
        </Link>
      </div>
    </div>
  );
}

function SubColumns({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
      {items.map((item) => (
        <div key={item.title}>
          <h3 className="text-[14px] font-medium text-[#f7f8f8]">{item.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#8a8f98]">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

const HARNESS_FILES = {
  "piece.json": {
    path: "crates/pieces/website-builder/piece.json",
    code: `{
  "id": "orthese.website-builder",
  "version": "0.1.0",
  "extends": "orthese.base-harness",
  "defaultTier": "balanced",
  "permissions": {
    "standard": ["ai:generate", "context:send", "context:receive"],
    "elevated": []
  },
  "context": {
    "accepts": ["orthese/spec", "text/markdown"],
    "emits": ["orthese/html-bundle"]
  },
  "monetization": {
    "purchaseType": "free",
    "priceUsd": 0,
    "tokenRevShare": false
  }
}`,
  },
  "lib.rs": {
    path: "crates/pieces/website-builder/src/lib.rs",
    code: `use orthese_sdk::{ModelTier, PieceManifest};

pub fn manifest() -> PieceManifest {
    PieceManifest {
        id: "orthese.website-builder".into(),
        extends: Some("orthese.base-harness".into()),
        default_tier: Some(ModelTier::Balanced),
        // Zero elevated permissions -> instant wasm32
        ..Default::default()
    }
}`,
  },
  "SKILL.md": {
    path: "skills/landing-page-architect/SKILL.md",
    code: `---
name: landing-page-architect
description: Calm pitch-obsidian layouts with mask-faded UI stages.
---

# Design Rules
- Canvas #08090A, primary ink #F7F8F8, muted #8A8F98
- Dissolve lower UI stage edges organically with CSS mask-image
- Reserve monospace for credits, latencies, and piece.json`,
  },
} as const;

type HarnessFileKey = keyof typeof HARNESS_FILES;

const CAPABILITY_ROWS = [
  { label: "Dashboard Canvas & @orthese/ui", wasm: "Full (wasm32)", desktop: "Native 120fps" },
  { label: "Standard Pieces (Prompt Box, Builder)", wasm: "Zero-install", desktop: "Full support" },
  { label: "Managed Credits & Remote MCP", wasm: "Full support", desktop: "Full support" },
  { label: "Elevated Pieces (fs:read/write, shell:exec)", wasm: "Sandbox preview", desktop: "Local repos" },
  { label: "Local stdio MCPs & CLIProxyAPI", wasm: null, desktop: "Native lifecycle" },
];

export function FeatureChapters() {
  const [routingMode, setRoutingMode] = useState<"credits" | "cliproxy">("credits");
  const [selectedFile, setSelectedFile] = useState<HarnessFileKey>("piece.json");
  const [busPacketCount, setBusPacketCount] = useState(14);

  return (
    <div className="mx-auto max-w-[1080px] space-y-36 px-5 py-16 sm:px-6 sm:space-y-44">
      {/* CHAPTER 1: Shared Context Bus */}
      <section id="shared-context" className="scroll-mt-20">
        <ChapterHeader
          titleLine1="Shared"
          titleLine2="Context Bus"
          description="Draft specs in AI Prompt Box and pipe structured artifacts straight into Website Builder and Software Engineer without ever copying across tabs."
          href="/marketplace"
        />

        {/* Faded Dark UI Stage */}
        <div className="mask-fade-bottom-soft stage-surface relative mt-12 overflow-hidden rounded-xl p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2.5 text-[12px] text-[#8a8f98]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono">bus://workspace.default</span>
              <span className="text-[#5e626a]">·</span>
              <span className="font-mono tabular-nums text-[#f7f8f8]">
                <NumberFlow value={busPacketCount} /> payloads routed
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setBusPacketCount((c) => c + 1);
                toast.success("Emitted orthese/spec on Shared Context Bus", {
                  description: "Delivered to Website Builder & Software Engineer in 11ms.",
                });
              }}
              className="btn-pill-dark inline-flex h-7 items-center rounded-full px-3 text-[11.5px] font-medium cursor-pointer"
            >
              Emit test payload →
            </button>
          </div>

          <div className="relative py-12">
            {/* Subtle 1px Silver Animated Bus Beam */}
            <svg
              className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-10 w-full -translate-y-1/2 md:block"
              viewBox="0 0 900 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line x1="250" y1="20" x2="345" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="555" y1="20" x2="650" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <motion.line
                x1="250"
                y1="20"
                x2="345"
                y2="20"
                stroke="url(#linearBusBeam)"
                strokeWidth="1.5"
                strokeDasharray="28 96"
                animate={{ strokeDashoffset: [124, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              />
              <motion.line
                x1="555"
                y1="20"
                x2="650"
                y2="20"
                stroke="url(#linearBusBeam)"
                strokeWidth="1.5"
                strokeDasharray="28 96"
                animate={{ strokeDashoffset: [124, 0] }}
                transition={{ duration: 2.2, delay: 0.75, repeat: Infinity, ease: "linear" }}
              />
              <defs>
                <linearGradient id="linearBusBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="50%" stopColor="rgba(247,248,248,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative z-10 grid gap-6 md:grid-cols-3 md:gap-10">
              {[
                {
                  name: "AI Prompt Box",
                  role: "Emits orthese/spec",
                  snippet: '"Kestrel telemetry hero with p99 span metrics"',
                  icon: Sparkles,
                },
                {
                  name: "Website Builder",
                  role: "Accepts orthese/spec",
                  snippet: "Renders live preview · emits orthese/html-bundle",
                  icon: Globe,
                },
                {
                  name: "Software Engineer",
                  role: "Accepts orthese/spec",
                  snippet: "Applies repo diff · emits orthese/git-diff",
                  icon: Terminal,
                },
              ].map((pane) => {
                const Icon = pane.icon;
                return (
                  <div
                    key={pane.name}
                    className="rounded-lg border border-white/[0.08] bg-[#0c0d0f] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  >
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#f7f8f8]">
                      <Icon className="h-3.5 w-3.5 text-[#8a8f98]" />
                      <span>{pane.name}</span>
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] text-[#5e626a]">{pane.role}</div>
                    <p className="mt-4 text-[12.5px] leading-relaxed text-[#8a8f98]">
                      {pane.snippet}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <SubColumns
          items={[
            {
              title: "Typed Payloads",
              body: "Pieces declare explicit MIME contracts like orthese/spec and orthese/git-diff in piece.json.",
            },
            {
              title: "Starter Packs",
              body: "Launch pre-wired multi-Piece layouts like Web Designer or Indie Builder in one click.",
            },
            {
              title: "Zero Copy-Paste",
              body: "Outputs stream directly across panes so prompting, design, and code stay synchronized.",
            },
          ]}
        />
      </section>

      {/* CHAPTER 2: Hybrid AI routing */}
      <section id="hybrid-routing" className="scroll-mt-20">
        <ChapterHeader
          titleLine1="Hybrid AI"
          titleLine2="routing"
          description="Start immediately with managed Cloudflare Edge credits—or flip to your local CLIProxyAPI sidecar on Desktop to reuse existing CLI OAuth subscriptions."
          href="/#pricing"
        />

        <div className="mask-fade-bottom-soft stage-surface mt-12 overflow-hidden rounded-xl p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#f7f8f8]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {routingMode === "credits"
                    ? "Orthese Credits · Cloudflare Edge"
                    : "Local CLIProxyAPI Sidecar"}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-[#8a8f98]">
                {routingMode === "credits"
                  ? "Official provider APIs metered cleanly across every Piece."
                  : "Runs locally on Desktop with live OAuth quota monitoring."}
              </p>
            </div>

            {/* Working Segmented Toggle */}
            <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#08090a] p-0.5">
              {(
                [
                  { id: "credits", label: "Orthese Credits · Cloudflare Edge" },
                  { id: "cliproxy", label: "Local CLIProxyAPI Sidecar" },
                ] as const
              ).map((opt) => {
                const active = routingMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    data-testid={`routing-${opt.id}`}
                    onClick={() => setRoutingMode(opt.id)}
                    className={cn(
                      "relative rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer",
                      active ? "text-[#f7f8f8]" : "text-[#8a8f98] hover:text-[#f7f8f8]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="chapter-routing-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-[6px] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.4fr] pb-8">
            <div className="space-y-6">
              <div>
                <span className="block font-mono text-[11px] text-[#5e626a]">EDGE LATENCY</span>
                <div className="mt-1 font-mono text-4xl font-medium tracking-[-0.04em] tabular-nums text-[#f7f8f8]">
                  <NumberFlow value={routingMode === "credits" ? 28 : 4} />
                  <span className="ml-1.5 text-lg text-[#8a8f98]">ms</span>
                </div>
              </div>

              <div>
                <span className="block font-mono text-[11px] text-[#5e626a]">
                  {routingMode === "credits" ? "ACTIVE BALANCE" : "LOCAL COST"}
                </span>
                <div className="mt-1 font-mono text-2xl font-medium tracking-[-0.03em] tabular-nums text-[#f7f8f8]">
                  {routingMode === "credits" ? (
                    <>
                      <NumberFlow value={2410} />
                      <span className="ml-1.5 text-sm text-[#8a8f98]">cr</span>
                    </>
                  ) : (
                    <span>Local OAuth · €0</span>
                  )}
                </div>
              </div>
            </div>

            <motion.div
              key={routingMode}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {(routingMode === "credits"
                ? [
                    { label: "Fast tier · Lightweight edits", meta: "~1 cr / call", pct: 92 },
                    { label: "Balanced tier · Website Builder & chat", meta: "~3 cr / call", pct: 76 },
                    { label: "Reasoning tier · Software Engineer", meta: "~7 cr / call", pct: 58 },
                  ]
                : [
                    { label: "Claude Code OAuth", meta: "84% quota", pct: 84 },
                    { label: "Codex CLI OAuth", meta: "62% quota", pct: 62 },
                    { label: "Gemini CLI OAuth", meta: "95% quota", pct: 95 },
                  ]
              ).map((bar) => (
                <div key={bar.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-[#f7f8f8]">{bar.label}</span>
                    <span className="font-mono text-[11px] tabular-nums text-[#8a8f98]">
                      {bar.meta}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.pct}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-[#f7f8f8]/80"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <SubColumns
          items={[
            {
              title: "Model-Weighted Credits",
              body: "Abstract fast, balanced, and reasoning tiers keep Marketplace Pieces resilient as models evolve.",
            },
            {
              title: "Local OAuth Sidecar",
              body: "Desktop manages CLIProxyAPI locally with multi-account load balancing and live quota bars.",
            },
            {
              title: "Zero API Key Setup",
              body: "Try everything immediately in the browser with €2 starter credits—no external billing portals.",
            },
          ]}
        />
      </section>

      {/* CHAPTER 3: Extensible Base Harness */}
      <section id="base-harness" className="scroll-mt-20">
        <ChapterHeader
          titleLine1="Extensible"
          titleLine2="Base Harness"
          description="Every Piece inherits streaming, checkpoints, Skills loading, and MCP permissions from one shared runtime layer—declared transparently in piece.json."
          href="/marketplace/orthese.website-builder"
        />

        <div className="mask-fade-bottom-soft stage-surface mt-12 overflow-hidden rounded-xl">
          <div className="grid md:grid-cols-[260px_1fr]">
            {/* Left File Tree */}
            <div className="border-b border-white/[0.06] bg-[#0b0c0e] p-5 font-mono text-[12px] md:border-b-0 md:border-r">
              <div className="mb-3 text-[10px] uppercase tracking-[0.12em] text-[#5e626a]">
                Workspace Bundle
              </div>

              <div className="flex items-center gap-2 py-1 text-[#8a8f98]">
                <FolderOpen className="h-3.5 w-3.5 text-[#5e626a]" />
                <span>crates/pieces/website-builder/</span>
              </div>

              {(["piece.json", "lib.rs"] as const).map((file) => {
                const active = selectedFile === file;
                return (
                  <button
                    key={file}
                    type="button"
                    data-testid={`tree-${file}`}
                    onClick={() => setSelectedFile(file)}
                    className={cn(
                      "ml-4 mt-0.5 flex w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors cursor-pointer",
                      active
                        ? "bg-white/[0.08] text-[#f7f8f8]"
                        : "text-[#8a8f98] hover:bg-white/[0.03] hover:text-[#f7f8f8]"
                    )}
                  >
                    <FileCode2 className="h-3.5 w-3.5 text-[#5e626a]" />
                    <span>{file === "lib.rs" ? "src/lib.rs" : file}</span>
                  </button>
                );
              })}

              <div className="mt-3 flex items-center gap-2 py-1 text-[#8a8f98]">
                <Folder className="h-3.5 w-3.5 text-[#5e626a]" />
                <span>skills/landing-page-architect/</span>
              </div>

              <button
                type="button"
                data-testid="tree-SKILL.md"
                onClick={() => setSelectedFile("SKILL.md")}
                className={cn(
                  "ml-4 mt-0.5 flex w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors cursor-pointer",
                  selectedFile === "SKILL.md"
                    ? "bg-white/[0.08] text-[#f7f8f8]"
                    : "text-[#8a8f98] hover:bg-white/[0.03] hover:text-[#f7f8f8]"
                )}
              >
                <FileCode2 className="h-3.5 w-3.5 text-[#5e626a]" />
                <span>SKILL.md</span>
              </button>
            </div>

            {/* Right Manifest / Code Viewer */}
            <div className="bg-[#090a0c] p-6 pb-12">
              <div className="mb-3 font-mono text-[11px] text-[#5e626a]">
                {HARNESS_FILES[selectedFile].path}
              </div>
              <motion.pre
                key={selectedFile}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-x-auto font-mono text-[12px] leading-[1.7] text-[#d4d6dc]"
              >
                {HARNESS_FILES[selectedFile].code}
              </motion.pre>
            </div>
          </div>
        </div>

        <SubColumns
          items={[
            {
              title: "Progressive SKILL.md",
              body: "Skills stay indexed as lightweight metadata and load full instructions only when relevant.",
            },
            {
              title: "Scoped MCP Hub",
              body: "Configure local stdio or remote Streamable HTTP MCP servers once with per-Piece allowlists.",
            },
            {
              title: "Tiered Permissions",
              body: "Standard permissions run seamlessly in WASM; elevated fs and shell calls prompt on Desktop.",
            },
          ]}
        />
      </section>

      {/* CHAPTER 4: WebAssembly to native Desktop */}
      <section id="dual-target" className="scroll-mt-20">
        <ChapterHeader
          titleLine1="WebAssembly to"
          titleLine2="native Desktop"
          description="Evaluate any standard Piece inside zero-install WebAssembly—then step up to the native 120fps Rust desktop app for local repos, shell guardrails, and stdio MCPs."
          href="/marketplace/orthese.software-engineer"
        />

        <div className="mask-fade-bottom-soft stage-surface mt-12 overflow-hidden rounded-xl">
          <div className="grid md:grid-cols-[1.15fr_1fr]">
            {/* Left Capability Matrix */}
            <div className="border-b border-white/[0.06] p-6 pb-10 md:border-b-0 md:border-r">
              <div className="grid grid-cols-[1.5fr_0.9fr_0.9fr] border-b border-white/[0.07] pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5e626a]">
                <span>Capability</span>
                <span>Web (WASM)</span>
                <span>Desktop</span>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {CAPABILITY_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1.5fr_0.9fr_0.9fr] items-center gap-2 py-3.5 text-[12.5px]"
                  >
                    <span className="text-[#f7f8f8]">{row.label}</span>
                    <span className="text-[#8a8f98]">
                      {row.wasm ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 text-[#8a8f98]" />
                          {row.wasm}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#5e626a]">
                          <Minus className="h-3.5 w-3.5" />
                          Desktop only
                        </span>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#f7f8f8]">
                      <Check className="h-3.5 w-3.5 text-[#f7f8f8]" />
                      {row.desktop}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Live Code Diff Preview */}
            <div className="bg-[#090a0c] p-6 pb-10">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="font-mono text-[11px] text-[#8a8f98]">
                  crates/orthese-sdk/src/lib.rs
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#8a8f98]">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  fs:write · shell:exec
                </span>
              </div>

              <pre className="mt-4 overflow-x-auto font-mono text-[12px] leading-[1.7] text-[#8a8f98]">
                <span className="block text-[#5e626a]">@@ -112,6 +112,11 @@ impl PieceManifest {"{"}</span>
                <span className="block text-[#f7f8f8] bg-white/[0.04] px-1.5 -mx-1.5">
                  +    pub fn supports_wasm(&amp;self) -&gt; bool {"{"}
                </span>
                <span className="block text-[#f7f8f8] bg-white/[0.04] px-1.5 -mx-1.5">
                  +        self.permissions.elevated.is_empty()
                </span>
                <span className="block text-[#f7f8f8] bg-white/[0.04] px-1.5 -mx-1.5">
                  +    {"}"}
                </span>
                <span className="block">{"}"}</span>
              </pre>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#111215] px-3.5 py-2.5 font-mono text-[11px] text-[#8a8f98]">
                <span>$ cargo test --workspace</span>
                <span className="text-[#f7f8f8]">2 passed · 0.01s</span>
              </div>
            </div>
          </div>
        </div>

        <SubColumns
          items={[
            {
              title: "Zero-Install WASM",
              body: "Try Website Builder and AI Prompt Box inside app.orthese.com in under 10 seconds.",
            },
            {
              title: "120fps Native GPUI",
              body: "Compile the exact same Rust canvas natively for macOS, Windows, and Linux.",
            },
            {
              title: "Open Piece SDK",
              body: "Build first-party and community Pieces against one transparent piece.json contract.",
            },
          ]}
        />
      </section>
    </div>
  );
}
