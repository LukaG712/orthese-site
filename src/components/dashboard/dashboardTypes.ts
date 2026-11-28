import type { MarketplaceItem } from "@/types/piece-sdk";

export type PieceSize = "sm" | "md" | "lg" | "xl";

export interface PieceSizeSpec {
  id: PieceSize;
  shortLabel: "S" | "M" | "L" | "XL";
  name: string;
  cols: 3 | 6 | 9 | 12;
  fraction: string;
  description: string;
  gridClass: string;
  heightClass: string;
}

export const PIECE_SIZE_OPTIONS: PieceSizeSpec[] = [
  {
    id: "sm",
    shortLabel: "S",
    name: "Compact",
    cols: 3,
    fraction: "1/4",
    description: "Widget card (3 cols · compact layout)",
    gridClass: "col-span-12 sm:col-span-6 lg:col-span-3",
    heightClass: "min-h-[250px]",
  },
  {
    id: "md",
    shortLabel: "M",
    name: "Standard",
    cols: 6,
    fraction: "1/2",
    description: "Balanced pane (6 cols · standard layout)",
    gridClass: "col-span-12 sm:col-span-6 lg:col-span-6",
    heightClass: "min-h-[385px]",
  },
  {
    id: "lg",
    shortLabel: "L",
    name: "Wide",
    cols: 9,
    fraction: "3/4",
    description: "Expanded stage (9 cols · spacious layout)",
    gridClass: "col-span-12 lg:col-span-9",
    heightClass: "min-h-[475px]",
  },
  {
    id: "xl",
    shortLabel: "XL",
    name: "Full",
    cols: 12,
    fraction: "Full",
    description: "Full-width canvas (12 cols · split view)",
    gridClass: "col-span-12",
    heightClass: "min-h-[550px]",
  },
];

export const PIECE_SIZE_ORDER: PieceSize[] = ["sm", "md", "lg", "xl"];

export function getPieceSizeSpec(size: PieceSize): PieceSizeSpec {
  return PIECE_SIZE_OPTIONS.find((opt) => opt.id === size) ?? PIECE_SIZE_OPTIONS[1];
}

export interface CanvasPane {
  instanceId: string;
  pieceId: string;
  size: PieceSize;
}

/** Migrates legacy saved panes (which stored `span: 4 | 6 | 8 | 12`) to the 4-size `PieceSize` model. */
export function normalizeCanvasPane(raw: Partial<CanvasPane> & { span?: number }): CanvasPane | null {
  if (!raw.instanceId || !raw.pieceId) return null;
  let size: PieceSize = "md";
  if (raw.size === "sm" || raw.size === "md" || raw.size === "lg" || raw.size === "xl") {
    size = raw.size;
  } else if (typeof raw.span === "number") {
    if (raw.span <= 3) size = "sm";
    else if (raw.span <= 6) size = "md";
    else if (raw.span <= 9) size = "lg";
    else size = "xl";
  }
  return {
    instanceId: raw.instanceId,
    pieceId: raw.pieceId,
    size,
  };
}

export interface WorkspaceTab {
  id: string;
  name: string;
  packId?: string;
  panes: CanvasPane[];
  activeSkillIds: string[];
  activeMcpIds: string[];
}

export interface BusEvent {
  id: string;
  timestamp: string;
  fromPieceId: string;
  fromPieceName: string;
  mime: string;
  title: string;
  payload: string;
}

export type RoutingEngine = "credits" | "cliproxy";

export interface DashboardModelOption {
  id: string;
  label: string;
  provider: string;
  costCr: number;
  hint: string;
}

export const DASHBOARD_MODELS: DashboardModelOption[] = [
  {
    id: "orthese-router",
    label: "Orthese Router (Auto)",
    provider: "Orthese",
    costCr: 2,
    hint: "Auto-selects best real model per turn",
  },
  {
    id: "gemini-4-neon",
    label: "Gemini 4 Neon",
    provider: "Google",
    costCr: 3,
    hint: "Fast UI layout & long-context canvas",
  },
  {
    id: "gpt-6.2-sol",
    label: "GPT-6.2 Sol",
    provider: "OpenAI",
    costCr: 3,
    hint: "Structured specs & component generation",
  },
  {
    id: "claude-opus-5.5",
    label: "Claude Opus 5.5",
    provider: "Anthropic",
    costCr: 6,
    hint: "Frontier architecture, diffs & audits",
  },
];

export const DASHBOARD_MCP_SERVERS = [
  { id: "github", name: "github", transport: "HTTP", scope: "WASM + Desktop" },
  { id: "browser", name: "browser", transport: "HTTP", scope: "WASM + Desktop" },
  { id: "filesystem", name: "filesystem", transport: "stdio", scope: "Desktop only" },
  { id: "postgres", name: "postgres", transport: "stdio", scope: "Desktop only" },
] as const;

export const INITIAL_WORKSPACES: WorkspaceTab[] = [
  {
    id: "ws-web-designer",
    name: "Web Designer",
    packId: "pack.web-designer",
    panes: [
      { instanceId: "pane-wd-prompt", pieceId: "orthese.ai-prompt-box", size: "md" },
      { instanceId: "pane-wd-builder", pieceId: "orthese.website-builder", size: "md" },
    ],
    activeSkillIds: ["orthese.skill-landing-architect"],
    activeMcpIds: ["browser", "github"],
  },
  {
    id: "ws-daily-desk",
    name: "Daily AI Desk",
    packId: "pack.daily-ai-desk",
    panes: [
      { instanceId: "pane-dd-prompt", pieceId: "orthese.ai-prompt-box", size: "md" },
      { instanceId: "pane-dd-research", pieceId: "orthese.research-canvas", size: "md" },
    ],
    activeSkillIds: ["orthese.skill-landing-architect"],
    activeMcpIds: ["browser"],
  },
  {
    id: "ws-indie-builder",
    name: "Indie Builder",
    packId: "pack.indie-builder",
    panes: [
      { instanceId: "pane-ib-prompt", pieceId: "orthese.ai-prompt-box", size: "sm" },
      { instanceId: "pane-ib-se", pieceId: "orthese.software-engineer", size: "md" },
      { instanceId: "pane-ib-wb", pieceId: "orthese.website-builder", size: "sm" },
    ],
    activeSkillIds: ["orthese.skill-landing-architect", "orthese.skill-rust-gpui"],
    activeMcpIds: ["github", "filesystem", "browser"],
  },
];

export const INITIAL_BUS_EVENTS: BusEvent[] = [
  {
    id: "bus-seed-1",
    timestamp: "Ready",
    fromPieceId: "orthese.ai-prompt-box",
    fromPieceName: "AI Prompt Box",
    mime: "orthese/spec",
    title: "Kestrel Telemetry Hero",
    payload:
      "Minimal obsidian #121212 landing hero for Kestrel, showing p99 span latency (14ms), zero-copy Rust ingestion, and a crisp CTA button.",
  },
];

export function createStarterWorkspaceFromPack(pack: MarketplaceItem): WorkspaceTab {
  const uid = Date.now().toString(36);
  const ids = pack.includedPieceIds ?? ["orthese.ai-prompt-box"];

  return {
    id: `ws-${pack.id}-${uid}`,
    name: pack.name.replace(/\s+Pack$/i, ""),
    packId: pack.id,
    panes: ids.map((pieceId, i) => {
      let size: PieceSize = "md";
      if (ids.length === 1) size = "xl";
      else if (ids.length === 2) size = "md";
      else size = i === 1 ? "md" : "sm";
      return {
        instanceId: `pane-${uid}-${i}`,
        pieceId,
        size,
      };
    }),
    activeSkillIds: ["orthese.skill-landing-architect"],
    activeMcpIds: ["browser", "github"],
  };
}
