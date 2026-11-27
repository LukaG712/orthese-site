"use client";

import Link from "next/link";
import type { MarketplaceItem } from "@/types/piece-sdk";
import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Play,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AssetIcon } from "@/components/ui/Icon";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { useStorefront } from "@/components/shell/StorefrontContext";
import { ManifestSecurityPanel } from "./ManifestSecurityPanel";

interface PieceDetailDrawerProps {
  item: MarketplaceItem | null;
  onClose: () => void;
}

export function PieceDetailDrawer({ item, onClose }: PieceDetailDrawerProps) {
  const { openCheckout } = useStorefront();

  const handlePrimaryAction = (activeItem: MarketplaceItem) => {
    if (activeItem.pricing === "paid") {
      onClose();
      openCheckout({
        id: activeItem.id,
        title: activeItem.name,
        subtitle: `One-time purchase · ${activeItem.author} (${activeItem.authorHandle})`,
        priceEur: activeItem.priceEur,
      });
      return;
    }
    toast.success(`Added ${activeItem.name} to Orthese Canvas`, {
      description:
        activeItem.runtime === "wasm+desktop"
          ? "Ready immediately in browser (WASM) and Desktop."
          : "Queued for your native Orthese Desktop workspace.",
    });
  };

  return (
    <Dialog.Root
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AnimatePresence>
        {item && (
          <Dialog.Portal key={item.id} keepMounted>
            <Dialog.Backdrop
              render={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              }
              className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
            />

            <Dialog.Viewport className="fixed inset-0 z-[60] flex justify-end overflow-hidden">
              <Dialog.Popup
                data-testid="piece-detail-drawer"
                render={
                  <motion.aside
                    initial={{ x: "100%", opacity: 0.85 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0.85 }}
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                }
                className="relative flex h-full w-full max-w-2xl flex-col border-l border-white/[0.1] bg-[#121212] shadow-[-24px_0_80px_rgba(0,0,0,0.92)] outline-none"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] bg-[#171717] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:gap-4 sm:px-6 sm:py-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-[#1f1f1f] text-[#fafafa] sm:h-10 sm:w-10">
                      <AssetIcon name={item.icon} className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Dialog.Title className="truncate text-[15px] font-medium text-[#fafafa] sm:text-[16px]">
                          {item.name}
                        </Dialog.Title>
                        {item.official && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#a3a3a3]">
                            <CheckCircle2 className="h-3 w-3 text-[#fafafa]" />
                            Official
                          </span>
                        )}
                      </div>
                      <Dialog.Description className="mt-0.5 truncate font-mono text-[11px] tabular-nums text-[#737373]">
                        {item.id} · {item.authorHandle} · {item.installs.toLocaleString()} installs
                      </Dialog.Description>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/marketplace/${item.id}`}
                      onClick={onClose}
                      aria-label="Open permalink page"
                      title="Open permalink"
                      className="btn-secondary inline-flex h-8 w-8 items-center justify-center gap-1 rounded-md text-[12px] sm:w-auto sm:px-2.5"
                    >
                      <span className="hidden sm:inline">Permalink</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    <Dialog.Close
                      data-testid="drawer-close-btn"
                      aria-label="Close drawer"
                      className="btn-secondary inline-flex h-8 w-8 items-center justify-center rounded-md text-[#a3a3a3] hover:text-[#fafafa] cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Dialog.Close>
                  </div>
                </div>

                {/* Scrollable Drawer Body */}
                <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6">
                  {/* Primary Action Bar */}
                  <div className="obsidian-surface flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#171717] p-4">
                    <div>
                      <span className="block text-[12px] text-[#8a8a8a]">
                        {item.pricing === "paid"
                          ? "One-time purchase · 85% to creator"
                          : item.pricing === "rev-share"
                            ? "Free · 20% credit margin rev-share"
                            : "Free official asset"}
                      </span>
                      <span className="mt-0.5 block font-mono text-[18px] font-medium tabular-nums text-[#fafafa]">
                        {item.pricing === "paid" ? `€${item.priceEur}` : "€0 · Free"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {item.runtime === "wasm+desktop" && (
                        <Link
                          href="/#workspace-demo"
                          onClick={onClose}
                          className="btn-secondary inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Try in Sandbox</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePrimaryAction(item)}
                        className="btn-primary inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-[13px] font-medium cursor-pointer"
                      >
                        {item.pricing === "paid" ? (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Buy · €{item.priceEur}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add to Canvas</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[12px] font-medium text-[#fafafa]">Overview</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-[#a3a3a3]">
                      {item.description}
                    </p>
                  </div>

                  {item.manifest && <ManifestSecurityPanel manifest={item.manifest} />}

                  {item.skillPreview && (
                    <div>
                      <h3 className="mb-2 text-[12px] font-medium text-[#fafafa]">
                        SKILL.md Bundle
                      </h3>
                      <CodeBlock
                        code={item.skillPreview}
                        filename={`${item.id}/SKILL.md`}
                        language="markdown"
                      />
                    </div>
                  )}

                  {item.includedPieceIds && item.includedPieceIds.length > 0 && (
                    <div className="obsidian-surface rounded-xl border border-white/[0.08] bg-[#171717] p-4">
                      <h3 className="text-[12px] font-medium text-[#fafafa]">Included Pieces</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.includedPieceIds.map((pid) => (
                          <Link
                            key={pid}
                            href={`/marketplace/${pid}`}
                            onClick={onClose}
                            className="rounded-md border border-white/[0.1] bg-[#121212] px-2.5 py-1 font-mono text-[11px] text-[#d4d4d4] hover:border-white/25 hover:text-[#fafafa] transition-colors"
                          >
                            {pid} →
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/[0.08] pt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[12px] font-medium text-[#fafafa]">Changelog</h3>
                      <a
                        href={item.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
                      >
                        <span>Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="mt-3 space-y-3">
                      {item.changelog.map((entry) => (
                        <div
                          key={entry.version}
                          className="rounded-xl border border-white/[0.07] bg-[#171717] p-4"
                        >
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="font-medium text-[#fafafa]">v{entry.version}</span>
                            <span className="text-[#737373]">{entry.date}</span>
                          </div>
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-[#a3a3a3]">
                            {entry.notes.map((note) => (
                              <li key={note}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
