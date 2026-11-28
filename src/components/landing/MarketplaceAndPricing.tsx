"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { CREDIT_PACKS, MARKETPLACE_ITEMS } from "@/data/catalog";
import { DownloadDesktopButton } from "@/components/landing/DownloadDesktopButton";
import { AssetIcon } from "@/components/ui/Icon";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { useStorefront } from "@/components/shell/StorefrontContext";
import { cn } from "@/lib/cn";

const FEATURED_STRIP_IDS = [
  "orthese.website-builder",
  "orthese.software-engineer",
  "pack.indie-builder",
];

function formatKindLabel(kind: string): string {
  if (kind === "starter-pack") return "Starter Pack";
  if (kind === "skill") return "SKILL.md";
  return "Piece";
}

function formatPriceLabel(item: (typeof MARKETPLACE_ITEMS)[number]): string {
  if (item.pricing === "rev-share") return "Rev-Share";
  if (item.pricing === "paid") return `€${item.priceEur}`;
  return "Free";
}

export function MarketplaceAndPricing() {
  const { openCheckout } = useStorefront();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/dashboard";

  const featuredStrip = FEATURED_STRIP_IDS.map((id) =>
    MARKETPLACE_ITEMS.find((item) => item.id === id)
  ).filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
      {/* 1. MARKETPLACE TEASER: 3-COLUMN rounded-2xl FEATURE STRIP + HORIZONTAL MARQUEE */}
      <section className="border-t border-white/[0.06] py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
              Marketplace
            </span>
            <h2 className="mt-2.5 text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] sm:text-[34px]">
              Snap in Pieces, Skills &amp;{" "}
              <OrbitGradientText>Starter Packs.</OrbitGradientText>
            </h2>
          </div>

          <Link
            href="/marketplace"
            className="bg-button-secondary inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-lg px-3 text-[12.5px] font-medium sm:self-auto"
          >
            <span>Explore /marketplace</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#a3a3a3]" />
          </Link>
        </div>

        {/* 3-Column rounded-2xl Feature Strip */}
        <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredStrip.map((item) => (
            <Link
              key={item.id}
              href={`/marketplace/${item.id}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#161618] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/[0.16] hover:bg-[#1a1a1d]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-[12px] text-[#a3a3a3]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-[#121212]">
                      <AssetIcon
                        name={item.icon}
                        className="h-3.5 w-3.5 text-[#a3a3a3] transition-colors group-hover:text-[#fafafa]"
                      />
                    </span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#737373]">
                      {formatKindLabel(item.kind)}
                    </span>
                  </div>

                  <span className="rounded-full border border-white/[0.08] bg-[#121212] px-2.5 py-0.5 font-mono text-[10.5px] text-[#d4d4d4]">
                    {formatPriceLabel(item)}
                  </span>
                </div>

                <h3 className="mt-4 text-[15.5px] font-medium tracking-[-0.02em] text-[#fafafa]">
                  {item.name}
                </h3>

                <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#a3a3a3]">
                  {item.tagline}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3.5 font-mono text-[11px] text-[#737373]">
                <span>
                  {item.runtime === "wasm+desktop" ? "WASM + Desktop" : "Desktop"}
                </span>
                <span className="inline-flex items-center gap-1 text-[#a3a3a3] transition-colors group-hover:text-[#fafafa]">
                  <span>Inspect</span>
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Horizontal Monochrome Marquee Strip */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#141416] py-3">
          <div className="mask-fade-x overflow-hidden">
            <div className="marketplace-marquee-track gap-2.5 px-2.5">
              {[0, 1].map((dupIdx) => (
                <div
                  key={dupIdx}
                  aria-hidden={dupIdx === 1}
                  className="flex shrink-0 items-center gap-2.5"
                >
                  {MARKETPLACE_ITEMS.map((item) => (
                    <Link
                      key={`${dupIdx}-${item.id}`}
                      href={`/marketplace/${item.id}`}
                      tabIndex={dupIdx === 1 ? -1 : undefined}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.08] bg-[#171719] px-3.5 py-1.5 text-[12px] text-[#d4d4d4] transition-colors hover:border-white/20 hover:bg-[#1e1e21] hover:text-[#fafafa]"
                    >
                      <AssetIcon
                        name={item.icon}
                        className="h-3.5 w-3.5 shrink-0 text-[#737373]"
                      />
                      <span className="font-medium">{item.name}</span>
                      <span className="font-mono text-[10.5px] text-[#737373]">
                        {formatPriceLabel(item)}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] px-4 pt-2.5 text-[11.5px] text-[#737373]">
            <span className="font-mono">
              {MARKETPLACE_ITEMS.length} verified Pieces, SKILL.md packs &amp; Starter Packs
            </span>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 font-medium text-[#d4d4d4] hover:text-[#fafafa] transition-colors"
            >
              <span>Browse all in Marketplace</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#737373]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 4-COLUMN PRICING SECTION WITH SUBTLE RING ON BUILDER €25 */}
      <section
        id="pricing"
        className="scroll-mt-16 border-t border-white/[0.06] py-20 sm:py-24"
      >
        <div className="max-w-lg">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
            Pricing
          </span>
          <h2 className="mt-2.5 text-3xl font-medium tracking-[-0.035em] leading-[1.08] text-[#fafafa] sm:text-[34px]">
            Transparent <OrbitGradientText>pricing.</OrbitGradientText>
          </h2>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#a3a3a3]">
            Free dashboard forever. Buy non-expiring credits only when you want cloud AI, or
            bring local models for Free.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREDIT_PACKS.map((pack) => {
            const isBuilder = pack.id === "builder";
            return (
              <div
                key={pack.id}
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-6 transition-colors",
                  isBuilder
                    ? "bg-[#1a1a1d] ring-1 ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_48px_-24px_rgba(0,0,0,0.85)]"
                    : "border border-white/[0.07] bg-[#161618] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[14px] font-medium text-[#fafafa]">
                      {pack.name}
                    </span>
                    {isBuilder && (
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.09] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#fafafa]">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-mono text-[32px] font-medium tracking-[-0.04em] tabular-nums text-[#fafafa]">
                      €<NumberFlow value={pack.priceEur} />
                    </span>
                    <span className="text-[12px] text-[#737373]">
                      {pack.priceEur === 0 ? "forever" : "one-time"}
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[12px] tabular-nums text-[#a3a3a3]">
                    <NumberFlow value={pack.credits} /> cr
                  </div>

                  <p className="mt-3.5 text-[12.5px] leading-relaxed text-[#a3a3a3]">
                    {pack.tagline}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
                    {pack.bullets.slice(0, 3).map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2 text-[12px] leading-snug text-[#a3a3a3]"
                      >
                        <Check
                          className={cn(
                            "mt-0.5 h-3.5 w-3.5 shrink-0",
                            isBuilder ? "text-[#fafafa]" : "text-[#737373]"
                          )}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  {pack.priceEur === 0 ? (
                    <Link
                      href={appUrl}
                      className="bg-button-secondary inline-flex h-9 w-full items-center justify-center rounded-[10px] text-[13px] font-medium"
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
                        "inline-flex h-9 w-full items-center justify-center rounded-[10px] text-[13px] font-medium cursor-pointer",
                        isBuilder ? "bg-button-primary" : "bg-button-secondary"
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

        {/* Calm Trust Line */}
        <p className="mt-6 text-center font-mono text-[11.5px] text-[#737373] sm:text-left">
          Powered by Polar · Apple Pay · Google Pay · Bancontact · Credits never expire
        </p>
      </section>

      {/* 3. ELEVATED CLOSING CTA (rounded-3xl bg-[#161618] + subtle radial top-glow) */}
      <section className="pb-20 sm:pb-24">
        <div className="relative rounded-3xl border border-white/[0.08] bg-[#161618] px-6 py-20 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] sm:px-12 sm:py-24">
          {/* Subtle Radial Top-Glow clipped cleanly to the rounded-3xl frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
          >
            <div
              className="absolute inset-x-0 top-0 h-60"
              style={{
                background:
                  "radial-gradient(ellipse 68% 58% at 50% 0%, rgba(255,255,255,0.09), rgba(255,255,255,0.025) 46%, transparent 76%)",
              }}
            />
            <div className="absolute inset-x-1/4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-xl">
            <h2 className="text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#fafafa] sm:text-[42px]">
              Built for modular work.
              <br />
              <OrbitGradientText>Available today.</OrbitGradientText>
            </h2>

            <p className="mx-auto mt-3.5 max-w-md text-[14.5px] leading-relaxed text-[#a3a3a3]">
              Try Orthese immediately in WebAssembly with €2 starter credits, or install the
              native 120fps Rust/GPUI desktop app.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={appUrl}
                className="bg-button-primary inline-flex h-9 items-center justify-center rounded-[10px] px-4 text-[13.5px] font-medium"
              >
                Launch in Browser
              </Link>
              <DownloadDesktopButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
