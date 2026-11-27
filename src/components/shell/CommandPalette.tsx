"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  CreditCard,
  Layers,
  LogIn,
  LogOut,
  Rocket,
  Route,
  Search,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CREDIT_PACKS, MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { useStorefront } from "./StorefrontContext";

interface PaletteItem {
  id: string;
  section: string;
  title: string;
  description?: string;
  keywords: string;
  shortcut?: string[];
  badge?: string;
  icon: ReactNode;
  onSelect: () => void;
}

function normalizeText(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function CommandPalette() {
  const router = useRouter();
  const {
    commandOpen,
    setCommandOpen,
    openCheckout,
    user,
    signInWithSocial,
    signOut,
  } = useStorefront();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  const closePalette = () => {
    setCommandOpen(false);
    setQuery("");
    setActiveIndex(0);
    requestAnimationFrame(() => previousFocusRef.current?.focus());
  };

  useEffect(() => {
    if (commandOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [commandOpen]);

  const allItems = useMemo<PaletteItem[]>(() => {
    const go = (href: string) => {
      setCommandOpen(false);
      setQuery("");
      router.push(href);
    };

    const navItems: PaletteItem[] = [
      {
        id: "nav-launch",
        section: "Quick Actions",
        title: "Launch Orthese",
        description: "Jump straight into the interactive browser workspace",
        keywords: "launch orthese browser wasm workspace canvas demo app",
        shortcut: ["G", "L"],
        icon: <Rocket className="h-3.5 w-3.5 text-[#818cf8]" />,
        onSelect: () => go(appUrl),
      },
      {
        id: "nav-router",
        section: "Navigate",
        title: "Orthese Router",
        description: "Auto model selection, token savings & 44 real models",
        keywords: "router auto model selection savings routing credits cliproxy",
        shortcut: ["G", "R"],
        icon: <Route className="h-3.5 w-3.5 text-sky-400" />,
        onSelect: () => go("/router"),
      },
      {
        id: "nav-marketplace",
        section: "Navigate",
        title: "Open Marketplace",
        description: "Browse Pieces, progressive Skills & Starter Packs",
        keywords: "browse marketplace registry pieces skills starter packs",
        shortcut: ["G", "M"],
        icon: <Layers className="h-3.5 w-3.5 text-[#a1a6b0]" />,
        onSelect: () => go("/marketplace"),
      },
      {
        id: "nav-docs",
        section: "Navigate",
        title: "Documentation",
        description: "Quickstart, Piece SDK (piece.json), SKILL.md & MCP Hub",
        keywords: "docs documentation quickstart piece sdk manifest skill md mcp",
        shortcut: ["G", "D"],
        icon: <BookOpen className="h-3.5 w-3.5 text-emerald-400" />,
        onSelect: () => go("/docs"),
      },
      {
        id: "nav-pricing",
        section: "Navigate",
        title: "Credits & Pricing",
        description: "Non-expiring top-ups starting at €2 with no subscription",
        keywords: "pricing credits billing starter free",
        shortcut: ["G", "P"],
        icon: <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />,
        onSelect: () => go("/#pricing"),
      },
    ];

    const accountItems: PaletteItem[] = user
      ? [
          {
            id: "acc-signout",
            section: "Account",
            title: `Sign out (${user.name})`,
            description: `${user.email} · ${user.credits.toLocaleString()} cr`,
            keywords: "sign out logout account profile session",
            icon: <LogOut className="h-3.5 w-3.5 text-rose-300" />,
            onSelect: () => {
              setCommandOpen(false);
              signOut();
              toast.info("Signed out of Orthese");
            },
          },
        ]
      : [
          {
            id: "acc-login",
            section: "Account",
            title: "Log in to Orthese",
            description: "Continue with Google, GitHub, Apple, Discord or email",
            keywords: "log in login sign in account auth",
            shortcut: ["G", "A"],
            icon: <LogIn className="h-3.5 w-3.5 text-emerald-400" />,
            onSelect: () => go("/auth"),
          },
          {
            id: "acc-signup",
            section: "Account",
            title: "Create an account",
            description: "Start free with €2 starter credits — no card required",
            keywords: "sign up signup register create account free",
            icon: <UserPlus className="h-3.5 w-3.5 text-indigo-300" />,
            onSelect: () => go("/auth?mode=signup"),
          },
          {
            id: "acc-google-quick",
            section: "Account",
            title: "Quick sign in with Google",
            description: "One-click OAuth session preview",
            keywords: "google oauth social login quick",
            icon: <Sparkles className="h-3.5 w-3.5 text-sky-300" />,
            onSelect: () => {
              setCommandOpen(false);
              const acc = signInWithSocial("google");
              toast.success(`Signed in as ${acc.name}`, {
                description: "Authenticated with Google",
              });
            },
          },
        ];

    const marketplaceItems: PaletteItem[] = MARKETPLACE_ITEMS.map((item) => ({
      id: `mkt-${item.id}`,
      section: "Pieces, Skills & Starter Packs",
      title: item.name,
      description: item.id,
      keywords: `${item.name} ${item.id} ${item.kind} ${item.tags.join(" ")}`,
      badge: item.kind,
      icon: <AssetIcon name={item.icon} className="h-3.5 w-3.5 text-[#8a8f98]" />,
      onSelect: () => go(`/marketplace/${item.id}`),
    }));

    const creditItems: PaletteItem[] = CREDIT_PACKS.filter(
      (p) => p.priceEur > 0
    ).map((pack) => ({
      id: `pack-${pack.id}`,
      section: "Credit Packs",
      title: pack.name,
      description: `${pack.credits.toLocaleString()} Orthese Credits · Never expires`,
      keywords: `${pack.name} pricing credits ${pack.priceEur} top up`,
      badge: `€${pack.priceEur}`,
      icon: <CreditCard className="h-3.5 w-3.5 text-[#8a8f98]" />,
      onSelect: () => {
        setCommandOpen(false);
        openCheckout({
          id: pack.id,
          title: pack.name,
          subtitle: `${pack.credits.toLocaleString()} Orthese Credits · Never expires`,
          priceEur: pack.priceEur,
          credits: pack.credits,
        });
      },
    }));

    return [...navItems, ...accountItems, ...marketplaceItems, ...creditItems];
  }, [router, setCommandOpen, openCheckout, user, signInWithSocial, signOut, appUrl]);

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    if (!q) return allItems;
    const tokens = q.split(/\s+/).filter(Boolean);
    return allItems.filter((item) => {
      const hay = normalizeText(
        `${item.title} ${item.description ?? ""} ${item.keywords} ${item.section}`
      );
      return tokens.every((tok) => hay.includes(tok));
    });
  }, [allItems, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, PaletteItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.section) ?? [];
      arr.push(item);
      map.set(item.section, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep highlighted row scrolled smoothly into view
  useEffect(() => {
    if (!commandOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-palette-idx="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, commandOpen]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (query.length > 0) {
        setQuery("");
      } else {
        closePalette();
      }
      return;
    }

    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target) target.onSelect();
    }
  }

  if (typeof document === "undefined") return null;

  let runningIdx = 0;

  return createPortal(
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          key="palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          data-testid="command-palette-overlay"
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/75 px-4 pt-[12vh] backdrop-blur-md"
          onClick={closePalette}
        >
          <motion.div
            key="palette-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Orthese Command Palette"
            data-testid="command-palette"
            initial={{ opacity: 0, scale: 0.96, y: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, y: -6, filter: "blur(3px)" }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[580px] overflow-hidden rounded-2xl border border-white/[0.13] bg-[#111217]/98 shadow-[0_32px_96px_-18px_rgba(0,0,0,0.96),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl"
          >
            {/* Search Row */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
              <Search className="h-4 w-4 shrink-0 text-[#6e737d]" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="orthese-palette-list"
                aria-activedescendant={
                  filtered[activeIndex]
                    ? `palette-item-${filtered[activeIndex].id}`
                    : undefined
                }
                data-testid="command-palette-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search Pieces, Skills, accounts…"
                className="h-12 w-full bg-transparent text-[14px] text-[#f7f8f8] placeholder:text-[#686d76] focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#6e737d] hover:bg-white/[0.08] hover:text-[#f7f8f8] transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={closePalette}
                  className="shrink-0 rounded-md border border-white/[0.1] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-[#7e8490] hover:text-[#f7f8f8] transition-colors cursor-pointer"
                >
                  Esc
                </button>
              )}
            </div>

            {/* Scrolling Command List */}
            <div
              id="orthese-palette-list"
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="max-h-[380px] overflow-y-auto p-2"
            >
              {grouped.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-[13px] font-medium text-[#c4c8d0]">
                    No commands match &ldquo;{query}&rdquo;
                  </p>
                  <p className="mt-1 text-[12px] text-[#686d76]">
                    Try searching for Router, Marketplace, Website Builder, or Log in.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {grouped.map(([section, items]) => (
                    <div key={section} role="group" aria-label={section}>
                      <div className="px-2.5 pb-1 pt-1 text-[11px] font-medium text-[#6e737d]">
                        {section}
                      </div>
                      <div className="space-y-0.5">
                        {items.map((item) => {
                          const idx = runningIdx++;
                          const isActive = idx === activeIndex;
                          return (
                            <button
                              key={item.id}
                              id={`palette-item-${item.id}`}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              data-palette-idx={idx}
                              onMouseEnter={() => setActiveIndex(idx)}
                              onClick={() => item.onSelect()}
                              className={cn(
                                "flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer",
                                isActive
                                  ? "bg-white/[0.08] text-[#f7f8f8]"
                                  : "text-[#c4c8d0] hover:bg-white/[0.05]"
                              )}
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                    isActive
                                      ? "border-white/[0.14] bg-white/[0.07]"
                                      : "border-white/[0.06] bg-white/[0.025]"
                                  )}
                                >
                                  {item.icon}
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-[13px] font-medium text-[#f7f8f8]">
                                    {item.title}
                                  </span>
                                  {item.description && (
                                    <span className="block truncate text-[11.5px] text-[#6e737d]">
                                      {item.description}
                                    </span>
                                  )}
                                </span>
                              </span>

                              <span className="flex shrink-0 items-center gap-1.5">
                                {item.badge && (
                                  <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10.5px] capitalize text-[#9ba1ab]">
                                    {item.badge}
                                  </span>
                                )}
                                {item.shortcut && (
                                  <span className="hidden sm:inline-flex items-center gap-1">
                                    {item.shortcut.map((key) => (
                                      <kbd
                                        key={key}
                                        className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#8a8f98]"
                                      >
                                        {key}
                                      </kbd>
                                    ))}
                                  </span>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Keyboard Hints */}
            <div className="flex items-center justify-between gap-2 border-t border-white/[0.07] bg-white/[0.015] px-4 py-2 text-[11px] text-[#6e737d]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.2 font-mono text-[9.5px] text-[#9ba1ab]">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.2 font-mono text-[9.5px] text-[#9ba1ab]">
                    ↵
                  </kbd>
                  <span>Select</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.2 font-mono text-[9.5px] text-[#9ba1ab]">
                    Esc
                  </kbd>
                  <span>{query ? "Clear" : "Close"}</span>
                </span>
              </div>
              <span className="font-mono text-[10.5px] tabular-nums text-[#5e626a]">
                {filtered.length} {filtered.length === 1 ? "result" : "results"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
