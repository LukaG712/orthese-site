import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlueprintDivider } from "@/components/ui/BlueprintDivider";

export function Footer() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  return (
    <footer className="relative z-10 bg-[#060607]">
      <BlueprintDivider />

      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_0.85fr_0.95fr_0.85fr_1.45fr]">
          {/* Column 1: Wordmark + 1-line tagline + 6px emerald status dot */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.02em] text-[#fafafa]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-[4px] border border-white/[0.14] bg-[#111113]">
                <span className="h-2 w-2 rounded-[1.5px] bg-[#fafafa]" />
              </span>
              <span>Orthese</span>
            </Link>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-[#a1a1aa]">
              Modular AI workstation built on one Rust + GPUI core.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-[12px] text-[#a1a1aa]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#a1a1aa]">
              <li>
                <Link href="/#workspace-demo" className="hover:text-[#fafafa] transition-colors">
                  Live Canvas (WASM)
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-[#fafafa] transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/#architecture" className="hover:text-[#fafafa] transition-colors">
                  Architecture
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#fafafa] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Developers */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
              Developers
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#a1a1aa]">
              <li>
                <Link
                  href="/marketplace/orthese.website-builder"
                  className="hover:text-[#fafafa] transition-colors"
                >
                  Piece SDK Docs
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/LukaG712/orthese"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#fafafa] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/marketplace/orthese.software-engineer"
                  className="hover:text-[#fafafa] transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#52525b]">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13px] text-[#a1a1aa]">
              <li>
                <Link href="/#pricing" className="hover:text-[#fafafa] transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-[#fafafa] transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-[#fafafa] transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Final WASM CTA */}
          <div className="flex flex-col items-start justify-between md:items-end">
            <div className="md:text-right">
              <p className="text-[13px] font-medium text-[#fafafa]">
                Ready in under 10 seconds
              </p>
              <p className="mt-1 text-[12px] text-[#a1a1aa]">
                Free dashboard · €2 starter credits
              </p>
            </div>
            <Link
              href={appUrl}
              className="btn-primary mt-4 inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md px-4 text-[13px] font-medium"
            >
              <span>Launch in Browser (WASM)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 border-t border-white/[0.06] pt-6 text-[12px] text-[#52525b] sm:flex-row sm:items-center">
          <span>© 2026 Orthese</span>
          <span className="font-mono text-[11px]">
            Piece SDK v0.1 · Polar Merchant of Record
          </span>
        </div>
      </div>
    </footer>
  );
}
