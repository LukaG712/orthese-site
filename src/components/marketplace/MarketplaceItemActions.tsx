"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MarketplaceItem } from "@/types/piece-sdk";
import { Play, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useStorefront } from "@/components/shell/StorefrontContext";

export function MarketplaceItemActions({ item }: { item: MarketplaceItem }) {
  const router = useRouter();
  const { openCheckout } = useStorefront();
  const dashboardHref =
    item.kind === "starter-pack"
      ? `/dashboard?pack=${encodeURIComponent(item.id)}`
      : `/dashboard?piece=${encodeURIComponent(item.id)}`;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      {item.runtime === "wasm+desktop" && (
        <Link
          href={dashboardHref}
          className="btn-secondary inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-medium"
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
            toast.success(`Opening ${item.name} in Orthese Dashboard`);
            router.push(dashboardHref);
          }
        }}
        className="bg-button-primary inline-flex h-9 items-center gap-1.5 rounded-[10px] px-4 text-[13.5px] font-medium cursor-pointer"
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
