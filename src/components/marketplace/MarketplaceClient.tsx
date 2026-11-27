"use client";

import { useEffect, useMemo, useState } from "react";
import type { MarketplaceAssetKind, MarketplaceItem, PricingFilter, RuntimeTarget } from "@/types/piece-sdk";
import { Checkbox } from "@base-ui/react/checkbox";
import { ArrowUpRight, Check, CheckCircle2, RotateCcw, Search } from "lucide-react";
import { MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
import { SpotlightCell } from "@/components/ui/SpotlightCell";
import {
  InfoTooltip,
  PERMISSION_TIER_TOOLTIPS,
  RUNTIME_TOOLTIPS,
  TooltipProvider,
} from "@/components/primitives/Tooltip";
import { cn } from "@/lib/cn";
import { PieceDetailDrawer } from "./PieceDetailDrawer";

type TabFilter = "all" | MarketplaceAssetKind;
type SortMode = "popular" | "newest" | "price";
type PermissionTier = "standard" | "elevated";

const VALID_TABS = new Set<TabFilter>(["all", "piece", "skill", "starter-pack"]);

function FilterCheckbox({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] text-[#a1a1aa] hover:bg-white/[0.03] hover:text-[#fafafa] transition-colors">
      <span className="flex items-center gap-2.5">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={(val) => onChange(Boolean(val))}
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors",
            checked
              ? "border-[#fafafa] bg-[#fafafa] text-[#060607]"
              : "border-white/[0.16] bg-transparent text-transparent"
          )}
        >
          <Checkbox.Indicator className="flex items-center justify-center">
            <Check className="h-3 w-3 stroke-[2.5]" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <span className={checked ? "text-[#fafafa]" : undefined}>{label}</span>
      </span>
      {hint && <span className="font-mono text-[10px] text-[#52525b]">{hint}</span>}
    </label>
  );
}

export function MarketplaceClient({ initialTab = "all" }: { initialTab?: TabFilter }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabFilter>(initialTab);
  const [sort, setSort] = useState<SortMode>("popular");
  const [selectedPerms, setSelectedPerms] = useState<PermissionTier[]>([]);
  const [selectedRuntimes, setSelectedRuntimes] = useState<RuntimeTarget[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<PricingFilter[]>([]);
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("tab") as TabFilter | null;
    if (param && VALID_TABS.has(param)) {
      setTab(param);
    }
  }, []);

  const toggle = <T,>(arr: T[], val: T, setter: (next: T[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const resetFilters = () => {
    setQuery("");
    setTab("all");
    setSelectedPerms([]);
    setSelectedRuntimes([]);
    setSelectedPricing([]);
  };

  const activeFilterCount =
    selectedPerms.length + selectedRuntimes.length + selectedPricing.length + (query.trim() ? 1 : 0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = MARKETPLACE_ITEMS.filter((item) => {
      if (tab !== "all" && item.kind !== tab) return false;
      if (q) {
        const hay = `${item.name} ${item.id} ${item.tagline} ${item.tags.join(" ")} ${item.authorHandle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (selectedRuntimes.length > 0 && !selectedRuntimes.includes(item.runtime)) return false;
      if (selectedPricing.length > 0 && !selectedPricing.includes(item.pricing)) return false;
      if (selectedPerms.length > 0) {
        const isElevated =
          (item.manifest?.permissions.elevated.length ?? 0) > 0 ||
          item.runtime === "desktop-only";
        const tier: PermissionTier = isElevated ? "elevated" : "standard";
        if (!selectedPerms.includes(tier)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "newest") return b.publishedAt.localeCompare(a.publishedAt);
      if (sort === "price") return a.priceEur - b.priceEur;
      return b.installs - a.installs;
    });
  }, [query, tab, sort, selectedPerms, selectedRuntimes, selectedPricing]);

  const featuredPacks = MARKETPLACE_ITEMS.filter(
    (i) => i.kind === "starter-pack" && i.featured
  );

  return (
    <TooltipProvider>
      <div className="relative bg-[#121212]">
        {/* Top Header Band */}
        <div className="relative mx-auto max-w-[1080px] px-5 pb-12 pt-28 sm:px-6 sm:pt-32">
        <h1 className="text-4xl font-medium tracking-[-0.04em] leading-[1.06] text-[#fafafa] sm:text-5xl">
          <OrbitGradientText>Marketplace</OrbitGradientText>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#a3a3a3]">
          Browse Pieces, <code className="font-mono text-[13px] text-[#fafafa]">SKILL.md</code>{" "}
          packs, and Starter Packs. Click any item to inspect its{" "}
          <code className="font-mono text-[13px] text-[#fafafa]">piece.json</code> permissions.
        </p>

        {/* Search, Sliding Tabs & Sort */}
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Pieces, Skills, or @creators..."
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#0e0f12] pl-10 pr-3 text-[13px] text-[#fafafa] placeholder:text-[#737373] focus:border-white/25 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SlidingTabs
              ariaLabel="Asset Categories"
              value={tab}
              onChange={setTab}
              options={[
                { value: "all", label: "All", count: MARKETPLACE_ITEMS.length },
                {
                  value: "piece",
                  label: "Pieces",
                  count: MARKETPLACE_ITEMS.filter((i) => i.kind === "piece").length,
                },
                {
                  value: "skill",
                  label: "Skills",
                  count: MARKETPLACE_ITEMS.filter((i) => i.kind === "skill").length,
                },
                {
                  value: "starter-pack",
                  label: "Starter Packs",
                  count: MARKETPLACE_ITEMS.filter((i) => i.kind === "starter-pack").length,
                },
              ]}
            />

            <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5">
              {(
                [
                  { id: "popular", label: "Popular" },
                  { id: "newest", label: "Newest" },
                  { id: "price", label: "Price" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSort(s.id)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[12px] transition-colors cursor-pointer",
                    sort === s.id
                      ? "bg-white/[0.09] text-[#fafafa] font-medium"
                      : "text-[#a3a3a3] hover:text-[#fafafa]"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="mx-auto max-w-[1080px] border-t border-white/[0.06] px-5 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* Sticky 220px Filter Rail (collapsible on <lg mobile) */}
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start lg:space-y-6">
            <div className="flex items-center justify-between px-1 lg:px-2">
              <button
                type="button"
                data-testid="mobile-filters-toggle"
                onClick={() => setMobileFiltersOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] font-medium text-[#fafafa] lg:pointer-events-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-[12px] cursor-pointer"
              >
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-white/[0.12] px-1.5 py-0.5 font-mono text-[10px] text-[#fafafa] lg:hidden">
                    {activeFilterCount}
                  </span>
                )}
                <span className="font-mono text-[11px] text-[#a3a3a3] lg:hidden">
                  {mobileFiltersOpen ? "Hide" : "Show"}
                </span>
              </button>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[11px] text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset ({activeFilterCount})
                </button>
              )}
            </div>

            <div className={cn("space-y-6", mobileFiltersOpen ? "block" : "hidden lg:block")}>
              <div className="space-y-1 border-t border-white/[0.06] pt-4">
                <span className="block px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Permissions
                </span>
                <FilterCheckbox
                  label="Standard"
                  hint="sandbox"
                  checked={selectedPerms.includes("standard")}
                  onChange={() => toggle(selectedPerms, "standard", setSelectedPerms)}
                />
                <FilterCheckbox
                  label="Elevated"
                  hint="fs / shell"
                  checked={selectedPerms.includes("elevated")}
                  onChange={() => toggle(selectedPerms, "elevated", setSelectedPerms)}
                />
              </div>

              <div className="space-y-1 border-t border-white/[0.06] pt-4">
                <span className="block px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Runtime
                </span>
                <FilterCheckbox
                  label="Web + Desktop"
                  hint="wasm32"
                  checked={selectedRuntimes.includes("wasm+desktop")}
                  onChange={() => toggle(selectedRuntimes, "wasm+desktop", setSelectedRuntimes)}
                />
                <FilterCheckbox
                  label="Desktop Only"
                  hint="native"
                  checked={selectedRuntimes.includes("desktop-only")}
                  onChange={() => toggle(selectedRuntimes, "desktop-only", setSelectedRuntimes)}
                />
              </div>

              <div className="space-y-1 border-t border-white/[0.06] pt-4">
                <span className="block px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  Pricing
                </span>
                <FilterCheckbox
                  label="Free"
                  checked={selectedPricing.includes("free")}
                  onChange={() => toggle(selectedPricing, "free", setSelectedPricing)}
                />
                <FilterCheckbox
                  label="Free + Rev-Share"
                  checked={selectedPricing.includes("rev-share")}
                  onChange={() => toggle(selectedPricing, "rev-share", setSelectedPricing)}
                />
                <FilterCheckbox
                  label="Paid One-Time"
                  checked={selectedPricing.includes("paid")}
                  onChange={() => toggle(selectedPricing, "paid", setSelectedPricing)}
                />
              </div>
            </div>
          </aside>

          {/* Right Catalog: Seamless Hairline-Divided Cells */}
          <div className="space-y-10 min-w-0">
            {tab === "all" && activeFilterCount === 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                    Featured Starter Packs
                  </span>
                  <span className="text-[12px] text-[#52525b]">One-click canvas presets</span>
                </div>

                <div className="grid gap-px border border-white/[0.06] bg-white/[0.06] md:grid-cols-2">
                  {featuredPacks.map((pack) => (
                    <SpotlightCell
                      key={pack.id}
                      featured
                      onClick={() => setActiveItem(pack)}
                      className="cursor-pointer p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.12] bg-white/[0.04] text-[#fafafa]">
                          <AssetIcon name={pack.icon} className="h-4 w-4" />
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[#71717a] transition-colors group-hover:text-[#fafafa]" />
                      </div>
                      <h2 className="mt-4 text-[15px] font-medium text-[#fafafa]">{pack.name}</h2>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#a1a1aa]">
                        {pack.tagline}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-[#737373]">
                        <span>{pack.includedPieceIds?.length ?? 2} Pieces</span>
                        <span>·</span>
                        <InfoTooltip
                          title={
                            pack.runtime === "wasm+desktop"
                              ? RUNTIME_TOOLTIPS.wasm.title
                              : RUNTIME_TOOLTIPS.desktop.title
                          }
                          content={
                            pack.runtime === "wasm+desktop"
                              ? RUNTIME_TOOLTIPS.wasm.description
                              : RUNTIME_TOOLTIPS.desktop.description
                          }
                        >
                          <span className="underline decoration-white/20 decoration-dotted underline-offset-4 hover:text-[#d4d4d4] transition-colors cursor-help">
                            {pack.runtime === "wasm+desktop" ? "WASM + Desktop" : "Desktop Only"}
                          </span>
                        </InfoTooltip>
                      </div>
                    </SpotlightCell>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 flex items-center justify-between text-[12px] text-[#737373]">
                <span className="tabular-nums">
                  Showing <span className="text-[#fafafa]">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "asset" : "assets"}
                </span>
                <span className="font-mono text-[11px]">Click cell for piece.json</span>
              </div>

              {filtered.length === 0 ? (
                <div className="obsidian-surface border border-white/[0.08] py-16 text-center">
                  <p className="text-[14px] text-[#a3a3a3]">No assets match those filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn-secondary mt-4 rounded-md px-3.5 py-2 text-[12px] font-medium cursor-pointer"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-px border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((item) => {
                    const isElevated =
                      (item.manifest?.permissions.elevated.length ?? 0) > 0 ||
                      item.runtime === "desktop-only";
                    const tierTip = isElevated
                      ? PERMISSION_TIER_TOOLTIPS.elevated
                      : PERMISSION_TIER_TOOLTIPS.standard;
                    const runtimeTip =
                      item.runtime === "wasm+desktop"
                        ? RUNTIME_TOOLTIPS.wasm
                        : RUNTIME_TOOLTIPS.desktop;

                    return (
                      <SpotlightCell
                        key={item.id}
                        onClick={() => setActiveItem(item)}
                        className="cursor-pointer p-5"
                      >
                        <div className="flex h-full flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.1] bg-white/[0.03] text-[#fafafa]">
                                <AssetIcon name={item.icon} className="h-4 w-4" />
                              </span>
                              <span
                                className={cn(
                                  "font-mono text-[10px] uppercase tracking-wider",
                                  item.pricing === "paid"
                                    ? "rounded bg-[#fafafa] px-2 py-0.5 font-medium text-[#121212]"
                                    : "text-[#8a8a8a]"
                                )}
                              >
                                {item.pricing === "paid"
                                  ? `€${item.priceEur}`
                                  : item.pricing === "rev-share"
                                    ? "Rev-Share"
                                    : "Free"}
                              </span>
                            </div>

                            <h3 className="mt-4 text-[14px] font-medium text-[#fafafa]">
                              {item.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                              {item.tagline}
                            </p>
                          </div>

                          <div className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-3">
                            <div className="flex items-center gap-2 font-mono text-[10px] text-[#8a8a8a]">
                              <InfoTooltip
                                title={tierTip.title}
                                content={tierTip.description}
                              >
                                <span
                                  data-testid={`badge-perm-${item.id}`}
                                  className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help"
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      isElevated ? "bg-amber-400" : "bg-emerald-400"
                                    }`}
                                  />
                                  {isElevated ? "Elevated" : "Std"}
                                </span>
                              </InfoTooltip>

                              <InfoTooltip
                                title={runtimeTip.title}
                                content={runtimeTip.description}
                              >
                                <span
                                  data-testid={`badge-runtime-${item.id}`}
                                  className="inline-flex items-center rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help"
                                >
                                  {item.runtime === "wasm+desktop" ? "WASM" : "Desktop"}
                                </span>
                              </InfoTooltip>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-[#737373]">
                              <span className="inline-flex items-center gap-1 text-[#a3a3a3]">
                                <span>{item.authorHandle}</span>
                                {item.official && <CheckCircle2 className="h-3 w-3 text-[#fafafa]" />}
                              </span>
                              <span className="font-mono tabular-nums">
                                {item.installs.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </SpotlightCell>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PieceDetailDrawer item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
    </TooltipProvider>
  );
}
