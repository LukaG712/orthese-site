"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  FileCode2,
  Folder,
  FolderOpen,
  Globe,
  Layers,
  Minus,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AgentLimitsCard } from "@/components/primitives/AgentLimitsCard";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import {
  ContextMenuTrigger,
  type ContextMenuEntry,
} from "@/components/primitives/ContextMenu";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { cn } from "@/lib/cn";

const WORKS_WITH_ITEMS = [
  "Claude",
  "Codex",
  "Gemini",
  "MCP",
  "SKILL.md",
  "Rust/GPUI",
  "WASM",
] as const;

const HARNESS_FILES = {
  "piece.json": {
    path: "crates/pieces/website-builder/piece.json",
    code: `{
  "id": "orthese.website-builder",
  "version": "0.1.0",
  "extends": "orthese.base-harness",
  "defaultModel": "gemini-4-neon",
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
    code: `use orthese_sdk::PieceManifest;

pub fn manifest() -> PieceManifest {
    PieceManifest {
        id: "orthese.website-builder".into(),
        extends: Some("orthese.base-harness".into()),
        default_model: Some("gemini-4-neon".into()),
        // Zero elevated permissions -> instant wasm32
        ..Default::default()
    }
}`,
  },
  "SKILL.md": {
    path: "skills/landing-page-architect/SKILL.md",
    code: `---
name: landing-page-architect
description: Calm BoardUI dark layouts with crisp surface contrast.
---

# Design Rules
- Canvas #121212, elevated surface #161618, primary ink #FAFAFA
- Alternate hairline borders with rounded-3xl elevated stages
- Reserve monospace for credits, latencies, and piece.json`,
  },
} as const;

type HarnessFileKey = keyof typeof HARNESS_FILES;

const MCP_SERVERS = [
  { id: "github", name: "github", transport: "HTTP", scope: "Remote" },
  { id: "browser", name: "browser", transport: "HTTP", scope: "WASM + Desktop" },
  { id: "filesystem", name: "filesystem", transport: "stdio", scope: "Desktop" },
  { id: "postgres", name: "postgres", transport: "stdio", scope: "Desktop" },
] as const;

type McpServerId = (typeof MCP_SERVERS)[number]["id"];

const CAPABILITY_ROWS = [
  {
    label: "Dashboard Canvas & @orthese/ui",
    wasm: "Full (wasm32)",
    desktop: "Native 120fps",
  },
  {
    label: "Standard Pieces (Prompt Box, Builder)",
    wasm: "Zero-install",
    desktop: "Full support",
  },
  {
    label: "Managed Credits & Remote MCP",
    wasm: "Full support",
    desktop: "Full support",
  },
  {
    label: "Elevated Pieces (fs:read/write, shell:exec)",
    wasm: "Sandbox preview",
    desktop: "Local repos",
  },
  {
    label: "Local stdio MCPs & CLIProxyAPI",
    wasm: null,
    desktop: "Native lifecycle",
  },
];

export function FeatureChapters() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/dashboard";
  const [routingMode, setRoutingMode] = useState<"credits" | "cliproxy">("credits");
  const [selectedFile, setSelectedFile] = useState<HarnessFileKey>("piece.json");
  const [busPacketCount, setBusPacketCount] = useState(14);
  const [mcpAllowed, setMcpAllowed] = useState<Record<McpServerId, boolean>>({
    github: true,
    browser: true,
    filesystem: true,
    postgres: false,
  });
  const [contextFlags, setContextFlags] = useState<
    Record<HarnessFileKey, { include: boolean; watch: boolean }>
  >({
    "piece.json": { include: true, watch: true },
    "lib.rs": { include: true, watch: false },
    "SKILL.md": { include: true, watch: true },
  });

  function buildFileMenuEntries(file: HarnessFileKey): ContextMenuEntry[] {
    const displayName = file === "lib.rs" ? "src/lib.rs" : file;
    const flags = contextFlags[file];

    return [
      {
        id: `open-${file}`,
        label: "Open in viewer",
        icon: ExternalLink,
        shortcut: "↵",
        onSelect: () => setSelectedFile(file),
      },
      {
        id: `copy-${file}`,
        label: `Copy @${displayName}`,
        icon: Copy,
        shortcut: "⌘C",
        onSelect: () => {
          navigator.clipboard?.writeText(`@${displayName}`).catch(() => {});
          toast.success(`Copied @${displayName}`, {
            description: "Ready to paste into the Orthese Composer.",
          });
        },
      },
      {
        type: "submenu",
        id: `send-${file}`,
        label: "Pipe to Piece",
        icon: Send,
        items: [
          {
            id: `pipe-wb-${file}`,
            label: "Website Builder",
            onSelect: () =>
              toast.success(`Piped ${displayName} → Website Builder`),
          },
          {
            id: `pipe-se-${file}`,
            label: "Software Engineer",
            onSelect: () =>
              toast.success(`Piped ${displayName} → Software Engineer`),
          },
          {
            id: `pipe-pb-${file}`,
            label: "AI Prompt Box",
            onSelect: () =>
              toast.success(`Piped ${displayName} → AI Prompt Box`),
          },
        ],
      },
      { type: "separator" },
      {
        type: "section",
        id: `ctx-${file}`,
        title: "Harness context",
        items: [
          {
            id: `inc-${file}`,
            label: "Include in prompt",
            checked: flags.include,
            keepOpen: true,
            onSelect: () =>
              setContextFlags((prev) => ({
                ...prev,
                [file]: { ...prev[file], include: !prev[file].include },
              })),
          },
          {
            id: `watch-${file}`,
            label: "Watch file changes",
            checked: flags.watch,
            keepOpen: true,
            onSelect: () =>
              setContextFlags((prev) => ({
                ...prev,
                [file]: { ...prev[file], watch: !prev[file].watch },
              })),
          },
        ],
      },
      { type: "separator" },
      {
        id: `unload-${file}`,
        label: "Unload from bundle",
        icon: Trash2,
        shortcut: "⌫",
        variant: "danger",
        onSelect: () =>
          toast.info(`Unloaded ${displayName} from active session`, {
            description: "Manifest files stay intact on disk.",
          }),
      },
    ];
  }

  function toggleMcpServer(id: McpServerId) {
    setMcpAllowed((prev) => {
      const next = !prev[id];
      toast.success(
        next ? `Enabled ${id} MCP on allowlist` : `Paused ${id} MCP for active Piece`
      );
      return { ...prev, [id]: next };
    });
  }

  return (
    <div id="architecture" className="scroll-mt-14">
      {/* 1. COMPACT MONOCHROME "WORKS WITH" STRIP DIRECTLY BELOW HERO */}
      <div className="border-y border-white/[0.06] bg-[#121212]">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-2.5 px-5 py-3.5 sm:flex-row sm:px-6">
          <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
            Works with
          </span>
          <div
            aria-label="Supported models, protocols, and runtimes"
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-x-2.5 sm:gap-y-1 font-mono text-[11.5px] sm:text-[12px] text-[#a3a3a3]"
          >
            {WORKS_WITH_ITEMS.map((item, idx) => (
              <span key={item} className="inline-flex items-center gap-2.5">
                <span className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 transition-colors hover:text-[#fafafa] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                  {item}
                </span>
                {idx < WORKS_WITH_ITEMS.length - 1 && (
                  <span aria-hidden="true" className="hidden text-[#404040] sm:inline">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CORE ARCHITECTURE: ASYMMETRIC 3-COLUMN BENTO GRID (rounded-2xl, gap-4) */}
      <section className="mx-auto max-w-[1080px] px-5 py-20 sm:px-6 sm:py-24">
        <div className="grid grid-cols-1 items-end gap-5 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
              Core Architecture
            </span>
            <h2 className="mt-2.5 text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] md:text-[38px]">
              One modular runtime.
              <br />
              <OrbitGradientText>Three shared layers.</OrbitGradientText>
            </h2>
          </div>
          <div className="md:col-span-6 md:pl-8">
            <p className="max-w-md text-[14.5px] leading-relaxed text-[#a3a3a3]">
              Every Piece snaps onto the same Shared Context Bus, inherits one Base Harness,
              and shares progressively loaded Skills and scoped MCP servers.
            </p>
          </div>
        </div>

        {/* Asymmetric 3-Column Bento Grid: [2 cols + 1 tall col] / [2 cols] */}
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* BENTO CARD 1 (2 cols): Shared Context Bus */}
          <div
            id="shared-context"
            className="scroll-mt-20 flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#161618] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:col-span-2 sm:p-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-md">
                <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#737373]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>bus://workspace.default</span>
                  <span className="text-[#404040]">·</span>
                  <span className="tabular-nums text-[#d4d4d4]">
                    <NumberFlow value={busPacketCount} /> routed
                  </span>
                </div>
                <h3 className="mt-2 text-[20px] font-medium tracking-[-0.025em] text-[#fafafa]">
                  Shared Context Bus
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3a3a3]">
                  Pipe typed <code className="font-mono text-[12px] text-[#d4d4d4]">orthese/spec</code>{" "}
                  and <code className="font-mono text-[12px] text-[#d4d4d4]">git-diff</code> payloads
                  straight across panes, with zero tab switching or copy-paste.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBusPacketCount((c) => c + 1);
                  toast.success("Emitted orthese/spec on Shared Context Bus", {
                    description: "Delivered to Website Builder & Software Engineer in 11ms.",
                  });
                }}
                className="bg-button-secondary inline-flex h-8 shrink-0 items-center rounded-lg px-3 text-[12px] font-medium cursor-pointer"
              >
                Emit test payload →
              </button>
            </div>

            {/* Compact Interactive 3-Node Bus Stage */}
            <div className="relative mt-6 overflow-hidden rounded-xl border border-white/[0.06] bg-[#121212] p-4 sm:p-5">
              <svg
                className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-10 w-full -translate-y-1/2 sm:block"
                viewBox="0 0 640 40"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1="190"
                  y1="20"
                  x2="230"
                  y2="20"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                <line
                  x1="410"
                  y1="20"
                  x2="450"
                  y2="20"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1"
                />
                <motion.line
                  x1="190"
                  y1="20"
                  x2="230"
                  y2="20"
                  stroke="url(#bentoBusBeam)"
                  strokeWidth="1.5"
                  strokeDasharray="18 56"
                  animate={{ strokeDashoffset: [74, 0] }}
                  transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
                />
                <motion.line
                  x1="410"
                  y1="20"
                  x2="450"
                  y2="20"
                  stroke="url(#bentoBusBeam)"
                  strokeWidth="1.5"
                  strokeDasharray="18 56"
                  animate={{ strokeDashoffset: [74, 0] }}
                  transition={{
                    duration: 2.0,
                    delay: 0.65,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <defs>
                  <linearGradient id="bentoBusBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="50%" stopColor="rgba(250,250,250,0.9)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {[
                  {
                    name: "AI Prompt Box",
                    mime: "emits orthese/spec",
                    detail: "Drafts structured brief",
                    icon: Sparkles,
                  },
                  {
                    name: "Website Builder",
                    mime: "emits html-bundle",
                    detail: "Live sandbox preview",
                    icon: Globe,
                  },
                  {
                    name: "Software Engineer",
                    mime: "emits git-diff",
                    detail: "Applies repo patch",
                    icon: Terminal,
                  },
                ].map((node) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.name}
                      className="rounded-lg border border-white/[0.08] bg-[#171717] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    >
                      <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#fafafa]">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-[#a3a3a3]" />
                        <span className="truncate">{node.name}</span>
                      </div>
                      <div className="mt-1 font-mono text-[10.5px] text-[#737373]">
                        {node.mime}
                      </div>
                      <p className="mt-2.5 text-[11.5px] text-[#a3a3a3]">{node.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BENTO CARD 2 (1 col, 2 rows): Skills + MCP */}
          <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#161618] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:col-span-1 lg:row-span-2 sm:p-7">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#737373]">
                Context & Tools
              </span>
              <h3 className="mt-2 text-[20px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Skills + MCP
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3a3a3]">
                Keep <code className="font-mono text-[12px] text-[#d4d4d4]">SKILL.md</code>{" "}
                instructions lazy-loaded and grant MCP tools per Piece from one hub.
              </p>

              {/* Progressive SKILL.md index */}
              <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#121212] p-3.5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                  <span>SKILL.md Index</span>
                  <span className="text-[#a3a3a3]">Progressive</span>
                </div>
                <div className="mt-2.5 space-y-2">
                  {[
                    { name: "landing-page-architect", state: "Loaded · 1.4k tok", active: true },
                    { name: "rust-gpui-piece", state: "Meta · 90 tok", active: false },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-[#171717] px-2.5 py-2"
                    >
                      <span className="truncate font-mono text-[11.5px] text-[#e5e5e5]">
                        {skill.name}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-[10px]",
                          skill.active ? "text-[#fafafa]" : "text-[#737373]"
                        )}
                      >
                        {skill.state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scoped MCP Hub (interactive per-Piece allowlist) */}
              <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#121212] p-3.5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                  <span>Scoped MCP Hub</span>
                  <span>Click to toggle</span>
                </div>
                <div className="mt-2.5 space-y-1.5">
                  {MCP_SERVERS.map((srv) => {
                    const enabled = mcpAllowed[srv.id];
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => toggleMcpServer(srv.id)}
                        aria-pressed={enabled}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors cursor-pointer",
                          enabled
                            ? "border-white/[0.1] bg-[#171717] text-[#fafafa]"
                            : "border-white/[0.04] bg-transparent text-[#737373] hover:border-white/[0.08] hover:text-[#a3a3a3]"
                        )}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                              enabled ? "bg-emerald-400" : "bg-[#404040]"
                            )}
                          />
                          <span className="truncate font-mono text-[11.5px]">{srv.name}</span>
                          <span className="font-mono text-[10px] text-[#737373]">
                            {srv.transport}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.06em]">
                          {enabled ? "Allow" : "Off"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Link
              href="/marketplace?tab=skill"
              className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[#d4d4d4] hover:text-[#fafafa] transition-colors"
            >
              <span>Explore Skills &amp; MCP</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#737373]" />
            </Link>
          </div>

          {/* BENTO CARD 3 (2 cols): Base Harness */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#161618] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:col-span-2 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-lg">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#737373]">
                    Shared Runtime
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-[#121212] px-2.5 py-0.5 font-mono text-[10.5px] text-[#a3a3a3]">
                    extends: &quot;orthese.base-harness&quot;
                  </span>
                </div>
                <h3 className="mt-2 text-[20px] font-medium tracking-[-0.025em] text-[#fafafa]">
                  Base Harness
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3a3a3]">
                  Every first-party and community Piece inherits streaming, checkpoints, model
                  routing, and tiered permissions from one Rust core, declared transparently in{" "}
                  <code className="font-mono text-[12px] text-[#d4d4d4]">piece.json</code>.
                </p>
              </div>

              <a
                href="#base-harness"
                className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[#d4d4d4] hover:text-[#fafafa] transition-colors"
              >
                <span>Inspect piece.json</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#737373]" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Layers,
                  title: "Streaming & Checkpoints",
                  body: "Consistent token streams, workspace state snapshots, and replay across panes.",
                },
                {
                  icon: ShieldCheck,
                  title: "Tiered Permissions",
                  body: "Standard caps run in WASM; elevated fs & shell calls gate behind Desktop approvals.",
                },
                {
                  icon: FileCode2,
                  title: "One Open SDK",
                  body: "Zero proprietary wrappers: author Pieces against a single validated manifest.",
                },
              ].map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-white/[0.06] bg-[#121212] p-4"
                  >
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#fafafa]">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-[#a3a3a3]" />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                      {pillar.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ZIG-ZAG SHOWCASE A (Elevated rounded-3xl #161618): COPY LEFT / INTERACTIVE UI RIGHT */}
      <section
        id="hybrid-routing"
        className="scroll-mt-20 mx-auto max-w-[1080px] px-5 sm:px-6"
      >
        <div className="rounded-3xl border border-white/[0.07] bg-[#161618] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* LEFT: Editorial Copy + Segmented Toggle + Live Telemetry */}
            <div className="lg:col-span-5">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                Hybrid AI Routing
              </span>
              <h2 className="mt-2.5 text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] md:text-[36px]">
                Managed credits or
                <br />
                <OrbitGradientText>local OAuth.</OrbitGradientText>
              </h2>
              <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Start immediately with managed Cloudflare Edge credits or Orthese Router, or
                flip to your local CLIProxyAPI sidecar on Desktop to reuse existing CLI OAuth
                subscriptions.
              </p>

              {/* Working Segmented Toggle */}
              <div className="mt-6 grid w-full grid-cols-2 rounded-xl border border-white/[0.08] bg-[#121212] p-1">
                {(
                  [
                    { id: "credits", label: "Orthese Credits" },
                    { id: "cliproxy", label: "Local CLIProxyAPI" },
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
                        "relative rounded-lg px-3 py-2 text-[12px] font-medium transition-colors cursor-pointer",
                        active ? "text-[#fafafa]" : "text-[#a3a3a3] hover:text-[#fafafa]"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="chapter-routing-pill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-lg bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                        />
                      )}
                      <span className="relative z-10">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Compact 2-Column Live Telemetry */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-6">
                <div>
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#737373]">
                    Edge Latency
                  </span>
                  <div className="mt-1 font-mono text-3xl font-medium tracking-[-0.04em] tabular-nums text-[#fafafa]">
                    <NumberFlow value={routingMode === "credits" ? 28 : 4} />
                    <span className="ml-1 text-base text-[#a3a3a3]">ms</span>
                  </div>
                </div>
                <div>
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#737373]">
                    {routingMode === "credits" ? "Active Balance" : "Local Cost"}
                  </span>
                  <div className="mt-1 font-mono text-xl font-medium tracking-[-0.03em] tabular-nums text-[#fafafa] sm:text-2xl">
                    {routingMode === "credits" ? (
                      <>
                        <NumberFlow value={2410} />
                        <span className="ml-1 text-sm text-[#a3a3a3]">cr</span>
                      </>
                    ) : (
                      <span className="whitespace-nowrap">OAuth · Free</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[12.5px] leading-relaxed text-[#737373]">
                Click <span className="text-[#d4d4d4]">Context window</span> on the card to
                inspect live per-bucket token budgets and deferred MCP tools.
              </p>

              <Link
                href="/router"
                className="mt-5 inline-flex items-center gap-1 text-[13.5px] font-medium text-[#fafafa] hover:opacity-80 transition-opacity"
              >
                <span>Explore Orthese Router</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#a3a3a3]" />
              </Link>
            </div>

            {/* RIGHT: Interactive AgentLimitsCard */}
            <div className="lg:col-span-7">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1">
                <span className="inline-flex items-center gap-2 text-[12px] font-medium text-[#d4d4d4]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>
                    {routingMode === "credits"
                      ? "Orthese Credits · Cloudflare Edge"
                      : "Local CLIProxyAPI Sidecar"}
                  </span>
                </span>
                <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-[#737373]">
                  {routingMode === "credits" ? "Non-expiring pool" : "Desktop OAuth"}
                </span>
              </div>

              <motion.div
                key={routingMode}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {routingMode === "credits" ? (
                  <AgentLimitsCard
                    plan="Max (5x)"
                    planHref="/router"
                    context={{
                      max: 1_000_000,
                      segments: [
                        { label: "Messages", tokens: 520_000, color: "#60a5fa" },
                        { label: "System tools", tokens: 96_000, color: "#818cf8" },
                        { label: "MCP tools", tokens: 68_000, color: "#34d399" },
                        { label: "Skills", tokens: 54_000, color: "#f59e0b" },
                        { label: "System prompt", tokens: 42_000, color: "#a78bfa" },
                        { label: "Memory files", tokens: 24_000, color: "#38bdf8" },
                        { label: "Custom agents", tokens: 16_000, color: "#e879f9" },
                        {
                          label: "MCP tools (deferred)",
                          tokens: 69_900,
                          color: "#737373",
                          deferred: true,
                        },
                        {
                          label: "System tools (deferred)",
                          tokens: 16_100,
                          color: "#737373",
                          deferred: true,
                        },
                      ],
                      groups: [
                        {
                          label: "MCP tools",
                          tokens: 137_900,
                          items: [
                            { label: "browser", tokens: 54_200 },
                            { label: "github", tokens: 38_400 },
                            { label: "filesystem", tokens: 26_100 },
                            { label: "postgres", tokens: 19_200 },
                          ],
                        },
                        {
                          label: "Memory files",
                          tokens: 24_000,
                          items: [
                            { label: "ORTHE.md", tokens: 14_800 },
                            { label: "workspace-rules.md", tokens: 9_200 },
                          ],
                        },
                        {
                          label: "Custom agents",
                          tokens: 16_000,
                          items: [
                            { label: "orthese.website-builder", tokens: 6_400 },
                            { label: "orthese.software-engineer", tokens: 5_800 },
                            { label: "orthese.research-canvas", tokens: 3_800 },
                          ],
                        },
                      ],
                    }}
                    limits={[
                      {
                        label: "5-hour limit",
                        used: 0.38,
                        resets: "Resets in 2 hr 46 min",
                      },
                      {
                        label: "Weekly · all models",
                        used: 0.14,
                        resets: "Resets Tue 3:00 PM",
                      },
                      {
                        label: "Weekly · Frontier",
                        used: 0.22,
                        resets: "Resets Tue 3:00 PM",
                      },
                    ]}
                  />
                ) : (
                  <AgentLimitsCard
                    plan="Local CLIProxyAPI"
                    planHref="/router"
                    context={{
                      max: 1_000_000,
                      segments: [
                        { label: "Messages", tokens: 390_000, color: "#60a5fa" },
                        { label: "System tools", tokens: 78_000, color: "#818cf8" },
                        { label: "MCP tools", tokens: 62_000, color: "#34d399" },
                        { label: "Skills", tokens: 44_000, color: "#f59e0b" },
                        { label: "Memory files", tokens: 36_000, color: "#38bdf8" },
                        {
                          label: "MCP tools (deferred)",
                          tokens: 52_000,
                          color: "#737373",
                          deferred: true,
                        },
                      ],
                      groups: [
                        {
                          label: "Local OAuth pool",
                          tokens: 114_000,
                          items: [
                            { label: "claude-code-oauth", tokens: 48_000 },
                            { label: "codex-cli-oauth", tokens: 39_000 },
                            { label: "gemini-cli-oauth", tokens: 27_000 },
                          ],
                        },
                      ],
                    }}
                    limits={[
                      {
                        label: "Claude Code OAuth",
                        used: 0.16,
                        resets: "84% remaining",
                      },
                      {
                        label: "Codex CLI OAuth",
                        used: 0.38,
                        resets: "62% remaining",
                      },
                      {
                        label: "Gemini CLI OAuth",
                        used: 0.05,
                        resets: "95% remaining",
                      },
                    ]}
                  />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ZIG-ZAG SHOWCASE B (Open canvas + border-t): INTERACTIVE UI LEFT / COPY RIGHT */}
      <section
        id="base-harness"
        className="scroll-mt-20 mx-auto mt-20 max-w-[1080px] px-5 sm:mt-24 sm:px-6"
      >
        <div className="border-t border-white/[0.06] pt-20 pb-20 sm:pt-24 sm:pb-24">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
            {/* LEFT (zig-zag reversed): Interactive File Tree + Manifest Code Viewer */}
            <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#161618] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="grid md:grid-cols-[210px_1fr]">
                  {/* File Tree (Right-click, long-press, or Shift+F10 opens ContextMenu) */}
                  <div className="min-w-0 border-b border-white/[0.06] bg-[#171717] p-4 font-mono text-[11.5px] md:border-b-0 md:border-r">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                        Bundle
                      </span>
                      <span className="font-sans text-[10px] text-[#737373]">
                        <span className="sm:hidden">Hold for menu</span>
                        <span className="hidden sm:inline">Right-click</span>
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5 py-1 text-[#a3a3a3]">
                      <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                      <span className="truncate">website-builder/</span>
                    </div>

                    {(["piece.json", "lib.rs"] as const).map((file) => {
                      const active = selectedFile === file;
                      const flags = contextFlags[file];
                      return (
                        <ContextMenuTrigger
                          key={file}
                          ariaLabel={`Actions for ${file}`}
                          entries={buildFileMenuEntries(file)}
                        >
                          {({ isOpen }) => (
                            <button
                              type="button"
                              data-testid={`tree-${file}`}
                              onClick={() => setSelectedFile(file)}
                              className={cn(
                                "ml-3 mt-0.5 flex w-[calc(100%-0.75rem)] items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-left transition-colors cursor-pointer",
                                isOpen
                                  ? "border-white/30 bg-white/[0.1] text-[#fafafa]"
                                  : active
                                    ? "border-transparent bg-white/[0.08] text-[#fafafa]"
                                    : "border-transparent text-[#a3a3a3] hover:bg-white/[0.03] hover:text-[#fafafa]"
                              )}
                            >
                              <span className="flex min-w-0 items-center gap-1.5">
                                <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                                <span className="truncate">
                                  {file === "lib.rs" ? "src/lib.rs" : file}
                                </span>
                              </span>
                              {flags.include && (
                                <span
                                  title="Included in prompt context"
                                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80"
                                />
                              )}
                            </button>
                          )}
                        </ContextMenuTrigger>
                      );
                    })}

                    <div className="mt-3 flex min-w-0 items-center gap-1.5 py-1 text-[#a3a3a3]">
                      <Folder className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                      <span className="truncate">skills/</span>
                    </div>

                    <ContextMenuTrigger
                      ariaLabel="Actions for SKILL.md"
                      entries={buildFileMenuEntries("SKILL.md")}
                    >
                      {({ isOpen }) => (
                        <button
                          type="button"
                          data-testid="tree-SKILL.md"
                          onClick={() => setSelectedFile("SKILL.md")}
                          className={cn(
                            "ml-3 mt-0.5 flex w-[calc(100%-0.75rem)] items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-left transition-colors cursor-pointer",
                            isOpen
                              ? "border-white/30 bg-white/[0.1] text-[#fafafa]"
                              : selectedFile === "SKILL.md"
                                ? "border-transparent bg-white/[0.08] text-[#fafafa]"
                                : "border-transparent text-[#a3a3a3] hover:bg-white/[0.03] hover:text-[#fafafa]"
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-1.5">
                            <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                            <span className="truncate">SKILL.md</span>
                          </span>
                          {contextFlags["SKILL.md"].include && (
                            <span
                              title="Included in prompt context"
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80"
                            />
                          )}
                        </button>
                      )}
                    </ContextMenuTrigger>
                  </div>

                  {/* Live Code Viewer */}
                  <div className="min-w-0 bg-[#141416] p-4">
                    <motion.div
                      key={selectedFile}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="min-w-0"
                    >
                      <CodeBlock
                        code={HARNESS_FILES[selectedFile].code}
                        filename={HARNESS_FILES[selectedFile].path}
                        language={
                          selectedFile === "lib.rs"
                            ? "rust"
                            : selectedFile === "SKILL.md"
                              ? "markdown"
                              : "json"
                        }
                        maxHeight="max-h-[320px]"
                        className="bg-[#121212]"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Editorial Copy & Open Contract Callouts */}
            <div className="order-1 lg:order-2 lg:col-span-5">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                Open Piece SDK
              </span>
              <h2 className="mt-2.5 text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] md:text-[36px]">
                Transparent
                <br />
                <OrbitGradientText>piece.json contract.</OrbitGradientText>
              </h2>
              <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Inspect every permission, MIME input/output, and skill file before installing.
                Right-click any file in the explorer to copy{" "}
                <code className="font-mono text-[12.5px] text-[#d4d4d4]">@mentions</code> or
                pipe context across Pieces.
              </p>

              <div className="mt-6 space-y-4 border-t border-white/[0.06] pt-6">
                {[
                  {
                    title: "Zero-Install WASM Eligibility",
                    body: "Keep permissions.elevated empty and your Piece runs instantly in app.orthese.com.",
                  },
                  {
                    title: "Composable MIME Contracts",
                    body: "Declare accepts & emits once so Starter Packs wire panes automatically.",
                  },
                  {
                    title: "Creator Token Rev-Share",
                    body: "Ship free Pieces with built-in tokenRevShare attribution and no subscription wall.",
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <h3 className="text-[13.5px] font-medium text-[#fafafa]">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#a3a3a3]">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/marketplace/orthese.website-builder"
                className="mt-6 inline-flex items-center gap-1 text-[13.5px] font-medium text-[#fafafa] hover:opacity-80 transition-opacity"
              >
                <span>Inspect Website Builder manifest</span>
                <ChevronRight className="h-3.5 w-3.5 text-[#a3a3a3]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIDE-BY-SIDE 2-COLUMN COMPARISON: WEB (WASM) VS NATIVE DESKTOP (RUST/GPUI) */}
      <section
        id="dual-target"
        className="scroll-mt-20 mx-auto max-w-[1080px] px-5 pb-20 sm:px-6 sm:pb-24"
      >
        <div className="rounded-3xl border border-white/[0.07] bg-[#161618] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:p-10 lg:p-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                Dual-Target Runtime
              </span>
              <h2 className="mt-2.5 text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] md:text-[36px]">
                Web (WASM) vs{" "}
                <OrbitGradientText>Native Desktop.</OrbitGradientText>
              </h2>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-[#a3a3a3]">
              Start in the browser with zero install, then step up to native 120fps Rust/GPUI
              whenever you need local repos and stdio MCPs.
            </p>
          </div>

          {/* Tight 2-Column Comparison */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* LEFT: Web (WASM) */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#121212] p-5 sm:p-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Globe className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
                    <h3 className="text-[16.5px] font-medium tracking-[-0.02em] text-[#fafafa] sm:text-[17px]">
                      Web (WASM)
                    </h3>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#171717] px-2.5 py-0.5 font-mono text-[10.5px] text-[#a3a3a3]">
                    wasm32 · Zero-install
                  </span>
                </div>

                <p className="mt-2.5 text-[13px] leading-relaxed text-[#a3a3a3]">
                  Instant browser evaluation for Prompt Box, Website Builder, and cloud MCP
                  workflows in under 10 seconds.
                </p>

                <ul className="mt-6 divide-y divide-white/[0.05] border-t border-white/[0.06]">
                  {CAPABILITY_ROWS.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-3 py-3 text-[12.5px]"
                    >
                      <span className="text-[#d4d4d4]">{row.label}</span>
                      {row.wasm ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-[#a3a3a3]">
                          <Check className="h-3.5 w-3.5 text-[#a3a3a3]" />
                          <span>{row.wasm}</span>
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-[#737373]">
                          <Minus className="h-3.5 w-3.5" />
                          <span>Desktop only</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <Link
                  href={appUrl}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#d4d4d4] hover:text-[#fafafa] transition-colors"
                >
                  <span>Launch in Browser</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#737373]" />
                </Link>
              </div>
            </div>

            {/* RIGHT: Native Desktop (Rust/GPUI) */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.14] bg-[#1a1a1d] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:p-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Terminal className="h-4 w-4 shrink-0 text-[#fafafa]" />
                    <h3 className="text-[16.5px] font-medium tracking-[-0.02em] text-[#fafafa] sm:text-[17px]">
                      Native Desktop
                    </h3>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-white/[0.14] bg-white/[0.08] px-2.5 py-0.5 font-mono text-[10.5px] text-[#fafafa]">
                    Rust/GPUI · 120fps
                  </span>
                </div>

                <p className="mt-2 text-[13px] leading-relaxed text-[#a3a3a3]">
                  Same Rust workspace compiled natively for macOS, Windows, and Linux, unlocking
                  local repos, guarded shell exec, and CLIProxyAPI.
                </p>

                <ul className="mt-6 divide-y divide-white/[0.06] border-t border-white/[0.08]">
                  {CAPABILITY_ROWS.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-3 py-3 text-[12.5px]"
                    >
                      <span className="text-[#fafafa]">{row.label}</span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-[#fafafa]">
                        <Check className="h-3.5 w-3.5 text-[#fafafa]" />
                        <span>{row.desktop}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#121212] px-3.5 py-2.5 font-mono text-[11px]">
                <span className="inline-flex items-center gap-2 text-[#a3a3a3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>$ cargo test --workspace</span>
                </span>
                <span className="text-[#fafafa]">2 passed · 0.01s</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
