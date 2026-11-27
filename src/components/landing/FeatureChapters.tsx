"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Check,
  ChevronRight,
  Copy,
  ExternalLink,
  FileCode2,
  Folder,
  FolderOpen,
  Globe,
  Minus,
  Send,
  Sparkles,
  Terminal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AgentLimitsCard } from "@/components/primitives/AgentLimitsCard";
import {
  CodeBlock,
  CodeBlockCode,
  CodeBlockCopyButton,
  CodeBlockGroup,
} from "@/components/primitives/CodeBlock";
import {
  ContextMenuTrigger,
  type ContextMenuEntry,
} from "@/components/primitives/ContextMenu";
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
        <h2 className="text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] md:text-[38px]">
          {titleLine1}
          <br />
          <OrbitGradientText>{titleLine2}</OrbitGradientText>
        </h2>
      </div>
      <div className="md:col-span-7 md:pl-8">
        <p className="max-w-lg text-[15px] leading-relaxed text-[#a3a3a3]">
          {description}
        </p>
        <Link
          href={href}
          className="mt-3 inline-flex items-center gap-1 text-[13.5px] font-medium text-[#fafafa] hover:opacity-80 transition-opacity"
        >
          <span>Learn more</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#a3a3a3]" />
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
          <h3 className="text-[14px] font-medium text-[#fafafa]">{item.title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3a3a3]">
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
description: Calm pitch-obsidian layouts with mask-faded UI stages.
---

# Design Rules
- Canvas #121212, primary ink #F7F8F8, muted #8A8F98
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

  return (
    <div
      id="architecture"
      className="scroll-mt-14 mx-auto max-w-[1024px] space-y-24 border-t border-white/[0.06] px-5 py-16 sm:px-6 sm:space-y-32 sm:py-24"
    >
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
            <div className="flex items-center gap-2.5 text-[12px] text-[#a3a3a3]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono">bus://workspace.default</span>
              <span className="text-[#737373]">·</span>
              <span className="font-mono tabular-nums text-[#fafafa]">
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
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#fafafa]">
                      <Icon className="h-3.5 w-3.5 text-[#a3a3a3]" />
                      <span>{pane.name}</span>
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] text-[#737373]">{pane.role}</div>
                    <p className="mt-4 text-[12.5px] leading-relaxed text-[#a3a3a3]">
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
          description="Start immediately with managed Cloudflare Edge credits or Orthese Router auto-selection—or flip to your local CLIProxyAPI sidecar on Desktop to reuse existing CLI OAuth subscriptions."
          href="/router"
        />

        <div className="stage-surface mt-12 overflow-hidden rounded-xl p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#fafafa]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {routingMode === "credits"
                    ? "Orthese Credits · Cloudflare Edge"
                    : "Local CLIProxyAPI Sidecar"}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-[#a3a3a3]">
                {routingMode === "credits"
                  ? "Official provider APIs metered cleanly across every Piece."
                  : "Runs locally on Desktop with live OAuth quota monitoring."}
              </p>
            </div>

            {/* Working Segmented Toggle */}
            <div className="grid w-full grid-cols-2 rounded-lg border border-white/[0.08] bg-[#121212] p-0.5 sm:inline-flex sm:w-auto">
              {(
                [
                  {
                    id: "credits",
                    short: "Orthese Credits",
                    label: "Orthese Credits · Cloudflare Edge",
                  },
                  {
                    id: "cliproxy",
                    short: "Local CLIProxyAPI",
                    label: "Local CLIProxyAPI Sidecar",
                  },
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
                      "relative rounded-[6px] px-2.5 py-1.5 text-[11.5px] sm:px-3 sm:text-[12px] font-medium transition-colors cursor-pointer",
                      active ? "text-[#fafafa]" : "text-[#a3a3a3] hover:text-[#fafafa]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="chapter-routing-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-[6px] bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                      />
                    )}
                    <span className="relative z-10 sm:hidden">{opt.short}</span>
                    <span className="relative z-10 hidden sm:inline">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[0.82fr_1.48fr] items-start">
            <div className="space-y-6">
              <div>
                <span className="block font-mono text-[11px] text-[#737373]">EDGE LATENCY</span>
                <div className="mt-1 font-mono text-4xl font-medium tracking-[-0.04em] tabular-nums text-[#fafafa]">
                  <NumberFlow value={routingMode === "credits" ? 28 : 4} />
                  <span className="ml-1.5 text-lg text-[#a3a3a3]">ms</span>
                </div>
              </div>

              <div>
                <span className="block font-mono text-[11px] text-[#737373]">
                  {routingMode === "credits" ? "ACTIVE BALANCE" : "LOCAL COST"}
                </span>
                <div className="mt-1 font-mono text-2xl font-medium tracking-[-0.03em] tabular-nums text-[#fafafa]">
                  {routingMode === "credits" ? (
                    <>
                      <NumberFlow value={2410} />
                      <span className="ml-1.5 text-sm text-[#a3a3a3]">cr</span>
                    </>
                  ) : (
                    <span>Local OAuth · Free</span>
                  )}
                </div>
              </div>

              <p className="text-[12.5px] leading-relaxed text-[#737373]">
                Click <span className="text-[#d4d4d4]">Context window</span> to inspect live per-bucket token budgets, deferred MCP tools, and collapsible workspace groups.
              </p>
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
                      { label: "MCP tools (deferred)", tokens: 69_900, color: "#737373", deferred: true },
                      { label: "System tools (deferred)", tokens: 16_100, color: "#737373", deferred: true },
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
                    { label: "5-hour limit", used: 0.38, resets: "Resets in 2 hr 46 min" },
                    { label: "Weekly · all models", used: 0.14, resets: "Resets Tue 3:00 PM" },
                    { label: "Weekly · Frontier", used: 0.22, resets: "Resets Tue 3:00 PM" },
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
                      { label: "MCP tools (deferred)", tokens: 52_000, color: "#737373", deferred: true },
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
                    { label: "Claude Code OAuth", used: 0.16, resets: "84% remaining" },
                    { label: "Codex CLI OAuth", used: 0.38, resets: "62% remaining" },
                    { label: "Gemini CLI OAuth", used: 0.05, resets: "95% remaining" },
                  ]}
                />
              )}
            </motion.div>
          </div>
        </div>

        <SubColumns
          items={[
            {
              title: "Token-Weighted Real Models",
              body: "Pick Claude Opus 5.5, GPT-6.2 Astra, Gemini 4 Neon, or Meta Muse directly—metered transparently from one non-expiring token balance.",
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

        <div className="mask-fade-bottom-soft stage-surface mt-10 overflow-hidden rounded-xl sm:mt-12">
          <div className="grid md:grid-cols-[260px_1fr]">
            {/* Left File Tree (Right-click, long-press, or Shift+F10 opens ContextMenu) */}
            <div className="min-w-0 border-b border-white/[0.06] bg-[#171717] p-4 font-mono text-[12px] sm:p-5 md:border-b-0 md:border-r">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                  Workspace Bundle
                </span>
                <span className="font-sans text-[10px] text-[#737373]">
                  <span className="sm:hidden">Hold for menu</span>
                  <span className="hidden sm:inline">Right-click files</span>
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-2 py-1 text-[#a3a3a3]">
                <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                <span className="truncate">crates/pieces/website-builder/</span>
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
                          "ml-4 mt-0.5 flex w-[calc(100%-1rem)] items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-left transition-colors sm:py-1.5 cursor-pointer",
                          isOpen
                            ? "border-[#818cf8]/60 bg-[#818cf8]/10 text-[#fafafa]"
                            : active
                              ? "border-transparent bg-white/[0.08] text-[#fafafa]"
                              : "border-transparent text-[#a3a3a3] hover:bg-white/[0.03] hover:text-[#fafafa]"
                        )}
                      >
                        <span className="flex items-center gap-2 min-w-0">
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

              <div className="mt-3 flex min-w-0 items-center gap-2 py-1 text-[#a3a3a3]">
                <Folder className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                <span className="truncate">skills/landing-page-architect/</span>
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
                      "ml-4 mt-0.5 flex w-[calc(100%-1rem)] items-center justify-between gap-2 rounded-md border px-2.5 py-2 text-left transition-colors sm:py-1.5 cursor-pointer",
                      isOpen
                        ? "border-[#818cf8]/60 bg-[#818cf8]/10 text-[#fafafa]"
                        : selectedFile === "SKILL.md"
                          ? "border-transparent bg-white/[0.08] text-[#fafafa]"
                          : "border-transparent text-[#a3a3a3] hover:bg-white/[0.03] hover:text-[#fafafa]"
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
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

            {/* Right Manifest / Code Viewer */}
            <div className="min-w-0 bg-[#171717] p-4 pb-10 sm:p-5 sm:pb-12">
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
                  maxHeight="max-h-[340px]"
                  className="bg-[#141414]"
                />
              </motion.div>
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

        <div className="mask-fade-bottom-soft stage-surface mt-10 overflow-hidden rounded-xl sm:mt-12">
          <div className="grid md:grid-cols-[1.15fr_1fr]">
            {/* Left Capability Matrix */}
            <div className="min-w-0 overflow-x-auto border-b border-white/[0.06] p-4 pb-8 sm:p-6 sm:pb-10 md:border-b-0 md:border-r">
              <div className="min-w-[420px] sm:min-w-0">
              <div className="grid grid-cols-[1.5fr_0.9fr_0.9fr] border-b border-white/[0.07] pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
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
                    <span className="text-[#fafafa]">{row.label}</span>
                    <span className="text-[#a3a3a3]">
                      {row.wasm ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#a3a3a3]" />
                          {row.wasm}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#737373]">
                          <Minus className="h-3.5 w-3.5 shrink-0" />
                          Desktop only
                        </span>
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[#fafafa]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-[#fafafa]" />
                      {row.desktop}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>

            {/* Right Live Code Diff Preview */}
            <div className="min-w-0 bg-[#171717] p-4 pb-10 sm:p-5">
              <CodeBlock className="bg-[#141414]">
                <CodeBlockGroup>
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 rounded-md bg-white/[0.07] px-2 py-0.5 text-[11px] font-medium text-[#e5e5e5]">
                      Diff
                    </span>
                    <span className="truncate font-mono text-[11.5px] text-[#a3a3a3]">
                      crates/orthese-sdk/src/lib.rs
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-[#a3a3a3]">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      fs:write · shell:exec
                    </span>
                    <CodeBlockCopyButton
                      filename="crates/orthese-sdk/src/lib.rs"
                      code={`@@ -112,6 +112,11 @@ impl PieceManifest {\n+    pub fn supports_wasm(&self) -> bool {\n+        self.permissions.elevated.is_empty()\n+    }\n}`}
                    />
                  </div>
                </CodeBlockGroup>
                <CodeBlockCode
                  language="diff"
                  code={`@@ -112,6 +112,11 @@ impl PieceManifest {\n+    pub fn supports_wasm(&self) -> bool {\n+        self.permissions.elevated.is_empty()\n+    }\n}`}
                />
              </CodeBlock>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#1c1c1c] px-3.5 py-2.5 font-mono text-[11px] text-[#a3a3a3]">
                <span>$ cargo test --workspace</span>
                <span className="text-[#fafafa]">2 passed · 0.01s</span>
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
