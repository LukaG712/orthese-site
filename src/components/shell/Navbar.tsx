"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronRight,
  Layers,
  LogOut,
  Rocket,
  Route,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/primitives/Avatar";
import { Skeleton } from "@/components/primitives/Skeleton";
import { cn } from "@/lib/cn";
import { useStorefront } from "./StorefrontContext";

interface CurtainLinkItem {
  label: string;
  href: string;
  meta?: string;
}

interface CurtainColumn {
  heading: string;
  primary?: boolean;
  links: CurtainLinkItem[];
}

interface NavMenuSection {
  id: string;
  label: string;
  href: string;
  matchPrefix?: string;
  badgeDot?: boolean;
  columns: CurtainColumn[];
}

function CurtainNavLink({
  item,
  primary,
  onSelect,
}: {
  item: CurtainLinkItem;
  primary?: boolean;
  onSelect: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className={cn(
        "group inline-flex items-baseline gap-2.5 transition-colors",
        primary
          ? "text-[18.5px] font-medium tracking-[-0.025em] leading-[1.32] text-[#e5e5e5] hover:text-white"
          : "text-[13px] font-medium text-[#b5b5b5] hover:text-[#fafafa]"
      )}
    >
      <span>{item.label}</span>
      {item.meta && (
        <span className="font-mono text-[10.5px] font-normal text-[#737373] group-hover:text-[#a3a3a3]">
          {item.meta}
        </span>
      )}
    </Link>
  );
}

const NAV_SECTIONS: NavMenuSection[] = [
  {
    id: "product",
    label: "Product",
    href: "/#architecture",
    columns: [
      {
        heading: "Explore Orthese",
        primary: true,
        links: [
          { label: "Workspace Canvas", href: "/#workspace-demo" },
          { label: "Shared Context Bus", href: "/#shared-context" },
          { label: "Hybrid AI Routing", href: "/#hybrid-routing" },
          { label: "Extensible Harness", href: "/#base-harness" },
          { label: "Desktop & WASM", href: "/#dual-target" },
        ],
      },
      {
        heading: "Core Pieces",
        links: [
          { label: "Website Builder", href: "/marketplace/orthese.website-builder" },
          { label: "Software Engineer", href: "/marketplace/orthese.software-engineer" },
          { label: "AI Prompt Box", href: "/marketplace/orthese.ai-prompt-box" },
          { label: "Research Canvas", href: "/marketplace/orthese.research-canvas" },
        ],
      },
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    href: "/marketplace",
    matchPrefix: "/marketplace",
    badgeDot: true,
    columns: [
      {
        heading: "Registry & Pricing",
        primary: true,
        links: [
          { label: "Browse All Pieces", href: "/marketplace" },
          { label: "Starter Packs", href: "/marketplace" },
          { label: "Credits & Pricing", href: "/#pricing" },
          { label: "Piece Revenue Share", href: "/docs#piece-sdk" },
        ],
      },
      {
        heading: "Plans & Credits",
        links: [
          { label: "Free Dashboard Forever", href: "/#pricing", meta: "€0" },
          { label: "Starter Top-Up", href: "/#pricing", meta: "€2" },
          { label: "Builder Pack", href: "/#pricing", meta: "€15" },
          { label: "Local CLIProxyAPI", href: "/#hybrid-routing", meta: "Free" },
        ],
      },
    ],
  },
  {
    id: "router",
    label: "Router",
    href: "/router",
    matchPrefix: "/router",
    columns: [
      {
        heading: "Model Routing",
        primary: true,
        links: [
          { label: "Orthese Router", href: "/router" },
          { label: "Auto & Max Modes", href: "/router" },
          { label: "Agent Limits & Budgets", href: "/#hybrid-routing" },
          { label: "Local OAuth Sidecar", href: "/#hybrid-routing" },
        ],
      },
      {
        heading: "Flagship Models",
        links: [
          { label: "Claude Opus 5.5", href: "/router", meta: "Anthropic" },
          { label: "GPT-6.2 Astra", href: "/router", meta: "OpenAI" },
          { label: "Gemini 4 Neon", href: "/router", meta: "Google" },
          { label: "Muse · Wonder Full", href: "/router", meta: "Meta" },
        ],
      },
    ],
  },
  {
    id: "docs",
    label: "Docs",
    href: "/docs",
    matchPrefix: "/docs",
    columns: [
      {
        heading: "Documentation",
        primary: true,
        links: [
          { label: "Quickstart", href: "/docs" },
          { label: "Piece SDK (piece.json)", href: "/docs#piece-sdk" },
          { label: "Shared Context Bus", href: "/docs#context-bus" },
          { label: "Progressive SKILL.md", href: "/docs#skills" },
        ],
      },
      {
        heading: "Runtime & Security",
        links: [
          { label: "Scoped MCP Hub", href: "/docs#mcp" },
          { label: "Permissions & WASM", href: "/docs#permissions" },
          { label: "Orthese Router API", href: "/docs#router" },
          { label: "Desktop GPUI Runtime", href: "/docs#runtime" },
        ],
      },
    ],
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { setCommandOpen, user, authReady, signOut } = useStorefront();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSectionId, setMobileSectionId] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [tickerDismissed, setTickerDismissed] = useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  const activeSection =
    NAV_SECTIONS.find((s) => s.id === activeMenuId) ?? null;

  const cancelCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (id: string) => {
    cancelCloseTimer();
    setAccountMenuOpen(false);
    setActiveMenuId(id);
  };

  const scheduleClose = () => {
    cancelCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveMenuId(null);
    }, 115);
  };

  const closeAll = () => {
    cancelCloseTimer();
    setActiveMenuId(null);
    setMobileOpen(false);
    setMobileSectionId(null);
    setAccountMenuOpen(false);
  };

  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
        setAccountMenuOpen(false);
        setMobileOpen(false);
        setMobileSectionId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelCloseTimer();
    };
  }, []);

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
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [accountMenuOpen]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full bg-gradient-to-b from-[#121212]/95 via-[#121212]/55 to-transparent px-3 pb-3 pt-2.5 sm:px-4 sm:pb-2 sm:pt-3">
        {/* Floating Centered Dock Matching Orthese BoardUI Dark Mode & Composer Geometry */}
        <div
          onMouseLeave={scheduleClose}
          onMouseEnter={cancelCloseTimer}
          className="nav-dither-bezel pointer-events-auto mx-auto w-full max-w-[720px] rounded-[18px] border border-white/[0.09] p-[3.5px] sm:rounded-[20px] sm:p-[4px]"
        >
          <div className="rounded-[14.5px] border border-white/[0.06] bg-[#171717]/95 backdrop-blur-xl sm:rounded-[16px]">
            {/* Primary Row */}
            <div className="flex h-[44px] items-center justify-between gap-2 px-2 sm:px-3">
              {/* Left: Orthese Mark + Wordmark (Geist Sans) */}
              <Link
                href="/"
                onClick={closeAll}
                className="group flex items-center gap-2 rounded-full pl-0.5 pr-2 text-[13.5px] font-medium tracking-[-0.02em] text-[#fafafa] hover:opacity-90 transition-opacity"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-[9px] border border-white/[0.09] bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] group-hover:border-white/[0.18] transition-colors">
                  <svg width="13.5" height="13.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="#FAFAFA" />
                    <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="#FAFAFA" strokeWidth="1.35" />
                    <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="#FAFAFA" strokeWidth="1.35" />
                    <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="#FAFAFA" fillOpacity="0.38" />
                  </svg>
                </span>
                <span>Orthese</span>
              </Link>

              {/* Center: Geist Sans Sentence-Case Tabs */}
              <nav
                className="hidden h-full items-center gap-0.5 md:flex"
                aria-label="Primary"
              >
                {NAV_SECTIONS.map((section) => {
                  const isOpen = activeMenuId === section.id;
                  const isCurrent =
                    section.matchPrefix && pathname?.startsWith(section.matchPrefix);

                  return (
                    <Link
                      key={section.id}
                      href={section.href}
                      data-testid={`nav-tab-${section.id}`}
                      onMouseEnter={() => openMenu(section.id)}
                      onFocus={() => openMenu(section.id)}
                      onClick={closeAll}
                      className={cn(
                        "relative inline-flex h-[30px] items-center rounded-full px-3 text-[12.5px] font-medium tracking-[-0.01em] transition-colors",
                        isOpen
                          ? "bg-white/[0.07] text-[#fafafa]"
                          : isCurrent
                            ? "text-[#fafafa]"
                            : "text-[#a3a3a3] hover:text-[#fafafa]"
                      )}
                    >
                      <span>{section.label}</span>
                      {section.badgeDot && (
                        <span
                          aria-hidden="true"
                          className="ml-1 -mt-2 h-[5px] w-[5px] rounded-full bg-[#818cf8] shadow-[0_0_8px_rgba(129,140,248,0.85)]"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Search + Pill Auth / Launch Orthese + Avatar + Mobile Toggle */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  data-testid="navbar-cmd-btn"
                  onClick={() => {
                    setActiveMenuId(null);
                    setMobileOpen(false);
                    setCommandOpen(true);
                  }}
                  aria-label="Open command palette (⌘K)"
                  title="Search (⌘K)"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#a3a3a3] hover:bg-white/[0.07] hover:text-[#fafafa] transition-colors sm:h-7 sm:w-7 cursor-pointer"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>

                {!authReady ? (
                  <Skeleton rounded="full" className="h-7 w-24" />
                ) : user ? (
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={appUrl}
                      data-testid="navbar-launch-orthese"
                      onClick={closeAll}
                      className="btn-pill-white inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium whitespace-nowrap"
                    >
                      Launch Orthese
                    </Link>

                    <div ref={accountMenuRef} className="relative flex items-center">
                      <button
                        type="button"
                        data-testid="navbar-avatar-btn"
                        onClick={() => {
                          setActiveMenuId(null);
                          setAccountMenuOpen((prev) => !prev);
                        }}
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
                          className="absolute right-0 top-full z-50 mt-2.5 w-60 overflow-hidden rounded-xl border border-white/[0.13] bg-[#1f1f1f]/98 p-1.5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
                        >
                          <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-white/[0.07]">
                            <Avatar name={user.name} src={user.avatarUrl} size="md" status="online" />
                            <div className="min-w-0">
                              <div className="truncate text-[13px] font-medium text-[#fafafa]">
                                {user.name}
                              </div>
                              <div className="truncate text-[11.5px] text-[#8a8a8a]">
                                {user.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between px-2.5 py-2 text-[11.5px] border-b border-white/[0.07]">
                            <span className="inline-flex items-center gap-1.5 text-[#a3a3a3]">
                              <Sparkles className="h-3 w-3 text-[#818cf8]" />
                              <span>{user.plan}</span>
                            </span>
                            <span className="font-mono text-[11.5px] font-medium tabular-nums text-[#fafafa]">
                              {user.credits.toLocaleString()} cr
                            </span>
                          </div>

                          <div className="py-1 space-y-0.5">
                            <Link
                              href={appUrl}
                              onClick={closeAll}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#d4d4d4] hover:bg-white/[0.07] hover:text-[#fafafa] transition-colors"
                            >
                              <Rocket className="h-3.5 w-3.5 text-[#a3a3a3]" />
                              <span>Launch Orthese</span>
                            </Link>
                            <Link
                              href="/router"
                              onClick={closeAll}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#d4d4d4] hover:bg-white/[0.07] hover:text-[#fafafa] transition-colors"
                            >
                              <Route className="h-3.5 w-3.5 text-[#a3a3a3]" />
                              <span>Orthese Router</span>
                            </Link>
                            <Link
                              href="/marketplace"
                              onClick={closeAll}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12.5px] text-[#d4d4d4] hover:bg-white/[0.07] hover:text-[#fafafa] transition-colors"
                            >
                              <Layers className="h-3.5 w-3.5 text-[#a3a3a3]" />
                              <span>Marketplace</span>
                            </Link>
                          </div>

                          <div className="border-t border-white/[0.07] pt-1">
                            <button
                              type="button"
                              data-testid="navbar-signout-btn"
                              onClick={() => {
                                closeAll();
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
                    onClick={closeAll}
                    className="btn-pill-white inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium whitespace-nowrap"
                  >
                    <span className="sm:hidden">Log in</span>
                    <span className="hidden sm:inline">Log in / Sign up</span>
                  </Link>
                )}

                {/* Two-Line Morphing Mobile Menu Toggle */}
                <button
                  type="button"
                  data-testid="mobile-menu-btn"
                  aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileOpen}
                  onClick={() => {
                    setMobileOpen((prev) => !prev);
                    setMobileSectionId(null);
                  }}
                  className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-[#1f1f1f] text-[#d4d4d4] hover:text-[#fafafa] md:hidden cursor-pointer"
                >
                  <span
                    className={cn(
                      "absolute h-[1.5px] w-3.5 rounded-full bg-current transition-transform duration-200",
                      mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-[3px]"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute h-[1.5px] w-3.5 rounded-full bg-current transition-transform duration-200",
                      mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-[3px]"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Desktop Expanding Curtain Mega-Menu Inside the Floating Dock */}
            <AnimatePresence>
              {activeSection && (
                <motion.div
                  key="dock-curtain"
                  data-testid="nav-curtain"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={cancelCloseTimer}
                  className="hidden overflow-hidden border-t border-white/[0.06] md:block"
                >
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-[1.15fr_0.85fr] gap-8 px-5 py-6"
                  >
                    {activeSection.columns.map((col, colIdx) => (
                      <div key={col.heading}>
                        <div className="mb-3 text-[11px] font-medium text-[#737373]">
                          {col.heading}
                        </div>
                        <ul className={cn(col.primary ? "space-y-1.5" : "space-y-2")}>
                          {col.links.map((item, idx) => (
                            <motion.li
                              key={`${col.heading}-${item.label}`}
                              initial={{ opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.16,
                                delay: colIdx * 0.035 + idx * 0.02,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <CurtainNavLink
                                item={item}
                                primary={col.primary}
                                onSelect={closeAll}
                              />
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Expanding Drawer Inside the Floating Dock */}
            <AnimatePresence>
              {mobileOpen && (
                <motion.nav
                  key="mobile-dock-drawer"
                  data-testid="mobile-nav-drawer"
                  aria-label="Mobile navigation"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[calc(100svh-120px)] overflow-y-auto border-t border-white/[0.06] px-3.5 py-4 md:hidden"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setCommandOpen(true);
                    }}
                    className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-left text-[12.5px] text-[#a3a3a3] hover:text-[#fafafa] cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Search className="h-3.5 w-3.5" />
                      <span>Search Pieces, Docs, commands…</span>
                    </span>
                    <kbd className="font-mono text-[10.5px] text-[#737373]">⌘K</kbd>
                  </button>

                  <div className="space-y-0.5">
                    {NAV_SECTIONS.map((section, idx) => {
                      const isExpanded = mobileSectionId === section.id;
                      return (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.16 }}
                          className="border-b border-white/[0.06] py-1.5 last:border-b-0"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setMobileSectionId(isExpanded ? null : section.id)
                            }
                            aria-expanded={isExpanded}
                            className="flex w-full items-center justify-between py-2 text-left text-[16px] font-medium tracking-[-0.02em] text-[#fafafa] cursor-pointer"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <span>{section.label}</span>
                              {section.badgeDot && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#818cf8]" />
                              )}
                            </span>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 text-[#737373] transition-transform duration-200",
                                isExpanded && "rotate-90 text-[#fafafa]"
                              )}
                            />
                          </button>

                          {isExpanded && (
                            <div className="pb-2.5 pt-1 space-y-3.5">
                              {section.columns.map((col) => (
                                <div key={col.heading}>
                                  <div className="mb-1.5 text-[11px] font-medium text-[#737373]">
                                    {col.heading}
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                    {col.links.map((item) => (
                                      <Link
                                        key={`${col.heading}-${item.label}`}
                                        href={item.href}
                                        onClick={closeAll}
                                        className="flex items-center justify-between py-1 text-[14px] text-[#d4d4d4] hover:text-white"
                                      >
                                        <span>{item.label}</span>
                                        {item.meta && (
                                          <span className="font-mono text-[11px] text-[#737373]">
                                            {item.meta}
                                          </span>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Recessed BoardUI Dark-Mode Status Strip Nestled Inside the Floating Dock (sm+ desktop/tablet) */}
            {!tickerDismissed && (
              <div className="hidden px-1.5 pb-1.5 sm:block">
                <div className="flex items-center justify-between gap-2 rounded-[11px] border border-white/[0.06] bg-[#1f1f1f]/85 px-3 py-1">
                  <Link
                    href="/#workspace-demo"
                    onClick={closeAll}
                    className="group flex min-w-0 flex-1 items-center justify-center gap-2 truncate text-[11.5px] text-[#a3a3a3] hover:text-[#fafafa] transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-tr from-[#818cf8] to-[#38bdf8]"
                    />
                    <span className="truncate">
                      <span className="font-medium text-[#e5e5e5]">Orthese v0.1</span>
                      <span className="mx-1.5 text-[#525252]">·</span>
                      <span>Browser WASM &amp; Desktop GPUI</span>
                      <span className="mx-1.5 text-[#525252]">·</span>
                      <span className="text-[#d4d4d4]">€2 free starter credits</span>
                    </span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-[#737373] transition-transform group-hover:translate-x-0.5 group-hover:text-[#fafafa]" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTickerDismissed(true)}
                    aria-label="Dismiss announcement"
                    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[#737373] hover:bg-white/[0.08] hover:text-[#fafafa] transition-colors cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Soft Full-Page Backdrop Blur When Hover Curtain or Mobile Drawer Is Open */}
      <AnimatePresence>
        {(activeSection || mobileOpen) && (
          <motion.div
            key="nav-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAll}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-md"
          />
        )}
      </AnimatePresence>
    </>
  );
}
