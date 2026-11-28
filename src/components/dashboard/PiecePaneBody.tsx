"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  Download,
  Eye,
  Play,
  Radio,
  Send,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { SegmentedControl } from "@/components/primitives/BoardUIPrimitives";
import type { MarketplaceItem } from "@/types/piece-sdk";
import type { BusEvent, DashboardModelOption, RoutingEngine } from "./dashboardTypes";

interface PiecePaneBodyProps {
  item: MarketplaceItem;
  activeModel: DashboardModelOption;
  routingEngine: RoutingEngine;
  latestSpec: BusEvent | null;
  onEmitBus: (event: Omit<BusEvent, "id" | "timestamp">) => void;
  onSpendCredits: (amount: number, reason: string) => boolean;
}

function buildPreviewHtml(specTitle: string, specBody: string): string {
  const safeTitle = specTitle.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeBody = specBody.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #121212;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 28px 22px;
      background-image: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.07), transparent 70%);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #a3a3a3;
      border: 1px solid rgba(255,255,255,0.1);
      background: #171717;
      border-radius: 999px;
      padding: 4px 10px;
      width: fit-content;
    }
    .dot { width: 6px; height: 6px; border-radius: 999px; background: #34d399; }
    h1 {
      margin-top: 14px;
      font-size: 26px;
      line-height: 1.1;
      letter-spacing: -0.035em;
      font-weight: 600;
    }
    p {
      margin-top: 10px;
      font-size: 13px;
      line-height: 1.55;
      color: #a3a3a3;
      max-width: 48ch;
    }
    .metrics {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }
    .card {
      background: #171717;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 10px;
    }
    .k { font-family: ui-monospace, monospace; font-size: 9px; color: #737373; text-transform: uppercase; }
    .v { margin-top: 4px; font-family: ui-monospace, monospace; font-size: 14px; color: #fafafa; font-weight: 600; }
    .cta {
      margin-top: 18px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #fafafa;
      color: #121212;
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 600;
      width: fit-content;
    }
  </style>
</head>
<body>
  <span class="badge"><span class="dot"></span>Generated via Orthese Bus</span>
  <h1>${safeTitle}</h1>
  <p>${safeBody}</p>
  <div class="metrics">
    <div class="card"><div class="k">p99 Latency</div><div class="v">14 ms</div></div>
    <div class="card"><div class="k">Runtime</div><div class="v">wasm32</div></div>
    <div class="card"><div class="k">Bundle</div><div class="v">1.8 KB</div></div>
  </div>
  <div class="cta">Deploy Bundle →</div>
</body>
</html>`;
}

export function PiecePaneBody({
  item,
  activeModel,
  routingEngine,
  latestSpec,
  onEmitBus,
  onSpendCredits,
}: PiecePaneBodyProps) {
  const [promptInput, setPromptInput] = useState("");
  const [promptHistory, setPromptHistory] = useState<
    { id: string; text: string; model: string; cost: number }[]
  >([
    {
      id: "seed-msg",
      text: "Drafted Kestrel Telemetry Hero spec and piped orthese/spec onto bus://workspace.default.",
      model: "Orthese Router (Auto)",
      cost: 2,
    },
  ]);

  const [builderMode, setBuilderMode] = useState<"preview" | "code">("preview");
  const [diffStatus, setDiffStatus] = useState<"pending" | "approved" | "denied">("pending");
  const [researchNotes, setResearchNotes] = useState(
    `# Workspace Brief\n\n- Target: Zero-install WASM canvas + 120fps GPUI desktop\n- Architecture: Shared Context Bus + Base Harness\n- Next: Pipe finalized spec to Website Builder`
  );

  const effectiveCost = routingEngine === "cliproxy" ? 0 : activeModel.costCr;

  const previewHtml = useMemo(
    () =>
      buildPreviewHtml(
        latestSpec?.title ?? "Orthese Live Preview",
        latestSpec?.payload ??
          "Emit a prompt from AI Prompt Box to stream a fresh orthese/spec straight into Website Builder."
      ),
    [latestSpec]
  );

  /* 1. AI PROMPT BOX */
  if (item.id === "orthese.ai-prompt-box") {
    const QUICK_PROMPTS = [
      {
        title: "Obsidian Pricing Section",
        body: "Monochrome 3-tier pricing layout on #121212 with non-expiring credits and Polar checkout.",
      },
      {
        title: "Rust Telemetry Hero",
        body: "Developer hero highlighting sub-15ms edge routing, live token counters, and native GPUI speed.",
      },
    ];

    function handleSendPrompt(customTitle?: string, customBody?: string) {
      const text = (customBody ?? promptInput).trim();
      if (!text) return;
      if (!onSpendCredits(effectiveCost, `AI Prompt Box (${activeModel.label})`)) return;

      const title =
        customTitle ??
        text
          .split(/\s+/)
          .slice(0, 4)
          .join(" ")
          .replace(/[.,!?]+$/, "");

      setPromptHistory((prev) => [
        {
          id: `msg-${Date.now()}`,
          text,
          model: routingEngine === "cliproxy" ? "Local CLIProxyAPI" : activeModel.label,
          cost: effectiveCost,
        },
        ...prev.slice(0, 4),
      ]);

      onEmitBus({
        fromPieceId: item.id,
        fromPieceName: item.name,
        mime: "orthese/spec",
        title: title || "Custom Workspace Spec",
        payload: text,
      });

      setPromptInput("");
    }

    return (
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.title}
                type="button"
                onClick={() => handleSendPrompt(qp.title, qp.body)}
                className="rounded-full border border-white/[0.08] bg-[#121212] px-2.5 py-1 text-[11px] text-[#a3a3a3] transition-colors hover:border-white/[0.18] hover:text-[#fafafa] cursor-pointer"
              >
                + {qp.title}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[210px] overflow-y-auto pr-0.5">
            {promptHistory.map((msg) => (
              <div
                key={msg.id}
                className="rounded-xl border border-white/[0.06] bg-[#121212] p-3"
              >
                <p className="text-[12.5px] leading-relaxed text-[#e5e5e5]">{msg.text}</p>
                <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10px] text-[#737373]">
                  <span className="truncate">{msg.model}</span>
                  <span className="shrink-0 text-[#a3a3a3]">
                    {msg.cost === 0 ? "Local · 0 cr" : `-${msg.cost} cr`} · piped
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="rounded-xl border border-white/[0.09] bg-[#121212] p-2 focus-within:border-white/[0.2]"
        >
          <textarea
            rows={2}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Describe a section or spec to pipe onto the Shared Context Bus..."
            className="w-full resize-none bg-transparent px-1.5 py-1 text-[12.5px] text-[#fafafa] placeholder:text-[#737373] focus:outline-none"
          />
          <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2">
            <span className="font-mono text-[10px] text-[#737373]">
              emits orthese/spec · {effectiveCost === 0 ? "0 cr" : `~${effectiveCost} cr`}
            </span>
            <button
              type="submit"
              disabled={!promptInput.trim()}
              className="bg-button-primary inline-flex h-7 items-center gap-1 rounded-lg px-3 text-[11.5px] font-medium disabled:opacity-45 cursor-pointer"
            >
              <Send className="h-3 w-3" />
              <span>Pipe</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  /* 2. WEBSITE BUILDER */
  if (item.id === "orthese.website-builder") {
    function handleDownloadHtml() {
      const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orthese-bundle.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Exported orthese-bundle.html", {
        description: "Standalone HTML/CSS bundle ready to deploy anywhere.",
      });
    }

    return (
      <div className="flex h-full flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11.5px] text-[#a3a3a3]">
            <Radio className="h-3.5 w-3.5 text-emerald-400" />
            <span className="truncate font-mono">
              {latestSpec ? `Synced: ${latestSpec.title}` : "Listening for orthese/spec"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SegmentedControl<"preview" | "code">
              ariaLabel="Website Builder view mode"
              value={builderMode}
              onChange={setBuilderMode}
              options={[
                { id: "preview", label: "Preview" },
                { id: "code", label: "HTML" },
              ]}
            />
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="bg-button-secondary inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {builderMode === "preview" ? (
          <div className="relative min-h-[315px] flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121212]">
            <iframe
              title="Orthese Website Builder Sandbox Preview"
              srcDoc={previewHtml}
              sandbox=""
              className="h-full min-h-[315px] w-full border-0"
            />
          </div>
        ) : (
          <pre className="min-h-[315px] max-h-[360px] flex-1 overflow-auto rounded-xl border border-white/[0.08] bg-[#121212] p-3.5 font-mono text-[11px] leading-relaxed text-[#d4d4d4]">
            <code>{previewHtml}</code>
          </pre>
        )}

        <div className="flex items-center justify-between font-mono text-[10.5px] text-[#737373]">
          <span className="inline-flex items-center gap-1.5">
            {builderMode === "preview" ? (
              <Eye className="h-3 w-3" />
            ) : (
              <Code2 className="h-3 w-3" />
            )}
            <span>Sandboxed iframe · zero elevated permissions</span>
          </span>
          <span>wasm32</span>
        </div>
      </div>
    );
  }

  /* 3. SOFTWARE ENGINEER */
  if (item.id === "orthese.software-engineer") {
    return (
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 text-[11.5px]">
            <span className="inline-flex items-center gap-1.5 text-amber-200">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span>Elevated Piece (Sandbox Preview in Web)</span>
            </span>
            <span className="font-mono text-[10px] text-amber-200/80">
              fs:write · shell:exec
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#121212] font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#171717] px-3 py-2 text-[#a3a3a3]">
              <span className="truncate">crates/orthese-sdk/src/lib.rs</span>
              <span className="shrink-0 text-emerald-400">+5 -1</span>
            </div>
            <div className="space-y-0.5 overflow-x-auto p-3 leading-relaxed">
              <div className="text-[#737373]">@@ -28,6 +28,10 @@ impl PieceManifest {"{"}</div>
              <div className="text-emerald-300/90">
                + pub fn supports_wasm(&amp;self) -&gt; bool {"{"}
              </div>
              <div className="text-emerald-300/90">
                +     self.permissions.elevated.is_empty()
              </div>
              <div className="text-emerald-300/90">+ {"}"}</div>
              <div className="text-[#a3a3a3]">
                {" "}
                // Synced spec: {latestSpec?.title ?? "Kestrel Telemetry Hero"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-3">
          <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[#a3a3a3]">
            <span className="inline-flex items-center gap-1.5 truncate">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
              <span className="truncate">$ cargo test --workspace</span>
            </span>
            <span className="shrink-0 text-[10px] text-[#737373]">Guardrail</span>
          </div>

          {diffStatus === "pending" ? (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDiffStatus("approved");
                  onEmitBus({
                    fromPieceId: item.id,
                    fromPieceName: item.name,
                    mime: "orthese/git-diff",
                    title: "Approved SDK patch",
                    payload: "Applied supports_wasm() check and verified cargo test --workspace.",
                  });
                }}
                className="bg-button-primary inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-lg text-[11.5px] font-medium cursor-pointer"
              >
                <Check className="h-3 w-3" />
                <span>Approve Once</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiffStatus("denied");
                  toast.info("Command denied: sandbox remained read-only");
                }}
                className="bg-button-secondary inline-flex h-7 items-center justify-center rounded-lg px-3 text-[11.5px] font-medium cursor-pointer"
              >
                Deny
              </button>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[11px]">
              <span
                className={
                  diffStatus === "approved" ? "text-emerald-300" : "text-[#a3a3a3]"
                }
              >
                {diffStatus === "approved"
                  ? "Approved: 6 tests passed · emitted orthese/git-diff"
                  : "Denied: workspace stayed read-only"}
              </span>
              <button
                type="button"
                onClick={() => setDiffStatus("pending")}
                className="text-[#737373] underline decoration-white/20 underline-offset-2 hover:text-[#fafafa] cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* 4. RESEARCH CANVAS */
  if (item.id === "orthese.research-canvas") {
    return (
      <div className="flex h-full flex-col justify-between gap-3">
        <textarea
          value={researchNotes}
          onChange={(e) => setResearchNotes(e.target.value)}
          rows={9}
          aria-label="Research Canvas notes"
          className="min-h-[220px] flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#121212] p-3.5 font-mono text-[12px] leading-relaxed text-[#e5e5e5] focus:border-white/[0.2] focus:outline-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10.5px] text-[#737373]">
            Markdown · Auto-saved locally
          </span>
          <button
            type="button"
            onClick={() => {
              const firstHeading =
                researchNotes
                  .split("\n")
                  .find((l) => l.trim().startsWith("#"))
                  ?.replace(/^#+\s*/, "") ?? "Research Brief";
              onEmitBus({
                fromPieceId: item.id,
                fromPieceName: item.name,
                mime: "orthese/spec",
                title: firstHeading,
                payload: researchNotes.replace(/^#+\s*/gm, "").slice(0, 180),
              });
            }}
            className="bg-button-secondary inline-flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-medium cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            <span>Pipe Brief to Bus</span>
          </button>
        </div>
      </div>
    );
  }

  /* 5. GENERIC PIECE SDK SHELL (Marketplace & Community Pieces) */
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="space-y-3">
        <p className="text-[13px] leading-relaxed text-[#a3a3a3]">{item.tagline}</p>

        {item.manifest && (
          <div className="rounded-xl border border-white/[0.07] bg-[#121212] p-3 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between text-[#737373]">
              <span>EXTENDS</span>
              <span className="text-[#d4d4d4]">{item.manifest.extends}</span>
            </div>
            <div className="flex items-center justify-between text-[#737373]">
              <span>ACCEPTS</span>
              <span className="truncate text-[#d4d4d4]">
                {item.manifest.context.accepts.join(", ")}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#737373]">
              <span>EMITS</span>
              <span className="truncate text-[#d4d4d4]">
                {item.manifest.context.emits.join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
        <span className="font-mono text-[10.5px] text-[#737373]">
          {item.authorHandle} · v{item.manifest?.version ?? "0.1.0"}
        </span>
        <button
          type="button"
          onClick={() => {
            if (!onSpendCredits(effectiveCost, item.name)) return;
            onEmitBus({
              fromPieceId: item.id,
              fromPieceName: item.name,
              mime: item.manifest?.context.emits[0] ?? "text/markdown",
              title: `${item.name} output`,
              payload: `Executed ${item.name} on ${activeModel.label} with latest workspace context.`,
            });
          }}
          className="bg-button-secondary inline-flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-medium cursor-pointer"
        >
          <Play className="h-3 w-3" />
          <span>Run Piece</span>
          <ArrowUpRight className="h-3 w-3 text-[#737373]" />
        </button>
      </div>
    </div>
  );
}
