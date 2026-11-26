"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Download,
  Eye,
  Globe,
  Sparkles,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { ApprovalCard } from "@/components/primitives/ApprovalCard";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { cn } from "@/lib/cn";

type StarterPackTab = "web-designer" | "indie-builder" | "daily-ai-desk";
type ModelTier = "fast" | "balanced" | "reasoning";

interface MiniSite {
  brand: string;
  eyebrow: string;
  headline: string;
  subcopy: string;
  cta: string;
  metrics: { label: string; value: string }[];
}

const PRESETS: Record<string, MiniSite> = {
  default: {
    brand: "Kestrel",
    eyebrow: "EDGE TELEMETRY · V2.4",
    headline: "Sub-millisecond traces for Rust backends.",
    subcopy:
      "Inspect spans, memory pressure, and tail latency in one hardware-accelerated timeline.",
    cta: "Deploy Collector",
    metrics: [
      { label: "p99 ingest", value: "0.42 ms" },
      { label: "footprint", value: "6.4 MB" },
      { label: "throughput", value: "1.2M /s" },
    ],
  },
  studio: {
    brand: "Atelier 09",
    eyebrow: "DESIGN ENGINEERING",
    headline: "Tactile software for technical teams.",
    subcopy:
      "We partner with founders to ship interfaces with physical restraint, precision motion, and speed.",
    cta: "Start a Sprint",
    metrics: [
      { label: "shipped", value: "24 apps" },
      { label: "frame rate", value: "120 fps" },
      { label: "lighthouse", value: "100 / 100" },
    ],
  },
  api: {
    brand: "Relay",
    eyebrow: "TRANSACTIONAL INFRA",
    headline: "Email APIs built for engineers who care.",
    subcopy:
      "Composable React templates, instant webhook replays, and deterministic delivery logs.",
    cta: "Get API Key",
    metrics: [
      { label: "delivery", value: "99.98%" },
      { label: "regions", value: "14 edge" },
      { label: "sdk size", value: "4.1 kB" },
    ],
  },
};

const TIER_COST: Record<ModelTier, number> = {
  fast: 1,
  balanced: 3,
  reasoning: 7,
};

const PACK_PROMPTS: Record<StarterPackTab, string> = {
  "web-designer":
    "Design a dark hardware-grade hero for Kestrel, a Rust telemetry engine with p99 span metrics.",
  "indie-builder":
    "Add supports_wasm() guard to PieceManifest in crates/orthese-sdk and run cargo test behind a shell guardrail.",
  "daily-ai-desk":
    "Synthesize the trade-offs of compiling one Rust + GPUI core to wasm32 vs maintaining two frontends.",
};

function buildExportBundle(site: MiniSite): string {
  return `<!-- Exported from Orthese Website Builder (orthese.website-builder v0.1.0) -->
<section class="min-h-screen bg-[#060607] text-[#FAFAFA] px-6 py-24">
  <div class="mx-auto max-w-3xl">
    <span class="font-mono text-[11px] tracking-[0.14em] text-zinc-500">
      ${site.eyebrow}
    </span>
    <h1 class="mt-4 text-5xl font-medium tracking-[-0.045em] leading-[1.02]">
      ${site.headline}
    </h1>
    <p class="mt-4 max-w-xl text-base text-zinc-400">
      ${site.subcopy}
    </p>
    <a href="#" class="mt-8 inline-flex rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black">
      ${site.cta} →
    </a>
  </div>
</section>`;
}

export function HeroWorkspaceWindow() {
  const [pack, setPack] = useState<StarterPackTab>("web-designer");
  const [splitPct, setSplitPct] = useState(43);
  const [tier, setTier] = useState<ModelTier>("balanced");
  const [credits, setCredits] = useState(197);
  const [prompt, setPrompt] = useState(PACK_PROMPTS["web-designer"]);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [site, setSite] = useState<MiniSite>(PRESETS.default);
  const [piping, setPiping] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const handlePackChange = (next: StarterPackTab) => {
    setPack(next);
    setPrompt(PACK_PROMPTS[next]);
  };

  const handlePointerDown = useCallback(() => {
    draggingRef.current = true;
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(60, Math.max(33, pct)));
    };
    const onUp = () => {
      draggingRef.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const handlePipe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = prompt.trim();
    if (!cleaned) return;

    if (pack === "web-designer") {
      const lower = cleaned.toLowerCase();
      const nextSite: MiniSite = lower.includes("studio") || lower.includes("atelier")
        ? PRESETS.studio
        : lower.includes("email") || lower.includes("relay")
          ? PRESETS.api
          : lower.includes("kestrel") || lower.includes("rust")
            ? PRESETS.default
            : {
                brand: "Custom Spec",
                eyebrow: "PIPED VIA ORTHESE/SPEC",
                headline: cleaned.length > 54 ? `${cleaned.slice(0, 52)}…` : cleaned,
                subcopy:
                  "Rendered live in Website Builder from the Shared Context Bus payload emitted by AI Prompt Box.",
                cta: "Launch Prototype",
                metrics: [
                  { label: "bus latency", value: "14 ms" },
                  { label: "target", value: "wasm32" },
                  { label: "export", value: "ZIP ready" },
                ],
              };
      setSite(nextSite);
    }

    const cost = TIER_COST[tier];
    setCredits((prev) => Math.max(0, prev - cost));
    setPiping(true);
    setTimeout(() => setPiping(false), 800);

    const targetName =
      pack === "web-designer"
        ? "Website Builder"
        : pack === "indie-builder"
          ? "Software Engineer"
          : "Research Canvas";

    toast.success("Piped orthese/spec across Shared Context Bus", {
      description: `AI Prompt Box (${tier}) → ${targetName} · −${cost} cr`,
    });
  };

  const handleExportZip = () => {
    const content = buildExportBundle(site);
    const blob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${site.brand.toLowerCase().replace(/\s+/g, "-")}-orthese-export.html`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported ZIP bundle", {
      description: `${site.brand} standalone HTML/Tailwind artifact saved.`,
    });
  };

  return (
    <div id="workspace-demo" className="scroll-mt-20">
      {/* Dark Obsidian Window Floating on Smoky-Silver Stage */}
      <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-[#0b0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_36px_100px_-14px_rgba(0,0,0,0.88)]">
        <div className="overflow-hidden bg-[#0b0c0e]">
          {/* Window Top Chrome Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0e0e11] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/[0.15]" />
              </div>
              <span className="hidden rounded border border-white/[0.07] bg-[#060607] px-2.5 py-0.5 font-mono text-[11px] text-[#71717a] sm:inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                app.orthese.com
              </span>
            </div>

            <SlidingTabs
              ariaLabel="Starter Pack Switcher"
              value={pack}
              onChange={handlePackChange}
              options={[
                { value: "web-designer", label: "Web Designer" },
                { value: "indie-builder", label: "Indie Builder" },
                { value: "daily-ai-desk", label: "Daily AI Desk" },
              ]}
            />

            <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
              <span
                data-testid="credit-counter"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#060607] px-2.5 py-1 text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <NumberFlow value={credits} />
                <span className="text-[#52525b]">cr</span>
              </span>
            </div>
          </div>

          {/* Resizable Two-Pane Canvas */}
          <div
            ref={containerRef}
            className="grid min-h-[500px] grid-cols-1 lg:flex lg:flex-row"
          >
            {/* LEFT PANE: AI Prompt Box */}
            <div
              data-testid="left-pane"
              className="flex flex-col justify-between border-b border-white/[0.06] bg-[#0a0a0c] lg:border-b-0"
              style={{ flexBasis: `${splitPct}%` }}
            >
              {/* Aligned 44px Header */}
              <div className="flex h-11 items-center justify-between gap-2 border-b border-white/[0.06] px-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                  <span className="truncate text-[13px] font-medium text-[#fafafa]">
                    AI Prompt Box
                  </span>
                </div>

                {/* Model Tier Pills */}
                <div
                  role="group"
                  aria-label="Model tier"
                  className="inline-flex items-center rounded-md border border-white/[0.08] bg-[#060607] p-0.5"
                >
                  {(["fast", "balanced", "reasoning"] as const).map((t) => {
                    const active = tier === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTier(t)}
                        className={cn(
                          "relative rounded px-2 py-0.5 font-mono text-[10px] transition-colors cursor-pointer",
                          active ? "text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]"
                        )}
                      >
                        {active && (
                          <motion.span
                            layoutId="model-tier-pill"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                            className="absolute inset-0 rounded bg-white/[0.11] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                          />
                        )}
                        <span className="relative z-10">{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Left Pane Body per Starter Pack */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <motion.div
                  key={`left-${pack}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3.5"
                >
                    <div className="rounded-lg border border-white/[0.07] bg-[#101013] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                      <div className="flex items-center justify-between text-[11px] text-[#71717a]">
                        <span className="flex items-center gap-1.5 font-medium text-[#a1a1aa]">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              pack === "indie-builder" ? "bg-amber-400" : "bg-emerald-400"
                            )}
                          />
                          {pack === "web-designer"
                            ? "Design Spec"
                            : pack === "indie-builder"
                              ? "Elevated Task · Desktop"
                              : "Research Query"}
                        </span>
                        <span className="font-mono text-[10px] text-[#52525b]">
                          orthese/spec
                        </span>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#e4e4e7]">
                        {prompt}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#71717a]">
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/[0.07] bg-white/[0.02] px-2 py-1 text-[#a1a1aa]">
                        ai:generate · {tier}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded border border-white/[0.07] bg-white/[0.02] px-2 py-1 text-[#a1a1aa]">
                        {pack === "indie-builder"
                          ? "scope: ~/projects/orthese"
                          : "context:send · 14ms"}
                      </span>
                    </div>

                    {pack === "web-designer" && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {[
                          {
                            label: "Kestrel Telemetry",
                            text: PACK_PROMPTS["web-designer"],
                            preset: PRESETS.default,
                          },
                          {
                            label: "Atelier 09 Studio",
                            text: "Build a restrained design engineering studio homepage for Atelier 09.",
                            preset: PRESETS.studio,
                          },
                          {
                            label: "Relay Email API",
                            text: "Create a clean developer landing hero for Relay, a transactional email API.",
                            preset: PRESETS.api,
                          },
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              setPrompt(item.text);
                              setSite(item.preset);
                              toast.message(`Loaded ${item.label} into Website Builder`);
                            }}
                            className="rounded border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#a1a1aa] hover:border-white/[0.16] hover:text-[#fafafa] transition-colors cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {pack === "indie-builder" && (
                      <div className="rounded-lg border border-white/[0.07] bg-[#0c0c0e] p-3 font-mono text-[11px] text-[#a1a1aa]">
                        <div className="flex items-center justify-between text-[10px] text-[#52525b]">
                          <span>ATTACHED CONTEXT</span>
                          <span>2 files</span>
                        </div>
                        <div className="mt-2 space-y-1 text-[#d4d4d8]">
                          <div>crates/orthese-sdk/src/lib.rs</div>
                          <div>crates/orthese-core/src/lib.rs</div>
                        </div>
                      </div>
                    )}

                    {pack === "daily-ai-desk" && (
                      <div className="rounded-lg border border-white/[0.07] bg-[#0c0c0e] p-3 font-mono text-[11px] text-[#a1a1aa]">
                        <div className="flex items-center justify-between text-[10px] text-[#52525b]">
                          <span>INDEXED SOURCES</span>
                          <span>3 notes</span>
                        </div>
                        <div className="mt-2 space-y-1 text-[#d4d4d8]">
                          <div>gpui-kit · wasm32 benchmark</div>
                          <div>Piece SDK v0.1 sandbox model</div>
                        </div>
                      </div>
                    )}
                </motion.div>

                {/* Prompt Composer */}
                <form onSubmit={handlePipe} className="mt-4">
                  <div className="rounded-lg border border-white/[0.1] bg-[#111113] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] focus-within:border-white/25 transition-colors">
                    <textarea
                      rows={2}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe an interface or spec to pipe across the bus..."
                      className="w-full resize-none bg-transparent text-[13px] leading-relaxed text-[#fafafa] placeholder:text-[#52525b] focus:outline-none"
                    />
                    <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2">
                      <span className="font-mono text-[10px] tabular-nums text-[#52525b]">
                        Est. {TIER_COST[tier]} cr · {tier}
                      </span>
                      <button
                        type="submit"
                        data-testid="pipe-spec-btn"
                        className="btn-primary inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium cursor-pointer"
                      >
                        <span>
                          Pipe <code className="font-mono text-[10px]">orthese/spec</code>
                        </span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* DRAGGABLE SPLIT-PANE DIVIDER with Hover Glow & Silver Bus Pulse */}
            <div
              role="separator"
              data-testid="split-divider"
              aria-orientation="vertical"
              aria-label="Drag to resize workspace panes"
              onPointerDown={handlePointerDown}
              className="group relative hidden w-3 shrink-0 cursor-col-resize items-center justify-center border-x border-white/[0.06] bg-[#070709] hover:bg-white/[0.04] transition-colors select-none lg:flex"
            >
              <div
                className={cn(
                  "w-[2px] rounded-full transition-all duration-300",
                  piping
                    ? "h-40 bg-white shadow-[0_0_20px_rgba(255,255,255,0.95)]"
                    : "h-10 bg-white/[0.14] group-hover:h-20 group-hover:bg-white/45 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                )}
              />
            </div>

            {/* RIGHT PANE: Dynamic Partner Piece */}
            <div className="flex flex-1 flex-col bg-[#08080a] min-w-0">
              {/* Aligned 44px Header */}
              <div className="flex h-11 items-center justify-between gap-2 border-b border-white/[0.06] px-4">
                <div className="flex items-center gap-2 min-w-0">
                  {pack === "web-designer" && (
                    <>
                      <Globe className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                      <span className="truncate text-[13px] font-medium text-[#fafafa]">
                        Website Builder
                      </span>
                    </>
                  )}
                  {pack === "indie-builder" && (
                    <>
                      <Terminal className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                      <span className="truncate text-[13px] font-medium text-[#fafafa]">
                        Software Engineer
                      </span>
                    </>
                  )}
                  {pack === "daily-ai-desk" && (
                    <>
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#a1a1aa]" />
                      <span className="truncate text-[13px] font-medium text-[#fafafa]">
                        Research Canvas
                      </span>
                    </>
                  )}
                </div>

                {pack === "web-designer" && (
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-md border border-white/[0.08] bg-[#060607] p-0.5">
                      {(
                        [
                          { id: "preview", label: "Preview", icon: Eye },
                          { id: "code", label: "Code", icon: Code2 },
                        ] as const
                      ).map((tab) => {
                        const Icon = tab.icon;
                        const active = viewMode === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setViewMode(tab.id)}
                            className={cn(
                              "relative inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer",
                              active ? "text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]"
                            )}
                          >
                            {active && (
                              <motion.span
                                layoutId="builder-view-pill"
                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                className="absolute inset-0 rounded bg-white/[0.11] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                              />
                            )}
                            <Icon className="relative z-10 h-3 w-3" />
                            <span className="relative z-10">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={handleExportZip}
                      className="btn-secondary inline-flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Export ZIP</span>
                    </button>
                  </div>
                )}

                {pack === "indie-builder" && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#a1a1aa]">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Elevated · Desktop
                  </span>
                )}

                {pack === "daily-ai-desk" && (
                  <button
                    type="button"
                    onClick={() => {
                      handlePackChange("web-designer");
                      toast.success("Piped Research Brief → Website Builder");
                    }}
                    className="btn-secondary inline-flex h-6 items-center gap-1 rounded-md px-2 text-[11px] font-medium cursor-pointer"
                  >
                    <span>Pipe to Builder</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Right Pane Body */}
              <div className="flex-1 p-4">
                {pack === "web-designer" && (
                  <motion.div
                    key={`web-${viewMode}-${site.brand}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    {viewMode === "preview" ? (
                      <div className="relative flex h-full min-h-[395px] flex-col justify-between overflow-hidden rounded-lg border border-white/[0.08] bg-[#060607] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[420px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl"
                        />

                        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-3.5 text-[11px]">
                          <span className="font-medium tracking-[-0.02em] text-[#fafafa]">
                            {site.brand}
                          </span>
                          <div className="flex items-center gap-4 text-[#71717a]">
                            <span>Docs</span>
                            <span>Benchmarks</span>
                            <span className="rounded bg-white/[0.08] px-2 py-0.5 text-[#fafafa]">
                              Sign in
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10 my-6">
                          <span className="font-mono text-[10px] tracking-[0.14em] text-[#71717a]">
                            {site.eyebrow}
                          </span>
                          <h3 className="mt-2.5 max-w-md bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-[26px] font-medium tracking-[-0.035em] leading-[1.06] text-transparent">
                            {site.headline}
                          </h3>
                          <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-[#a1a1aa]">
                            {site.subcopy}
                          </p>
                          <div className="mt-5 flex items-center gap-2.5">
                            <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#fafafa] px-3.5 text-[12px] font-medium text-[#060607]">
                              {site.cta}
                              <ArrowRight className="h-3 w-3" />
                            </span>
                            <span className="inline-flex h-8 items-center rounded-md border border-white/[0.1] px-3 text-[12px] text-[#a1a1aa]">
                              Live Demo
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.07] pt-3.5">
                          {site.metrics.map((m) => (
                            <div key={m.label} className="px-3 first:pl-0">
                              <span className="block font-mono text-[13px] font-medium tabular-nums text-[#fafafa]">
                                {m.value}
                              </span>
                              <span className="block text-[11px] text-[#52525b]">
                                {m.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <CodeBlock
                        code={buildExportBundle(site)}
                        filename={`${site.brand.toLowerCase().replace(/\s+/g, "-")}.html`}
                        language="html"
                        maxHeight="max-h-[395px]"
                      />
                    )}
                  </motion.div>
                )}

                {pack === "indie-builder" && (
                  <motion.div
                    key="indie-builder"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-3.5"
                  >
                    <CodeBlock
                      filename="crates/orthese-sdk/src/lib.rs"
                      language="diff"
                      maxHeight="max-h-[190px]"
                      code={`@@ -112,6 +112,9 @@ impl PieceManifest {
+    pub fn supports_wasm(&self) -> bool {
+        self.permissions.elevated.is_empty()
+    }
 }`}
                    />
                    <ApprovalCard
                      permission="shell:exec"
                      command="cargo test --workspace && cargo check --target wasm32-unknown-unknown"
                      scope="~/projects/orthese"
                      estimatedCredits={4}
                    />
                  </motion.div>
                )}

                {pack === "daily-ai-desk" && (
                  <motion.div
                    key="daily-ai-desk"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-full min-h-[395px] flex-col justify-between rounded-lg border border-white/[0.08] bg-[#0b0b0d] p-5"
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#52525b]">
                        RESEARCH BRIEF · SHARED CONTEXT BUS
                      </span>
                      <h3 className="mt-2.5 text-[18px] font-medium tracking-[-0.02em] text-[#fafafa]">
                        Single Rust + GPUI core for Native Desktop &amp; WASM
                      </h3>
                      <div className="mt-4 space-y-3 divide-y divide-white/[0.06] text-[13px] text-[#a1a1aa]">
                        <p className="pt-0 leading-relaxed">
                          <span className="mr-2 font-mono text-[11px] text-[#52525b]">01</span>
                          Zero duplicated UI codebases—standard Pieces run immediately inside the browser canvas.
                        </p>
                        <p className="pt-3 leading-relaxed">
                          <span className="mr-2 font-mono text-[11px] text-[#52525b]">02</span>
                          Elevated Pieces unlock local repos, stdio MCP servers, and CLIProxyAPI natively on Desktop.
                        </p>
                        <p className="pt-3 leading-relaxed">
                          <span className="mr-2 font-mono text-[11px] text-[#52525b]">03</span>
                          Every synthesized brief emits <code className="font-mono text-[12px] text-[#fafafa]">orthese/spec</code> directly to downstream Pieces.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] text-[#52525b]">
                      <span>3 citations indexed</span>
                      <span>Ready to emit · orthese/spec</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
