import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";

export function MarketplaceTeaserRail() {
  const featured = MARKETPLACE_ITEMS.slice(0, 8);
  const looped = [...featured, ...featured];

  return (
    <section className="border-t border-white/[0.06] py-20">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            03 / Marketplace Registry
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Snap in Pieces, Skills &amp; Starter Packs.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Every asset exposes its exact <code className="text-zinc-200">piece.json</code>{" "}
            permissions and Shared Context Bus contract before you install or buy.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3.5 text-xs font-medium text-white hover:border-white/25 hover:bg-white/[0.08] transition-colors"
        >
          <span>Browse Full Marketplace</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Horizontal Marquee Rail */}
      <div className="relative -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

        <div className="animate-marquee gap-3 py-2">
          {looped.map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              href={`/marketplace/${item.id}`}
              className="workstation-card workstation-card-hover mr-3 flex w-[290px] shrink-0 flex-col justify-between rounded-xl p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-zinc-200">
                    <AssetIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-zinc-200">
                    {item.pricing === "paid"
                      ? `€${item.priceEur}`
                      : item.pricing === "rev-share"
                        ? "REV-SHARE"
                        : "FREE"}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold text-white">{item.name}</h3>
                  {item.official && (
                    <CheckCircle2
                      className="h-3.5 w-3.5 shrink-0 text-zinc-300"
                      aria-label="Official Orthese asset"
                    />
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                  {item.tagline}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono text-[10px] text-zinc-500">
                <span>{item.runtime === "wasm+desktop" ? "WASM + Desktop" : "Desktop Only"}</span>
                <span>{item.installs.toLocaleString()} installs</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
