"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MarketplaceAssetKind, MarketplaceItem, PricingFilter, RuntimeTarget } from "@/types/piece-sdk";
import { Checkbox } from "@base-ui/react/checkbox";
import NumberFlow from "@number-flow/react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
} from "lucide-react";
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
type ViewMode = "grid" | "list";
type PermissionTier = "standard" | "elevated";

const VALID_TABS = new Set<TabFilter>(["all", "piece", "skill", "starter-pack"]);
const VALID_SORTS = new Set<SortMode>(["popular", "newest", "price"]);
const VALID_VIEWS = new Set<ViewMode>(["grid", "list"]);

function FilterCheckbox({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[12.5px] text-[#a3a3a3] transition-colors hover:bg-white/[0.03] hover:text-[#fafafa]">
      <span className="flex items-center gap-2.5">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={onChange}
          className="flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border border-white/20 bg-transparent data-[checked]:border-[#fafafa] data-[checked]:bg-[#fafafa] transition-colors cursor-pointer"
        >
          <Checkbox.Indicator className="text-[#121212]">
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <span>{label}</span>
      </span>
      {hint && <span className="font-mono text-[10px] text-[#737373]">{hint}</span>}
    </label>
  );
}

export function MarketplaceClient({ initialTab = "all" }: { initialTab?: TabFilter }) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabFilter>(initialTab);
  const [sort, setSort] = useState<SortMode>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPerms, setSelectedPerms] = useState<PermissionTier[]>([]);
  const [selectedRuntimes, setSelectedRuntimes] = useState<RuntimeTarget[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<PricingFilter[]>([]);
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramTab = params.get("tab") as TabFilter | null;
    const paramQ = params.get("q");
    const paramSort = params.get("sort") as SortMode | null;
    const paramView = params.get("view") as ViewMode | null;
    if (paramTab && VALID_TABS.has(paramTab)) setTab(paramTab);
    if (paramQ) setQuery(paramQ);
    if (paramSort && VALID_SORTS.has(paramSort)) setSort(paramSort);
    if (paramView && VALID_VIEWS.has(paramView)) setViewMode(paramView);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (tab !== "all") params.set("tab", tab);
    else params.delete("tab");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (sort !== "popular") params.set("sort", sort);
    else params.delete("sort");
    if (viewMode !== "grid") params.set("view", viewMode);
    else params.delete("view");
    const qs = params.toString();
    const nextUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [tab, query, sort, viewMode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
      if (selectedPerms.length > 0) {
        const hasElevated =
          (item.manifest?.permissions.elevated.length ?? 0) > 0 ||
          item.runtime === "desktop-only";
        const tier: PermissionTier = hasElevated ? "elevated" : "standard";
        if (!selectedPerms.includes(tier)) return false;
      }
      if (selectedRuntimes.length > 0 && !selectedRuntimes.includes(item.runtime)) {
        return false;
      }
      if (selectedPricing.length > 0 && !selectedPricing.includes(item.pricing)) {
        return false;
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
            packs, and Starter Packs. Click any asset to inspect its{" "}
            <code className="font-mono text-[13px] text-[#fafafa]">piece.json</code> permissions.
          </p>

          {/* Search, Sliding Tabs, Sort & Grid/List View Toggle */}
          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Pieces, Skills, or @creators..."
                className="h-9 w-full rounded-xl border border-white/[0.08] bg-[#171717] pl-10 pr-9 text-[13px] text-[#fafafa] placeholder:text-[#737373] focus:border-white/25 focus:outline-none transition-colors"
              />
              {!query && (
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03] font-mono text-[10px] text-[#737373]">
                  /
                </kbd>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
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

              <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#171717] p-0.5">
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
                        ? "bg-white/[0.09] font-medium text-[#fafafa]"
                        : "text-[#a3a3a3] hover:text-[#fafafa]"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Grid / List View Toggle */}
              <div
                role="group"
                aria-label="Catalog layout"
                className="inline-flex rounded-lg border border-white/[0.08] bg-[#171717] p-0.5"
              >
                <button
                  type="button"
                  data-testid="view-grid"
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  title="Grid view"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer",
                    viewMode === "grid"
                      ? "bg-white/[0.1] text-[#fafafa]"
                      : "text-[#737373] hover:text-[#fafafa]"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  data-testid="view-list"
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  title="List view"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors cursor-pointer",
                    viewMode === "list"
                      ? "bg-white/[0.1] text-[#fafafa]"
                      : "text-[#737373] hover:text-[#fafafa]"
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
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
                    className="inline-flex items-center gap-1 text-[11px] text-[#a3a3a3] hover:text-[#fafafa] cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              <div className={cn("space-y-6", mobileFiltersOpen ? "block" : "hidden lg:block")}>
                <div className="space-y-1 border-t border-white/[0.06] pt-4">
                  <span className="block px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737373]">
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
                  <span className="block px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737373]">
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
                  <span className="block px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737373]">
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

            {/* Right Catalog: 2-Column Bento Starter Packs + Grid / List Assets */}
            <div className="min-w-0 space-y-10">
              {tab === "all" && activeFilterCount === 0 && (
                <div>
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                      Featured Starter Packs
                    </span>
                    <span className="text-[12px] text-[#737373]">One-click canvas presets</span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {featuredPacks.map((pack) => {
                      const runtimeTip =
                        pack.runtime === "wasm+desktop"
                          ? RUNTIME_TOOLTIPS.wasm
                          : RUNTIME_TOOLTIPS.desktop;
                      const isElevatedPack = pack.runtime === "desktop-only";
                      const tierTip = isElevatedPack
                        ? PERMISSION_TIER_TOOLTIPS.elevated
                        : PERMISSION_TIER_TOOLTIPS.standard;

                      return (
                        <SpotlightCell
                          key={pack.id}
                          featured
                          onClick={() => setActiveItem(pack)}
                          className="cursor-pointer p-6"
                        >
                          <div className="flex h-full flex-col justify-between gap-5">
                            <div>
                              <div className="flex items-start justify-between gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-[#222222] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                  <AssetIcon name={pack.icon} className="h-4.5 w-4.5" />
                                </span>
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#8a8a8a] transition-colors group-hover:border-white/[0.18] group-hover:text-[#fafafa]">
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </span>
                              </div>

                              <h2 className="mt-4 text-[16px] font-medium tracking-[-0.02em] text-[#fafafa]">
                                {pack.name}
                              </h2>
                              <p className="mt-1.5 text-[13px] leading-relaxed text-[#a3a3a3]">
                                {pack.tagline}
                              </p>

                              {pack.includedPieceIds && pack.includedPieceIds.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                  {pack.includedPieceIds.map((pid) => (
                                    <span
                                      key={pid}
                                      className="rounded-md border border-white/[0.07] bg-[#121212]/80 px-2 py-0.5 font-mono text-[10.5px] text-[#a3a3a3]"
                                    >
                                      {pid.replace(/^orthese\./, "")}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3.5">
                              <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-[#8a8a8a]">
                                <InfoTooltip
                                  title={tierTip.title}
                                  content={tierTip.description}
                                >
                                  <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help">
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        isElevatedPack ? "bg-amber-400" : "bg-emerald-400"
                                      }`}
                                    />
                                    {isElevatedPack ? "Elevated" : "Std"}
                                  </span>
                                </InfoTooltip>

                                <InfoTooltip
                                  title={runtimeTip.title}
                                  content={runtimeTip.description}
                                >
                                  <span className="inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help">
                                    {pack.runtime === "wasm+desktop" ? "WASM + Desktop" : "Desktop Only"}
                                  </span>
                                </InfoTooltip>
                              </div>

                              <span className="font-mono text-[11px] tabular-nums text-[#737373]">
                                <NumberFlow value={pack.installs} /> installs
                              </span>
                            </div>
                          </div>
                        </SpotlightCell>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-3.5 flex items-center justify-between text-[12px] text-[#737373]">
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <span>Showing</span>
                    <span className="font-medium text-[#fafafa]">
                      <NumberFlow value={filtered.length} />
                    </span>
                    <span>{filtered.length === 1 ? "asset" : "assets"}</span>
                  </span>
                  <span className="font-mono text-[11px]">Click card for piece.json</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#171717] py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <p className="text-[14px] text-[#a3a3a3]">No assets match those filters.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="btn-secondary mt-4 rounded-lg px-3.5 py-2 text-[12px] font-medium cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : viewMode === "grid" ? (
                  /* GRID VIEW: BoardUI Dark Mode rounded-2xl cards with gap-4 */
                  <div
                    data-testid="marketplace-grid-view"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  >
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
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-[#1f1f1f] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                  <AssetIcon name={item.icon} className="h-4 w-4" />
                                </span>
                                <span
                                  className={cn(
                                    "font-mono text-[10px] uppercase tracking-wider",
                                    item.pricing === "paid"
                                      ? "rounded-full bg-[#fafafa] px-2.5 py-0.5 font-medium text-[#121212]"
                                      : "rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[#a3a3a3]"
                                  )}
                                >
                                  {item.pricing === "paid"
                                    ? `€${item.priceEur}`
                                    : item.pricing === "rev-share"
                                      ? "Rev-Share"
                                      : "Free"}
                                </span>
                              </div>

                              <h3 className="mt-4 text-[14.5px] font-medium tracking-[-0.015em] text-[#fafafa]">
                                {item.name}
                              </h3>
                              <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                                {item.tagline}
                              </p>
                            </div>

                            <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-3.5">
                              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8a8a8a]">
                                <InfoTooltip
                                  title={tierTip.title}
                                  content={tierTip.description}
                                >
                                  <span
                                    data-testid={`badge-perm-${item.id}`}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#1f1f1f] px-2 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help"
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
                                    className="inline-flex items-center rounded-md border border-white/[0.08] bg-[#1f1f1f] px-2 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help"
                                  >
                                    {item.runtime === "wasm+desktop" ? "WASM" : "Desktop"}
                                  </span>
                                </InfoTooltip>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-[#737373]">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuery(item.authorHandle);
                                  }}
                                  title={`Filter by ${item.authorHandle}`}
                                  className="inline-flex items-center gap-1 text-[#a3a3a3] hover:text-[#fafafa] transition-colors cursor-pointer"
                                >
                                  <span>{item.authorHandle}</span>
                                  {item.official && <CheckCircle2 className="h-3 w-3 text-[#fafafa]" />}
                                </button>
                                <span className="font-mono tabular-nums">
                                  <NumberFlow value={item.installs} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </SpotlightCell>
                      );
                    })}
                  </div>
                ) : (
                  /* LIST VIEW: Compact BoardUI Task-List / Stat-Row horizontal rows */
                  <div
                    data-testid="marketplace-list-view"
                    className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_32px_-16px_rgba(0,0,0,0.7)] divide-y divide-white/[0.06]"
                  >
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
                        <div
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setActiveItem(item)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveItem(item);
                            }
                          }}
                          className="group flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                        >
                          {/* Left: Icon + Identity + Tagline */}
                          <div className="flex min-w-0 flex-1 items-center gap-3.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-[#1f1f1f] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                              <AssetIcon name={item.icon} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <h3 className="truncate text-[13.5px] font-medium text-[#fafafa]">
                                  {item.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setQuery(item.authorHandle);
                                  }}
                                  title={`Filter by ${item.authorHandle}`}
                                  className="inline-flex items-center gap-1 text-[11px] text-[#737373] hover:text-[#fafafa] transition-colors cursor-pointer"
                                >
                                  <span>{item.authorHandle}</span>
                                  {item.official && (
                                    <CheckCircle2 className="h-3 w-3 text-[#d4d4d4]" />
                                  )}
                                </button>
                              </div>
                              <p className="mt-0.5 truncate text-[12px] text-[#a3a3a3]">
                                {item.tagline}
                              </p>
                            </div>
                          </div>

                          {/* Right: Capability Chips + Stat-Card Readout */}
                          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 sm:justify-end">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8a8a8a]">
                              <InfoTooltip
                                title={tierTip.title}
                                content={tierTip.description}
                              >
                                <span
                                  data-testid={`badge-perm-${item.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#1f1f1f] px-2 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help"
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
                                  className="inline-flex items-center rounded-md border border-white/[0.08] bg-[#1f1f1f] px-2 py-0.5 hover:border-white/[0.2] hover:text-[#fafafa] transition-colors cursor-help"
                                >
                                  {item.runtime === "wasm+desktop" ? "WASM" : "Desktop"}
                                </span>
                              </InfoTooltip>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "min-w-[64px] text-center font-mono text-[10px] uppercase tracking-wider",
                                  item.pricing === "paid"
                                    ? "rounded-full bg-[#fafafa] px-2.5 py-0.5 font-medium text-[#121212]"
                                    : "rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[#a3a3a3]"
                                )}
                              >
                                {item.pricing === "paid"
                                  ? `€${item.priceEur}`
                                  : item.pricing === "rev-share"
                                    ? "Rev-Share"
                                    : "Free"}
                              </span>

                              <div className="w-[54px] text-right font-mono text-[11.5px] tabular-nums text-[#a3a3a3]">
                                <NumberFlow value={item.installs} />
                              </div>

                              <ArrowUpRight className="h-3.5 w-3.5 text-[#525252] transition-colors group-hover:text-[#fafafa]" />
                            </div>
                          </div>
                        </div>
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
