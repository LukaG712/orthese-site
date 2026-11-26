import type { MarketplaceItem } from "@/types/piece-sdk";

export interface CreditPack {
  id: string;
  name: string;
  priceEur: number;
  credits: number;
  badge?: string;
  tagline: string;
  bullets: string[];
  ctaLabel: string;
  polarEnvKey?: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "free",
    name: "Free Tier",
    priceEur: 0,
    credits: 200,
    tagline: "Zero-install WASM canvas + native desktop, forever free.",
    bullets: [
      "Full Desktop & Web (WASM) dashboard",
      "Starter Pieces (Prompt Box, Website Builder)",
      "€2 free starter credits (~200 credits)",
      "Unlimited local models & CLIProxyAPI on Desktop",
    ],
    ctaLabel: "Launch in Browser",
  },
  {
    id: "starter",
    name: "Starter Pack",
    priceEur: 10,
    credits: 1000,
    tagline: "Entry pay-as-you-go pack. Never expires, zero subscription.",
    bullets: [
      "1,000 model-weighted Orthese Credits",
      "All-in price — no surprise checkout fees",
      "Credits never expire across every Piece",
      "Transparent per-action spend breakdown",
    ],
    ctaLabel: "Buy Starter · €10",
    polarEnvKey: "NEXT_PUBLIC_POLAR_CHECKOUT_STARTER",
  },
  {
    id: "builder",
    name: "Builder Pack",
    priceEur: 25,
    credits: 2600,
    badge: "MOST POPULAR",
    tagline: "Built for daily prompting, site generation & coding sessions.",
    bullets: [
      "2,600 model-weighted Orthese Credits",
      "Works across WASM + Desktop seamlessly",
      "Shared Context Bus multi-Piece pipelines",
      "Supports creator tokenRevShare attribution",
    ],
    ctaLabel: "Buy Builder · €25",
    polarEnvKey: "NEXT_PUBLIC_POLAR_CHECKOUT_BUILDER",
  },
  {
    id: "studio",
    name: "Studio Pack",
    priceEur: 50,
    credits: 5500,
    tagline: "Heavy agentic Software Engineer & multi-agent runs.",
    bullets: [
      "5,500 model-weighted Orthese Credits",
      "Reasoning-tier frontier models on demand",
      "Zero monthly lock-in — top up only when needed",
      "Invoice & VAT handled automatically by Polar",
    ],
    ctaLabel: "Buy Studio · €50",
    polarEnvKey: "NEXT_PUBLIC_POLAR_CHECKOUT_STUDIO",
  },
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "orthese.website-builder",
    kind: "piece",
    name: "Website Builder",
    tagline: "Visual + AI site generation with live sandbox preview & ZIP export.",
    description:
      "Flagship v0.1 Orthese Piece. Accepts structured specs from AI Prompt Box over the Shared Context Bus, renders live HTML/CSS/JS inside an isolated preview (gpui-webview on Desktop, sandboxed iframe in WASM), and exports clean standalone bundles.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "globe",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 14820,
    publishedAt: "2026-11-26",
    featured: true,
    tags: ["flagship", "web-design", "html-export", "wasm"],
    manifest: {
      id: "orthese.website-builder",
      name: "Website Builder",
      version: "0.1.0",
      author: "Orthese",
      entry: "./dist/index.html",
      extends: "orthese.base-harness",
      defaultModel: "claude-sonnet-4.5",
      layout: {
        defaultSize: { w: 7, h: 6 },
        minSize: { w: 5, h: 4 },
        resizable: true,
      },
      ui: {
        theme: "inherit",
        usePrimitives: true,
      },
      permissions: {
        standard: ["ai:generate", "context:send", "context:receive", "storage:local"],
        elevated: [],
      },
      context: {
        accepts: ["orthese/spec", "text/markdown"],
        emits: ["orthese/html-bundle", "text/html"],
      },
      monetization: {
        purchaseType: "free",
        priceUsd: 0,
        tokenRevShare: false,
      },
    },
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-26",
        notes: [
          "Initial flagship release with live Preview/Code toggle and one-click ZIP export.",
          "Native Shared Context Bus listener for orthese/spec payloads.",
        ],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese",
  },
  {
    id: "orthese.ai-prompt-box",
    kind: "piece",
    name: "AI Prompt Box",
    tagline: "Fast, distraction-free multi-model chat with Shared Context Bus piping.",
    description:
      "Core workspace prompt interface featuring the Hybrid Model Switcher (Orthese Managed Credits or Desktop CLIProxyAPI sidecar), @-context mentions, and one-click piping into downstream Pieces.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "sparkles",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 19410,
    publishedAt: "2026-11-26",
    featured: true,
    tags: ["prompting", "multi-model", "context-bus", "wasm"],
    manifest: {
      id: "orthese.ai-prompt-box",
      name: "AI Prompt Box",
      version: "0.1.0",
      author: "Orthese",
      entry: "./dist/index.html",
      extends: "orthese.base-harness",
      defaultModel: "claude-sonnet-4.5",
      layout: {
        defaultSize: { w: 5, h: 6 },
        minSize: { w: 4, h: 4 },
        resizable: true,
      },
      ui: {
        theme: "inherit",
        usePrimitives: true,
      },
      permissions: {
        standard: ["ai:generate", "context:send", "context:receive", "storage:local"],
        elevated: [],
      },
      context: {
        accepts: ["text/markdown", "orthese/code-patch"],
        emits: ["orthese/spec", "text/markdown"],
      },
      monetization: {
        purchaseType: "free",
        priceUsd: 0,
        tokenRevShare: false,
      },
    },
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-26",
        notes: [
          "Multi-tier streaming via @orthese/harness.",
          "One-click spec piping to Website Builder & Software Engineer.",
        ],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese",
  },
  {
    id: "orthese.software-engineer",
    kind: "piece",
    name: "Software Engineer",
    tagline: "Repo-aware coding agent with diffs, folder-scoped fs, shell & MCP.",
    description:
      "Elevated Desktop Piece built on @orthese/harness. Reads and edits local repositories behind folder-scoped approvals, runs guarded shell commands, connects to stdio/HTTP MCP servers, and emits git diffs onto the Shared Context Bus.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "terminal",
    runtime: "desktop-only",
    pricing: "rev-share",
    priceEur: 0,
    installs: 11250,
    publishedAt: "2026-11-26",
    featured: true,
    tags: ["coding", "git-diff", "mcp", "elevated"],
    manifest: {
      id: "orthese.software-engineer",
      name: "Software Engineer",
      version: "0.1.0",
      author: "Orthese",
      entry: "./dist/index.html",
      extends: "orthese.base-harness",
      defaultModel: "claude-opus-4.5",
      layout: {
        defaultSize: { w: 8, h: 6 },
        minSize: { w: 5, h: 4 },
        resizable: true,
      },
      ui: {
        theme: "inherit",
        usePrimitives: true,
      },
      permissions: {
        standard: ["ai:generate", "context:send", "context:receive", "storage:local"],
        elevated: ["fs:read", "fs:write", "shell:exec", "mcp:call"],
      },
      context: {
        accepts: ["orthese/spec", "text/markdown"],
        emits: ["orthese/git-diff", "orthese/code-patch"],
      },
      monetization: {
        purchaseType: "free",
        priceUsd: 0,
        tokenRevShare: true,
      },
    },
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-26",
        notes: [
          "Added human-in-the-loop click-to-approve cards for destructive shell commands.",
          "Integrated local stdio MCP allowlisting.",
        ],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese",
  },
  {
    id: "community.ui-component-forge",
    kind: "piece",
    name: "UI Component Forge",
    tagline: "Generate accessible Base UI + Tailwind v4 components on demand.",
    description:
      "Community-built free Piece powered by tokenRevShare. Generates copy-ready React 19 + Base UI + Tailwind components with keyboard accessibility and reduced-motion guards, then pipes JSX directly into Website Builder.",
    author: "Studio Nord",
    authorHandle: "@studionord",
    official: false,
    icon: "layers",
    runtime: "wasm+desktop",
    pricing: "rev-share",
    priceEur: 0,
    installs: 4320,
    publishedAt: "2026-11-22",
    tags: ["components", "tailwind", "base-ui", "rev-share"],
    manifest: {
      id: "community.ui-component-forge",
      name: "UI Component Forge",
      version: "0.3.1",
      author: "Studio Nord",
      entry: "./dist/index.html",
      extends: "orthese.base-harness",
      defaultModel: "gemini-2.5-pro",
      layout: {
        defaultSize: { w: 6, h: 6 },
        minSize: { w: 4, h: 4 },
        resizable: true,
      },
      ui: {
        theme: "inherit",
        usePrimitives: true,
      },
      permissions: {
        standard: ["ai:generate", "context:send", "context:receive", "storage:local"],
        elevated: [],
      },
      context: {
        accepts: ["orthese/spec"],
        emits: ["orthese/html-bundle", "text/markdown"],
      },
      monetization: {
        purchaseType: "free",
        priceUsd: 0,
        tokenRevShare: true,
      },
    },
    changelog: [
      {
        version: "0.3.1",
        date: "2026-11-22",
        notes: ["Upgraded templates to @base-ui/react 1.9 and Tailwind v4."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese-marketplace",
  },
  {
    id: "community.sql-explorer",
    kind: "piece",
    name: "SQL & Schema Inspector",
    tagline: "Natural-language Postgres & SQLite queries with read-only guardrails.",
    description:
      "One-time purchase Desktop Piece connecting via MCP to local Postgres or Supabase instances. Translates prompts into EXPLAIN-checked SQL with tabular diff views and CSV export.",
    author: "Marek K.",
    authorHandle: "@marekk",
    official: false,
    icon: "database",
    runtime: "desktop-only",
    pricing: "paid",
    priceEur: 9,
    installs: 2180,
    publishedAt: "2026-11-18",
    tags: ["postgres", "sqlite", "mcp", "data"],
    manifest: {
      id: "community.sql-explorer",
      name: "SQL & Schema Inspector",
      version: "1.1.0",
      author: "Marek K.",
      entry: "./dist/index.html",
      extends: "orthese.base-harness",
      defaultModel: "gemini-2.5-flash",
      layout: {
        defaultSize: { w: 7, h: 5 },
        minSize: { w: 5, h: 4 },
        resizable: true,
      },
      ui: {
        theme: "inherit",
        usePrimitives: true,
      },
      permissions: {
        standard: ["ai:generate", "context:send", "storage:local"],
        elevated: ["mcp:call"],
      },
      context: {
        accepts: ["text/markdown"],
        emits: ["text/markdown", "application/json"],
      },
      monetization: {
        purchaseType: "one_time",
        priceUsd: 9,
        tokenRevShare: false,
      },
    },
    changelog: [
      {
        version: "1.1.0",
        date: "2026-11-18",
        notes: ["Added read-only transaction guardrails and EXPLAIN ANALYZE badges."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese-marketplace",
  },
  {
    id: "orthese.research-canvas",
    kind: "piece",
    name: "Research Canvas",
    tagline: "Structured notes, citations, and spec synthesis for Daily AI Desk.",
    description:
      "Lightweight knowledge-synthesis Piece that gathers citations, organizes markdown briefs, and pipes finalized specs directly into Website Builder or Software Engineer.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "book",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 7640,
    publishedAt: "2026-11-24",
    tags: ["research", "notes", "markdown", "wasm"],
    manifest: {
      id: "orthese.research-canvas",
      name: "Research Canvas",
      version: "0.1.0",
      author: "Orthese",
      entry: "./dist/index.html",
      extends: "orthese.base-harness",
      defaultModel: "gpt-5.2",
      layout: {
        defaultSize: { w: 6, h: 6 },
        minSize: { w: 4, h: 4 },
        resizable: true,
      },
      ui: {
        theme: "inherit",
        usePrimitives: true,
      },
      permissions: {
        standard: ["ai:generate", "context:send", "context:receive", "storage:local"],
        elevated: [],
      },
      context: {
        accepts: ["text/markdown"],
        emits: ["orthese/spec", "text/markdown"],
      },
      monetization: {
        purchaseType: "free",
        priceUsd: 0,
        tokenRevShare: false,
      },
    },
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-24",
        notes: ["Initial release included in the Daily AI Desk Starter Pack."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese",
  },
  {
    id: "orthese.skill-landing-architect",
    kind: "skill",
    name: "Landing Page Architect",
    tagline: "SKILL.md pack for monochrome developer-workstation sites.",
    description:
      "Progressively loaded Skill that teaches Website Builder and Software Engineer how to craft high-contrast, hairline-bordered landing pages with clean semantic HTML/Tailwind export.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "file-code",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 9120,
    publishedAt: "2026-11-25",
    tags: ["skill", "design-system", "landing-page"],
    skillPreview: `---
name: landing-page-architect
description: Generates monochrome developer-workstation landing pages with crisp hairlines.
---

# Landing Page Architect
- Canvas #0A0A0A, surface #111111, 1px rgba(255,255,255,0.08) borders
- Tabular monospace for credits, prices, and manifests
- Zero neon glows; rely on surface elevation & specular highlights`,
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-25",
        notes: ["Bundled by default in orthese/skills/landing-page-architect."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese",
  },
  {
    id: "orthese.skill-rust-gpui",
    kind: "skill",
    name: "Rust GPUI Piece Authoring",
    tagline: "SKILL.md pack for building native + wasm32 Orthese Pieces.",
    description:
      "Gives any harness-powered Piece exact instructions for piece.json validation, wasm32 permission boundaries, and gpui-kit layout conventions.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "cpu",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 5410,
    publishedAt: "2026-11-25",
    tags: ["skill", "rust", "gpui", "sdk"],
    skillPreview: `---
name: rust-gpui-piece
description: Guides creation of Rust + GPUI Pieces with wasm32 compatibility.
---

# Rust GPUI Piece Checklist
1. Validate piece.json against @/types/piece-sdk schema
2. Keep permissions.elevated empty for instant WASM execution
3. Declare a real defaultModel (e.g. claude-sonnet-4.5, gpt-5.2, gemini-2.5-flash)`,
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-25",
        notes: ["Aligned with gpui-kit 0.10 and Piece SDK v0.1."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese",
  },
  {
    id: "pack.web-designer",
    kind: "starter-pack",
    name: "Web Designer Pack",
    tagline: "AI Prompt Box + Website Builder + Landing Page Architect Skill.",
    description:
      "One-click workspace preset optimized for zero-install browser (WASM) design loops. Prompt on the left, live preview & ZIP export on the right, wired over the Shared Context Bus.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "layout",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 12980,
    publishedAt: "2026-11-26",
    featured: true,
    tags: ["starter-pack", "wasm", "web-design"],
    includedPieceIds: ["orthese.ai-prompt-box", "orthese.website-builder"],
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-26",
        notes: ["Default v0.1 Starter Pack loaded in app.orthese.com."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese-marketplace",
  },
  {
    id: "pack.indie-builder",
    kind: "starter-pack",
    name: "Indie Builder Pack",
    tagline: "Prompt Box + Software Engineer + Website Builder on one canvas.",
    description:
      "Full-stack solo founder cockpit. Draft product specs, execute folder-scoped repo edits with click-to-approve shell guardrails, and preview marketing updates side by side.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "boxes",
    runtime: "desktop-only",
    pricing: "free",
    priceEur: 0,
    installs: 9840,
    publishedAt: "2026-11-26",
    featured: true,
    tags: ["starter-pack", "desktop", "coding", "full-stack"],
    includedPieceIds: [
      "orthese.ai-prompt-box",
      "orthese.software-engineer",
      "orthese.website-builder",
    ],
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-26",
        notes: ["Includes pre-wired orthese/spec → orthese/git-diff bus routes."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese-marketplace",
  },
  {
    id: "pack.daily-ai-desk",
    kind: "starter-pack",
    name: "Daily AI Desk",
    tagline: "AI Prompt Box + Research Canvas for everyday writing & synthesis.",
    description:
      "Clean two-pane knowledge workspace that runs 100% inside the browser (WASM) or natively on Desktop with zero elevated permissions required.",
    author: "Orthese",
    authorHandle: "@orthese",
    official: true,
    icon: "compass",
    runtime: "wasm+desktop",
    pricing: "free",
    priceEur: 0,
    installs: 6790,
    publishedAt: "2026-11-24",
    tags: ["starter-pack", "wasm", "research"],
    includedPieceIds: ["orthese.ai-prompt-box", "orthese.research-canvas"],
    changelog: [
      {
        version: "0.1.0",
        date: "2026-11-24",
        notes: ["Initial release for browser and desktop workspaces."],
      },
    ],
    repoUrl: "https://github.com/LukaG712/orthese-marketplace",
  },
];

export function getMarketplaceItem(id: string): MarketplaceItem | undefined {
  return MARKETPLACE_ITEMS.find((item) => item.id === id);
}
