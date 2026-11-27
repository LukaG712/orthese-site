"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { ChevronRight } from "lucide-react";
import { CREDIT_PACKS, MARKETPLACE_ITEMS } from "@/data/catalog";
import { DownloadDesktopButton } from "@/components/landing/DownloadDesktopButton";
import { AssetIcon } from "@/components/ui/Icon";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { useStorefront } from "@/components/shell/StorefrontContext";
import { cn } from "@/lib/cn";

const CURATED_IDS = [
  "orthese.website-builder",
  "orthese.ai-prompt-box",
  "orthese.software-engineer",
  "community.ui-component-forge",
];

export function MarketplaceAndPricing() {
  const { openCheckout } = useStorefront();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  const curated = CURATED_IDS.map((id) =>
    MARKETPLACE_ITEMS.find((item) => item.id === id)
  ).filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto max-w-[1024px] px-5 sm:px-6">
      {/* Compact 4-Column Unboxed Marketplace Row */}
      <section className="border-t border-white/[0.06] py-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#f7f8f8] sm:text-[28px]">
            Marketplace
          </h2>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1 text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            <span>Browse all</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {curated.map((item) => (
            <Link
              key={item.id}
              href={`/marketplace/${item.id}`}
              className="group block"
            >
              <div className="flex items-center gap-2 text-[12px] text-[#5e626a]">
                <AssetIcon
                  name={item.icon}
                  className="h-3.5 w-3.5 text-[#8a8f98] transition-colors group-hover:text-[#f7f8f8]"
                />
                <span>
                  {item.pricing === "rev-share"
                    ? "Rev-Share"
                    : item.pricing === "paid"
                      ? `€${item.priceEur}`
                      : "Free"}
                </span>
              </div>

              <h3 className="mt-2.5 text-[14.5px] font-medium tracking-[-0.015em] text-[#f7f8f8] group-hover:underline decoration-white/25 underline-offset-4">
                {item.name}
              </h3>

              <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#8a8f98]">
                {item.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quiet 4-Column Hairline Pricing Row */}
      <section id="pricing" className="scroll-mt-16 border-t border-white/[0.06] py-20">
        <div className="max-w-lg">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#f7f8f8] sm:text-[28px]">
            Transparent <OrbitGradientText>pricing</OrbitGradientText>
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#8a8f98]">
            Free dashboard forever. Buy non-expiring credits only when you want cloud AI—or
            bring local models for Free.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 divide-y divide-white/[0.07] border-y border-white/[0.07] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {CREDIT_PACKS.map((pack) => {
            const isBuilder = pack.id === "builder";
            return (
              <div
                key={pack.id}
                className={cn(
                  "flex flex-col justify-between py-6 lg:px-6 lg:first:pl-0 lg:last:pr-0",
                  "sm:px-5"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13.5px] font-medium text-[#f7f8f8]">
                      {pack.name}
                    </span>
                    {isBuilder && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#f7f8f8]">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5 flex items-baseline gap-1.5">
                    <span className="font-mono text-[30px] font-medium tracking-[-0.04em] tabular-nums text-[#f7f8f8]">
                      €<NumberFlow value={pack.priceEur} />
                    </span>
                    <span className="text-[12px] text-[#5e626a]">
                      {pack.priceEur === 0 ? "forever" : "one-time"}
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[12px] tabular-nums text-[#8a8f98]">
                    <NumberFlow value={pack.credits} /> cr
                  </div>

                  <p className="mt-3.5 text-[12.5px] leading-relaxed text-[#8a8f98]">
                    {pack.tagline}
                  </p>
                </div>

                <div className="mt-6">
                  {pack.priceEur === 0 ? (
                    <Link
                      href={appUrl}
                      className="btn-pill-dark inline-flex h-8 w-full items-center justify-center rounded-full text-[12.5px] font-medium"
                    >
                      Launch in Browser
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openCheckout({
                          id: pack.id,
                          title: pack.name,
                          subtitle: `${pack.credits.toLocaleString()} Orthese Credits · Never expires`,
                          priceEur: pack.priceEur,
                          credits: pack.credits,
                        })
                      }
                      className={cn(
                        "inline-flex h-8 w-full items-center justify-center rounded-full text-[12.5px] font-medium cursor-pointer",
                        isBuilder ? "btn-pill-white" : "btn-pill-dark"
                      )}
                    >
                      {pack.ctaLabel}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-[11px] text-[#5e626a]">
          Polar MoR · Apple Pay · Google Pay · Cards · Bancontact
        </p>
      </section>

      {/* Quiet Closing CTA */}
      <section className="border-t border-white/[0.06] py-24 text-center sm:py-28">
        <h2 className="text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#f7f8f8] sm:text-[42px]">
          Built for modular work.
          <br />
          <OrbitGradientText>Available today.</OrbitGradientText>
        </h2>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={appUrl}
            className="btn-pill-white inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium"
          >
            Launch in Browser
          </Link>
          <DownloadDesktopButton />
        </div>
      </section>
    </div>
  );
}
