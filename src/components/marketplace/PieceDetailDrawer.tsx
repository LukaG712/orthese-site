"use client";

import Link from "next/link";
import type { MarketplaceItem } from "@/types/piece-sdk";
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

  const handlePrimaryAction = () => {
    if (!item) return;
    if (item.pricing === "paid") {
      onClose();
      openCheckout({
        id: item.id,
        title: item.name,
        subtitle: `One-time purchase · ${item.author} (${item.authorHandle})`,
        priceEur: item.priceEur,
      });
      return;
    }
    toast.success(`Added ${item.name} to Orthese Canvas`, {
      description:
        item.runtime === "wasm+desktop"
          ? "Ready immediately in browser (WASM) and Desktop."
          : "Queued for your native Orthese Desktop workspace.",
    });
  };

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-white/[0.1] bg-[#0a0a0b] shadow-[-24px_0_80px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] bg-[#111111] px-6 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-[#fafafa]">
                  <AssetIcon name={item.icon} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[16px] font-medium text-[#fafafa]">{item.name}</h2>
                    {item.official && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#a1a1aa]">
                        <CheckCircle2 className="h-3 w-3 text-[#fafafa]" />
                        Official
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] tabular-nums text-[#71717a]">
                    {item.id} · {item.authorHandle} · {item.installs.toLocaleString()} installs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href={`/marketplace/${item.id}`}
                  onClick={onClose}
                  className="btn-secondary inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-[12px]"
                >
                  <span>Permalink</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="btn-secondary inline-flex h-8 w-8 items-center justify-center rounded-md text-[#a1a1aa] hover:text-[#fafafa] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {/* Primary Action Bar */}
              <div className="obsidian-card flex flex-wrap items-center justify-between gap-4 rounded-xl p-4">
                <div>
                  <span className="block text-[12px] text-[#71717a]">
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
                    onClick={handlePrimaryAction}
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
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1aa]">
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
                <div className="obsidian-card rounded-xl p-4">
                  <h3 className="text-[12px] font-medium text-[#fafafa]">Included Pieces</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.includedPieceIds.map((pid) => (
                      <Link
                        key={pid}
                        href={`/marketplace/${pid}`}
                        onClick={onClose}
                        className="rounded-md border border-white/[0.1] bg-[#080809] px-2.5 py-1 font-mono text-[11px] text-[#d4d4d8] hover:border-white/25 hover:text-[#fafafa] transition-colors"
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
                    className="inline-flex items-center gap-1 text-[12px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
                  >
                    <span>Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="mt-3 space-y-3">
                  {item.changelog.map((entry) => (
                    <div
                      key={entry.version}
                      className="rounded-xl border border-white/[0.07] bg-[#111111] p-4"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-medium text-[#fafafa]">v{entry.version}</span>
                        <span className="text-[#52525b]">{entry.date}</span>
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-[13px] text-[#a1a1aa]">
                        {entry.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
