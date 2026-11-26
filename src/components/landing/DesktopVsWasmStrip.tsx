"use client";

import { useState } from "react";
import { Check, FileCode2, Folder, FolderOpen, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

const CAPABILITIES = [
  { feature: "Dashboard Canvas & @orthese/ui", wasm: "Full (GPUI → wasm32)", desktop: "Full (120fps native)" },
  { feature: "Standard Pieces (Prompt Box, Website Builder)", wasm: "Instant zero-install", desktop: "Full support" },
  { feature: "Managed Orthese Credits (Cloudflare Proxy)", wasm: "Full support", desktop: "Full support" },
  { feature: "Remote MCP Servers (Streamable HTTP / SSE)", wasm: "Full support", desktop: "Full support" },
  { feature: "Elevated Pieces (fs:read/write, shell:exec)", wasm: "Sandbox preview only", desktop: "Full local repos" },
  { feature: "Local stdio MCPs & CLIProxyAPI Sidecar", wasm: null, desktop: "Native lifecycle" },
];

const TREE_FILES: Record<string, { path: string; preview: string }> = {
  "piece.json": {
    path: "my-piece/piece.json",
    preview: `{
  "id": "orthese.website-builder",
  "extends": "orthese.base-harness",
  "defaultTier": "balanced",
  "permissions": {
    "standard": ["ai:generate", "context:receive"],
    "elevated": []
  },
  "context": {
    "accepts": ["orthese/spec"],
    "emits": ["orthese/html-bundle"]
  }
}`,
  },
  "SKILL.md": {
    path: "skills/landing-page-architect/SKILL.md",
    preview: `---
name: landing-page-architect
description: Monochrome workstation layouts
---
# Rules
- #0A0A0A canvas, 1px rgba(255,255,255,0.08) borders
- Tabular monospace for credits & manifests`,
  },
  "lib.rs": {
    path: "crates/pieces/website-builder/src/lib.rs",
    preview: `pub fn manifest() -> PieceManifest {
    PieceManifest {
        id: "orthese.website-builder".into(),
        // Compiles cleanly for desktop & wasm32
        ..Default::default()
    }
}`,
  },
};

export function DesktopVsWasmStrip() {
  const [selectedFile, setSelectedFile] = useState<keyof typeof TREE_FILES>("piece.json");

  return (
    <section className="border-t border-white/[0.06] py-20">
      <div className="mb-10 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          02 / Dual Target · Rust + GPUI
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Try instantly in WebAssembly. Unlock local power on Desktop.
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
          One Rust + GPUI codebase compiles to both <code className="text-zinc-200">wasm32</code>{" "}
          in the browser and a native desktop binary—mapped directly to Standard vs. Elevated
          Piece permissions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Left: Numbered Comparison Matrix */}
        <div className="workstation-card overflow-hidden rounded-2xl">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-white/[0.08] bg-[#0e0e0e] px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            <span>Capability</span>
            <span>Web (WASM)</span>
            <span>Desktop (Native)</span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {CAPABILITIES.map((row, idx) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-2 px-4 py-3 text-xs"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <span className="font-mono text-[10px] text-zinc-600">
                    0{idx + 1}
                  </span>
                  <span>{row.feature}</span>
                </div>
                <div className="font-mono text-[11px] text-zinc-400">
                  {row.wasm ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-zinc-300" />
                      <span>{row.wasm}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-zinc-600">
                      <Minus className="h-3 w-3" />
                      <span>Desktop only</span>
                    </span>
                  )}
                </div>
                <div className="font-mono text-[11px] text-zinc-200">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-white" />
                    <span>{row.desktop}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Piece + SKILL.md File Tree */}
        <div className="workstation-card flex flex-col justify-between rounded-2xl p-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="font-mono text-[11px] text-zinc-300">
                orthese/ workspace bundle
              </span>
              <span className="font-mono text-[10px] text-zinc-500">Click to inspect</span>
            </div>

            <div className="mt-3 space-y-1 font-mono text-xs">
              <div className="flex items-center gap-2 px-2 py-1 text-zinc-400">
                <FolderOpen className="h-3.5 w-3.5 text-zinc-500" />
                <span>crates/pieces/website-builder/</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile("piece.json")}
                className={cn(
                  "ml-4 flex w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2 py-1 text-left transition-colors cursor-pointer",
                  selectedFile === "piece.json"
                    ? "bg-white/[0.09] text-white"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>piece.json</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFile("lib.rs")}
                className={cn(
                  "ml-4 flex w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2 py-1 text-left transition-colors cursor-pointer",
                  selectedFile === "lib.rs"
                    ? "bg-white/[0.09] text-white"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>src/lib.rs</span>
              </button>
              <div className="mt-2 flex items-center gap-2 px-2 py-1 text-zinc-400">
                <Folder className="h-3.5 w-3.5 text-zinc-500" />
                <span>skills/landing-page-architect/</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile("SKILL.md")}
                className={cn(
                  "ml-4 flex w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2 py-1 text-left transition-colors cursor-pointer",
                  selectedFile === "SKILL.md"
                    ? "bg-white/[0.09] text-white"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                )}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>SKILL.md</span>
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.07] bg-[#0a0a0a]">
            <div className="border-b border-white/[0.06] px-3 py-1.5 font-mono text-[10px] text-zinc-500">
              {TREE_FILES[selectedFile].path}
            </div>
            <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed text-zinc-300">
              {TREE_FILES[selectedFile].preview}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
