export type ModelTier = "fast" | "balanced" | "reasoning";

export type StandardPermission =
  | "ai:generate"
  | "context:send"
  | "context:receive"
  | "storage:local";

export type ElevatedPermission =
  | "fs:read"
  | "fs:write"
  | "shell:exec"
  | "mcp:call";

export interface GridSize {
  w: number;
  h: number;
}

export interface PieceManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  entry: string;
  extends?: string;
  defaultTier?: ModelTier;
  layout: {
    defaultSize: GridSize;
    minSize: GridSize;
    resizable: boolean;
  };
  ui: {
    theme: "inherit" | "dark" | "light";
    usePrimitives: boolean;
  };
  permissions: {
    standard: StandardPermission[];
    elevated: ElevatedPermission[];
  };
  context: {
    accepts: string[];
    emits: string[];
  };
  monetization: {
    purchaseType: "free" | "one_time";
    priceUsd: number;
    tokenRevShare: boolean;
  };
}

export type MarketplaceAssetKind = "piece" | "skill" | "starter-pack";
export type RuntimeTarget = "wasm+desktop" | "desktop-only";
export type PricingFilter = "free" | "rev-share" | "paid";

export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export interface MarketplaceItem {
  id: string;
  kind: MarketplaceAssetKind;
  name: string;
  tagline: string;
  description: string;
  author: string;
  authorHandle: string;
  official: boolean;
  icon: string;
  runtime: RuntimeTarget;
  pricing: PricingFilter;
  priceEur: number;
  installs: number;
  publishedAt: string;
  featured?: boolean;
  tags: string[];
  manifest?: PieceManifest;
  skillPreview?: string;
  includedPieceIds?: string[];
  changelog: ChangelogEntry[];
  repoUrl: string;
}
