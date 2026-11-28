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
import { cn } from "@/lib/cn";
import type {
  BusEvent,
  DashboardModelOption,
  PieceSize,
  RoutingEngine,
} from "./dashboardTypes";

interface PiecePaneBodyProps {
  item: MarketplaceItem;
  size: PieceSize;
  activeModel: DashboardModelOption;
  routingEngine: RoutingEngine;
  latestSpec: BusEvent | null;
  onEmitBus: (event: Omit<BusEvent, "id" | "timestamp">) => void;
  onSpendCredits: (amount: number, reason: string) => boolean;
}

function buildPreviewHtml(specTitle: string, specBody: string, compact: boolean): string {
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
      padding: ${compact ? "11px 12px" : "24px 22px"};
      background-image: radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.07), transparent 70%);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: ${compact ? "8.5px" : "10px"};
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #a3a3a3;
      border: 1px solid rgba(255,255,255,0.1);
      background: #171717;
      border-radius: 999px;
      padding: ${compact ? "2px 8px" : "4px 10px"};
      width: fit-content;
    }
    .dot { width: 5px; height: 5px; border-radius: 999px; background: #34d399; }
    h1 {
      margin-top: ${compact ? "7px" : "14px"};
      font-size: ${compact ? "15.5px" : "25px"};
      line-height: 1.12;
      letter-spacing: -0.03em;
      font-weight: 600;
    }
    p {
      margin-top: ${compact ? "5px" : "10px"};
      font-size: ${compact ? "10.5px" : "13px"};
      line-height: 1.4;
      color: #a3a3a3;
      max-width: 48ch;
      ${compact ? "display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" : ""}
    }
    .metrics {
      margin-top: ${compact ? "8px" : "18px"};
      display: grid;
      grid-template-columns: repeat(${compact ? 2 : 3}, minmax(0, 1fr));
      gap: ${compact ? "6px" : "8px"};
    }
    .card {
      background: #171717;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: ${compact ? "5px 8px" : "10px"};
    }
    .k { font-family: ui-monospace, monospace; font-size: ${compact ? "8px" : "9px"}; color: #737373; text-transform: uppercase; }
    .v { margin-top: 2px; font-family: ui-monospace, monospace; font-size: ${compact ? "11px" : "14px"}; color: #fafafa; font-weight: 600; }
    .cta {
      margin-top: ${compact ? "8px" : "18px"};
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(125deg, #8b96ff 0%, #56c8fa 52%, #ec8cfa 100%);
      color: #0b0c0f;
      border-radius: 8px;
      padding: ${compact ? "4px 10px" : "7px 14px"};
      font-size: ${compact ? "10px" : "12px"};
      font-weight: 600;
      width: fit-content;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.45), 0 1px 2px rgba(0,0,0,0.28);
    }
  </style>
</head>
<body>
  <span class="badge"><span class="dot"></span>${compact ? "Orthese Bus" : "Generated via Orthese Bus"}</span>
  <h1>${safeTitle}</h1>
  <p>${safeBody}</p>
  <div class="metrics">
    <div class="card"><div class="k">p99 Latency</div><div class="v">14 ms</div></div>
    <div class="card"><div class="k">Runtime</div><div class="v">wasm32</div></div>
    ${compact ? "" : '<div class="card"><div class="k">Bundle</div><div class="v">1.8 KB</div></div>'}
  </div>
  <div class="cta">Deploy Bundle →</div>
</body>
</html>`;
}

export function PiecePaneBody({
  item,
  size,
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

  const isCompact = size === "sm";
  const isWide = size === "lg" || size === "xl";
  const isFull = size === "xl";

  const effectiveCost = routingEngine === "cliproxy" ? 0 : activeModel.costCr;

  const previewHtml = useMemo(
    () =>
      buildPreviewHtml(
        latestSpec?.title ?? "Orthese Live Preview",
        latestSpec?.payload ??
          "Emit a prompt from AI Prompt Box to stream a fresh orthese/spec straight into Website Builder.",
        isCompact
      ),
    [latestSpec, isCompact]
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
        ...prev.slice(0, 5),
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

    const visibleHistory = isCompact ? promptHistory.slice(0, 1) : promptHistory;

    const composerForm = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt();
        }}
        className={cn(
          "rounded-xl border border-white/[0.09] bg-[#121212] focus-within:border-white/[0.2]",
          isCompact ? "p-1.5" : "p-2"
        )}
      >
        <textarea
          rows={isCompact ? 1 : isWide ? 3 : 2}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder={
            isCompact
              ? "Pipe a spec to the bus..."
              : "Describe a section or spec to pipe onto the Shared Context Bus..."
          }
          className={cn(
            "w-full resize-none bg-transparent text-[#fafafa] placeholder:text-[#737373] focus:outline-none",
            isCompact ? "px-1.5 py-0.5 text-[12px]" : "px-1.5 py-1 text-[12.5px]"
          )}
        />
        <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-1.5">
          <span className="truncate font-mono text-[10px] text-[#737373]">
            {isCompact
              ? effectiveCost === 0
                ? "0 cr"
                : `~${effectiveCost} cr`
              : `emits orthese/spec · ${effectiveCost === 0 ? "0 cr" : `~${effectiveCost} cr`}`}
          </span>
          <button
            type="submit"
            disabled={!promptInput.trim()}
            className="bg-button-primary inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11.5px] font-medium disabled:opacity-45 cursor-pointer"
          >
            <Send className="h-3 w-3" />
            <span>Pipe</span>
          </button>
        </div>
      </form>
    );

    if (isFull) {
      return (
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-2.5 lg:col-span-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
              Session Stream ({promptHistory.length})
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto pr-0.5 max-h-[380px]">
              {promptHistory.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl border border-white/[0.06] bg-[#121212] p-3.5"
                >
                  <p className="text-[13px] leading-relaxed text-[#e5e5e5]">{msg.text}</p>
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

          <div className="flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#141416] p-3.5 lg:col-span-5">
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                Quick Spec Presets
              </div>
              <div className="flex flex-col gap-1.5">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp.title}
                    type="button"
                    onClick={() => handleSendPrompt(qp.title, qp.body)}
                    className="rounded-xl border border-white/[0.08] bg-[#121212] px-3 py-2 text-left transition-colors hover:border-white/[0.18] cursor-pointer"
                  >
                    <div className="text-[12px] font-medium text-[#fafafa]">+ {qp.title}</div>
                    <div className="mt-0.5 line-clamp-2 text-[11px] text-[#737373]">{qp.body}</div>
                  </button>
                ))}
              </div>
            </div>
            {composerForm}
          </div>
        </div>
      );
    }

    return (
      <div className={cn("flex h-full flex-col justify-between", isCompact ? "gap-2" : "gap-3")}>
        <div className={isCompact ? "space-y-2" : "space-y-2.5"}>
          <div className="flex flex-wrap gap-1.5">
            {(isCompact ? QUICK_PROMPTS.slice(0, 1) : QUICK_PROMPTS).map((qp) => (
              <button
                key={qp.title}
                type="button"
                onClick={() => handleSendPrompt(qp.title, qp.body)}
                className="max-w-full truncate rounded-lg border border-white/[0.08] bg-[#121212] px-2.5 py-1 text-[11px] text-[#a3a3a3] transition-colors hover:border-white/[0.18] hover:text-[#fafafa] cursor-pointer"
              >
                + {qp.title}
              </button>
            ))}
          </div>

          <div
            className={cn(
              "space-y-2 overflow-y-auto pr-0.5",
              isCompact ? "max-h-[82px]" : isWide ? "max-h-[260px]" : "max-h-[180px]"
            )}
          >
            {visibleHistory.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-xl border border-white/[0.06] bg-[#121212]",
                  isCompact ? "p-2.5" : "p-3"
                )}
              >
                <p
                  className={cn(
                    "leading-relaxed text-[#e5e5e5]",
                    isCompact ? "line-clamp-2 text-[11.5px]" : "text-[12.5px]"
                  )}
                >
                  {msg.text}
                </p>
                {!isCompact && (
                  <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10px] text-[#737373]">
                    <span className="truncate">{msg.model}</span>
                    <span className="shrink-0 text-[#a3a3a3]">
                      {msg.cost === 0 ? "Local · 0 cr" : `-${msg.cost} cr`} · piped
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {composerForm}
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

    const previewHeightClass = isCompact
      ? "min-h-[185px]"
      : isFull
        ? "min-h-[385px]"
        : isWide
          ? "min-h-[325px]"
          : "min-h-[285px]";

    return (
      <div className={cn("flex h-full flex-col", isCompact ? "gap-2" : "gap-3")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!isCompact ? (
            <div className="flex min-w-0 items-center gap-2 text-[11.5px] text-[#a3a3a3]">
              <Radio className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span className="truncate font-mono">
                {latestSpec ? `Synced: ${latestSpec.title}` : "Listening for orthese/spec"}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
              <Radio className="h-3 w-3" />
              <span>Synced</span>
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {!isFull && (
              <SegmentedControl<"preview" | "code">
                ariaLabel="Website Builder view mode"
                value={builderMode}
                onChange={setBuilderMode}
                options={[
                  { id: "preview", label: "Preview" },
                  { id: "code", label: "HTML" },
                ]}
              />
            )}
            <button
              type="button"
              onClick={handleDownloadHtml}
              aria-label="Export standalone HTML"
              className="bg-button-secondary inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {!isCompact && <span className="hidden sm:inline">Export</span>}
            </button>
          </div>
        </div>

        {isFull ? (
          <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-12">
            <div
              className={cn(
                "relative flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121212] lg:col-span-7",
                previewHeightClass
              )}
            >
              <iframe
                title="Orthese Website Builder Sandbox Preview"
                srcDoc={previewHtml}
                sandbox=""
                className={cn("h-full w-full border-0", previewHeightClass)}
              />
            </div>
            <div className="flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#121212] lg:col-span-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                <span>Live HTML Bundle</span>
                <span>1.8 KB</span>
              </div>
              <pre className="max-h-[385px] flex-1 overflow-auto p-3 font-mono text-[11px] leading-relaxed text-[#d4d4d4]">
                <code>{previewHtml}</code>
              </pre>
            </div>
          </div>
        ) : builderMode === "preview" ? (
          <div
            className={cn(
              "relative flex-1 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121212]",
              previewHeightClass
            )}
          >
            <iframe
              title="Orthese Website Builder Sandbox Preview"
              srcDoc={previewHtml}
              sandbox=""
              className={cn("h-full w-full border-0", previewHeightClass)}
            />
          </div>
        ) : (
          <pre
            className={cn(
              "max-h-[340px] flex-1 overflow-auto rounded-xl border border-white/[0.08] bg-[#121212] p-3 font-mono text-[11px] leading-relaxed text-[#d4d4d4]",
              previewHeightClass
            )}
          >
            <code>{previewHtml}</code>
          </pre>
        )}

        {!isCompact && (
          <div className="flex items-center justify-between font-mono text-[10.5px] text-[#737373]">
            <span className="inline-flex items-center gap-1.5">
              {isFull || builderMode === "preview" ? (
                <Eye className="h-3 w-3" />
              ) : (
                <Code2 className="h-3 w-3" />
              )}
              <span>
                {isFull
                  ? "Split Preview + Live HTML · Sandboxed iframe"
                  : "Sandboxed iframe · zero elevated permissions"}
              </span>
            </span>
            <span>wasm32</span>
          </div>
        )}
      </div>
    );
  }

  /* 3. SOFTWARE ENGINEER */
  if (item.id === "orthese.software-engineer") {
    const guardrailBlock = (
      <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
        <div className="flex items-center justify-between gap-2 font-mono text-[10.5px]">
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-[#d4d4d4]">
            <Terminal className="h-3 w-3 shrink-0 text-[#a3a3a3]" />
            <span className="truncate">$ cargo test --workspace</span>
          </span>
          {!isCompact && <span className="shrink-0 text-[#737373]">Guardrail</span>}
        </div>

        {diffStatus === "pending" ? (
          <div className="mt-2 flex items-center gap-1.5">
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
              <span>{isCompact ? "Approve" : "Approve Once"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDiffStatus("denied");
                toast.info("Command denied: sandbox remained read-only");
              }}
              className="bg-button-secondary inline-flex h-7 items-center justify-center rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
            >
              Deny
            </button>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10.5px]">
            <span
              className={cn(
                "truncate",
                diffStatus === "approved" ? "text-emerald-300" : "text-[#a3a3a3]"
              )}
            >
              {diffStatus === "approved"
                ? "Approved · emitted orthese/git-diff"
                : "Denied · read-only"}
            </span>
            <button
              type="button"
              onClick={() => setDiffStatus("pending")}
              className="shrink-0 text-[#fafafa] underline underline-offset-2 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    );

    const diffBlock = (
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#121212] font-mono text-[11px]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-1.5 text-[10px] text-[#737373]">
          <span className="truncate">crates/orthese-sdk/src/lib.rs</span>
          <span className="shrink-0 text-emerald-400">+5 -1</span>
        </div>
        <pre
          className={cn(
            "overflow-x-auto leading-relaxed",
            isCompact ? "p-2.5 text-[10px]" : "p-3 text-[11px]"
          )}
        >
          <code className="block text-[#737373]">@@ -28,6 +28,10 @@ impl PieceManifest {"{"}</code>
          <code className="block text-emerald-300">+ pub fn supports_wasm(&amp;self) -&gt; bool {"{"}</code>
          <code className="block text-emerald-300">+   self.permissions.elevated.is_empty()</code>
          <code className="block text-emerald-300">+ {"}"}</code>
          {!isCompact && (
            <code className="block text-[#a3a3a3]">
              // Synced spec: {latestSpec?.title ?? "Ready"}
            </code>
          )}
        </pre>
      </div>
    );

    if (isFull) {
      return (
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-7">{diffBlock}</div>
          <div className="flex flex-col justify-between gap-3 lg:col-span-5">
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3.5 text-[12px] text-amber-200/90">
              <div className="flex items-center gap-2 font-medium text-amber-200">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Elevated Piece (Desktop Sandbox Preview)</span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-amber-200/75">
                Folder-scoped filesystem and local stdio MCP run natively in the Rust/GPUI
                desktop app with click-to-approve cards.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[10px]">
                {["fs:read", "fs:write", "shell:exec", "mcp:call"].map((scope) => (
                  <span
                    key={scope}
                    className="rounded-md border border-amber-300/25 bg-amber-400/10 px-2 py-0.5 text-amber-200"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            </div>
            {guardrailBlock}
          </div>
        </div>
      );
    }

    return (
      <div className={cn("flex h-full flex-col justify-between", isCompact ? "gap-2" : "gap-3")}>
        <div className={isCompact ? "space-y-2" : "space-y-3"}>
          {!isCompact ? (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-[11.5px] text-amber-200/90">
              <div className="flex items-center gap-2 font-medium text-amber-200">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                <span>Elevated Piece (Sandbox Preview in Web)</span>
              </div>
              <p className="mt-1 font-mono text-[10.5px] text-amber-200/70">
                fs:write · shell:exec · mcp:call
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300/90">
              <ShieldAlert className="h-3 w-3 shrink-0" />
              <span className="truncate">Elevated · Desktop preview</span>
            </div>
          )}

          {diffBlock}
        </div>

        {guardrailBlock}
      </div>
    );
  }

  /* 4. RESEARCH CANVAS */
  if (item.id === "orthese.research-canvas") {
    const wordCount = researchNotes.trim().split(/\s+/).filter(Boolean).length;

    function handlePipeResearch() {
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
    }

    if (isFull) {
      return (
        <div className="flex h-full flex-col gap-3">
          <div className="grid flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
            <textarea
              value={researchNotes}
              onChange={(e) => setResearchNotes(e.target.value)}
              aria-label="Research Canvas Markdown Notes"
              className="min-h-[360px] flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#121212] p-3.5 font-mono text-[12px] leading-relaxed text-[#e5e5e5] focus:border-white/[0.2] focus:outline-none"
            />
            <div className="min-h-[360px] rounded-xl border border-white/[0.08] bg-[#121212] p-4 space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                Live Brief Preview
              </div>
              {researchNotes.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-1" />;
                if (trimmed.startsWith("#")) {
                  return (
                    <h3 key={i} className="text-[16px] font-medium text-[#fafafa]">
                      {trimmed.replace(/^#+\s*/, "")}
                    </h3>
                  );
                }
                if (trimmed.startsWith("-")) {
                  return (
                    <p key={i} className="text-[13px] leading-relaxed text-[#d4d4d4]">
                      • {trimmed.replace(/^-\s*/, "")}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-[13px] leading-relaxed text-[#a3a3a3]">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10.5px] text-[#737373]">
              Markdown · {wordCount} words · Split preview
            </span>
            <button
              type="button"
              onClick={handlePipeResearch}
              className="bg-button-secondary inline-flex h-7 items-center gap-1.5 rounded-lg px-3 text-[11.5px] font-medium cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Pipe Brief to Bus</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={cn("flex h-full flex-col", isCompact ? "gap-2" : "gap-3")}>
        <textarea
          value={researchNotes}
          onChange={(e) => setResearchNotes(e.target.value)}
          aria-label="Research Canvas Markdown Notes"
          className={cn(
            "flex-1 resize-none rounded-xl border border-white/[0.08] bg-[#121212] font-mono leading-relaxed text-[#e5e5e5] focus:border-white/[0.2] focus:outline-none",
            isCompact
              ? "min-h-[135px] p-2.5 text-[11.5px]"
              : isWide
                ? "min-h-[310px] p-3.5 text-[12px]"
                : "min-h-[225px] p-3 text-[12px]"
          )}
        />
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-mono text-[10.5px] text-[#737373]">
            {isCompact ? `${wordCount}w` : `Markdown · ${wordCount} words · Local`}
          </span>
          <button
            type="button"
            onClick={handlePipeResearch}
            className="bg-button-secondary inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            <span>{isCompact ? "Pipe" : "Pipe Brief to Bus"}</span>
          </button>
        </div>
      </div>
    );
  }

  /* 5. GENERIC PIECE SDK SHELL (Marketplace & Community Pieces) */
  return (
    <div
      className={cn(
        "flex h-full flex-col justify-between",
        isFull ? "lg:grid lg:grid-cols-12 lg:gap-4" : isCompact ? "gap-2" : "gap-3"
      )}
    >
      <div className={cn(isCompact ? "space-y-2" : "space-y-3", isFull && "lg:col-span-7")}>
        <p
          className={cn(
            "leading-relaxed text-[#a3a3a3]",
            isCompact ? "line-clamp-2 text-[12px]" : "text-[13px]"
          )}
        >
          {item.tagline}
        </p>

        {item.manifest && (
          <div
            className={cn(
              "rounded-xl border border-white/[0.07] bg-[#121212] font-mono text-[11px]",
              isCompact ? "p-2.5 space-y-1" : "p-3 space-y-2"
            )}
          >
            {!isCompact && (
              <div className="flex items-center justify-between gap-2 text-[#737373]">
                <span>EXTENDS</span>
                <span className="truncate text-[#d4d4d4]">{item.manifest.extends}</span>
              </div>
            )}
            {!isCompact && (
              <div className="flex items-center justify-between gap-2 text-[#737373]">
                <span>ACCEPTS</span>
                <span className="truncate text-[#d4d4d4]">
                  {item.manifest.context.accepts.join(", ")}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 text-[#737373]">
              <span>EMITS</span>
              <span className="truncate text-[#d4d4d4]">
                {item.manifest.context.emits.join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2.5",
          isFull &&
            "lg:col-span-5 lg:flex-col lg:items-stretch lg:justify-between lg:rounded-xl lg:border lg:bg-[#121212] lg:p-4"
        )}
      >
        <span className="truncate font-mono text-[10.5px] text-[#737373]">
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
          className="bg-button-secondary inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
        >
          <Play className="h-3 w-3" />
          <span>{isCompact ? "Run" : "Run Piece"}</span>
          <ArrowUpRight className="h-3 w-3 text-[#737373]" />
        </button>
      </div>
    </div>
  );
}
