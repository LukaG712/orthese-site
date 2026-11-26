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
    <div className="rounded-xl border border-white/[0.09] bg-[#0e0e0e] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {hasElevated ? (
            <ShieldAlert className="h-4 w-4 text-zinc-200" />
          ) : (
            <Shield className="h-4 w-4 text-zinc-300" />
          )}
          <span className="text-xs font-semibold text-white">
            Transparent Manifest &amp; Security
          </span>
          <span className="rounded border border-white/[0.1] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
            piece.json
          </span>
        </div>

        <div className="inline-flex rounded-md border border-white/[0.09] bg-[#0a0a0a] p-0.5">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={cn(
              "rounded px-2 py-0.5 font-mono text-[10px] cursor-pointer transition-colors",
              mode === "visual" ? "bg-white/[0.12] text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setMode("raw")}
            className={cn(
              "inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] cursor-pointer transition-colors",
              mode === "raw" ? "bg-white/[0.12] text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Code2 className="h-3 w-3" />
            Raw JSON
          </button>
        </div>
      </div>

      {mode === "visual" ? (
        <div className="space-y-4 p-4 text-xs">
          {/* Permissions Breakdown */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.07] bg-[#121212] p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Standard Permissions (Zero Friction)
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {manifest.permissions.standard.map((perm) => (
                  <span
                    key={perm}
                    className="rounded border border-white/[0.09] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-200"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.07] bg-[#121212] p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Elevated Permissions (Desktop Approval)
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {hasElevated ? (
                  manifest.permissions.elevated.map((perm) => (
                    <span
                      key={perm}
                      className="rounded border border-white/25 bg-white/[0.08] px-2 py-0.5 font-mono text-[11px] text-white"
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-[11px] text-zinc-500">
                    None — safe for instant WebAssembly (wasm32)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Shared Context Bus Contract */}
          <div className="rounded-lg border border-white/[0.07] bg-[#121212] p-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              <Radio className="h-3 w-3" />
              <span>Shared Context Bus Contract</span>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <span className="font-mono text-[10px] text-zinc-500">accepts:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {manifest.context.accepts.map((mime) => (
                    <code
                      key={mime}
                      className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-zinc-300"
                    >
                      {mime}
                    </code>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-zinc-500">emits:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {manifest.context.emits.map((mime) => (
                    <code
                      key={mime}
                      className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-zinc-300"
                    >
                      {mime}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Runtime Metadata */}
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="rounded-lg border border-white/[0.06] bg-[#121212] px-3 py-2">
              <span className="block text-[10px] text-zinc-500">DEFAULT TIER</span>
              <span className="text-zinc-200">{manifest.defaultTier ?? "balanced"}</span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-[#121212] px-3 py-2">
              <span className="block text-[10px] text-zinc-500">GRID SIZE</span>
              <span className="text-zinc-200">
                {manifest.layout.defaultSize.w}×{manifest.layout.defaultSize.h} (min{" "}
                {manifest.layout.minSize.w}×{manifest.layout.minSize.h})
              </span>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-[#121212] px-3 py-2">
              <span className="block text-[10px] text-zinc-500">REV-SHARE</span>
              <span className="text-zinc-200">
                {manifest.monetization.tokenRevShare ? "Enabled (20%)" : "Off"}
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
