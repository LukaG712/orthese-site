import Link from "next/link";
import { ArrowRight, BookOpen, Cpu, Layers, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";

const DOC_SECTIONS = [
  { id: "quickstart", label: "Quickstart" },
  { id: "piece-sdk", label: "Piece SDK (piece.json)" },
  { id: "context-bus", label: "Shared Context Bus" },
  { id: "skills", label: "Progressive SKILL.md" },
  { id: "mcp", label: "Scoped MCP Hub" },
  { id: "permissions", label: "Permissions & WASM" },
  { id: "router", label: "Orthese Router" },
  { id: "runtime", label: "Desktop GPUI Runtime" },
];

const PIECE_MANIFEST_EXAMPLE = `{
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
    "tokenRevShare": true
  }
}`;

const SKILL_MD_EXAMPLE = `---
name: landing-page-architect
description: Minimalist dark obsidian landing pages with tabular metrics
triggers: ["landing page", "hero", "marketing site"]
---

# Landing Page Architect

1. Start from an optically centered full-viewport hero on #121212.
2. Keep copy concise; pair every interactive widget with hairline borders.
3. Emit valid orthese/html-bundle payloads directly onto the Shared Context Bus.`;

export default function DocsPage() {
  return (
    <div className="bg-[#121212]">
      <div className="mx-auto max-w-[1024px] px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32">
        {/* Header */}
        <div className="max-w-2xl border-b border-white/[0.07] pb-8 sm:pb-10">
          <div className="inline-flex items-center gap-2 text-[12px] font-medium text-[#a3a3a3]">
            <BookOpen className="h-3.5 w-3.5 text-[#818cf8]" />
            <span>Documentation</span>
          </div>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#fafafa] sm:text-[42px]">
            Build with <OrbitGradientText>Orthese.</OrbitGradientText>
          </h1>
          <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#a3a3a3] sm:text-[15px]">
            Everything you need to run modular Pieces in WebAssembly or Desktop GPUI, pipe
            typed context payloads, load progressive <code className="font-mono text-[13px] text-[#d4d4d4]">SKILL.md</code> files, and route across 44 models.
          </p>

          {/* Mobile Horizontal Section Jump Bar */}
          <nav
            aria-label="Jump to section"
            className="-mx-4 mt-5 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden"
          >
            {DOC_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="shrink-0 rounded-full border border-white/[0.09] bg-[#171717] px-3 py-1.5 text-[12px] text-[#d4d4d4] hover:border-white/[0.2] hover:text-[#fafafa] transition-colors"
              >
                {sec.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Sticky Sidebar + Main Docs Content */}
        <div className="mt-10 grid gap-12 sm:mt-12 lg:grid-cols-[200px_1fr]">
          <aside className="hidden lg:block">
            <nav aria-label="Documentation sections" className="sticky top-28 space-y-1">
              <div className="mb-2.5 text-[11px] font-medium text-[#737373]">
                On this page
              </div>
              {DOC_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block rounded-md px-2.5 py-1.5 text-[13px] text-[#a3a3a3] hover:bg-white/[0.04] hover:text-[#fafafa] transition-colors"
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-16">
            {/* 1. Quickstart */}
            <section id="quickstart" className="scroll-mt-20 space-y-4">
              <h2 className="text-[22px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Quickstart
              </h2>
              <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Orthese compiles from one Rust + GPUI core to both a zero-install WebAssembly
                browser dashboard and a native 120fps Desktop binary (macOS Apple Silicon,
                Windows x64/ARM64, and Linux).
              </p>
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <Link
                  href="/#workspace-demo"
                  className="group rounded-xl border border-white/[0.09] bg-[#171717] p-4 hover:border-white/[0.18] transition-colors"
                >
                  <div className="flex items-center justify-between text-[13.5px] font-medium text-[#fafafa]">
                    <span>Browser WASM Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#737373] group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                    Try Pieces immediately in Chrome, Safari, or Firefox with €2 free starter credits.
                  </p>
                </Link>
                <Link
                  href="/marketplace"
                  className="group rounded-xl border border-white/[0.09] bg-[#171717] p-4 hover:border-white/[0.18] transition-colors"
                >
                  <div className="flex items-center justify-between text-[13.5px] font-medium text-[#fafafa]">
                    <span>Explore Marketplace</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#737373] group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                    Snap verified official Pieces, community tools, and progressive Skills onto your canvas.
                  </p>
                </Link>
              </div>
            </section>

            {/* 2. Piece SDK */}
            <section id="piece-sdk" className="scroll-mt-20 space-y-4 border-t border-white/[0.06] pt-12">
              <div className="flex items-center gap-2 text-[12px] text-[#a3a3a3]">
                <Layers className="h-3.5 w-3.5 text-[#818cf8]" />
                <span>SDK &amp; Manifest</span>
              </div>
              <h2 className="text-[22px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Piece SDK (<code className="font-mono text-[19px]">piece.json</code>)
              </h2>
              <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Every Piece declares its capabilities, accepted/emitted context contracts, default
                real model, and optional <code className="font-mono text-[13px] text-[#d4d4d4]">tokenRevShare</code> in a single manifest. Free Pieces with{" "}
                <code className="font-mono text-[13px] text-[#d4d4d4]">tokenRevShare: true</code> earn 20% of token margin automatically.
              </p>
              <CodeBlock code={PIECE_MANIFEST_EXAMPLE} language="json" filename="piece.json" />
            </section>

            {/* 3. Shared Context Bus */}
            <section id="context-bus" className="scroll-mt-20 space-y-4 border-t border-white/[0.06] pt-12">
              <h2 className="text-[22px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Shared Context Bus
              </h2>
              <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Pieces never force copy-pasting between tabs. Any Piece emitting a typed contract
                publishes directly onto <code className="font-mono text-[13px] text-[#d4d4d4]">bus://workspace.default</code> so downstream panes receive structured state immediately:
              </p>
              <div className="grid gap-3 sm:grid-cols-3 pt-1">
                {[
                  { type: "orthese/spec", desc: "Structured architecture & UI specs drafted by AI Prompt Box." },
                  { type: "orthese/html-bundle", desc: "Live previewable HTML/Tailwind artifacts rendered in Website Builder." },
                  { type: "orthese/git-diff", desc: "Folder-scoped patches & test reports verified in Software Engineer." },
                ].map((c) => (
                  <div
                    key={c.type}
                    className="rounded-xl border border-white/[0.08] bg-[#171717] p-4"
                  >
                    <div className="font-mono text-[12px] text-[#a5b4fc]">{c.type}</div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Progressive SKILL.md */}
            <section id="skills" className="scroll-mt-20 space-y-4 border-t border-white/[0.06] pt-12">
              <div className="flex items-center gap-2 text-[12px] text-[#a3a3a3]">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>Context Efficiency</span>
              </div>
              <h2 className="text-[22px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Progressive <code className="font-mono text-[19px]">SKILL.md</code>
              </h2>
              <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Skills stay indexed as lightweight frontmatter metadata and stream their full
                instruction body into the active context window only when triggered—keeping token
                usage lean.
              </p>
              <CodeBlock code={SKILL_MD_EXAMPLE} language="markdown" filename="skills/landing-page-architect/SKILL.md" />
            </section>

            {/* 5. Scoped MCP Hub & Permissions */}
            <section id="mcp" className="scroll-mt-20 space-y-4 border-t border-white/[0.06] pt-12">
              <div className="flex items-center gap-2 text-[12px] text-[#a3a3a3]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Security &amp; Tooling</span>
              </div>
              <h2 id="permissions" className="scroll-mt-20 text-[22px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Scoped MCP Hub &amp; Tiered Permissions
              </h2>
              <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Configure local stdio or remote Streamable HTTP MCP servers once in the workspace
                hub with per-Piece allowlists. Standard scopes (<code className="font-mono text-[13px] text-[#d4d4d4]">ai:generate</code>,{" "}
                <code className="font-mono text-[13px] text-[#d4d4d4]">context:*</code>) run safely in WebAssembly; elevated scopes (
                <code className="font-mono text-[13px] text-[#d4d4d4]">fs:write</code>,{" "}
                <code className="font-mono text-[13px] text-[#d4d4d4]">shell:exec</code>, local stdio MCP) prompt with click-to-approve diff guardrails on Desktop.
              </p>
            </section>

            {/* 6. Router & Runtime */}
            <section id="router" className="scroll-mt-20 space-y-4 border-t border-white/[0.06] pt-12">
              <div className="flex items-center gap-2 text-[12px] text-[#a3a3a3]">
                <Cpu className="h-3.5 w-3.5 text-fuchsia-400" />
                <span>Hybrid Execution</span>
              </div>
              <h2 id="runtime" className="scroll-mt-20 text-[22px] font-medium tracking-[-0.025em] text-[#fafafa]">
                Orthese Router &amp; Desktop GPUI Runtime
              </h2>
              <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                Select any of 44 real models across 13 providers—including Claude Opus 5.5, GPT-6.2
                Astra, Gemini 4 Neon, and Meta Muse—or let <strong className="font-medium text-[#fafafa]">Auto</strong> and{" "}
                <strong className="font-medium text-[#fafafa]">Max</strong> route dynamically per turn. On Desktop, toggle the local{" "}
                <code className="font-mono text-[13px] text-[#d4d4d4]">CLIProxyAPI</code> sidecar or Ollama to run at zero credit cost.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/router"
                  className="btn-pill-white inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium"
                >
                  <span>Explore Orthese Router</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/#dual-target"
                  className="btn-pill-dark inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium"
                >
                  <Terminal className="h-3.5 w-3.5 text-[#a3a3a3]" />
                  <span>Compare Desktop vs. WASM</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
