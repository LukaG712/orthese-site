"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  Cpu,
  Layers,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { ProviderGlyph, type ProviderId } from "@/components/landing/ModelSelectorPopover";
import { cn } from "@/lib/cn";

type RouteTierKey = "efficient" | "mid" | "frontier";

interface RoutedModelNode {
  key: RouteTierKey;
  model: string;
  provider: string;
  brandIcons: ProviderId[];
  priceTier: "$" | "$$" | "$$$";
  costCr: number;
  relative: string;
  bestFor: string;
}

const MODEL_NODES: RoutedModelNode[] = [
  {
    key: "efficient",
    model: "Gemini 4 Hydrogen",
    provider: "Google",
    brandIcons: ["google"],
    priceTier: "$",
    costCr: 1,
    relative: "0.16×",
    bestFor: "Copy tweaks, formatting, quick SQL & lightweight agent edits",
  },
  {
    key: "mid",
    model: "Gemini 4 Neon · GPT-6.2 Sol",
    provider: "Google / OpenAI",
    brandIcons: ["google", "openai"],
    priceTier: "$$",
    costCr: 3,
    relative: "0.50×",
    bestFor: "UI layouts, API endpoints, long-context docs & multi-file components",
  },
  {
    key: "frontier",
    model: "Claude Opus 5.5 · GPT-6.2 Astra",
    provider: "Anthropic / OpenAI",
    brandIcons: ["anthropic", "openai"],
    priceTier: "$$$",
    costCr: 6,
    relative: "1.0×",
    bestFor: "Deep architecture, Rust sandboxes, security audits & escalations",
  },
];

const DEMO_PROMPTS: {
  prompt: string;
  piece: string;
  target: RouteTierKey;
  chosenModel: string;
  reason: string;
}[] = [
  {
    prompt: "Fix spacing on the footer copyright line",
    piece: "orthese.website-builder",
    target: "efficient",
    chosenModel: "Gemini 4 Hydrogen",
    reason: "Single-line CSS adjustment — routed to efficient pool (83% token savings).",
  },
  {
    prompt: "Add pagination & filtering to the Pieces registry API",
    piece: "orthese.software-engineer",
    target: "mid",
    chosenModel: "Gemini 4 Neon",
    reason: "Scoped multi-file feature — routed to Gemini 4 Neon for long-context balance (50% savings).",
  },
  {
    prompt: "Build a dark obsidian pricing strip with Polar checkout",
    piece: "orthese.website-builder",
    target: "mid",
    chosenModel: "GPT-6.2 Sol",
    reason: "Structured UI layout + state wiring — routed to GPT-6.2 Sol via Cloudflare Edge.",
  },
  {
    prompt: "Design the Rust GPUI permission sandbox & MCP allowlist verifier",
    piece: "orthese.software-engineer",
    target: "frontier",
    chosenModel: "Claude Opus 5.5",
    reason: "High-complexity systems & security boundary — kept directly on frontier.",
  },
];

function classifyPrompt(text: string): {
  target: RouteTierKey;
  chosenModel: string;
  reason: string;
} {
  const lower = text.toLowerCase();
  if (
    lower.includes("architect") ||
    lower.includes("sandbox") ||
    lower.includes("security") ||
    lower.includes("rust") ||
    lower.includes("refactor") ||
    lower.includes("caching") ||
    lower.includes("audit")
  ) {
    return {
      target: "frontier",
      chosenModel: lower.includes("architect") ? "GPT-6.2 Astra" : "Claude Opus 5.5",
      reason: "High-complexity reasoning & architectural constraints — kept on frontier.",
    };
  }
  if (
    lower.includes("typo") ||
    lower.includes("copyright") ||
    lower.includes("padding") ||
    lower.includes("spacing") ||
    lower.includes("rename") ||
    lower.includes("format") ||
    lower.includes("sql")
  ) {
    return {
      target: "efficient",
      chosenModel: "Gemini 4 Hydrogen",
      reason: "Routine deterministic edit — routed to Gemini 4 Hydrogen for 83% savings.",
    };
  }
  return {
    target: "mid",
    chosenModel: lower.includes("pricing") || lower.includes("ui") ? "GPT-6.2 Sol" : "Gemini 4 Neon",
    reason: "Standard feature implementation — balanced quality & token efficiency (50% savings).",
  };
}

interface ComparisonRow {
  prompt: string;
  routedModel: string;
  routedCost: number;
  frontierCost: number;
  note?: string;
}

const WORKLOAD_PROFILES: Record<
  "desk" | "designer" | "builder",
  { label: string; rows: ComparisonRow[] }
> = {
  desk: {
    label: "Daily AI Desk",
    rows: [
      { prompt: "“Summarize this 4-page PR diff”", routedModel: "Gemini 4 Hydrogen", routedCost: 1, frontierCost: 6 },
      { prompt: "“Add MIT license header to 6 files”", routedModel: "Muse Ember", routedCost: 1, frontierCost: 6 },
      { prompt: "“Draft a release changelog from git log”", routedModel: "Gemini 4 Neon", routedCost: 3, frontierCost: 6 },
      { prompt: "“Audit elevated shell permissions”", routedModel: "Claude Opus 5.5", routedCost: 6, frontierCost: 6, note: "kept on frontier" },
    ],
  },
  designer: {
    label: "Web Designer",
    rows: [
      { prompt: "“Tighten navbar tracking to -0.02em”", routedModel: "Gemini 4 Hydrogen", routedCost: 1, frontierCost: 6 },
      { prompt: "“Convert SVG logo to monochrome”", routedModel: "Gemini 4 Hydrogen", routedCost: 1, frontierCost: 6 },
      { prompt: "“Generate dark hairline pricing grid”", routedModel: "GPT-6.2 Sol", routedCost: 3, frontierCost: 6 },
      { prompt: "“Build interactive split-pane canvas”", routedModel: "Gemini 4 Neon", routedCost: 3, frontierCost: 6 },
    ],
  },
  builder: {
    label: "Indie Builder",
    rows: [
      { prompt: "“Fix TypeScript import path in SDK”", routedModel: "Gemini 4 Hydrogen", routedCost: 1, frontierCost: 6 },
      { prompt: "“Add pagination to Marketplace API”", routedModel: "Gemini 4 Neon", routedCost: 3, frontierCost: 6 },
      { prompt: "“Wire Polar credit-pack webhook”", routedModel: "GPT-6.2 Sol", routedCost: 3, frontierCost: 6 },
      { prompt: "“Design multi-crate WASM Context Bus”", routedModel: "GPT-6.2 Astra", routedCost: 6, frontierCost: 6, note: "kept on frontier" },
    ],
  },
};

const POLICIES = [
  {
    id: "piece-policy",
    title: "Per-Piece model policy",
    summary: "Pin mission-critical Pieces to frontier models while utility Pieces auto-route.",
    code: `{
  "id": "orthese.software-engineer",
  "defaultModel": "orthese-router",
  "routerPolicy": {
    "minModel": "gemini-4-neon",
    "escalateTo": "claude-opus-5.5",
    "allowLocalCliProxy": true
  }
}`,
  },
  {
    id: "budget-rules",
    title: "Routing rules & token ceilings",
    summary: "Set workspace token guardrails, prefer CLIProxyAPI OAuth quotas, or cap auto-escalation.",
    code: `{
  "workspace": "studio-default",
  "monthlyCreditCap": 2600,
  "preferLocalOAuth": true,
  "escalateOnTestFailure": true,
  "fallbackOrder": ["anthropic", "openai", "google", "meta"]
}`,
  },
];

const FAQS = [
  {
    q: "What is Orthese Router?",
    a: "Orthese Router is automatic real-model selection built directly into the Orthese Composer Panel and Base Harness. Choose Orthese Router (Auto) once, and every prompt is routed to the best real model—Gemini 4 Hydrogen, Gemini 4 Neon, GPT-6.2 Sol, Claude Opus 5.5, or GPT-6.2 Astra—using your existing non-expiring Orthese Tokens.",
  },
  {
    q: "Can I still pick a specific real model manually?",
    a: "Yes. Orthese Router is completely optional. You can switch between Orthese Router (Auto), Claude Opus 5.5, Claude Fable 5.2, GPT-6.2 Astra, Gemini 4 Neon, Meta Muse, Grok 4.7, DeepSeek V4.1, or your local Ollama / CLIProxyAPI sidecar at any time—per prompt or per Piece.",
  },
  {
    q: "What happens if an efficient model struggles on a task?",
    a: "If a routed model stalls, produces failing typechecks, or hits multi-file complexity mid-turn, Orthese Router automatically escalates the thread to Claude Opus 5.5 or GPT-6.2 Astra while preserving the full Shared Context Bus history.",
  },
  {
    q: "How does it work with Orthese Tokens and CLIProxyAPI?",
    a: "Every routed call is metered transparently in Orthese Tokens at the chosen model's exact rate (~1 cr for Gemini 4 Hydrogen / Muse Ember, ~3–4 cr for GPT-6.2 Sol / Gemini 4 Neon, ~5–8 cr for Claude Opus 5.5 / GPT-6.2 Astra). On Desktop, you can also let Orthese Router spill eligible turns to your local CLIProxyAPI OAuth subscriptions for €0.",
  },
  {
    q: "Where can I use Orthese Router?",
    a: "Orthese Router works identically in the zero-install WebAssembly browser workstation and the native 120fps Rust + GPUI Desktop app, across every official and Marketplace Piece.",
  },
  {
    q: "How do Piece authors opt in inside piece.json?",
    a: 'Set "defaultModel": "orthese-router" (or any real model ID like "gemini-4-neon" or "claude-opus-5.5") in piece.json. Users can always override the default model directly from the Composer Panel.',
  },
];

export function RouterPageClient() {
  const [selectedDemoIdx, setSelectedDemoIdx] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [activeInput, setActiveInput] = useState(DEMO_PROMPTS[0].prompt);
  const [escalated, setEscalated] = useState(false);
  const [profile, setProfile] = useState<"desk" | "designer" | "builder">("builder");
  const [openPolicy, setOpenPolicy] = useState<string | null>("piece-policy");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const routingDecision = useMemo(() => {
    const preset = DEMO_PROMPTS.find((d) => d.prompt === activeInput);
    const base = preset
      ? {
          target: preset.target,
          chosenModel: preset.chosenModel,
          reason: preset.reason,
        }
      : classifyPrompt(activeInput);

    if (escalated && base.target !== "frontier") {
      return {
        target: "frontier" as RouteTierKey,
        chosenModel: "Claude Opus 5.5",
        reason: `Escalated automatically from ${base.chosenModel} → Claude Opus 5.5 after detecting multi-file complexity.`,
        escalatedFrom: base.chosenModel,
      };
    }

    return { ...base, escalatedFrom: null as string | null };
  }, [activeInput, escalated]);

  const activeNode =
    MODEL_NODES.find((n) => n.key === routingDecision.target) ?? MODEL_NODES[1];
  const savedPct = Math.round(((6 - activeNode.costCr) / 6) * 100);

  const activeProfile = WORKLOAD_PROFILES[profile];
  const frontierTotal = activeProfile.rows.reduce((sum, r) => sum + r.frontierCost, 0);
  const routedTotal = activeProfile.rows.reduce((sum, r) => sum + r.routedCost, 0);
  const profileSavedPct = Math.round(((frontierTotal - routedTotal) / frontierTotal) * 100);

  const runCustomPrompt = () => {
    const trimmed = customPrompt.trim();
    if (!trimmed) return;
    setEscalated(false);
    setActiveInput(trimmed);
  };

  return (
    <div className="bg-[#121212] text-[#fafafa]">
      {/* 1. HERO + INTERACTIVE LIVE ROUTER STAGE */}
      <section className="relative overflow-x-clip px-5 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 48% at 50% 0%, rgba(255,255,255,0.065), rgba(129,140,248,0.03) 45%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-[1080px]">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a3a3a3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />
              <span>Orthese Router · Automatic Real-Model Selection</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,3.9rem)] font-medium tracking-[-0.04em] leading-[1.06] text-[#fafafa]">
              The right model
              <br />
              <OrbitGradientText>for every Piece.</OrbitGradientText>
            </h1>

            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#a3a3a3]">
              Automatic model selection across every Orthese session. Orthese Router preserves
              frontier quality on complex work and cuts token spend by up to 63%—choose it once in
              the Composer Panel.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/#workspace-demo"
                className="btn-pill-white inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium"
              >
                Try in Composer
              </Link>
              <a
                href="#cost-comparison"
                className="inline-flex items-center gap-1 text-[13px] text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
              >
                <span>Compare token costs</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* LIVE INTERACTIVE ROUTER SIMULATOR */}
          <div className="stage-surface mt-12 overflow-hidden rounded-2xl p-5 sm:p-8">
            {/* Prompt Input + Auto Pill */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCustomPrompt();
              }}
              className="rounded-xl border border-white/[0.1] bg-[#171717] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  data-testid="router-demo-input"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={activeInput}
                  className="h-8 flex-1 bg-transparent text-[14px] text-[#fafafa] placeholder:text-[#d4d4d4] focus:outline-none"
                />
                <button
                  type="submit"
                  data-testid="router-demo-submit"
                  aria-label="Route prompt"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fafafa] text-[#121212] hover:bg-white transition-colors cursor-pointer"
                >
                  <ArrowUp className="h-4 w-4 stroke-[2.4]" />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#818cf8]/35 bg-[#818cf8]/10 px-2.5 py-0.5 text-[11.5px] font-medium text-[#c7d2fe]">
                    <Sparkles className="h-3 w-3" />
                    <span>Orthese Router · Auto</span>
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-[#a3a3a3]">
                    MCP
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-[#a3a3a3]">
                    SKILL.md
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="simulate-escalation-btn"
                  onClick={() => setEscalated((v) => !v)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-colors cursor-pointer",
                    escalated
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                      : "border-white/[0.08] bg-white/[0.03] text-[#a3a3a3] hover:text-[#fafafa]"
                  )}
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{escalated ? "Escalation active" : "Simulate escalation"}</span>
                </button>
              </div>
            </form>

            {/* Clickable Preset Prompts */}
            <div className="mt-3.5 flex flex-wrap gap-2">
              {DEMO_PROMPTS.map((item, idx) => {
                const active = activeInput === item.prompt;
                return (
                  <button
                    key={item.prompt}
                    type="button"
                    data-testid={`router-preset-${idx}`}
                    onClick={() => {
                      setSelectedDemoIdx(idx);
                      setCustomPrompt("");
                      setEscalated(false);
                      setActiveInput(item.prompt);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-[12px] transition-colors cursor-pointer",
                      active
                        ? "border-white/25 bg-white/[0.1] text-[#fafafa]"
                        : "border-white/[0.07] bg-white/[0.02] text-[#a3a3a3] hover:border-white/[0.16] hover:text-[#fafafa]"
                    )}
                  >
                    {item.prompt}
                  </button>
                );
              })}
            </div>

            {/* 3-Column Live Model Destination Strip */}
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {MODEL_NODES.map((node) => {
                const isSelected = routingDecision.target === node.key;
                return (
                  <div
                    key={node.key}
                    data-testid={`router-node-${node.key}`}
                    className={cn(
                      "relative rounded-xl border p-4 transition-all duration-200",
                      isSelected
                        ? "border-white/25 bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                        : "border-white/[0.06] bg-[#171717]/70 opacity-55"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "h-2 w-2 shrink-0 rounded-full",
                            isSelected ? "bg-emerald-400" : "bg-white/20"
                          )}
                        />
                        <div className="flex shrink-0 items-center gap-1 text-[#d4d4d4]">
                          {node.brandIcons.map((b) => (
                            <ProviderGlyph key={b} provider={b} className="h-3.5 w-3.5" />
                          ))}
                        </div>
                        <span className="truncate text-[13.5px] font-medium text-[#fafafa]">
                          {node.model}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-[#a3a3a3]">
                        {node.priceTier}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-[#737373]">
                      <span>{node.provider}</span>
                      <span className={cn("tabular-nums", isSelected && "text-[#fafafa]")}>
                        ~{node.costCr} cr / turn
                      </span>
                    </div>

                    <p className="mt-3 text-[12px] leading-relaxed text-[#a3a3a3]">
                      {node.bestFor}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live Routing Decision Telemetry Bar */}
            <motion.div
              key={`${routingDecision.chosenModel}-${String(escalated)}-${selectedDemoIdx}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              data-testid="router-decision-bar"
              className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-[#090a0d] px-4 py-3 text-[12.5px]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-[#818cf8]" />
                <span className="text-[#a3a3a3]">Selected:</span>
                <span className="font-mono text-[12px] font-medium text-[#fafafa]">
                  {routingDecision.chosenModel}
                </span>
                <span className="text-[#737373]">·</span>
                <span className="text-[#d4d4d4]">{routingDecision.reason}</span>
              </div>

              <div className="font-mono text-[11.5px] tabular-nums text-[#fafafa]">
                {savedPct > 0 ? (
                  <span className="text-emerald-400">-{savedPct}% vs Opus 5.5</span>
                ) : (
                  <span className="text-[#a5b4fc]">Frontier precision</span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FOUR-COLUMN HAIRLINE METRICS STRIP */}
      <section className="mx-auto max-w-[1080px] px-5 py-12 sm:px-6">
        <div className="grid grid-cols-2 divide-y divide-white/[0.07] border-y border-white/[0.07] lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {[
            { value: "63%", label: "Aggregate token savings", sub: "across routed Piece sessions" },
            { value: "72.5%", label: "Median session savings", sub: "vs always-frontier pricing" },
            { value: "1 in 3", label: "At least 80% cheaper", sub: "routed to Gemini 4 Hydrogen" },
            { value: "99.9%+", label: "Request reliability", sub: "with automatic failover" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="py-7 lg:px-7 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="font-mono text-3xl font-medium tracking-[-0.04em] tabular-nums text-[#fafafa] sm:text-[40px]">
                {stat.value}
              </div>
              <div className="mt-2 text-[13.5px] font-medium text-[#fafafa]">
                {stat.label}
              </div>
              <div className="mt-0.5 text-[12.5px] text-[#737373]">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS (01 / 02 / 03) */}
      <section className="mx-auto max-w-[1080px] px-5 py-24 sm:px-6 sm:py-32">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] sm:text-[40px]">
            Stop choosing a model
            <br />
            <OrbitGradientText>for every task.</OrbitGradientText>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">
            Most builders pin their most expensive model just to stay safe. Choose Orthese Router
            once and keep frontier intelligence where it matters.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            {
              num: "01",
              title: "Select Orthese Router once.",
              body: "Pick Orthese Router (Auto) in the Composer Panel or set defaultModel to orthese-router in piece.json.",
            },
            {
              num: "02",
              title: "Routes each prompt to a real model.",
              body: "Draws from Gemini 4 Hydrogen, Gemini 4 Neon, GPT-6.2 Sol, Claude Opus 5.5, and GPT-6.2 Astra—metered cleanly in Orthese Tokens.",
            },
            {
              num: "03",
              title: "Recovers if a model struggles.",
              body: "If an efficient model stalls on a diff or test failure, Orthese Router escalates seamlessly to Claude Opus 5.5 or GPT-6.2 Astra.",
            },
          ].map((step) => (
            <div key={step.num} className="border-t border-white/[0.08] pt-6">
              <span className="font-mono text-[11px] tracking-[0.14em] text-[#737373]">
                {step.num}
              </span>
              <h3 className="mt-3 text-[16px] font-medium tracking-[-0.02em] text-[#fafafa]">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#a3a3a3]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SAME PROMPTS. DIFFERENT COST. (INTERACTIVE SIDE-BY-SIDE COMPARISON) */}
      <section
        id="cost-comparison"
        className="scroll-mt-20 mx-auto max-w-[1080px] border-t border-white/[0.06] px-5 py-24 sm:px-6 sm:py-32"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] sm:text-[40px]">
              Same prompts.
              <br />
              <OrbitGradientText>Different token cost.</OrbitGradientText>
            </h2>
          </div>

          {/* Workload Profile Switcher */}
          <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#171717] p-0.5">
            {(["desk", "designer", "builder"] as const).map((key) => {
              const active = profile === key;
              return (
                <button
                  key={key}
                  type="button"
                  data-testid={`profile-${key}`}
                  onClick={() => setProfile(key)}
                  className={cn(
                    "relative rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer",
                    active ? "text-[#fafafa]" : "text-[#a3a3a3] hover:text-[#fafafa]"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="router-profile-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-[6px] bg-white/[0.1]"
                    />
                  )}
                  <span className="relative z-10">{WORKLOAD_PROFILES[key].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Left: Without Routing */}
          <div className="stage-surface rounded-xl p-6">
            <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-4">
              <div>
                <div className="text-[14px] font-medium text-[#fafafa]">
                  Without Routing
                </div>
                <div className="font-mono text-[11px] text-[#737373]">
                  Always Claude Opus 5.5
                </div>
              </div>
              <div className="font-mono text-[18px] font-medium tabular-nums text-[#a3a3a3]">
                <NumberFlow value={frontierTotal} /> cr
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {activeProfile.rows.map((row) => (
                <div key={row.prompt} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[12.5px]">
                    <span className="truncate text-[#d4d4d4]">{row.prompt}</span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#a3a3a3]">
                      Claude Opus 5.5 · {row.frontierCost} cr
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-full rounded-full bg-white/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: With Orthese Router */}
          <div className="stage-surface rounded-xl border border-white/[0.12] p-6">
            <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2 text-[14px] font-medium text-[#fafafa]">
                  <span>With Orthese Router</span>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-mono text-[10.5px] text-emerald-400 tabular-nums">
                    -<NumberFlow value={profileSavedPct} />%
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#737373]">
                  Routed per task · real models
                </div>
              </div>
              <div className="font-mono text-[18px] font-medium tabular-nums text-[#fafafa]">
                <NumberFlow value={routedTotal} /> cr
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {activeProfile.rows.map((row) => {
                const pct = Math.max(16, Math.round((row.routedCost / row.frontierCost) * 100));
                return (
                  <div key={row.prompt} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[12.5px]">
                      <span className="truncate text-[#fafafa]">{row.prompt}</span>
                      <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#a5b4fc]">
                        {row.routedModel}
                        {row.note ? ` · ${row.note}` : ""} · {row.routedCost} cr
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        key={`${profile}-${row.prompt}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-[#fafafa]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELIABILITY GRID */}
      <section className="mx-auto max-w-[1080px] border-t border-white/[0.06] px-5 py-24 sm:px-6 sm:py-32">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] sm:text-[40px]">
            Reliability
            <br />
            <OrbitGradientText>you can count on.</OrbitGradientText>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">
            When a provider degrades or rate limits spike, your Pieces keep streaming. Orthese
            Router routes across providers and local sidecars for 99.9%+ reliability.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
          {[
            {
              icon: Activity,
              title: "Automatic provider failover",
              body: "If an upstream provider degrades or throws 429s, Orthese Router reroutes seamlessly on a healthy path without resetting your Piece.",
            },
            {
              icon: Zap,
              title: "Hybrid CLIProxyAPI handoff",
              body: "On Desktop, spill eligible calls into your local CLI OAuth quotas (Claude Code, Codex, Gemini CLI) at €0—or stay on Cloudflare Edge tokens.",
            },
            {
              icon: Layers,
              title: "Frontier models on day one",
              body: "New Anthropic, OpenAI, and Google releases land directly in the real-model pool—no waiting for opaque abstract tiers to catch up.",
            },
            {
              icon: ShieldCheck,
              title: "Zero-retention edge proxy",
              body: "Payloads stream directly through Cloudflare Workers with strict piece.json permission envelopes and zero training on your code.",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-[#171717] p-7">
                <Icon className="h-4 w-4 text-[#a3a3a3]" />
                <h3 className="mt-4 text-[15px] font-medium text-[#fafafa]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#a3a3a3]">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. WORKSPACE & PIECE POLICIES */}
      <section className="mx-auto max-w-[1080px] border-t border-white/[0.06] px-5 py-24 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-medium tracking-[-0.035em] leading-[1.12] text-[#fafafa] sm:text-3xl">
              Routing that reflects
              <br />
              <OrbitGradientText>how your Pieces work.</OrbitGradientText>
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#a3a3a3]">
              Declare model boundaries directly in{" "}
              <code className="font-mono text-[12.5px] text-[#fafafa]">piece.json</code> or
              workspace config—no separate control plane required.
            </p>
          </div>

          <div className="space-y-3 md:col-span-7">
            {POLICIES.map((pol) => {
              const open = openPolicy === pol.id;
              return (
                <div
                  key={pol.id}
                  className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#171717]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenPolicy(open ? null : pol.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                  >
                    <div>
                      <div className="text-[14px] font-medium text-[#fafafa]">
                        {pol.title}
                      </div>
                      <div className="mt-0.5 text-[12.5px] text-[#a3a3a3]">
                        {pol.summary}
                      </div>
                    </div>
                    <Plus
                      className={cn(
                        "h-4 w-4 shrink-0 text-[#a3a3a3] transition-transform duration-200",
                        open && "rotate-45 text-[#fafafa]"
                      )}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-white/[0.06] bg-[#121212] px-5 py-4">
                      <pre className="overflow-x-auto font-mono text-[12px] leading-[1.65] text-[#d4d4d4]">
                        {pol.code}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="mx-auto max-w-[1080px] border-t border-white/[0.06] px-5 py-24 sm:px-6">
        <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#fafafa] sm:text-3xl">
          Frequently asked <OrbitGradientText>questions</OrbitGradientText>
        </h2>

        <div className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {FAQS.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  data-testid={`faq-${idx}`}
                  onClick={() => setOpenFaq(open ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span className="text-[15px] font-medium text-[#fafafa]">{item.q}</span>
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#a3a3a3] transition-transform duration-200",
                      open && "rotate-45 text-[#fafafa]"
                    )}
                  />
                </button>
                {open && (
                  <p className="pb-5 pr-8 text-[14px] leading-relaxed text-[#a3a3a3]">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CLOSING CTA */}
      <section className="px-5 py-28 text-center sm:px-6 sm:py-36">
        <h2 className="text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#fafafa] sm:text-[46px]">
          Frontier quality. Zero wasted tokens.
          <br />
          <OrbitGradientText>Try Orthese Router today.</OrbitGradientText>
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#workspace-demo"
            className="btn-pill-white inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-[13.5px] font-medium"
          >
            <span>Open Composer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/marketplace"
            className="btn-pill-dark inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-[13.5px] font-medium"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Browse Pieces</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
