import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { HeroComposerPanel } from "@/components/landing/HeroComposerPanel";
import { EcosystemAndPillars } from "@/components/landing/EcosystemAndPillars";
import { FeatureChapters } from "@/components/landing/FeatureChapters";
import { MarketplaceAndPricing } from "@/components/landing/MarketplaceAndPricing";

export default function HomePage() {
  return (
    <div className="bg-[#08090a]">
      {/* FOCUSED HERO: DISPLAY HEADLINE + COMPOSER PANEL DIRECTLY UNDERNEATH */}
      <section className="relative overflow-x-clip px-4 pb-16 pt-14 sm:px-6 sm:pb-28 sm:pt-32">
        {/* Subtle monochrome top-center radial glow behind the hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px]"
          style={{
            background:
              "radial-gradient(ellipse 62% 50% at 50% 0%, rgba(255,255,255,0.065), rgba(129,140,248,0.03) 45%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-[820px] text-center">
          <h1 className="text-[clamp(2rem,5.2vw,3.85rem)] font-medium tracking-[-0.04em] leading-[1.08] text-[#f7f8f8]">
            The modular AI workstation
            <br />
            for <OrbitGradientText>builders and agents.</OrbitGradientText>
          </h1>

          <p className="mt-4 font-mono text-[11.5px] sm:mt-5 sm:text-[12.5px] text-[#8a8f98]">
            Free dashboard · €2 starter credits · No subscription
          </p>
        </div>

        <div className="relative mt-8 sm:mt-11">
          <HeroComposerPanel />
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
