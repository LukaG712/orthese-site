"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, FileCode2, Folder, FolderOpen, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

const CAPABILITIES = [
  { feature: "Dashboard Canvas & @orthese/ui", wasm: "Full (wasm32)", desktop: "Native 120fps" },
  { feature: "Standard Pieces (Prompt Box, Website Builder)", wasm: "Zero-install", desktop: "Full support" },
  { feature: "Managed Orthese Credits (Edge Proxy)", wasm: "Full support", desktop: "Full support" },
  { feature: "Remote MCP Servers (Streamable HTTP)", wasm: "Full support", desktop: "Full support" },
  { feature: "Elevated Pieces (fs:read/write, shell:exec)", wasm: "Sandbox preview", desktop: "Local repositories" },
  { feature: "Local stdio MCPs & CLIProxyAPI Sidecar", wasm: null, desktop: "Native lifecycle" },
];

const TREE_FILES = {
  "piece.json": {
    path: "crates/pieces/website-builder/piece.json",
    code: `{
  "id": "orthese.website-builder",
  "version": "0.1.0",
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
  "lib.rs": {
    path: "crates/pieces/website-builder/src/lib.rs",
    code: `use orthese_sdk::{ModelTier, PieceManifest};

pub fn manifest() -> PieceManifest {
    PieceManifest {
        id: "orthese.website-builder".into(),
        default_tier: Some(ModelTier::Balanced),
        // Zero elevated permissions -> instant wasm32
        ..Default::default()
    }
}`,
  },
  "SKILL.md": {
    path: "skills/landing-page-architect/SKILL.md",
    code: `---
name: landing-page-architect
description: Obsidian monochrome developer landing pages.
---

# Design System
- Canvas #050505, surfaces #111111, 1px rgba(255,255,255,0.08)
- Top-edge specular highlight on elevated frames
- Tabular numerals for credits, latencies, and pricing`,
  },
} as const;

type FileKey = keyof typeof TREE_FILES;

export function DesktopVsWasmStrip() {
  const [selected, setSelected] = useState<FileKey>("piece.json");

  return (
    <section className="border-t border-white/[0.08] py-28 sm:py-32">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
          02 / DUAL TARGET · RUST + GPUI
        </span>
        <h2 className="text-metallic mt-3 text-3xl font-medium tracking-[-0.04em] leading-[1.06] sm:text-4xl">
          Try in WebAssembly. Unlock native Desktop.
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#a1a1aa]">
          One GPU-accelerated Rust codebase powers zero-install browser sessions and full
          local filesystem &amp; shell execution on Desktop.
        </p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_1fr]">
        {/* Left: High-Density Cognition-Style Hairline Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[460px]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr] border-b border-white/[0.1] pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#52525b]">
              <span>Capability</span>
              <span>Web (WASM)</span>
              <span>Desktop (120fps)</span>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {CAPABILITIES.map((row, idx) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-[1.5fr_1fr_1fr] items-center gap-3 py-4 text-[13px]"
                >
                  <div className="flex items-baseline gap-3 text-[#fafafa]">
                    <span className="font-mono text-[11px] tabular-nums text-[#52525b]">
                      0{idx + 1}
                    </span>
                    <span className="font-normal">{row.feature}</span>
                  </div>

                  <div className="text-[12px] text-[#a1a1aa]">
                    {row.wasm ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-[#a1a1aa]" />
                        <span>{row.wasm}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#52525b]">
                        <Minus className="h-3.5 w-3.5" />
                        <span>Desktop only</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[12px] text-[#fafafa]">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-[#fafafa]" />
                      <span>{row.desktop}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive Monochrome File Tree + Animated Code Viewer */}
        <div className="obsidian-card overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
            <span className="font-mono text-[11px] text-[#a1a1aa]">orthese/</span>
            <span className="font-mono text-[10px] text-[#52525b]">Inspect bundle</span>
          </div>

          <div className="grid border-b border-white/[0.07] p-3 font-mono text-[12px]">
            <div className="flex items-center gap-2 px-2 py-1 text-[#71717a]">
              <FolderOpen className="h-3.5 w-3.5 text-[#52525b]" />
              <span>crates/pieces/website-builder/</span>
            </div>

            {(["piece.json", "lib.rs"] as const).map((file) => {
              const active = selected === file;
              return (
                <button
                  key={file}
                  type="button"
                  onClick={() => setSelected(file)}
                  className={cn(
                    "ml-4 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors cursor-pointer",
                    active
                      ? "bg-white/[0.08] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-[#a1a1aa] hover:bg-white/[0.03] hover:text-[#fafafa]"
                  )}
                >
                  <FileCode2 className="h-3.5 w-3.5 text-[#71717a]" />
                  <span>{file === "lib.rs" ? "src/lib.rs" : file}</span>
                </button>
              );
            })}

            <div className="mt-1.5 flex items-center gap-2 px-2 py-1 text-[#71717a]">
              <Folder className="h-3.5 w-3.5 text-[#52525b]" />
              <span>skills/landing-page-architect/</span>
            </div>
            <button
              type="button"
              onClick={() => setSelected("SKILL.md")}
              className={cn(
                "ml-4 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left transition-colors cursor-pointer",
                selected === "SKILL.md"
                  ? "bg-white/[0.08] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  : "text-[#a1a1aa] hover:bg-white/[0.03] hover:text-[#fafafa]"
              )}
            >
              <FileCode2 className="h-3.5 w-3.5 text-[#71717a]" />
              <span>SKILL.md</span>
            </button>
          </div>

          <div className="bg-[#080809] p-4">
            <div className="mb-2.5 font-mono text-[10px] text-[#52525b]">
              {TREE_FILES[selected].path}
            </div>
            <AnimatePresence mode="wait">
              <motion.pre
                key={selected}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="overflow-x-auto font-mono text-[11.5px] leading-[1.65] text-[#d4d4d8]"
              >
                {TREE_FILES[selected].code}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
