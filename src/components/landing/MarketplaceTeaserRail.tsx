import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const CURATED_IDS = [
  "orthese.website-builder",
  "orthese.ai-prompt-box",
  "orthese.software-engineer",
  "community.ui-component-forge",
];

export function MarketplaceTeaserRail() {
  const curated = CURATED_IDS.map((id) =>
    MARKETPLACE_ITEMS.find((item) => item.id === id)
  ).filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="border-t border-white/[0.08] py-28 sm:py-32">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
            03 / MARKETPLACE
          </span>
          <h2 className="text-metallic mt-3 text-3xl font-medium tracking-[-0.04em] leading-[1.06] sm:text-4xl">
            Flagship Pieces, ready to snap in.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1aa]">
            Every Piece declares its exact permissions and Context Bus contract in{" "}
            <code className="font-mono text-[13px] text-[#fafafa]">piece.json</code>.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="btn-secondary inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-[13px] font-medium"
        >
          <span>Browse Full Marketplace</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Clean Single-Row 4-Card Curated Strip (No Duplicated Marquee Clutter) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {curated.map((item) => (
          <Link key={item.id} href={`/marketplace/${item.id}`} className="block h-full">
            <SpotlightCard className="h-full p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.03] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                      <AssetIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#52525b] transition-colors group-hover:text-[#fafafa]" />
                  </div>

                  <h3 className="mt-5 text-[15px] font-medium tracking-[-0.015em] text-[#fafafa]">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#a1a1aa]">
                    {item.tagline}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-3 font-mono text-[11px] tabular-nums text-[#52525b]">
                  <span>
                    {item.runtime === "wasm+desktop" ? "WASM + Desktop" : "Desktop"}
                  </span>
                  <span className="text-[#a1a1aa]">
                    {item.pricing === "rev-share"
                      ? "Rev-Share"
                      : item.pricing === "paid"
                        ? `€${item.priceEur}`
                        : "Free"}
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
