"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useStorefront } from "./StorefrontContext";

const NAV_LINKS = [
  { label: "Pieces", href: "/#shared-context", matchPrefix: null },
  { label: "Router", href: "/router", matchPrefix: "/router" },
  { label: "Marketplace", href: "/marketplace", matchPrefix: "/marketplace" },
  { label: "Pricing", href: "/#pricing", matchPrefix: null },
];

export function Navbar() {
  const pathname = usePathname();
  const { setCommandOpen } = useStorefront();
  const [mobileOpen, setMobileOpen] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#08090a]/85 backdrop-blur-md">
      <div className="mx-auto flex h-[52px] max-w-[1080px] items-center justify-between px-4 sm:px-6">
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

        {/* Center: Quiet 13px Muted Links (Desktop) */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((item) => {
            const active = item.matchPrefix && pathname?.startsWith(item.matchPrefix);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-[13px] transition-colors",
                  active ? "text-[#f7f8f8]" : "text-[#8a8f98] hover:text-[#f7f8f8]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Cmd+K + Compact White Pill + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            className="hidden sm:inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[12px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors cursor-pointer"
          >
            <kbd className="font-mono text-[11px] tracking-tight">⌘K</kbd>
          </button>

          <Link
            href={appUrl}
            className="btn-pill-white inline-flex h-7 items-center rounded-full px-3 text-[12.5px] font-medium"
          >
            Launch App
          </Link>

          <button
            type="button"
            data-testid="mobile-menu-btn"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#c4c8d0] hover:text-[#f7f8f8] md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          data-testid="mobile-nav-drawer"
          aria-label="Mobile navigation"
          className="border-t border-white/[0.07] bg-[#0a0b0e]/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((item) => {
              const active = item.matchPrefix && pathname?.startsWith(item.matchPrefix);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
                    active
                      ? "bg-white/[0.08] text-[#f7f8f8]"
                      : "text-[#9ca3af] hover:bg-white/[0.04] hover:text-[#f7f8f8]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setCommandOpen(true);
              }}
              className="mt-1 flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-left text-[13px] text-[#9ca3af] hover:text-[#f7f8f8] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Search Pieces &amp; commands…</span>
              </span>
              <kbd className="font-mono text-[10.5px] text-[#5e626a]">⌘K</kbd>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
