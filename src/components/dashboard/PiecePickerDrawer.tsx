"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Check, Plus, ShoppingBag, X } from "lucide-react";
import { MARKETPLACE_ITEMS } from "@/data/catalog";
import { SearchField, Tabs } from "@/components/primitives/BoardUIPrimitives";
import { AssetIcon } from "@/components/ui/Icon";
import { useStorefront } from "@/components/shell/StorefrontContext";
import type { MarketplaceItem } from "@/types/piece-sdk";
import { cn } from "@/lib/cn";

type PickerTab = "all" | "piece" | "skill" | "starter-pack";

interface PiecePickerDrawerProps {
  open: boolean;
  onClose: () => void;
  activePieceIds: string[];
  activeSkillIds: string[];
  onAddPiece: (item: MarketplaceItem) => void;
  onToggleSkill: (skillId: string) => void;
  onOpenStarterPack: (pack: MarketplaceItem) => void;
}

export function PiecePickerDrawer({
  open,
  onClose,
  activePieceIds,
  activeSkillIds,
  onAddPiece,
  onToggleSkill,
  onOpenStarterPack,
}: PiecePickerDrawerProps) {
  const { openCheckout } = useStorefront();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<PickerTab>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARKETPLACE_ITEMS.filter((item) => {
      if (tab !== "all" && item.kind !== tab) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, tab]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup
          data-testid="dashboard-piece-picker"
          className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-[440px] flex-col border-l border-white/[0.1] bg-[#161618] shadow-[0_0_80px_rgba(0,0,0,0.9)] focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
            <div>
              <Dialog.Title className="text-[16px] font-medium tracking-[-0.02em] text-[#fafafa]">
                Marketplace Piece Picker
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-[12.5px] text-[#a3a3a3]">
                Snap Pieces, attach SKILL.md packs, or open Starter Pack workspaces.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close Piece Picker"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#121212] text-[#a3a3a3] transition-colors hover:text-[#fafafa] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Search & Category Tabs */}
          <div className="space-y-3 border-b border-white/[0.07] px-5 py-3.5">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search Pieces, Skills, Starter Packs..."
              ariaLabel="Search Marketplace catalog"
              size="small"
            />
            <Tabs<PickerTab>
              ariaLabel="Filter Marketplace catalog"
              value={tab}
              onChange={setTab}
              options={[
                { id: "all", label: "All" },
                { id: "piece", label: "Pieces" },
                { id: "skill", label: "Skills" },
                { id: "starter-pack", label: "Packs" },
              ]}
            />
          </div>

          {/* Catalog List */}
          <div className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.07] bg-[#121212] p-6 text-center text-[13px] text-[#737373]">
                No items match &ldquo;{query}&rdquo;.
              </div>
            ) : (
              filtered.map((item) => {
                const isElevated = (item.manifest?.permissions.elevated.length ?? 0) > 0;
                const skillAttached = item.kind === "skill" && activeSkillIds.includes(item.id);
                const pieceCount =
                  item.kind === "piece"
                    ? activePieceIds.filter((id) => id === item.id).length
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/[0.08] bg-[#121212] p-4 transition-colors hover:border-white/[0.15]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#171717]">
                          <AssetIcon name={item.icon} className="h-4 w-4 text-[#d4d4d4]" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[13.5px] font-medium text-[#fafafa]">
                              {item.name}
                            </span>
                            <span className="rounded-md border border-white/[0.08] bg-[#171717] px-1.5 py-0.5 font-mono text-[9.5px] uppercase text-[#a3a3a3]">
                              {item.kind === "starter-pack"
                                ? "Pack"
                                : item.kind === "skill"
                                  ? "SKILL.md"
                                  : isElevated
                                    ? "Elevated"
                                    : "WASM"}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] leading-relaxed text-[#a3a3a3]">
                            {item.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                      <div className="flex items-center gap-2 font-mono text-[10.5px] text-[#737373]">
                        <span>
                          {item.pricing === "paid"
                            ? `€${item.priceEur}`
                            : item.pricing === "rev-share"
                              ? "Free · Rev-Share"
                              : "Free"}
                        </span>
                        {pieceCount > 0 && (
                          <span className="text-emerald-400">· {pieceCount} on canvas</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/marketplace/${item.id}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] text-[#737373] transition-colors hover:border-white/[0.16] hover:text-[#fafafa]"
                          aria-label={`Inspect ${item.name} details`}
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>

                        {item.kind === "skill" ? (
                          <button
                            type="button"
                            onClick={() => onToggleSkill(item.id)}
                            className={cn(
                              "inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer",
                              skillAttached ? "bg-button-secondary" : "bg-button-primary"
                            )}
                          >
                            {skillAttached ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span>Attached</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3 w-3" />
                                <span>Attach</span>
                              </>
                            )}
                          </button>
                        ) : item.kind === "starter-pack" ? (
                          <button
                            type="button"
                            onClick={() => {
                              onOpenStarterPack(item);
                              onClose();
                            }}
                            className="bg-button-primary inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Open Tab</span>
                          </button>
                        ) : item.pricing === "paid" ? (
                          <button
                            type="button"
                            onClick={() =>
                              openCheckout({
                                id: item.id,
                                title: item.name,
                                subtitle: `One-time purchase · ${item.author}`,
                                priceEur: item.priceEur,
                              })
                            }
                            className="bg-button-secondary inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Buy €{item.priceEur}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            data-testid={`picker-add-${item.id}`}
                            onClick={() => onAddPiece(item)}
                            className="bg-button-primary inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11.5px] font-medium cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.07] bg-[#141416] px-5 py-3 text-[12px]">
            <span className="font-mono text-[11px] text-[#737373]">
              {MARKETPLACE_ITEMS.length} verified assets
            </span>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 font-medium text-[#d4d4d4] hover:text-[#fafafa]"
            >
              <span>Full Marketplace</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#737373]" />
            </Link>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
