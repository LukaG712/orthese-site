"use client";

import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { CREDIT_PACKS } from "@/data/catalog";
import { useStorefront } from "@/components/shell/StorefrontContext";
import { cn } from "@/lib/cn";

export function PricingBlock() {
  const { openCheckout } = useStorefront();

  return (
    <section id="pricing" className="scroll-mt-20 border-t border-white/[0.06] py-20">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            04 / Transparent Pricing
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Free dashboard. Non-expiring credit packs.
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Zero monthly subscriptions in v0.1. Buy all-in Orthese Credits only when you want
            frictionless cloud AI—or bring your own local models &amp; CLIProxyAPI for €0.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-zinc-400">
          {["Polar MoR", "Apple Pay", "Google Pay", "Cards", "Bancontact"].map((rail) => (
            <span
              key={rail}
              className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1"
            >
              {rail}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKS.map((pack) => {
          const isFeatured = Boolean(pack.badge);
          return (
            <div
              key={pack.id}
              className={cn(
                "workstation-card flex flex-col justify-between rounded-2xl p-5",
                isFeatured && "border-beam-ring border-white/[0.2] bg-[#141414]"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{pack.name}</h3>
                  {pack.badge ? (
                    <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-black">
                      {pack.badge}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-zinc-500">
                      {pack.priceEur === 0 ? "FOREVER" : "NEVER EXPIRES"}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-mono text-3xl font-semibold tracking-tight text-white">
                    €<NumberFlow value={pack.priceEur} />
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    {pack.priceEur === 0 ? "/ free forever" : "all-in one-time"}
                  </span>
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#0a0a0a] px-2 py-1 font-mono text-[11px] text-zinc-300">
                  <NumberFlow value={pack.credits} />
                  <span className="text-zinc-500">Orthese Credits</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-zinc-400">{pack.tagline}</p>

                <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4 text-xs text-zinc-300">
                  {pack.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                {pack.priceEur === 0 ? (
                  <Link
                    href="/#workspace-demo"
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.14] bg-white/[0.04] text-xs font-medium text-white hover:border-white/25 hover:bg-white/[0.08] transition-colors"
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
                    className={cn(
                      "flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                      isFeatured
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "border border-white/[0.14] bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]"
                    )}
                  >
                    <span>{pack.ctaLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#111111] px-4 py-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-zinc-300" />
          <span>
            <strong className="text-zinc-200">Creator Token Rev-Share:</strong> Free Pieces
            with <code className="text-zinc-200">tokenRevShare: true</code> automatically earn
            20% of Orthese&apos;s credit margin whenever users run them.
          </span>
        </div>
        <Link
          href="/marketplace"
          className="font-mono text-[11px] text-zinc-200 underline decoration-white/25 underline-offset-4 hover:text-white"
        >
          Explore Piece SDK →
        </Link>
      </div>
    </section>
  );
}
