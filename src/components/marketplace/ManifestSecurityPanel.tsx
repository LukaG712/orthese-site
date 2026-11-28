"use client";

import { useState } from "react";
import type { PieceManifest } from "@/types/piece-sdk";
import { Code2, Radio, Shield, ShieldAlert } from "lucide-react";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import {
  InfoTooltip,
  PERMISSION_TIER_TOOLTIPS,
  RUNTIME_TOOLTIPS,
  TooltipProvider,
  describePermissionScope,
} from "@/components/primitives/Tooltip";
import { cn } from "@/lib/cn";

interface ManifestSecurityPanelProps {
  manifest: PieceManifest;
}

export function ManifestSecurityPanel({ manifest }: ManifestSecurityPanelProps) {
  const [mode, setMode] = useState<"visual" | "raw">("visual");
  const hasElevated = manifest.permissions.elevated.length > 0;
  const runtimeInfo = hasElevated ? RUNTIME_TOOLTIPS.desktop : RUNTIME_TOOLTIPS.wasm;

  return (
    <TooltipProvider>
      <div className="obsidian-surface overflow-hidden rounded-xl border border-white/[0.08] bg-[#171717]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {hasElevated ? (
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            ) : (
              <Shield className="h-4 w-4 text-emerald-400" />
            )}
            <span className="text-[13px] font-medium text-[#fafafa]">
              Manifest &amp; Security
            </span>
            <span className="font-mono text-[11px] text-[#737373]">piece.json</span>

            <InfoTooltip title={runtimeInfo.title} content={runtimeInfo.description}>
              <span
                data-testid="manifest-runtime-badge"
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium transition-colors cursor-help",
                  hasElevated
                    ? "border-amber-400/25 bg-amber-400/10 text-amber-200 hover:border-amber-400/45"
                    : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200 hover:border-emerald-400/45"
                )}
              >
                {hasElevated ? "Desktop" : "WASM"}
              </span>
            </InfoTooltip>
          </div>

          <div className="inline-flex rounded-md border border-white/[0.08] bg-[#121212] p-0.5">
            <button
              type="button"
              onClick={() => setMode("visual")}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer transition-colors",
                mode === "visual"
                  ? "bg-white/[0.11] text-[#fafafa]"
                  : "text-[#737373] hover:text-[#a3a3a3]"
              )}
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setMode("raw")}
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer transition-colors",
                mode === "raw"
                  ? "bg-white/[0.11] text-[#fafafa]"
                  : "text-[#737373] hover:text-[#a3a3a3]"
              )}
            >
              <Code2 className="h-3 w-3" />
              JSON
            </button>
          </div>
        </div>

        {mode === "visual" ? (
          <div className="space-y-4 p-4 text-[12px]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/[0.07] bg-[#121212] p-3">
                <div className="flex items-center justify-between gap-2">
                  <InfoTooltip
                    title={PERMISSION_TIER_TOOLTIPS.standard.title}
                    content={PERMISSION_TIER_TOOLTIPS.standard.description}
                  >
                    <span
                      data-testid="manifest-std-badge"
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3] underline decoration-white/20 decoration-dotted underline-offset-4 cursor-help hover:text-[#fafafa] transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Std (Sandboxed)
                    </span>
                  </InfoTooltip>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {manifest.permissions.standard.map((perm) => (
                    <InfoTooltip
                      key={perm}
                      title={perm}
                      content={describePermissionScope(perm)}
                    >
                      <span className="rounded border border-white/[0.09] bg-[#1a1a1a] px-2 py-0.5 font-mono text-[11px] text-[#d4d4d4] hover:border-white/[0.22] hover:text-[#fafafa] transition-colors cursor-help">
                        {perm}
                      </span>
                    </InfoTooltip>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/[0.07] bg-[#121212] p-3">
                <div className="flex items-center justify-between gap-2">
                  <InfoTooltip
                    title={PERMISSION_TIER_TOOLTIPS.elevated.title}
                    content={PERMISSION_TIER_TOOLTIPS.elevated.description}
                  >
                    <span
                      data-testid="manifest-elevated-badge"
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3] underline decoration-white/20 decoration-dotted underline-offset-4 cursor-help hover:text-[#fafafa] transition-colors"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          hasElevated ? "bg-amber-400" : "bg-[#525252]"
                        )}
                      />
                      Elevated (Desktop Prompt)
                    </span>
                  </InfoTooltip>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {hasElevated ? (
                    manifest.permissions.elevated.map((perm) => (
                      <InfoTooltip
                        key={perm}
                        title={perm}
                        content={describePermissionScope(perm)}
                      >
                        <span className="rounded border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] text-amber-100 hover:border-amber-400/45 transition-colors cursor-help">
                          {perm}
                        </span>
                      </InfoTooltip>
                    ))
                  ) : (
                    <InfoTooltip
                      title={RUNTIME_TOOLTIPS.wasm.title}
                      content={RUNTIME_TOOLTIPS.wasm.description}
                    >
                      <span className="text-[12px] text-[#8a8a8a] underline decoration-white/15 decoration-dotted underline-offset-4 cursor-help">
                        None (runs natively in WASM)
                      </span>
                    </InfoTooltip>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.07] bg-[#121212] p-3">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#737373]">
                <Radio className="h-3 w-3" />
                <span>Shared Context Bus</span>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="font-mono text-[10px] text-[#737373]">accepts</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {manifest.context.accepts.map((mime) => (
                      <code
                        key={mime}
                        className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-[#d4d4d4]"
                      >
                        {mime}
                      </code>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#737373]">emits</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {manifest.context.emits.map((mime) => (
                      <code
                        key={mime}
                        className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-[#d4d4d4]"
                      >
                        {mime}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-y divide-white/[0.06] rounded-lg border border-white/[0.07] bg-[#121212] font-mono text-[11px] tabular-nums sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="col-span-2 p-2.5 sm:col-span-1">
                <span className="block text-[10px] text-[#737373]">MODEL</span>
                <span className="block truncate text-[#fafafa]">
                  {manifest.defaultModel ?? "claude-sonnet-5.5"}
                </span>
              </div>
              <div className="border-r border-white/[0.06] p-2.5 sm:border-r-0">
                <span className="block text-[10px] text-[#737373]">GRID</span>
                <span className="text-[#fafafa]">
                  {manifest.layout.defaultSize.w}×{manifest.layout.defaultSize.h}
                </span>
              </div>
              <div className="p-2.5">
                <span className="block text-[10px] text-[#737373]">REV-SHARE</span>
                <span className="text-[#fafafa]">
                  {manifest.monetization.tokenRevShare ? "20% margin" : "Off"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <CodeBlock
              code={JSON.stringify(manifest, null, 2)}
              filename={`${manifest.id}/piece.json`}
              language="json"
              maxHeight="max-h-[340px]"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
