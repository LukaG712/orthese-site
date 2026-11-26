import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { BlueprintDivider } from "@/components/ui/BlueprintDivider";
import { HeroWorkspaceWindow } from "@/components/landing/HeroWorkspaceWindow";
import { BentoArchitecture } from "@/components/landing/BentoArchitecture";
import { DesktopVsWasmStrip } from "@/components/landing/DesktopVsWasmStrip";
import { MarketplaceTeaserRail } from "@/components/landing/MarketplaceTeaserRail";
import { PricingBlock } from "@/components/landing/PricingBlock";

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "#workspace-demo";

  return (
    <div className="relative">
      {/* Subtle Top-Center Radial Monochrome Light Bloom behind Hero */}
      <div
        aria-hidden="true"
        className="hero-bloom pointer-events-none absolute inset-x-0 top-0 h-[620px]"
      />

      {/* HERO + INTERACTIVE LIVE WORKSPACE */}
      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        <section className="pb-14 pt-20 sm:pt-28">
          <div className="mx-auto max-w-[1040px] text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#0e0e11] px-3.5 py-1 font-mono text-[11px] text-[#a1a1aa] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Rust + GPUI · Native Desktop &amp; Zero-Install WASM</span>
            </div>

            <h1 className="mt-7 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-[clamp(2.5rem,4.7vw,4.15rem)] font-medium tracking-[-0.045em] leading-[1.02] text-transparent">
              Your modular AI workstation,
              <br />
              snapped together from Pieces.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[#a1a1aa]">
              Assemble AI Prompt Box, Website Builder, and Software Engineer on one
              obsidian canvas—with shared context and non-expiring credits.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={appUrl}
                className="btn-primary inline-flex h-10 items-center gap-2 rounded-md px-5 text-[14px] font-medium"
              >
                <span>Launch in Browser (WASM)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#architecture"
                className="btn-secondary inline-flex h-10 items-center gap-2 rounded-md px-5 text-[14px] font-medium"
              >
                <Download className="h-4 w-4 text-[#a1a1aa]" />
                <span>Download Desktop</span>
              </Link>
            </div>

            <p className="mt-5 font-mono text-[11px] text-[#52525b]">
              Free dashboard · €2 starter credits · No subscription
            </p>
          </div>
        </section>

        <section className="pb-24 sm:pb-28">
          <HeroWorkspaceWindow />
        </section>
      </div>

      {/* SECTION 01: ASYMMETRIC BENTO GRID */}
      <BlueprintDivider />
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <BentoArchitecture />
      </div>

      {/* SECTION 02: DUAL TARGET — WEB (WASM) VS DESKTOP */}
      <BlueprintDivider />
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <DesktopVsWasmStrip />
      </div>

      {/* SECTION 03: CURATED MARKETPLACE STRIP */}
      <BlueprintDivider />
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <MarketplaceTeaserRail />
      </div>

      {/* SECTION 04: TRANSPARENT PRICING */}
      <BlueprintDivider />
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <PricingBlock />
      </div>
    </div>
  );
}
