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
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* SECTION 01: Hero Headline & CTAs */}
      <section className="pb-12 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>Rust + GPUI · Native Desktop &amp; Zero-Install WASM</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.035em] text-white sm:text-6xl sm:leading-[1.05]">
            Your modular AI workstation,{" "}
            <span className="t-shimmer-text">snapped together from Pieces.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Stop juggling disconnected AI tabs and subscriptions. Assemble AI Prompt Box,
            Website Builder, and Software Engineer on one shared canvas—try instantly in
            WebAssembly or run natively on Desktop.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={appUrl}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-200 transition-colors"
            >
              <span>Launch in Browser (WASM)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/marketplace"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.14] bg-white/[0.04] px-5 text-sm font-medium text-white hover:border-white/25 hover:bg-white/[0.08] transition-colors"
            >
              <Download className="h-4 w-4 text-zinc-300" />
              <span>Browse Marketplace</span>
            </Link>
          </div>

          <p className="mt-4 font-mono text-[11px] text-zinc-500">
            Free dashboard · €2 starter credits · No subscription · Press{" "}
            <kbd className="rounded border border-white/[0.12] bg-white/[0.04] px-1.5 py-0.5 text-zinc-300">
              ⌘K
            </kbd>{" "}
            anywhere
          </p>
        </div>
      </section>

      {/* SECTION 02: Hero Live Workspace Window */}
      <section className="pb-12">
        <HeroWorkspaceWindow />
      </section>

      {/* SECTION 03: Bento Grid — Why Modular Wins */}
      <BentoArchitecture />

      {/* SECTION 04: Desktop vs. Web (WASM) Strip + File Tree */}
      <DesktopVsWasmStrip />

      {/* SECTION 05: Marketplace Teaser Rail */}
      <MarketplaceTeaserRail />

      {/* SECTION 06: Transparent Pricing Block */}
      <PricingBlock />
    </div>
  );
}
