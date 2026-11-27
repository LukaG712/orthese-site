"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, LogOut, Menu, Rocket, Route, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/primitives/Avatar";
import { Skeleton } from "@/components/primitives/Skeleton";
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
  const { setCommandOpen, user, authReady, signOut } = useStorefront();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  useEffect(() => {
    setMobileOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountMenuOpen]);

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

        {/* Right: Cmd+K + Auth / Launch Orthese + Avatar + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            data-testid="navbar-cmd-btn"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            className="hidden sm:inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[12px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors cursor-pointer"
          >
            <kbd className="font-mono text-[11px] tracking-tight">⌘K</kbd>
          </button>

          {!authReady ? (
            <Skeleton rounded="full" className="h-7 w-28" />
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Launch Orthese sits directly to the left of the Avatar when logged in */}
              <Link
                href={appUrl}
                data-testid="navbar-launch-orthese"
                className="btn-pill-white inline-flex h-7 items-center rounded-full px-3 text-[12.5px] font-medium whitespace-nowrap"
              >
                Launch Orthese
              </Link>

              {/* Logged-in User Avatar + Account Dropdown */}
              <div ref={accountMenuRef} className="relative flex items-center">
                <button
                  type="button"
                  data-testid="navbar-avatar-btn"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                  aria-label={`Account menu for ${user.name}`}
                  className="rounded-full p-0.5 ring-1 ring-transparent hover:ring-white/25 transition-all cursor-pointer"
                >
                  <Avatar
                    name={user.name}
                    src={user.avatarUrl}
                    size="sm"
                    status="online"
                  />
                </button>

                {accountMenuOpen && (
                  <div
                    role="menu"
                    data-testid="navbar-account-menu"
                    className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-white/[0.13] bg-[#12141a]/98 p-1.5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-white/[0.07]">
                      <Avatar name={user.name} src={user.avatarUrl} size="md" status="online" />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-[#f7f8f8]">
                          {user.name}
                        </div>
                        <div className="truncate text-[11.5px] text-[#7e8490]">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-2.5 py-2 text-[11.5px] border-b border-white/[0.07]">
                      <span className="inline-flex items-center gap-1.5 text-[#8a8f98]">
                        <Sparkles className="h-3 w-3 text-[#818cf8]" />
                        <span>{user.plan}</span>
                      </span>
                      <span className="font-mono text-[11.5px] font-medium tabular-nums text-[#f7f8f8]">
                        {user.credits.toLocaleString()} cr
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href={appUrl}
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#d4d6dc] hover:bg-white/[0.07] hover:text-[#f7f8f8] transition-colors"
                      >
                        <Rocket className="h-3.5 w-3.5 text-[#8a8f98]" />
                        <span>Launch Orthese</span>
                      </Link>
                      <Link
                        href="/router"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#d4d6dc] hover:bg-white/[0.07] hover:text-[#f7f8f8] transition-colors"
                      >
                        <Route className="h-3.5 w-3.5 text-[#8a8f98]" />
                        <span>Orthese Router</span>
                      </Link>
                      <Link
                        href="/marketplace"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#d4d6dc] hover:bg-white/[0.07] hover:text-[#f7f8f8] transition-colors"
                      >
                        <Layers className="h-3.5 w-3.5 text-[#8a8f98]" />
                        <span>Marketplace</span>
                      </Link>
                    </div>

                    <div className="border-t border-white/[0.07] pt-1">
                      <button
                        type="button"
                        data-testid="navbar-signout-btn"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          signOut();
                          toast.info("Signed out of Orthese");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              data-testid="navbar-login-btn"
              className="btn-pill-white inline-flex h-7 items-center rounded-full px-3 text-[12.5px] font-medium whitespace-nowrap"
            >
              <span className="sm:hidden">Log in</span>
              <span className="hidden sm:inline">Log in / Sign up</span>
            </Link>
          )}

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
