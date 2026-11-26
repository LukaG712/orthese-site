"use client";

import Link from "next/link";
import type { MarketplaceItem } from "@/types/piece-sdk";
import { Play, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useStorefront } from "@/components/shell/StorefrontContext";

export function MarketplaceItemActions({ item }: { item: MarketplaceItem }) {
  const { openCheckout } = useStorefront();

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {item.runtime === "wasm+desktop" && (
        <Link
          href="/#workspace-demo"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.04] px-3.5 text-xs font-medium text-white hover:border-white/25 hover:bg-white/[0.08] transition-colors"
        >
          <Play className="h-3.5 w-3.5" />
          <span>Try in Sandbox</span>
        </Link>
      )}
      <button
        type="button"
        onClick={() => {
          if (item.pricing === "paid") {
            openCheckout({
              id: item.id,
              title: item.name,
              subtitle: `One-time purchase · ${item.author} (${item.authorHandle})`,
              priceEur: item.priceEur,
            });
          } else {
            toast.success(`Added ${item.name} to Orthese Canvas`);
          }
        }}
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
  );
}
