"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { ArrowRight, Check } from "lucide-react";
import { CREDIT_PACKS } from "@/data/catalog";
import { useStorefront } from "@/components/shell/StorefrontContext";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function PricingBlock() {
  const { openCheckout } = useStorefront();

  return (
    <section id="pricing" className="scroll-mt-20 border-t border-white/[0.08] py-28 sm:py-32">
      <div className="mb-12 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
          04 / TRANSPARENT PRICING
        </span>
        <h2 className="text-metallic mt-3 text-3xl font-medium tracking-[-0.04em] leading-[1.06] sm:text-4xl">
          Free dashboard. Non-expiring credit packs.
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#a1a1aa]">
          Zero monthly subscription lock-in. Pay once for Orthese Credits—or run local
          models and CLIProxyAPI for €0.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKS.map((pack) => {
          const isFeatured = pack.id === "builder";
          return (
            <SpotlightCard key={pack.id} featured={isFeatured} className="p-6">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[15px] font-medium text-[#fafafa]">{pack.name}</h3>
                    {isFeatured && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#fafafa]">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-mono text-[34px] font-medium tracking-[-0.04em] tabular-nums text-[#fafafa]">
                      €<NumberFlow value={pack.priceEur} />
                    </span>
                    <span className="text-[12px] text-[#52525b]">
                      {pack.priceEur === 0 ? "forever" : "one-time"}
                    </span>
                  </div>

                  <div className="mt-2 font-mono text-[12px] tabular-nums text-[#a1a1aa]">
                    <NumberFlow value={pack.credits} />{" "}
                    <span className="text-[#52525b]">Orthese Credits</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5 text-[13px] text-[#a1a1aa]">
                    {pack.bullets.slice(0, 3).map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#71717a]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {pack.priceEur === 0 ? (
                    <Link
                      href="/#workspace-demo"
                      className="btn-secondary flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium"
                    >
                      <span>{pack.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
                      className={
                        isFeatured
                          ? "btn-primary flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium cursor-pointer"
                          : "btn-secondary flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium cursor-pointer"
                      }
                    >
                      <span>{pack.ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Quiet Trustworthy Payment Rails & Creator Rev-Share Strip */}
      <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
        <p className="font-mono text-[11px] text-[#71717a]">
          Polar MoR · Apple Pay · Google Pay · Cards · Bancontact
        </p>
        <p className="text-[12px] text-[#71717a]">
          Creator{" "}
          <code className="font-mono text-[11px] text-[#a1a1aa]">tokenRevShare</code>{" "}
          automatically allocates 20% of credit margin to free Piece authors.
        </p>
      </div>
    </section>
  );
}
