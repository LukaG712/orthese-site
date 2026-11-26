"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { useStorefront } from "./StorefrontContext";

export function Navbar() {
  const pathname = usePathname();
  const { setCommandOpen } = useStorefront();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  return (
    <header className="sticky top-0 z-40 h-[52px] w-full border-b border-white/[0.06] bg-[#08090a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between px-5 sm:px-6">
        {/* Left: Crisp Orthese Icon + Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-[14px] font-medium tracking-[-0.02em] text-[#f7f8f8]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="#F7F8F8" />
            <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="#F7F8F8" strokeWidth="1.35" />
            <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="#F7F8F8" strokeWidth="1.35" />
            <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="#F7F8F8" fillOpacity="0.38" />
          </svg>
          <span>Orthese</span>
        </Link>

        {/* Center: Quiet 13px Muted Links */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          <Link
            href="/#shared-context"
            className="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            Pieces
          </Link>
          <Link
            href="/router"
            className={cn(
              "text-[13px] transition-colors",
              pathname?.startsWith("/router")
                ? "text-[#f7f8f8]"
                : "text-[#8a8f98] hover:text-[#f7f8f8]"
            )}
          >
            Router
          </Link>
          <Link
            href="/marketplace"
            className={cn(
              "text-[13px] transition-colors",
              pathname?.startsWith("/marketplace")
                ? "text-[#f7f8f8]"
                : "text-[#8a8f98] hover:text-[#f7f8f8]"
            )}
          >
            Marketplace
          </Link>
          <Link
            href="/#pricing"
            className="text-[13px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right: Subtle Cmd+K Trigger + Compact White Pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            className="inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[12px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors cursor-pointer"
          >
            <kbd className="font-mono text-[11px] tracking-tight">⌘K</kbd>
          </button>

          <Link
            href={appUrl}
            className="btn-pill-white inline-flex h-7 items-center rounded-full px-3 text-[12.5px] font-medium"
          >
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}
