import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { HeroComposerPanel } from "@/components/landing/HeroComposerPanel";
import { EcosystemAndPillars } from "@/components/landing/EcosystemAndPillars";
import { FeatureChapters } from "@/components/landing/FeatureChapters";
import { MarketplaceAndPricing } from "@/components/landing/MarketplaceAndPricing";

export default function HomePage() {
  return (
    <div className="bg-[#08090a]">
      {/* FOCUSED HERO: ARCHITECTURAL STAGE + EDITORIAL HEADLINE + COMPOSER PANEL */}
      <section className="relative flex min-h-[calc(100svh-52px)] flex-col justify-center overflow-x-clip px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-12">
        {/* Subtle monochrome top-center radial glow + masked architectural grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[580px]"
          style={{
            background:
              "radial-gradient(ellipse 66% 52% at 50% 0%, rgba(255,255,255,0.075), rgba(129,140,248,0.045) 42%, transparent 76%)",
          }}
        />
        <div
          aria-hidden="true"
          className="hero-grid-veil pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto max-w-[820px] text-center">
          <h1 className="text-[clamp(2.2rem,5.5vw,4.15rem)] font-medium tracking-[-0.042em] leading-[1.04] text-[#f7f8f8]">
            The modular AI workstation
            <br />
            for <OrbitGradientText>builders and agents.</OrbitGradientText>
          </h1>

          <p className="mx-auto mt-4 max-w-[640px] text-balance text-[14.5px] leading-relaxed text-[#8a8f98] sm:mt-5 sm:text-[16px]">
            Snap prompt boxes, site builders, and coding agents onto one shared canvas.
          </p>
        </div>

        <div className="relative mt-9 sm:mt-11">
          <HeroComposerPanel />
        </div>

        {/* Whisper-quiet bottom scroll hairline on desktop */}
        <a
          href="#architecture"
          aria-label="Scroll to architecture"
          className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 opacity-40 hover:opacity-80 transition-opacity"
        >
          <span className="h-7 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </a>
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
