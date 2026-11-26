"use client";

import { useState } from "react";
import type { PieceManifest } from "@/types/piece-sdk";
import { Code2, Radio, Shield, ShieldAlert } from "lucide-react";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { cn } from "@/lib/cn";

interface ManifestSecurityPanelProps {
  manifest: PieceManifest;
}

export function ManifestSecurityPanel({ manifest }: ManifestSecurityPanelProps) {
  const [mode, setMode] = useState<"visual" | "raw">("visual");
  const hasElevated = manifest.permissions.elevated.length > 0;

  return (
    <div className="obsidian-surface overflow-hidden rounded-lg border border-white/[0.08]">
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          {hasElevated ? (
            <ShieldAlert className="h-4 w-4 text-[#fafafa]" />
          ) : (
            <Shield className="h-4 w-4 text-[#a1a1aa]" />
          )}
          <span className="text-[13px] font-medium text-[#fafafa]">
            Manifest &amp; Security
          </span>
          <span className="font-mono text-[11px] text-[#52525b]">piece.json</span>
        </div>

        <div className="inline-flex rounded-md border border-white/[0.08] bg-[#060607] p-0.5">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={cn(
              "rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer transition-colors",
              mode === "visual" ? "bg-white/[0.11] text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]"
            )}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setMode("raw")}
            className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium cursor-pointer transition-colors",
              mode === "raw" ? "bg-white/[0.11] text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]"
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
            <div className="rounded-lg border border-white/[0.06] bg-[#080809] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#52525b]">
                Standard (Sandboxed)
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {manifest.permissions.standard.map((perm) => (
                  <span
                    key={perm}
                    className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-[#d4d4d8]"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-[#080809] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#52525b]">
                Elevated (Desktop Prompt)
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {hasElevated ? (
                  manifest.permissions.elevated.map((perm) => (
                    <span
                      key={perm}
                      className="rounded border border-white/20 bg-white/[0.08] px-2 py-0.5 font-mono text-[11px] text-[#fafafa]"
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="text-[12px] text-[#71717a]">
                    None — runs natively in wasm32
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-[#080809] p-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#52525b]">
              <Radio className="h-3 w-3" />
              <span>Shared Context Bus</span>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <span className="font-mono text-[10px] text-[#52525b]">accepts</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {manifest.context.accepts.map((mime) => (
                    <code
                      key={mime}
                      className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-[#d4d4d8]"
                    >
                      {mime}
                    </code>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#52525b]">emits</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {manifest.context.emits.map((mime) => (
                    <code
                      key={mime}
                      className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-[#d4d4d8]"
                    >
                      {mime}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/[0.06] rounded-lg border border-white/[0.06] bg-[#080809] font-mono text-[11px] tabular-nums">
            <div className="p-2.5">
              <span className="block text-[10px] text-[#52525b]">TIER</span>
              <span className="text-[#fafafa]">{manifest.defaultTier ?? "balanced"}</span>
            </div>
            <div className="p-2.5">
              <span className="block text-[10px] text-[#52525b]">GRID</span>
              <span className="text-[#fafafa]">
                {manifest.layout.defaultSize.w}×{manifest.layout.defaultSize.h}
              </span>
            </div>
            <div className="p-2.5">
              <span className="block text-[10px] text-[#52525b]">REV-SHARE</span>
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
  );
}
