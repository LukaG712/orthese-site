"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Cpu,
  ExternalLink,
  FolderTree,
  Globe,
  Layers,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  Accordion,
  Announcement,
  Breadcrumb,
  Divider,
  Pagination,
  SearchField,
  SegmentedControl,
  Tabs,
  TreeView,
  type AccordionEntry,
  type TreeNodeItem,
} from "@/components/primitives/BoardUIPrimitives";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { cn } from "@/lib/cn";

interface DocSectionMeta {
  id: string;
  label: string;
  group: string;
  keywords: string;
  badge?: string;
}

const DOC_SECTIONS: DocSectionMeta[] = [
  {
    id: "quickstart",
    label: "Quickstart",
    group: "Getting Started",
    keywords: "install pnpm npm npx skills wasm desktop rust quickstart setup",
  },
  {
    id: "monorepo",
    label: "Monorepo & Manifest Tree",
    group: "Getting Started",
    keywords: "crates apps skills tree folder structure piece.json skill.md",
    badge: "Tree",
  },
  {
    id: "piece-sdk",
    label: "Piece SDK (piece.json)",
    group: "Architecture",
    keywords: "manifest sdk extends base-harness tokenrevshare monetization",
  },
  {
    id: "context-bus",
    label: "Shared Context Bus",
    group: "Architecture",
    keywords: "bus mime orthese/spec html-bundle git-diff pipe context",
  },
  {
    id: "skills",
    label: "Progressive SKILL.md",
    group: "Architecture",
    keywords: "skill.md frontmatter triggers lazy load context efficiency",
  },
  {
    id: "mcp",
    label: "Permissions & MCP Hub",
    group: "Security & Runtime",
    keywords: "permissions standard elevated fs:write shell:exec mcp stdio http",
    badge: "6",
  },
  {
    id: "router",
    label: "Router & GPUI Runtime",
    group: "Security & Runtime",
    keywords: "router cliproxyapi oauth models gpui desktop ollama",
  },
  {
    id: "faq",
    label: "FAQ & Troubleshooting",
    group: "Reference",
    keywords: "faq questions credits polar wasm billing rev-share",
  },
];

const DOC_GROUPS = [
  "Getting Started",
  "Architecture",
  "Security & Runtime",
  "Reference",
] as const;

type InstallManager = "pnpm" | "npm" | "npx-skills";
type RuntimeTarget = "wasm" | "desktop";

const INSTALL_COMMANDS: Record<
  RuntimeTarget,
  Record<InstallManager, { filename: string; code: string; caption: string }>
> = {
  wasm: {
    pnpm: {
      filename: "terminal · pnpm (Web WASM)",
      caption:
        "Scaffolds a standard Piece with zero elevated permissions and runs the wasm32 preview canvas locally.",
      code: `# Create a new WASM-compatible Piece
pnpm create orthese-piece my-piece --target wasm32
cd my-piece

# Install dependencies & launch local WASM canvas
pnpm install
pnpm dev:wasm`,
    },
    npm: {
      filename: "terminal · npm (Web WASM)",
      caption:
        "Standard npm workflow for scaffolding and testing browser-sandboxed Pieces.",
      code: `# Scaffold a Piece with piece.json + SKILL.md
npx create-orthese-piece@latest my-piece --target wasm32
cd my-piece

# Run in zero-install browser sandbox
npm install
npm run dev:wasm`,
    },
    "npx-skills": {
      filename: "terminal · npx skills (Web WASM)",
      caption:
        "Install official progressive SKILL.md packs straight into your workspace skills/ folder.",
      code: `# Install official Orthese SKILL.md packs
npx skills add orthese/landing-page-architect
npx skills add orthese/rust-gpui-piece

# Verify indexed frontmatter metadata
npx skills list --format compact`,
    },
  },
  desktop: {
    pnpm: {
      filename: "terminal · pnpm + cargo (Desktop Rust)",
      caption:
        "Compiles the native 120fps GPUI workstation with folder-scoped fs, guarded shell, and local stdio MCPs.",
      code: `# Clone the Orthese Rust + GPUI workspace
git clone https://github.com/LukaG712/orthese.git
cd orthese

# Build Piece assets & launch native 120fps Desktop binary
pnpm install
cargo run --release -p orthese-desktop`,
    },
    npm: {
      filename: "terminal · npm + cargo (Desktop Rust)",
      caption:
        "Pair npm Piece scripts with the native Rust/GPUI runner and CLIProxyAPI sidecar.",
      code: `# Initialize an elevated Desktop Piece
npx create-orthese-piece@latest repo-auditor --elevated fs:read,shell:exec
cd repo-auditor

# Launch attached to local Desktop GPUI host
npm install
cargo run -p orthese-desktop -- --piece ./piece.json`,
    },
    "npx-skills": {
      filename: "terminal · npx skills (Desktop Rust)",
      caption:
        "Attach progressive SKILL.md rules and local stdio MCP presets for Desktop coding sessions.",
      code: `# Add Rust/GPUI & repo-aware skills to ~/.orthese/skills
npx skills add orthese/rust-gpui-piece --global
npx skills add orthese/landing-page-architect --global

# Verify Desktop CLIProxyAPI + MCP allowlist
orthese doctor --desktop`,
    },
  },
};

const MONOREPO_TREE: TreeNodeItem[] = [
  {
    id: "dir-crates",
    label: "crates/",
    kind: "folder",
    children: [
      {
        id: "dir-sdk",
        label: "orthese-sdk/",
        kind: "folder",
        children: [
          {
            id: "file-sdk-lib",
            label: "src/lib.rs",
            kind: "file",
            badge: "Rust",
          },
        ],
      },
      {
        id: "dir-pieces",
        label: "pieces/",
        kind: "folder",
        children: [
          {
            id: "file-wb-manifest",
            label: "website-builder/piece.json",
            kind: "file",
            badge: "wasm32",
          },
          {
            id: "file-se-manifest",
            label: "software-engineer/piece.json",
            kind: "file",
            badge: "elevated",
          },
        ],
      },
    ],
  },
  {
    id: "dir-apps",
    label: "apps/",
    kind: "folder",
    children: [
      {
        id: "file-web-wasm",
        label: "web-wasm/src/lib.rs",
        kind: "file",
        badge: "WASM",
      },
      {
        id: "file-desktop-main",
        label: "desktop/src/main.rs",
        kind: "file",
        badge: "GPUI",
      },
    ],
  },
  {
    id: "dir-skills",
    label: "skills/",
    kind: "folder",
    children: [
      {
        id: "file-skill-landing",
        label: "landing-page-architect/SKILL.md",
        kind: "file",
        badge: "SKILL.md",
      },
      {
        id: "file-skill-gpui",
        label: "rust-gpui-piece/SKILL.md",
        kind: "file",
        badge: "SKILL.md",
      },
    ],
  },
];

interface TreeFileSpec {
  path: string;
  language: string;
  runtimeLabel: string;
  summary: string;
  code: string;
}

const TREE_FILES: Record<string, TreeFileSpec> = {
  "file-wb-manifest": {
    path: "crates/pieces/website-builder/piece.json",
    language: "json",
    runtimeLabel: "WASM + Desktop · Standard",
    summary:
      "Empty elevated[] array makes this Piece immediately eligible for zero-install WebAssembly execution.",
    code: `{
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
}`,
  },
  "file-se-manifest": {
    path: "crates/pieces/software-engineer/piece.json",
    language: "json",
    runtimeLabel: "Desktop only · Elevated",
    summary:
      "Declares folder-scoped fs:read/write, guarded shell:exec, and mcp:call, enforced with click-to-approve cards.",
    code: `{
  "id": "orthese.software-engineer",
  "version": "0.1.0",
  "extends": "orthese.base-harness",
  "defaultModel": "claude-opus-5.5",
  "permissions": {
    "standard": ["ai:generate", "context:send", "context:receive"],
    "elevated": ["fs:read", "fs:write", "shell:exec", "mcp:call"]
  },
  "context": {
    "accepts": ["orthese/spec", "text/markdown"],
    "emits": ["orthese/git-diff", "orthese/code-patch"]
  },
  "monetization": {
    "purchaseType": "free",
    "priceUsd": 0,
    "tokenRevShare": true
  }
}`,
  },
  "file-sdk-lib": {
    path: "crates/orthese-sdk/src/lib.rs",
    language: "rust",
    runtimeLabel: "Shared Core SDK",
    summary:
      "Single Rust contract validating piece.json manifests, MIME routes, and wasm32 eligibility across every Piece.",
    code: `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PiecePermissions {
    pub standard: Vec<String>,
    pub elevated: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PieceManifest {
    pub id: String,
    pub extends: Option<String>,
    pub default_model: Option<String>,
    pub permissions: PiecePermissions,
}

impl PieceManifest {
    /// Pieces with no elevated scopes compile directly to wasm32.
    pub fn supports_wasm(&self) -> bool {
        self.permissions.elevated.is_empty()
    }
}`,
  },
  "file-web-wasm": {
    path: "apps/web-wasm/src/lib.rs",
    language: "rust",
    runtimeLabel: "wasm32-unknown-unknown",
    summary:
      "Zero-install browser host mounting @orthese/ui and standard Pieces against managed Cloudflare Edge credits.",
    code: `use orthese_canvas::{CanvasHost, RuntimeTarget};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn boot_wasm_workspace() -> Result<(), JsValue> {
    CanvasHost::builder()
        .target(RuntimeTarget::WebWasm)
        .context_bus("bus://workspace.default")
        .mount("#orthese-root")
        .map_err(|err| JsValue::from_str(&err.to_string()))
}`,
  },
  "file-desktop-main": {
    path: "apps/desktop/src/main.rs",
    language: "rust",
    runtimeLabel: "Native 120fps GPUI",
    summary:
      "Native Rust/GPUI shell unlocking local repositories, guarded terminal execution, stdio MCPs, and CLIProxyAPI.",
    code: `use orthese_canvas::{CanvasHost, RuntimeTarget};
use orthese_sidecar::CliProxySupervisor;

fn main() -> anyhow::Result<()> {
    let sidecar = CliProxySupervisor::attach_local()?;
    CanvasHost::builder()
        .target(RuntimeTarget::DesktopGpui)
        .with_sidecar(sidecar)
        .context_bus("bus://workspace.default")
        .run_native()
}`,
  },
  "file-skill-landing": {
    path: "skills/landing-page-architect/SKILL.md",
    language: "markdown",
    runtimeLabel: "Progressive Skill · 90 tok meta",
    summary:
      "Only YAML frontmatter is indexed upfront; the Markdown body streams into context when a trigger matches.",
    code: `---
name: landing-page-architect
description: Calm BoardUI dark layouts with crisp surface contrast.
triggers: ["landing page", "hero", "marketing site"]
---

# Landing Page Architect

1. Start from an optically centered hero on #121212.
2. Alternate hairline borders with elevated #161618 / #171717 surfaces.
3. Emit valid orthese/html-bundle payloads directly onto the Shared Context Bus.`,
  },
  "file-skill-gpui": {
    path: "skills/rust-gpui-piece/SKILL.md",
    language: "markdown",
    runtimeLabel: "Progressive Skill · 85 tok meta",
    summary:
      "Teaches coding agents the exact piece.json schema and wasm32 vs GPUI permission split.",
    code: `---
name: rust-gpui-piece
description: Author dual-target Rust + GPUI Pieces with piece.json validation.
triggers: ["piece.json", "gpui", "wasm32", "orthese sdk"]
---

# Rust GPUI Piece Checklist

1. Validate piece.json against crates/orthese-sdk/src/lib.rs.
2. Keep permissions.elevated empty for instant browser execution.
3. Declare explicit context.accepts and context.emits MIME contracts.`,
  },
};

const SKILL_MD_EXAMPLE = TREE_FILES["file-skill-landing"].code;

const PERMISSION_ITEMS: AccordionEntry[] = [
  {
    id: "perm-ai-generate",
    title: "ai:generate",
    subtitle: "Model inference via Orthese Router or local CLIProxyAPI",
    badge: "Standard · WASM",
    badgeTone: "standard",
    content: (
      <p>
        Grants access to streaming completions through{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">orthese.base-harness</code>.
        Requests are metered transparently against the user&apos;s non-expiring credit balance
        (Cloudflare Edge) or routed at zero cost through Desktop CLIProxyAPI OAuth.
      </p>
    ),
  },
  {
    id: "perm-context",
    title: "context:send & context:receive",
    subtitle: "Typed MIME pub/sub across the Shared Context Bus",
    badge: "Standard · WASM",
    badgeTone: "standard",
    content: (
      <p>
        Allows a Piece to publish and subscribe to declared MIME types such as{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">orthese/spec</code>,{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">orthese/html-bundle</code>, and{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">orthese/git-diff</code> on{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">bus://workspace.default</code>.
      </p>
    ),
  },
  {
    id: "perm-storage",
    title: "storage:local",
    subtitle: "Isolated per-Piece workspace state & checkpoints",
    badge: "Standard · WASM",
    badgeTone: "standard",
    content: (
      <p>
        Persists undo checkpoints, draft prompts, and pane layout preferences inside a
        sandboxed Piece namespace (IndexedDB in WebAssembly, SQLite in Native Desktop).
      </p>
    ),
  },
  {
    id: "perm-fs",
    title: "fs:read & fs:write",
    subtitle: "Folder-scoped local repository access",
    badge: "Elevated · Desktop",
    badgeTone: "elevated",
    content: (
      <p>
        Restricted exclusively to folders explicitly mounted into the current workspace on
        Native Desktop. Write operations surface an interactive unified diff preview before
        touching files on disk.
      </p>
    ),
  },
  {
    id: "perm-shell",
    title: "shell:exec",
    subtitle: "Guarded terminal commands with human-in-the-loop approvals",
    badge: "Elevated · Desktop",
    badgeTone: "elevated",
    content: (
      <p>
        Executes workspace build/test commands (such as{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">cargo test --workspace</code>{" "}
        or <code className="font-mono text-[12px] text-[#fafafa]">pnpm typecheck</code>).
        Destructive commands always pause behind a click-to-approve card.
      </p>
    ),
  },
  {
    id: "perm-mcp",
    title: "mcp:call",
    subtitle: "Per-Piece allowlist for remote HTTP & local stdio MCP servers",
    badge: "Scoped · Hub",
    badgeTone: "neutral",
    content: (
      <p>
        Remote Streamable HTTP MCP servers work across both WASM and Desktop; local{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">stdio</code> MCP servers are
        supervised natively on Desktop. Each Piece only sees servers explicitly enabled on its
        workspace allowlist.
      </p>
    ),
  },
];

const FAQ_ITEMS: AccordionEntry[] = [
  {
    id: "faq-wasm",
    title: "When can my Piece run zero-install in WebAssembly?",
    content: (
      <p>
        Any Piece whose{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">permissions.elevated</code>{" "}
        array in <code className="font-mono text-[12px] text-[#fafafa]">piece.json</code> is
        empty compiles directly to <code className="font-mono text-[12px] text-[#fafafa]">wasm32</code>{" "}
        and launches inside <code className="font-mono text-[12px] text-[#fafafa]">app.orthese.com</code>{" "}
        in under 10 seconds. Pieces requesting{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">fs:write</code> or{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">shell:exec</code> automatically
        show a sandbox preview on Web and unlock full execution on Native Desktop.
      </p>
    ),
  },
  {
    id: "faq-cliproxy",
    title: "How does local CLIProxyAPI OAuth routing work on Desktop?",
    content: (
      <p>
        On Native Desktop, Orthese supervises a local{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">CLIProxyAPI</code> sidecar that
        reuses your existing Claude Code, Codex CLI, or Gemini CLI OAuth sessions with live
        quota bars and multi-account failover, consuming zero Orthese Credits.
      </p>
    ),
  },
  {
    id: "faq-revshare",
    title: "How does creator tokenRevShare attribution work?",
    content: (
      <p>
        Community authors can ship Pieces completely free (no paywall) while setting{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">
          &quot;tokenRevShare&quot;: true
        </code>{" "}
        in <code className="font-mono text-[12px] text-[#fafafa]">piece.json</code>. Whenever
        users invoke cloud models inside your Piece with Orthese Credits, 20% of token margin
        is attributed automatically to your creator account via Polar.
      </p>
    ),
  },
  {
    id: "faq-skill-loading",
    title: "Do SKILL.md files bloat my context window?",
    content: (
      <p>
        No. Orthese indexes only the lightweight YAML frontmatter (~80–120 tokens per skill).
        The full Markdown instruction body is streamed into the prompt context only when a
        trigger matches or when you explicitly reference the skill via{" "}
        <code className="font-mono text-[12px] text-[#fafafa]">@SKILL.md</code>.
      </p>
    ),
  },
  {
    id: "faq-credits",
    title: "Do Orthese Credits expire or require a monthly subscription?",
    content: (
      <p>
        Never. The Orthese dashboard is free forever, starter accounts include €2 in free
        credits, and one-time credit packs purchased via Polar (Apple Pay, Google Pay,
        Bancontact, cards) never expire.
      </p>
    ),
  },
];

export function DocsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState<string>("quickstart");
  const [runtime, setRuntime] = useState<RuntimeTarget>("wasm");
  const [installTab, setInstallTab] = useState<InstallManager>("pnpm");
  const [selectedTreeFile, setSelectedTreeFile] = useState<string>("file-wb-manifest");
  const [expandedPerms, setExpandedPerms] = useState<string[]>([
    "perm-ai-generate",
    "perm-fs",
  ]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Press "/" anywhere outside text inputs to focus the Docs Sidebar SearchField
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track active section while scrolling so Sidebar, Breadcrumb & Pagination stay in sync
  useEffect(() => {
    const elements = DOC_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0.05 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DOC_SECTIONS;
    return DOC_SECTIONS.filter(
      (sec) =>
        sec.label.toLowerCase().includes(q) ||
        sec.group.toLowerCase().includes(q) ||
        sec.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeSection =
    DOC_SECTIONS.find((s) => s.id === activeSectionId) ?? DOC_SECTIONS[0];
  const activeIndex = Math.max(
    0,
    DOC_SECTIONS.findIndex((s) => s.id === activeSection.id)
  );

  function jumpToSection(id: string) {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  const activeTreeSpec = TREE_FILES[selectedTreeFile] ?? TREE_FILES["file-wb-manifest"];
  const activeInstallSpec = INSTALL_COMMANDS[runtime][installTab];

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="mx-auto max-w-[1160px] px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:items-start lg:gap-10">
          {/* FLOATING 260px BOARDUI DOCS SIDEBAR */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div
              data-testid="docs-sidebar"
              className="flex w-[260px] flex-col rounded-3xl border border-white/[0.08] bg-[#171717] p-3.5 shadow-[0_18px_48px_-14px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between px-1.5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.1] bg-[#121212]">
                    <BookOpen className="h-3.5 w-3.5 text-[#fafafa]" />
                  </span>
                  <span className="text-[13px] font-medium text-[#fafafa]">
                    Orthese Docs
                  </span>
                </div>
                <span className="rounded-full border border-white/[0.08] bg-[#121212] px-2 py-0.5 font-mono text-[10px] text-[#a3a3a3]">
                  v0.1
                </span>
              </div>

              {/* Audience Mode Switcher (Non-Tech Quickstart <-> Tech & Pro) */}
              <div className="mb-3 grid grid-cols-2 rounded-xl border border-white/[0.08] bg-[#121212] p-0.5 text-[11.5px] font-medium">
                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center justify-center rounded-lg py-1.5 text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                >
                  Quickstart
                </Link>
                <span
                  aria-current="page"
                  className="inline-flex items-center justify-center rounded-lg border border-white/[0.1] bg-[#262626] py-1.5 text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  Tech &amp; Pro
                </span>
              </div>

              {/* BoardUI Search Field with Kbd hint */}
              <SearchField
                inputRef={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Filter docs..."
                ariaLabel="Filter documentation sections"
                kbdHint="/"
                size="small"
                shape="rounded"
              />

              {/* Grouped Nav Items */}
              <nav
                aria-label="Documentation sections"
                className="mt-3.5 max-h-[calc(100vh-280px)] space-y-4 overflow-y-auto pr-0.5"
              >
                {filteredSections.length === 0 ? (
                  <div className="rounded-xl border border-white/[0.06] bg-[#121212] px-3 py-4 text-center">
                    <p className="text-[12px] text-[#737373]">
                      No sections match &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-2 font-mono text-[11px] text-[#fafafa] underline decoration-white/25 underline-offset-4 cursor-pointer"
                    >
                      Reset filter
                    </button>
                  </div>
                ) : (
                  DOC_GROUPS.map((group) => {
                    const groupItems = filteredSections.filter(
                      (s) => s.group === group
                    );
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group}>
                        <div className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                          {group}
                        </div>
                        <ul className="space-y-0.5">
                          {groupItems.map((sec) => {
                            const active = activeSection.id === sec.id;
                            return (
                              <li key={sec.id}>
                                <a
                                  href={`#${sec.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    jumpToSection(sec.id);
                                  }}
                                  aria-current={active ? "location" : undefined}
                                  className={cn(
                                    "flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-[12.5px] transition-colors",
                                    active
                                      ? "bg-white/[0.09] font-medium text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                                      : "text-[#a3a3a3] hover:bg-white/[0.04] hover:text-[#fafafa]"
                                  )}
                                >
                                  <span className="truncate">{sec.label}</span>
                                  {sec.badge && (
                                    <span className="shrink-0 rounded-md border border-white/[0.08] bg-[#121212] px-1.5 py-0.5 font-mono text-[9.5px] leading-none text-[#a3a3a3]">
                                      {sec.badge}
                                    </span>
                                  )}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
                )}
              </nav>

              {/* Sidebar Footer Links */}
              <div className="mt-3.5 border-t border-white/[0.07] pt-3">
                <div className="space-y-0.5">
                  <Link
                    href="/marketplace"
                    className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[12px] text-[#a3a3a3] transition-colors hover:bg-white/[0.04] hover:text-[#fafafa]"
                  >
                    <span>Marketplace</span>
                    <ArrowRight className="h-3 w-3 text-[#737373]" />
                  </Link>
                  <Link
                    href="/router"
                    className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[12px] text-[#a3a3a3] transition-colors hover:bg-white/[0.04] hover:text-[#fafafa]"
                  >
                    <span>Orthese Router</span>
                    <ArrowRight className="h-3 w-3 text-[#737373]" />
                  </Link>
                  <a
                    href="https://github.com/LukaG712/orthese-sdk"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-[12px] text-[#a3a3a3] transition-colors hover:bg-white/[0.04] hover:text-[#fafafa]"
                  >
                    <span>Piece SDK GitHub</span>
                    <ExternalLink className="h-3 w-3 text-[#737373]" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN DOCS COLUMN */}
          <main className="min-w-0">
            {/* TOP BREADCRUMB + ANNOUNCEMENT CALLOUT */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Breadcrumb
                  items={[
                    { label: "Docs", onClick: () => jumpToSection("quickstart") },
                    { label: activeSection.group },
                    { label: activeSection.label },
                  ]}
                />

                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#171717] px-3 py-1 text-[11.5px] font-medium text-[#d4d4d4] transition-colors hover:border-white/[0.2] hover:text-[#fafafa]"
                >
                  <Sparkles className="h-3 w-3 text-[#a3a3a3]" />
                  <span>Non-Tech Quickstart</span>
                  <ArrowRight className="h-3 w-3 text-[#737373]" />
                </Link>
              </div>

              <Announcement
                badge="v0.1"
                title="Piece SDK v0.1 · Early Preview"
                description="Standard Pieces run zero-install in WebAssembly; elevated fs/shell Pieces run natively on Desktop GPUI."
                actionLabel="Explore Pieces"
                actionHref="/marketplace"
              />
            </div>

            {/* EDITORIAL DOCS HEADER */}
            <header className="mt-7 pb-8">
              <h1 className="text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#fafafa] sm:text-[42px]">
                Build with <OrbitGradientText>Orthese.</OrbitGradientText>
              </h1>
              <p className="mt-3.5 max-w-2xl text-[14.5px] leading-relaxed text-[#a3a3a3] sm:text-[15.5px]">
                Everything you need to run modular Pieces in WebAssembly or Desktop GPUI, pipe
                typed context payloads, load progressive{" "}
                <code className="font-mono text-[13px] text-[#d4d4d4]">SKILL.md</code> files,
                and route across 44 models.
              </p>

              {/* Mobile Search Field + Section Jump Chips */}
              <div className="mt-5 space-y-2.5 lg:hidden">
                <SearchField
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Filter docs sections..."
                  ariaLabel="Filter documentation sections"
                  size="small"
                />
                <nav
                  aria-label="Jump to section"
                  className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1"
                >
                  {filteredSections.map((sec) => {
                    const active = activeSection.id === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          jumpToSection(sec.id);
                        }}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                          active
                            ? "border-white/20 bg-white/[0.1] font-medium text-[#fafafa]"
                            : "border-white/[0.09] bg-[#171717] text-[#a3a3a3] hover:text-[#fafafa]"
                        )}
                      >
                        {sec.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </header>

            <Divider />

            <div className="mt-10 space-y-14">
              {/* 1. QUICKSTART: SEGMENTED CONTROL (RUNTIME) + TABS (INSTALL COMMANDS) */}
              <section id="quickstart" className="scroll-mt-24 space-y-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                      01 · Getting Started
                    </span>
                    <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                      Quickstart
                    </h2>
                  </div>

                  {/* BoardUI Segmented Control for Runtime Choice */}
                  <SegmentedControl<RuntimeTarget>
                    ariaLabel="Choose Orthese runtime target"
                    value={runtime}
                    onChange={setRuntime}
                    options={[
                      { id: "wasm", label: "Web WASM", meta: "wasm32" },
                      { id: "desktop", label: "Desktop Rust", meta: "GPUI 120fps" },
                    ]}
                  />
                </div>

                <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                  Orthese compiles from one Rust + GPUI core to both a zero-install WebAssembly
                  browser dashboard and a native 120fps Desktop binary. Pick your target runtime
                  and package manager below:
                </p>

                {/* Runtime Context Summary Card */}
                <motion.div
                  key={runtime}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {runtime === "wasm" ? (
                        <Globe className="h-4 w-4 text-[#fafafa]" />
                      ) : (
                        <Terminal className="h-4 w-4 text-[#fafafa]" />
                      )}
                      <span className="text-[14px] font-medium text-[#fafafa]">
                        {runtime === "wasm"
                          ? "WebAssembly Sandbox (Zero-Install)"
                          : "Native Desktop Workstation (Rust/GPUI)"}
                      </span>
                    </div>
                    <span className="rounded-full border border-white/[0.1] bg-[#121212] px-2.5 py-0.5 font-mono text-[10.5px] text-[#a3a3a3]">
                      {runtime === "wasm"
                        ? "Standard scopes · Cloudflare Edge"
                        : "Full fs/shell · CLIProxyAPI + stdio MCP"}
                    </span>
                  </div>

                  {/* BoardUI Tabs for Installation Commands */}
                  <div className="mt-4">
                    <Tabs<InstallManager>
                      ariaLabel="Installation command manager"
                      value={installTab}
                      onChange={setInstallTab}
                      options={[
                        { id: "pnpm", label: "pnpm" },
                        { id: "npm", label: "npm" },
                        { id: "npx-skills", label: "npx skills", badge: "SKILL.md" },
                      ]}
                    />

                    <div className="mt-4">
                      <CodeBlock
                        code={activeInstallSpec.code}
                        language="bash"
                        filename={activeInstallSpec.filename}
                        className="bg-[#121212]"
                      />
                      <p className="mt-2.5 text-[12.5px] text-[#a3a3a3]">
                        {activeInstallSpec.caption}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Jump Cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/dashboard"
                    className="group rounded-2xl border border-white/[0.08] bg-[#171717] p-4 transition-colors hover:border-white/[0.18]"
                  >
                    <div className="flex items-center justify-between text-[13.5px] font-medium text-[#fafafa]">
                      <span>Browser WASM Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#737373] transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                      Try Pieces immediately in Chrome, Safari, or Firefox with €2 free starter
                      credits.
                    </p>
                  </Link>
                  <Link
                    href="/marketplace"
                    className="group rounded-2xl border border-white/[0.08] bg-[#171717] p-4 transition-colors hover:border-white/[0.18]"
                  >
                    <div className="flex items-center justify-between text-[13.5px] font-medium text-[#fafafa]">
                      <span>Explore Marketplace</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#737373] transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                      Snap verified official Pieces, community tools, and progressive Skills
                      onto your canvas.
                    </p>
                  </Link>
                </div>
              </section>

              <Divider />

              {/* 2. MONOREPO & MANIFEST TREE VIEW */}
              <section id="monorepo" className="scroll-mt-24 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    <FolderTree className="h-3.5 w-3.5 text-[#a3a3a3]" />
                    <span>02 · Workspace Layout</span>
                  </div>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    Monorepo &amp; Manifest Tree
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#a3a3a3]">
                    Explore how <code className="font-mono text-[13px] text-[#d4d4d4]">crates/</code>,{" "}
                    <code className="font-mono text-[13px] text-[#d4d4d4]">apps/</code>, and{" "}
                    <code className="font-mono text-[13px] text-[#d4d4d4]">skills/</code> fit
                    together. Click any file in the Tree View to inspect its{" "}
                    <code className="font-mono text-[13px] text-[#d4d4d4]">piece.json</code>,{" "}
                    <code className="font-mono text-[13px] text-[#d4d4d4]">SKILL.md</code>, or
                    Rust entrypoint.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div className="grid grid-cols-1 md:grid-cols-[270px_1fr]">
                    {/* Left: BoardUI TreeView */}
                    <div className="border-b border-white/[0.07] bg-[#151517] p-3.5 md:border-b-0 md:border-r">
                      <div className="mb-2.5 flex items-center justify-between px-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                        <span>orthese/</span>
                        <span>7 files</span>
                      </div>
                      <TreeView
                        nodes={MONOREPO_TREE}
                        selectedId={selectedTreeFile}
                        onSelect={setSelectedTreeFile}
                        defaultExpandedIds={[
                          "dir-crates",
                          "dir-sdk",
                          "dir-pieces",
                          "dir-apps",
                          "dir-skills",
                        ]}
                        ariaLabel="Orthese monorepo file tree"
                      />
                    </div>

                    {/* Right: Live File Viewer */}
                    <div className="min-w-0 bg-[#171717] p-4 sm:p-5">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11.5px] text-[#d4d4d4]">
                          {activeTreeSpec.path}
                        </span>
                        <span className="rounded-full border border-white/[0.09] bg-[#121212] px-2.5 py-0.5 font-mono text-[10.5px] text-[#a3a3a3]">
                          {activeTreeSpec.runtimeLabel}
                        </span>
                      </div>

                      <motion.div
                        key={selectedTreeFile}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="min-w-0"
                      >
                        <CodeBlock
                          code={activeTreeSpec.code}
                          filename={activeTreeSpec.path}
                          language={activeTreeSpec.language}
                          maxHeight="max-h-[340px]"
                          className="bg-[#121212]"
                        />
                      </motion.div>

                      <p className="mt-3 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                        {activeTreeSpec.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Divider />

              {/* 3. PIECE SDK (piece.json) */}
              <section id="piece-sdk" className="scroll-mt-24 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                  <Layers className="h-3.5 w-3.5 text-[#a3a3a3]" />
                  <span>03 · SDK &amp; Manifest</span>
                </div>
                <h2 className="text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                  Piece SDK (<code className="font-mono text-[20px]">piece.json</code>)
                </h2>
                <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                  Every Piece declares its capabilities, accepted/emitted context contracts,
                  default real model, and optional{" "}
                  <code className="font-mono text-[13px] text-[#d4d4d4]">tokenRevShare</code> in
                  a single manifest. Free Pieces with{" "}
                  <code className="font-mono text-[13px] text-[#d4d4d4]">
                    tokenRevShare: true
                  </code>{" "}
                  earn 20% of token margin automatically.
                </p>

                <div className="grid gap-3 sm:grid-cols-3 pt-1">
                  {[
                    {
                      field: 'extends: "orthese.base-harness"',
                      note: "Inherits streaming, checkpoints, model switching, and SKILL.md loading.",
                    },
                    {
                      field: "permissions.elevated: []",
                      note: "Leaving elevated empty unlocks instant zero-install WebAssembly execution.",
                    },
                    {
                      field: "monetization.tokenRevShare",
                      note: "Keep community Pieces free while earning Polar creator attribution.",
                    },
                  ].map((spec) => (
                    <div
                      key={spec.field}
                      className="rounded-2xl border border-white/[0.08] bg-[#171717] p-4"
                    >
                      <div className="font-mono text-[11.5px] text-[#fafafa]">
                        {spec.field}
                      </div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                        {spec.note}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* 4. SHARED CONTEXT BUS */}
              <section id="context-bus" className="scroll-mt-24 space-y-4">
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                  04 · Inter-Piece Piping
                </span>
                <h2 className="text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                  Shared Context Bus
                </h2>
                <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                  Pieces never force copy-pasting between tabs. Any Piece emitting a typed
                  contract publishes directly onto{" "}
                  <code className="font-mono text-[13px] text-[#d4d4d4]">
                    bus://workspace.default
                  </code>{" "}
                  so downstream panes receive structured state immediately:
                </p>
                <div className="grid gap-3 pt-1 sm:grid-cols-3">
                  {[
                    {
                      type: "orthese/spec",
                      desc: "Structured architecture & UI specs drafted by AI Prompt Box.",
                    },
                    {
                      type: "orthese/html-bundle",
                      desc: "Live previewable HTML/Tailwind artifacts rendered in Website Builder.",
                    },
                    {
                      type: "orthese/git-diff",
                      desc: "Folder-scoped patches & test reports verified in Software Engineer.",
                    },
                  ].map((c) => (
                    <div
                      key={c.type}
                      className="rounded-2xl border border-white/[0.08] bg-[#171717] p-4"
                    >
                      <div className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[#fafafa]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{c.type}</span>
                      </div>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                        {c.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* 5. PROGRESSIVE SKILL.md */}
              <section id="skills" className="scroll-mt-24 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                  <Sparkles className="h-3.5 w-3.5 text-[#a3a3a3]" />
                  <span>05 · Context Efficiency</span>
                </div>
                <h2 className="text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                  Progressive <code className="font-mono text-[20px]">SKILL.md</code>
                </h2>
                <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                  Skills stay indexed as lightweight frontmatter metadata and stream their full
                  instruction body into the active context window only when triggered, keeping
                  token usage lean.
                </p>
                <CodeBlock
                  code={SKILL_MD_EXAMPLE}
                  language="markdown"
                  filename="skills/landing-page-architect/SKILL.md"
                  className="bg-[#171717]"
                />
              </section>

              <Divider />

              {/* 6. PERMISSIONS & SCOPED MCP HUB (BOARDUI ACCORDION) */}
              <section id="mcp" className="scroll-mt-24 space-y-5">
                <div
                  id="permissions"
                  className="scroll-mt-24 flex flex-wrap items-end justify-between gap-4"
                >
                  <div>
                    <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#a3a3a3]" />
                      <span>06 · Security &amp; Tooling</span>
                    </div>
                    <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                      Scoped MCP Hub &amp; Tiered Permissions
                    </h2>
                  </div>

                  {/* Controlled Expand / Collapse All */}
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpandedPerms(PERMISSION_ITEMS.map((p) => p.id))}
                      className="rounded-lg border border-white/[0.08] bg-[#171717] px-2.5 py-1 text-[11.5px] font-medium text-[#d4d4d4] transition-colors hover:border-white/[0.16] hover:text-[#fafafa] cursor-pointer"
                    >
                      Expand all
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedPerms([])}
                      className="rounded-lg border border-white/[0.08] bg-[#171717] px-2.5 py-1 text-[11.5px] font-medium text-[#a3a3a3] transition-colors hover:border-white/[0.16] hover:text-[#fafafa] cursor-pointer"
                    >
                      Collapse all
                    </button>
                  </div>
                </div>

                <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                  Every capability must be explicitly listed in{" "}
                  <code className="font-mono text-[13px] text-[#d4d4d4]">piece.json</code>.
                  Inspect each permission scope below:
                </p>

                <Accordion
                  items={PERMISSION_ITEMS}
                  variant="contained"
                  indicator="chevron"
                  allowsMultipleExpanded
                  expandedIds={expandedPerms}
                  onExpandedChange={setExpandedPerms}
                />
              </section>

              <Divider />

              {/* 7. ORTHESE ROUTER & DESKTOP GPUI RUNTIME */}
              <section id="router" className="scroll-mt-24 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                  <Cpu className="h-3.5 w-3.5 text-[#a3a3a3]" />
                  <span>07 · Hybrid Execution</span>
                </div>
                <h2
                  id="runtime"
                  className="scroll-mt-24 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]"
                >
                  Orthese Router &amp; Desktop GPUI Runtime
                </h2>
                <p className="text-[14.5px] leading-relaxed text-[#a3a3a3]">
                  Select any of 44 real models across 13 providers (including Claude Opus 5.5,
                  GPT-6.2 Astra, Gemini 4 Neon, and Meta Muse), or let{" "}
                  <strong className="font-medium text-[#fafafa]">Auto</strong> and{" "}
                  <strong className="font-medium text-[#fafafa]">Max</strong> route dynamically
                  per turn. On Desktop, toggle the local{" "}
                  <code className="font-mono text-[13px] text-[#d4d4d4]">CLIProxyAPI</code>{" "}
                  sidecar or Ollama to run at zero credit cost.
                </p>

                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  {[
                    {
                      title: "Cloudflare Edge Credits",
                      points: [
                        "28ms average edge dispatch",
                        "One non-expiring balance across all Pieces",
                        "Zero external API keys or billing portals",
                      ],
                    },
                    {
                      title: "Local CLIProxyAPI Sidecar",
                      points: [
                        "4ms local dispatch on Native Desktop",
                        "Reuses Claude Code, Codex & Gemini CLI OAuth",
                        "Live per-provider quota bars & failover",
                      ],
                    },
                  ].map((mode) => (
                    <div
                      key={mode.title}
                      className="rounded-2xl border border-white/[0.08] bg-[#171717] p-4"
                    >
                      <h3 className="text-[13.5px] font-medium text-[#fafafa]">
                        {mode.title}
                      </h3>
                      <ul className="mt-2.5 space-y-1.5">
                        {mode.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex items-start gap-2 text-[12.5px] text-[#a3a3a3]"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#737373]" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/router"
                    className="bg-button-primary inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13px] font-medium"
                  >
                    <span>Explore Orthese Router</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/#dual-target"
                    className="bg-button-secondary inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13px] font-medium"
                  >
                    <Terminal className="h-3.5 w-3.5 text-[#a3a3a3]" />
                    <span>Compare Desktop vs. WASM</span>
                  </Link>
                </div>
              </section>

              <Divider label="FAQ & Reference" />

              {/* 8. FAQ ACCORDION */}
              <section id="faq" className="scroll-mt-24 space-y-4">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    08 · Reference
                  </span>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    Frequently Asked Questions
                  </h2>
                </div>

                <Accordion
                  items={FAQ_ITEMS}
                  variant="separated"
                  indicator="plus"
                  defaultExpandedIds={["faq-wasm"]}
                />
              </section>

              {/* BOTTOM DIVIDER + BOARDUI PAGINATION */}
              <div className="space-y-6 pt-4">
                <Divider />
                <Pagination
                  pages={DOC_SECTIONS.map((s) => ({
                    id: s.id,
                    label: s.label,
                    group: s.group,
                  }))}
                  currentIndex={activeIndex}
                  onSelectPage={(idx) => {
                    const target = DOC_SECTIONS[idx];
                    if (target) jumpToSection(target.id);
                  }}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
