"use client";

import { useEffect, useMemo, useState } from "react";
import type { MarketplaceAssetKind, MarketplaceItem, PricingFilter, RuntimeTarget } from "@/types/piece-sdk";
import { Checkbox } from "@base-ui/react/checkbox";
import { ArrowUpRight, Check, CheckCircle2, RotateCcw, Search, Shield, ShieldAlert } from "lucide-react";
import { MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { SlidingTabs } from "@/components/ui/SlidingTabs";
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
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-300 hover:bg-white/[0.04] transition-colors">
      <span className="flex items-center gap-2.5">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={(val) => onChange(Boolean(val))}
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
            checked
              ? "border-white bg-white text-black"
              : "border-white/20 bg-transparent text-transparent"
          )}
        >
          <Checkbox.Indicator className="flex items-center justify-center">
            <Check className="h-3 w-3 stroke-[2.5]" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <span>{label}</span>
      </span>
      {hint && <span className="font-mono text-[10px] text-zinc-500">{hint}</span>}
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

      if (selectedRuntimes.length > 0 && !selectedRuntimes.includes(item.runtime)) {
        return false;
      }

      if (selectedPricing.length > 0 && !selectedPricing.includes(item.pricing)) {
        return false;
      }

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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          Orthese Registry · v0.1
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Marketplace
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Package registry meets industrial hardware catalog. Browse Pieces, portable{" "}
          <code className="text-zinc-200">SKILL.md</code> packs, and one-click Starter Packs—every
          entry exposes its exact <code className="text-zinc-200">piece.json</code> permissions
          before installation.
        </p>

        {/* Top Search, Tabs & Sort */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter Pieces, Skills, tags, or @creators..."
              className="h-9 w-full rounded-lg border border-white/[0.1] bg-[#111111] pl-9 pr-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-white/25 focus:outline-none"
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

            <select
              aria-label="Sort marketplace items"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="h-9 rounded-lg border border-white/[0.1] bg-[#111111] px-2.5 font-mono text-xs text-zinc-300 focus:border-white/25 focus:outline-none cursor-pointer"
            >
              <option value="popular">Sort: Popular</option>
              <option value="newest">Sort: Newest</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split: Sticky 220px Filter Rail + Catalog Content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sticky Left Filter Rail */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              Filters
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                Reset ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="space-y-1.5 border-t border-white/[0.06] pt-4">
            <span className="block px-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Permissions
            </span>
            <FilterCheckbox
              label="Standard"
              hint="Sandboxed"
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

          <div className="space-y-1.5 border-t border-white/[0.06] pt-4">
            <span className="block px-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Runtime Target
            </span>
            <FilterCheckbox
              label="Web + Desktop"
              hint="WASM"
              checked={selectedRuntimes.includes("wasm+desktop")}
              onChange={() => toggle(selectedRuntimes, "wasm+desktop", setSelectedRuntimes)}
            />
            <FilterCheckbox
              label="Desktop Only"
              hint="Native"
              checked={selectedRuntimes.includes("desktop-only")}
              onChange={() => toggle(selectedRuntimes, "desktop-only", setSelectedRuntimes)}
            />
          </div>

          <div className="space-y-1.5 border-t border-white/[0.06] pt-4">
            <span className="block px-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
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
        </aside>

        {/* Right Content: Featured Banner + Dense 3-Column Grid */}
        <div className="space-y-8 min-w-0">
          {tab === "all" && activeFilterCount === 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Featured Starter Packs
                </span>
                <span className="font-mono text-[10px] text-zinc-600">
                  1-click workspace layouts
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {featuredPacks.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setActiveItem(pack)}
                    className="workstation-card workstation-card-hover border-beam-ring group rounded-xl p-5 text-left cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] text-white">
                        <AssetIcon name={pack.icon} className="h-4 w-4" />
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-400 group-hover:text-white">
                        Inspect Pack
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <h2 className="mt-3.5 text-sm font-semibold text-white">{pack.name}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{pack.tagline}</p>
                    <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
                      <span>{pack.includedPieceIds?.length ?? 2} Pieces</span>
                      <span>·</span>
                      <span>
                        {pack.runtime === "wasm+desktop" ? "WASM + Desktop" : "Desktop Only"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dense 3-Column Asset Grid */}
          <div>
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-zinc-500">
              <span>
                Showing <strong className="text-zinc-200">{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "asset" : "assets"}
              </span>
              <span>Click any card to inspect piece.json</span>
            </div>

            {filtered.length === 0 ? (
              <div className="workstation-card rounded-xl py-16 text-center">
                <p className="text-sm text-zinc-300">No assets match those filters.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-md border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:bg-white/[0.08] cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => {
                  const isElevated =
                    (item.manifest?.permissions.elevated.length ?? 0) > 0 ||
                    item.runtime === "desktop-only";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveItem(item)}
                      className="workstation-card workstation-card-hover flex flex-col justify-between rounded-xl p-4 text-left cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-zinc-100">
                            <AssetIcon name={item.icon} className="h-4 w-4" />
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase",
                              item.pricing === "paid"
                                ? "border-white/25 bg-white text-black"
                                : "border-white/[0.1] bg-white/[0.04] text-zinc-200"
                            )}
                          >
                            {item.pricing === "paid"
                              ? `€${item.priceEur}`
                              : item.pricing === "rev-share"
                                ? "REV-SHARE"
                                : "FREE"}
                          </span>
                        </div>

                        <h3 className="mt-3 text-sm font-semibold text-white">{item.name}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                          {item.tagline}
                        </p>
                      </div>

                      <div className="mt-4 space-y-2.5 border-t border-white/[0.06] pt-3">
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                          <span className="inline-flex items-center gap-1 rounded border border-white/[0.09] bg-white/[0.03] px-1.5 py-0.5 text-zinc-300">
                            {isElevated ? (
                              <ShieldAlert className="h-2.5 w-2.5" />
                            ) : (
                              <Shield className="h-2.5 w-2.5" />
                            )}
                            {isElevated ? "Elevated" : "Standard"}
                          </span>
                          <span className="rounded border border-white/[0.08] px-1.5 py-0.5 text-zinc-400">
                            {item.runtime === "wasm+desktop" ? "WASM" : "Desktop"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                          <span className="inline-flex items-center gap-1 text-zinc-400">
                            <span>{item.authorHandle}</span>
                            {item.official && <CheckCircle2 className="h-3 w-3 text-zinc-300" />}
                          </span>
                          <span>{item.installs.toLocaleString()}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Piece Detail Slide-Over Drawer */}
      <PieceDetailDrawer item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
}
