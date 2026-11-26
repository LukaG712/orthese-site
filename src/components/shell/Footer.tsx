import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  return (
    <footer className="border-t border-white/[0.08] bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded border border-white/[0.16] bg-white/[0.05]">
                <span className="h-2 w-2 rounded-[2px] bg-white" />
              </span>
              <span>Orthese</span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-zinc-400">
              Free modular AI workstation compiled from one Rust + GPUI core for native
              desktop and zero-install WebAssembly.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>All edge systems operational</span>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Workspace
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/#workspace-demo" className="hover:text-white transition-colors">
                  Live Canvas (WASM)
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  Marketplace Registry
                </Link>
              </li>
              <li>
                <Link href="/#architecture" className="hover:text-white transition-colors">
                  Desktop vs. WASM
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Orthese Credits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Ecosystem
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-400">
              <li>
                <Link
                  href="/marketplace/orthese.website-builder"
                  className="hover:text-white transition-colors"
                >
                  Website Builder Piece
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace/orthese.software-engineer"
                  className="hover:text-white transition-colors"
                >
                  Software Engineer Piece
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace?tab=skill"
                  className="hover:text-white transition-colors"
                >
                  Skills (SKILL.md)
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/LukaG712/orthese"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub Monorepo
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#111111] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Zero-install try-out
              </span>
              <p className="mt-1.5 text-xs font-medium text-zinc-100">
                Test Website Builder with €2 free starter credits.
              </p>
            </div>
            <Link
              href={appUrl}
              className="mt-4 inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-3 text-xs font-medium text-black hover:bg-zinc-200 transition-colors"
            >
              <span>Launch in Browser</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 font-mono text-[11px] text-zinc-500 sm:flex-row sm:items-center">
          <span>© 2026 Orthese · Piece SDK v0.1</span>
          <span>Payments & VAT via Polar (Merchant of Record) · Zero subscription lock-in</span>
        </div>
      </div>
    </footer>
  );
}
