import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { HeroMultiAgentWorkspace } from "@/components/landing/HeroMultiAgentWorkspace";
import { EcosystemAndPillars } from "@/components/landing/EcosystemAndPillars";
import { FeatureChapters } from "@/components/landing/FeatureChapters";
import { MarketplaceAndPricing } from "@/components/landing/MarketplaceAndPricing";

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "#workspace-demo";

  return (
    <div className="bg-[#08090a]">
      {/* LEFT-ALIGNED EDITORIAL HERO */}
      <section className="mx-auto max-w-[1080px] px-5 pb-12 pt-20 sm:px-6 sm:pt-28">
        <h1 className="max-w-3xl text-[clamp(2.5rem,4.8vw,3.75rem)] font-medium tracking-[-0.04em] leading-[1.08] text-[#f7f8f8]">
          The modular AI workstation
          <br />
          for <OrbitGradientText>builders and agents.</OrbitGradientText>
        </h1>

        <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-mono text-[12px] text-[#8a8f98]">
            Free dashboard · €2 starter credits · No subscription
          </p>

          <div className="flex items-center gap-5">
            <Link
              href={appUrl}
              className="btn-pill-white inline-flex h-8 items-center rounded-full px-4 text-[13px] font-medium"
            >
              Launch in Browser
            </Link>
            <Link
              href="#dual-target"
              className="inline-flex items-center gap-1 text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
            >
              <span>Download Desktop</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SIGNATURE FULL-BLEED SMOKY-SILVER METALLIC HERO STAGE: MULTI-AGENT CHAT */}
      <section className="linear-hero-stage w-full px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-[1160px]">
          <HeroMultiAgentWorkspace />
        </div>
      </section>

      {/* ECOSYSTEM STRIP + TWO-TONE STATEMENT + 3 BOXLESS WIREFRAME PILLARS */}
      <EcosystemAndPillars />

      {/* FOUR REPEATING FEATURE CHAPTERS */}
      <FeatureChapters />

      {/* MARKETPLACE ROW + QUIET PRICING + DUAL EDITORIAL CARDS + CLOSING CTA */}
      <MarketplaceAndPricing />
    </div>
  );
}
