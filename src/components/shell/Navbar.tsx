"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronDown, Search, Sparkles, Terminal, Globe, FileCode2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useStorefront } from "./StorefrontContext";

const PIECES_MENU = [
  {
    href: "/marketplace/orthese.website-builder",
    title: "Website Builder",
    desc: "Flagship live-preview + ZIP export Piece",
    icon: Globe,
  },
  {
    href: "/marketplace/orthese.ai-prompt-box",
    title: "AI Prompt Box",
    desc: "Multi-model chat + Shared Context Bus",
    icon: Sparkles,
  },
  {
    href: "/marketplace/orthese.software-engineer",
    title: "Software Engineer",
    desc: "Desktop repo diffs, shell guardrails & MCP",
    icon: Terminal,
  },
  {
    href: "/marketplace?tab=skill",
    title: "Skills (SKILL.md)",
    desc: "Portable capability packs loaded on demand",
    icon: FileCode2,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { setCommandOpen } = useStorefront();
  const [piecesOpen, setPiecesOpen] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/#workspace-demo";

  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.16] bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors group-hover:border-white/30">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#FAFAFA" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="#FAFAFA" strokeWidth="1.4" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="#FAFAFA" strokeWidth="1.4" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#FAFAFA" fillOpacity="0.45" />
            </svg>
          </span>
          <span className="tracking-[-0.02em]">Orthese</span>
          <span className="hidden rounded border border-white/[0.1] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] font-normal text-zinc-400 sm:inline-block">
            v0.1
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setPiecesOpen(true)}
            onMouseLeave={() => setPiecesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setPiecesOpen((o) => !o)}
              aria-expanded={piecesOpen}
              className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer"
            >
              <span>Pieces</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-zinc-500 transition-transform duration-150",
                  piecesOpen && "rotate-180 text-zinc-200"
                )}
              />
            </button>

            <div
              data-open={piecesOpen ? "true" : "false"}
              className="t-menu-dropdown absolute left-1/2 top-full pt-2 -translate-x-1/2 w-[340px]"
            >
              <div className="rounded-xl border border-white/[0.1] bg-[#111111]/95 p-1.5 shadow-2xl backdrop-blur-xl shadow-black/70">
                {PIECES_MENU.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setPiecesOpen(false)}
                      className="flex items-start gap-3 rounded-lg px-2.5 py-2 hover:bg-white/[0.05] transition-colors"
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.09] bg-white/[0.03] text-zinc-200">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-zinc-100">
                          {item.title}
                        </span>
                        <span className="block text-[11px] text-zinc-400">
                          {item.desc}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            href="/marketplace"
            className={cn(
              "inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors",
              pathname?.startsWith("/marketplace")
                ? "bg-white/[0.06] text-white"
                : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            Marketplace
          </Link>

          <Link
            href="/#architecture"
            className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            Architecture
          </Link>

          <Link
            href="/#pricing"
            className="inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-zinc-300 hover:bg-white/[0.04] hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right: Cmd+K + Launch CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="inline-flex h-8 items-center gap-2 rounded-md border border-white/[0.09] bg-white/[0.03] px-2.5 text-xs text-zinc-400 hover:border-white/[0.18] hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="rounded border border-white/[0.1] bg-black/50 px-1 py-0.2 font-mono text-[10px] text-zinc-400">
              ⌘K
            </kbd>
          </button>

          <Link
            href={appUrl}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-xs font-medium text-black hover:bg-zinc-200 transition-colors"
          >
            <span>Launch App</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
