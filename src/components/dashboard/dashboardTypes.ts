import type { MarketplaceItem } from "@/types/piece-sdk";

export type PaneSpan = 4 | 6 | 8 | 12;

export interface CanvasPane {
  instanceId: string;
  pieceId: string;
  span: PaneSpan;
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
      { instanceId: "pane-wd-prompt", pieceId: "orthese.ai-prompt-box", span: 4 },
      { instanceId: "pane-wd-builder", pieceId: "orthese.website-builder", span: 8 },
    ],
    activeSkillIds: ["orthese.skill-landing-architect"],
    activeMcpIds: ["browser", "github"],
  },
  {
    id: "ws-daily-desk",
    name: "Daily AI Desk",
    packId: "pack.daily-ai-desk",
    panes: [
      { instanceId: "pane-dd-prompt", pieceId: "orthese.ai-prompt-box", span: 6 },
      { instanceId: "pane-dd-research", pieceId: "orthese.research-canvas", span: 6 },
    ],
    activeSkillIds: ["orthese.skill-landing-architect"],
    activeMcpIds: ["browser"],
  },
  {
    id: "ws-indie-builder",
    name: "Indie Builder",
    packId: "pack.indie-builder",
    panes: [
      { instanceId: "pane-ib-prompt", pieceId: "orthese.ai-prompt-box", span: 4 },
      { instanceId: "pane-ib-se", pieceId: "orthese.software-engineer", span: 4 },
      { instanceId: "pane-ib-wb", pieceId: "orthese.website-builder", span: 4 },
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
      "Minimal obsidian #121212 landing hero for Kestrel, showing p99 span latency (14ms), zero-copy Rust ingestion, and a crisp white CTA pill.",
  },
];

export function createStarterWorkspaceFromPack(pack: MarketplaceItem): WorkspaceTab {
  const uid = Date.now().toString(36);
  const ids = pack.includedPieceIds ?? ["orthese.ai-prompt-box"];
  const span: PaneSpan = ids.length === 1 ? 12 : ids.length === 2 ? 6 : 4;

  return {
    id: `ws-${pack.id}-${uid}`,
    name: pack.name.replace(/\s+Pack$/i, ""),
    packId: pack.id,
    panes: ids.map((pieceId, i) => ({
      instanceId: `pane-${uid}-${i}`,
      pieceId,
      span: ids.length === 2 && i === 0 ? 4 : ids.length === 2 && i === 1 ? 8 : span,
    })),
    activeSkillIds: ["orthese.skill-landing-architect"],
    activeMcpIds: ["browser", "github"],
  };
}
