"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowRight,
  Code2,
  Download,
  Eye,
  GripVertical,
  Radio,
  Send,
  Sparkles,
  Terminal,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { ApprovalCard } from "@/components/primitives/ApprovalCard";
import { ToolChips } from "@/components/primitives/ToolChips";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { cn } from "@/lib/cn";

type StarterPackTab = "web-designer" | "indie-builder" | "daily-ai-desk";

interface GeneratedSite {
  headline: string;
  subcopy: string;
  cta: string;
  badge: string;
}

const SITE_PRESETS: Record<string, GeneratedSite> = {
  default: {
    headline: "Ship hardware-grade interfaces in minutes.",
    subcopy:
      "Generated inside Website Builder from an orthese/spec payload piped over the Shared Context Bus.",
    cta: "Start Building",
    badge: "MONOCHROME · V1",
  },
  saas: {
    headline: "Zero-latency observability for Rust services.",
    subcopy:
      "Inspect distributed traces, flamegraphs, and edge quotas in one monochrome developer console.",
    cta: "Deploy Collector",
    badge: "INFRA · EDGE",
  },
  studio: {
    headline: "Independent design engineering studio.",
    subcopy:
      "We craft tactile software, bespoke interaction systems, and calm developer tools.",
    cta: "Book Sprint",
    badge: "STUDIO · 2026",
  },
};

function buildHtmlBundle(site: GeneratedSite): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${site.headline}</title>
  <style>
    body { margin: 0; background: #0a0a0a; color: #fafafa; font-family: system-ui, sans-serif; padding: 48px 24px; }
    .badge { display: inline-block; font: 11px/1 monospace; border: 1px solid rgba(255,255,255,.14); padding: 4px 10px; border-radius: 999px; color: #a1a1aa; }
    h1 { font-size: 36px; letter-spacing: -0.03em; margin: 16px 0 12px; max-width: 560px; }
    p { color: #a1a1aa; max-width: 480px; line-height: 1.6; }
    .btn { margin-top: 24px; display: inline-block; background: #fafafa; color: #0a0a0a; padding: 10px 18px; border-radius: 8px; font-weight: 600; text-decoration: none; }
  </style>
</head>
<body>
  <span class="badge">${site.badge}</span>
  <h1>${site.headline}</h1>
  <p>${site.subcopy}</p>
  <a class="btn" href="#">${site.cta} →</a>
</body>
</html>`;
}

const MODELS = [
  { id: "balanced", label: "Orthese · Balanced", cost: "~3 cr" },
  { id: "fast", label: "Orthese · Fast", cost: "~1 cr" },
  { id: "reasoning", label: "Orthese · Reasoning", cost: "~8 cr" },
  { id: "cliproxy", label: "Local · CLIProxyAPI", cost: "0 cr" },
] as const;

export function HeroWorkspaceWindow() {
  const [pack, setPack] = useState<StarterPackTab>("web-designer");
  const [splitPct, setSplitPct] = useState(44);
  const [modelId, setModelId] = useState<(typeof MODELS)[number]["id"]>("balanced");
  const [prompt, setPrompt] = useState(
    "Create a monochrome landing hero for a Rust observability tool with a crisp hairline badge."
  );
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [site, setSite] = useState<GeneratedSite>(SITE_PRESETS.default);
  const [busPulse, setBusPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    draggingRef.current = true;
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(64, Math.max(32, pct)));
    };
    const onUp = () => {
      draggingRef.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  const handlePipeSpec = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = prompt.trim();
    if (!cleaned) return;

    const lower = cleaned.toLowerCase();
    const nextSite: GeneratedSite = lower.includes("studio")
      ? SITE_PRESETS.studio
      : lower.includes("rust") || lower.includes("observability")
        ? SITE_PRESETS.saas
        : {
            headline: cleaned.length > 68 ? `${cleaned.slice(0, 65)}...` : cleaned,
            subcopy:
              "Live-updated via orthese.context.send('orthese/spec') inside the zero-install WASM canvas.",
            cta: "Launch Preview",
            badge: "CUSTOM SPEC · LIVE",
          };

    setSite(nextSite);
    setBusPulse(true);
    setTimeout(() => setBusPulse(false), 900);

    toast.success("Piped orthese/spec across Shared Context Bus", {
      description:
        pack === "web-designer"
          ? `AI Prompt Box → Website Builder (${modelId === "cliproxy" ? "0 credits · CLIProxyAPI" : "3 credits"})`
          : `AI Prompt Box → ${pack === "indie-builder" ? "Software Engineer" : "Research Canvas"}`,
    });
  };

  const handleExportHtml = () => {
    const html = buildHtmlBundle(site);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orthese-site-export.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Exported standalone HTML bundle", {
      description: "orthese-site-export.html downloaded locally.",
    });
  };

  return (
    <div id="workspace-demo" className="scroll-mt-20">
      {/* Top Starter Pack Switcher Bar */}
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <SlidingTabs
          ariaLabel="Starter Pack Presets"
          value={pack}
          onChange={setPack}
          options={[
            { value: "web-designer", label: "Web Designer" },
            { value: "indie-builder", label: "Indie Builder" },
            { value: "daily-ai-desk", label: "Daily AI Desk" },
          ]}
        />
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 transition-colors",
              busPulse
                ? "border-white/40 bg-white/[0.1] text-white"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400"
            )}
          >
            <Radio className="h-3 w-3" />
            <span>Bus: orthese/spec</span>
          </span>
          <span className="hidden text-zinc-600 sm:inline">|</span>
          <span className="hidden text-zinc-500 sm:inline">Drag center divider to resize</span>
        </div>
      </div>

      {/* Interactive Split-Pane Canvas Shell */}
      <div className="workstation-card overflow-hidden rounded-2xl shadow-[0_32px_90px_rgba(0,0,0,0.75)]">
        {/* Window Chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0e0e0e] px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            </div>
            <span className="font-mono text-[11px] text-zinc-400">
              app.orthese.com ·{" "}
              <span className="text-zinc-200">
                {pack === "web-designer"
                  ? "pack.web-designer (WASM)"
                  : pack === "indie-builder"
                    ? "pack.indie-builder (Desktop)"
                    : "pack.daily-ai-desk (WASM)"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="rounded border border-white/[0.09] bg-white/[0.03] px-2 py-0.5 text-zinc-300">
              197 cr left
            </span>
            <span className="hidden rounded border border-white/[0.08] px-2 py-0.5 text-zinc-500 sm:inline">
              GPUI · 120fps
            </span>
          </div>
        </div>

        {/* Resizable Two-Pane Canvas */}
        <div
          ref={containerRef}
          className="grid min-h-[470px] grid-cols-1 lg:flex lg:flex-row"
        >
          {/* LEFT PANE: AI Prompt Box Piece */}
          <div
            className="flex flex-col justify-between border-b border-white/[0.08] bg-[#0c0c0c] p-4 lg:border-b-0"
            style={{ flexBasis: `${splitPct}%` }}
          >
            <div>
              {/* Piece Header + Hybrid Model Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <span className="block text-xs font-medium text-zinc-100">
                      AI Prompt Box
                    </span>
                    <span className="block font-mono text-[10px] text-zinc-500">
                      orthese.ai-prompt-box · Standard
                    </span>
                  </div>
                </div>

                <select
                  aria-label="Hybrid Model Switcher"
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value as (typeof MODELS)[number]["id"])}
                  className="rounded-md border border-white/[0.1] bg-[#141414] px-2 py-1 font-mono text-[11px] text-zinc-200 focus:border-white/30 focus:outline-none cursor-pointer"
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.cost})
                    </option>
                  ))}
                </select>
              </div>

              {/* Conversation & Tool Trace */}
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                    <span>USER SPEC</span>
                    <span>@landing-page-architect</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-200">
                    {pack === "indie-builder"
                      ? "Add a folder-scoped shell guardrail before running cargo test and emit the diff onto the bus."
                      : pack === "daily-ai-desk"
                        ? "Summarize the trade-offs of compiling GPUI to wasm32 vs shipping a separate React web app."
                        : prompt}
                  </p>
                </div>

                <ToolChips
                  items={[
                    { label: "ai:generate · balanced", kind: "ai" },
                    { label: "context:send · orthese/spec", kind: "bus" },
                    { label: "delivered · 18ms", kind: "done" },
                  ]}
                />

                {/* Quick Prompt Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    {
                      label: "Rust SaaS Hero",
                      value: "Create a monochrome landing hero for a Rust observability tool with a crisp hairline badge.",
                    },
                    {
                      label: "Design Studio",
                      value: "Build an independent design studio homepage with calm editorial typography.",
                    },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setPrompt(preset.value);
                        setPack("web-designer");
                        setSite(
                          preset.label.includes("Studio") ? SITE_PRESETS.studio : SITE_PRESETS.saas
                        );
                        toast.message(`Loaded preset: ${preset.label}`);
                      }}
                      className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 font-mono text-[10px] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      Try &ldquo;{preset.label}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Beautiful UI Prompt Composer */}
            <form onSubmit={handlePipeSpec} className="mt-4">
              <div className="rounded-xl border border-white/[0.1] bg-[#131313] p-2.5 focus-within:border-white/25 transition-colors">
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe a page or spec to pipe across the bus..."
                  className="w-full resize-none bg-transparent text-xs leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2">
                  <span className="font-mono text-[10px] text-zinc-500">
                    Emits <span className="text-zinc-300">orthese/spec</span>
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold text-black hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>Send &amp; Pipe</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* DRAGGABLE SPLIT DIVIDER */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize workspace panes"
            onPointerDown={handlePointerDown}
            className="hidden lg:flex w-2 shrink-0 cursor-col-resize items-center justify-center border-x border-white/[0.06] bg-[#0e0e0e] hover:bg-white/[0.08] transition-colors select-none"
          >
            <GripVertical className="h-3.5 w-3.5 text-zinc-600" />
          </div>

          {/* RIGHT PANE: Dynamic Starter Pack Partner Piece */}
          <div className="flex flex-1 flex-col bg-[#0a0a0a] p-4 min-w-0">
            {pack === "web-designer" && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                      <Eye className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-zinc-100">
                        Website Builder
                      </span>
                      <span className="block font-mono text-[10px] text-zinc-500">
                        orthese.website-builder · Flagship · WASM + Desktop
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-md border border-white/[0.09] bg-[#111111] p-0.5">
                      <button
                        type="button"
                        onClick={() => setViewMode("preview")}
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer",
                          viewMode === "preview"
                            ? "bg-white/[0.12] text-white"
                            : "text-zinc-400 hover:text-zinc-200"
                        )}
                      >
                        <Eye className="h-3 w-3" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("code")}
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer",
                          viewMode === "code"
                            ? "bg-white/[0.12] text-white"
                            : "text-zinc-400 hover:text-zinc-200"
                        )}
                      >
                        <Code2 className="h-3 w-3" />
                        Code
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportHtml}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-100 hover:border-white/25 hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      Export HTML
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  {viewMode === "preview" ? (
                    <div className="bg-workstation-grid flex h-full min-h-[340px] flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0e0e0e] p-6">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-wider text-zinc-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          {site.badge}
                        </span>
                        <h3 className="mt-4 max-w-md text-2xl font-semibold tracking-tight text-white">
                          {site.headline}
                        </h3>
                        <p className="mt-2.5 max-w-md text-xs leading-relaxed text-zinc-400">
                          {site.subcopy}
                        </p>
                        <div className="mt-5 flex items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-xs font-semibold text-black">
                            {site.cta}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                          <span className="rounded-md border border-white/[0.1] px-3 py-2 font-mono text-[11px] text-zinc-400">
                            Read Docs
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
                        {["0.8s FCP", "100% Static", "Zero Lock-in"].map((metric) => (
                          <div
                            key={metric}
                            className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 text-center font-mono text-[10px] text-zinc-400"
                          >
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <CodeBlock
                      code={buildHtmlBundle(site)}
                      filename="index.html"
                      language="html"
                      maxHeight="max-h-[340px]"
                    />
                  )}
                </div>
              </>
            )}

            {pack === "indie-builder" && (
              <>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                      <Terminal className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-zinc-100">
                        Software Engineer
                      </span>
                      <span className="block font-mono text-[10px] text-zinc-500">
                        orthese.software-engineer · Elevated · Desktop Only
                      </span>
                    </div>
                  </div>
                  <span className="rounded border border-white/[0.12] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                    fs:write · shell:exec · mcp:call
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <CodeBlock
                    filename="crates/orthese-sdk/src/lib.rs (diff)"
                    language="diff"
                    maxHeight="max-h-[165px]"
                    code={`@@ -84,6 +84,9 @@ impl PieceManifest {
+    pub fn supports_wasm(&self) -> bool {
+        self.permissions.elevated.is_empty()
+    }
 }`}
                  />
                  <ApprovalCard
                    permission="shell:exec"
                    command="cargo test --workspace && cargo clippy --all-targets"
                    scope="~/projects/orthese"
                    estimatedCredits={4}
                  />
                </div>
              </>
            )}

            {pack === "daily-ai-desk" && (
              <>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                      <BookOpen className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-zinc-100">
                        Research Canvas
                      </span>
                      <span className="block font-mono text-[10px] text-zinc-500">
                        orthese.research-canvas · Standard · WASM + Desktop
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPack("web-designer");
                      toast.success("Piped research brief to Website Builder");
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-200 hover:bg-white/[0.08] cursor-pointer"
                  >
                    Pipe to Builder →
                  </button>
                </div>

                <div className="mt-4 space-y-3 rounded-xl border border-white/[0.08] bg-[#0e0e0e] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Brief · Single Rust/GPUI Core Strategy
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    Why compiling GPUI to wasm32 eliminates duplicate frontends
                  </h4>
                  <ul className="space-y-2 text-xs leading-relaxed text-zinc-400">
                    <li className="flex gap-2">
                      <span className="font-mono text-zinc-500">01</span>
                      <span>
                        One layout engine &amp; Piece SDK contract runs both native 120fps Desktop and zero-install browser sessions.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-mono text-zinc-500">02</span>
                      <span>
                        Standard Pieces run immediately in WebAssembly; Elevated Pieces unlock local repos, stdio MCPs, and CLIProxyAPI on Desktop.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-mono text-zinc-500">03</span>
                      <span>
                        Every synthesized note exports directly as an <code className="text-zinc-200">orthese/spec</code> payload for downstream Pieces.
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
