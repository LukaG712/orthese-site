import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { HeroWorkspaceWindow } from "@/components/landing/HeroWorkspaceWindow";
import { BentoArchitecture } from "@/components/landing/BentoArchitecture";
import { DesktopVsWasmStrip } from "@/components/landing/DesktopVsWasmStrip";
import { MarketplaceTeaserRail } from "@/components/landing/MarketplaceTeaserRail";
import { PricingBlock } from "@/components/landing/PricingBlock";

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "#workspace-demo";

  return (
    <div className="relative">
      {/* Subtle Top-of-Page Ambient Overhead Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.06)_0%,rgba(5,5,5,0)_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* HERO SECTION */}
        <section className="pb-14 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#111111] px-3.5 py-1 font-mono text-[11px] text-[#a1a1aa] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#fafafa]" />
              <span>Rust + GPUI · Native Desktop &amp; Zero-Install WASM</span>
            </div>

            <h1 className="text-metallic mt-7 text-4xl font-medium tracking-[-0.04em] leading-[1.05] sm:text-[58px]">
              Your modular AI workstation,
              <br />
              snapped together from Pieces.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#a1a1aa]">
              Assemble AI Prompt Box, Website Builder, and Software Engineer on one
              obsidian canvas—with shared context and non-expiring credits.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={appUrl}
                className="btn-primary inline-flex h-10 items-center gap-2 rounded-lg px-5 text-[14px] font-medium"
              >
                <span>Launch in Browser (WASM)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#architecture"
                className="btn-secondary inline-flex h-10 items-center gap-2 rounded-lg px-5 text-[14px] font-medium"
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

        {/* INTERACTIVE HERO LIVE WORKSPACE WINDOW */}
        <section className="pb-8">
          <HeroWorkspaceWindow />
        </section>

        {/* SECTION 01: ASYMMETRIC BENTO GRID */}
        <BentoArchitecture />

        {/* SECTION 02: DUAL TARGET — WEB (WASM) VS DESKTOP */}
        <DesktopVsWasmStrip />

        {/* SECTION 03: CURATED MARKETPLACE STRIP */}
        <MarketplaceTeaserRail />

        {/* SECTION 04: TRANSPARENT PRICING */}
        <PricingBlock />
      </div>
    </div>
  );
}
