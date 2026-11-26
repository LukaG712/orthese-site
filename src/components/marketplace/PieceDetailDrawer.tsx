"use client";

import Link from "next/link";
import type { MarketplaceItem } from "@/types/piece-sdk";
import { Dialog } from "@base-ui/react/dialog";
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
    <Dialog.Root
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-white/[0.1] bg-[#0c0c0c] shadow-[0_0_80px_rgba(0,0,0,0.9)] focus:outline-none">
          {item && (
            <>
              {/* Top Action Bar */}
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] bg-[#111111] px-6 py-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-zinc-100">
                    <AssetIcon name={item.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Dialog.Title className="text-base font-semibold text-white">
                        {item.name}
                      </Dialog.Title>
                      {item.official && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-zinc-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Official
                        </span>
                      )}
                      <span className="rounded border border-white/[0.09] px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                        {item.kind}
                      </span>
                    </div>
                    <Dialog.Description className="mt-0.5 font-mono text-[11px] text-zinc-500">
                      {item.id} · by {item.authorHandle} · {item.installs.toLocaleString()} installs
                    </Dialog.Description>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/marketplace/${item.id}`}
                    onClick={onClose}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-white/[0.09] px-2.5 font-mono text-[11px] text-zinc-300 hover:border-white/20 hover:text-white transition-colors"
                    title="Open standalone page"
                  >
                    <span>Permalink</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.09] text-zinc-400 hover:bg-white/[0.06] hover:text-white cursor-pointer">
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
                {/* Action CTA Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111111] p-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      {item.pricing === "paid"
                        ? "One-Time Purchase (85% to Creator)"
                        : item.pricing === "rev-share"
                          ? "Free + Creator Token Rev-Share"
                          : "Free Official Asset"}
                    </span>
                    <span className="mt-0.5 block font-mono text-lg font-semibold text-white">
                      {item.pricing === "paid" ? `€${item.priceEur}` : "€0 · Free"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.runtime === "wasm+desktop" && (
                      <Link
                        href="/#workspace-demo"
                        onClick={onClose}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.04] px-3.5 text-xs font-medium text-white hover:border-white/25 hover:bg-white/[0.08] transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Try in Sandbox</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-xs font-semibold text-black hover:bg-zinc-200 transition-colors cursor-pointer"
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

                {/* Description */}
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Overview
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                    {item.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transparent Manifest & Security Panel OR Skill Preview OR Starter Pack Breakdown */}
                {item.manifest && <ManifestSecurityPanel manifest={item.manifest} />}

                {item.skillPreview && (
                  <div>
                    <h4 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      SKILL.md Bundle Preview
                    </h4>
                    <CodeBlock
                      code={item.skillPreview}
                      filename={`${item.id}/SKILL.md`}
                      language="markdown"
                    />
                  </div>
                )}

                {item.includedPieceIds && item.includedPieceIds.length > 0 && (
                  <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Included Pieces in Starter Pack
                    </h4>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {item.includedPieceIds.map((pid) => (
                        <Link
                          key={pid}
                          href={`/marketplace/${pid}`}
                          onClick={onClose}
                          className="rounded-md border border-white/[0.1] bg-[#0a0a0a] px-2.5 py-1 font-mono text-xs text-zinc-200 hover:border-white/25 transition-colors"
                        >
                          {pid} →
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Changelog */}
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      Changelog
                    </h4>
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-400 hover:text-white transition-colors"
                    >
                      <span>Source / README</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="mt-2.5 space-y-3">
                    {item.changelog.map((entry) => (
                      <div
                        key={entry.version}
                        className="rounded-lg border border-white/[0.07] bg-[#111111] p-3.5"
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-semibold text-white">v{entry.version}</span>
                          <span className="text-zinc-500">{entry.date}</span>
                        </div>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-zinc-400">
                          {entry.notes.map((note) => (
                            <li key={note}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
