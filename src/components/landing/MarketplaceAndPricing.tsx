"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { CREDIT_PACKS, MARKETPLACE_ITEMS } from "@/data/catalog";
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
    <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
      {/* 6. Marketplace Strip (Matching Linear's 4-Column Unboxed Changelog Row) */}
      <section className="border-t border-white/[0.06] py-28">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#f7f8f8] sm:text-3xl">
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

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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

              <h3 className="mt-3 text-[15px] font-medium tracking-[-0.015em] text-[#f7f8f8] group-hover:underline decoration-white/25 underline-offset-4">
                {item.name}
              </h3>

              <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-[#8a8f98]">
                {item.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 7A. Quiet 4-Column Hairline Pricing Row (No Clunky Card Boxes) */}
      <section id="pricing" className="scroll-mt-20 border-t border-white/[0.06] py-28">
        <div className="max-w-xl">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-[#f7f8f8] sm:text-3xl">
            Transparent <OrbitGradientText>pricing</OrbitGradientText>
          </h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-[#8a8f98]">
            Free dashboard forever. Buy non-expiring Orthese Credits only when you want
            frictionless cloud AI—or bring local models for €0.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 divide-y divide-white/[0.07] border-y border-white/[0.07] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {CREDIT_PACKS.map((pack) => {
            const isBuilder = pack.id === "builder";
            return (
              <div
                key={pack.id}
                className={cn(
                  "flex flex-col justify-between py-7 lg:px-6 lg:first:pl-0 lg:last:pr-0",
                  "sm:px-5"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-medium text-[#f7f8f8]">
                      {pack.name}
                    </span>
                    {isBuilder && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#f7f8f8]">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-mono text-[32px] font-medium tracking-[-0.04em] tabular-nums text-[#f7f8f8]">
                      €<NumberFlow value={pack.priceEur} />
                    </span>
                    <span className="text-[12px] text-[#5e626a]">
                      {pack.priceEur === 0 ? "forever" : "one-time"}
                    </span>
                  </div>

                  <div className="mt-1.5 font-mono text-[12px] tabular-nums text-[#8a8f98]">
                    <NumberFlow value={pack.credits} /> cr
                  </div>

                  <p className="mt-4 text-[13px] leading-relaxed text-[#8a8f98]">
                    {pack.tagline}
                  </p>
                </div>

                <div className="mt-7">
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

        <p className="mt-5 font-mono text-[11px] text-[#5e626a]">
          Polar MoR · Apple Pay · Google Pay · Cards · Bancontact
        </p>

        {/* 7B. High-Contrast Dual Editorial Cards (Signature Linear Visual Break) */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Left Card (8 cols): Soft Ice-Periwinkle #DCE4FF */}
          <Link
            href={appUrl}
            className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-lg bg-[#DCE4FF] p-8 text-[#09090B] transition-transform duration-200 hover:-translate-y-0.5 md:col-span-8"
          >
            {/* Subtle Oversized Geometric Watermark */}
            <svg
              className="pointer-events-none absolute -bottom-10 -right-8 h-64 w-64 text-[#09090B]/[0.06]"
              viewBox="0 0 160 160"
              fill="none"
              aria-hidden="true"
            >
              <rect x="14" y="14" width="56" height="56" rx="10" fill="currentColor" />
              <rect x="90" y="14" width="56" height="56" rx="10" stroke="currentColor" strokeWidth="10" />
              <rect x="14" y="90" width="56" height="56" rx="10" stroke="currentColor" strokeWidth="10" />
              <rect x="90" y="90" width="56" height="56" rx="10" fill="currentColor" fillOpacity="0.45" />
            </svg>

            <p className="relative z-10 max-w-xl text-xl font-medium tracking-[-0.03em] leading-[1.28] sm:text-[24px]">
              Try the full Rust + GPUI workspace in WebAssembly with €2 free starter
              credits—zero install, zero subscription.
            </p>

            <span className="relative z-10 mt-10 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#09090B]">
              <span>Launch in Browser</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Right Card (4 cols): Vivid Acid-Lime #E2F626 */}
          <Link
            href="/marketplace/orthese.website-builder"
            className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-lg bg-[#E2F626] p-8 text-[#09090B] transition-transform duration-200 hover:-translate-y-0.5 md:col-span-4"
          >
            <svg
              className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-[#09090B]/[0.07]"
              viewBox="0 0 120 120"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="10" />
              <path d="M60 28V92M28 60H92" stroke="currentColor" strokeWidth="10" />
            </svg>

            <p className="relative z-10 text-xl font-medium tracking-[-0.03em] leading-[1.25] sm:text-[23px]">
              Publish free Pieces. Earn 20%{" "}
              <span className="font-mono text-[19px]">tokenRevShare</span>.
            </p>

            <span className="relative z-10 mt-10 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#09090B]">
              <span>Piece SDK Docs</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* 8. Centered Closing CTA */}
      <section className="py-32 text-center sm:py-40">
        <h2 className="text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#f7f8f8] sm:text-[46px]">
          Built for modular work.
          <br />
          <OrbitGradientText>Available today.</OrbitGradientText>
        </h2>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={appUrl}
            className="btn-pill-white inline-flex h-9 items-center rounded-full px-5 text-[13.5px] font-medium"
          >
            Launch in Browser
          </Link>
          <Link
            href="/#dual-target"
            className="btn-pill-dark inline-flex h-9 items-center rounded-full px-5 text-[13.5px] font-medium"
          >
            Download Desktop
          </Link>
        </div>
      </section>
    </div>
  );
}
