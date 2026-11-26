"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, FileCode2, Globe, Sparkles, Terminal } from "lucide-react";
import { cn } from "@/lib/cn";
import { useStorefront } from "./StorefrontContext";

const PIECES_MENU = [
  {
    href: "/marketplace/orthese.website-builder",
    title: "Website Builder",
    desc: "Live preview + standalone HTML/ZIP export",
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
    desc: "Local repo diffs, shell guardrails & MCP",
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
    <header className="sticky top-0 z-40 h-14 w-full border-b border-white/[0.06] bg-[#060607]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6 sm:px-8">
        {/* Left: Crisp Orthese Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[14px] font-medium tracking-[-0.02em] text-[#fafafa]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-white/[0.14] bg-[#111113] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-colors group-hover:border-white/25">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#FAFAFA" />
              <rect x="9" y="2" width="5" height="5" rx="1" stroke="#FAFAFA" strokeWidth="1.5" />
              <rect x="2" y="9" width="5" height="5" rx="1" stroke="#FAFAFA" strokeWidth="1.5" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#FAFAFA" fillOpacity="0.4" />
            </svg>
          </span>
          <span>Orthese</span>
        </Link>

        {/* Center: Primary Navigation */}
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
              className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-[13px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer"
            >
              <span>Pieces</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-[#52525b] transition-transform duration-150",
                  piecesOpen && "rotate-180 text-[#a1a1aa]"
                )}
              />
            </button>

            <AnimatePresence>
              {piecesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  style={{ transformOrigin: "top center" }}
                  className="absolute left-1/2 top-full pt-2.5 -translate-x-1/2 w-[336px]"
                >
                  <div className="obsidian-surface rounded-xl border border-white/[0.1] p-1.5 backdrop-blur-xl">
                    {PIECES_MENU.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setPiecesOpen(false)}
                          className="flex items-start gap-3 rounded-lg px-2.5 py-2 hover:bg-white/[0.05] transition-colors"
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[13px] font-medium text-[#fafafa]">
                              {item.title}
                            </span>
                            <span className="block text-[12px] text-[#a1a1aa]">
                              {item.desc}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/marketplace"
            className={cn(
              "inline-flex h-8 items-center rounded-md px-3 text-[13px] transition-colors",
              pathname?.startsWith("/marketplace")
                ? "text-[#fafafa] font-medium"
                : "text-[#a1a1aa] hover:text-[#fafafa]"
            )}
          >
            Marketplace
          </Link>

          <Link
            href="/#architecture"
            className="inline-flex h-8 items-center rounded-md px-3 text-[13px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          >
            Architecture
          </Link>

          <Link
            href="/#pricing"
            className="inline-flex h-8 items-center rounded-md px-3 text-[13px] text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          >
            Pricing
          </Link>
        </nav>

        {/* Right: Clickable Cmd+K Keycap + High-Contrast Launch App */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Open command palette"
            className="inline-flex h-8 items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 text-[12px] text-[#a1a1aa] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/[0.16] hover:text-[#fafafa] transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">Search</span>
            <kbd className="rounded border border-white/[0.08] bg-[#060607] px-1 py-0.5 font-mono text-[10px] leading-none text-[#a1a1aa]">
              ⌘K
            </kbd>
          </button>

          <Link
            href={appUrl}
            className="btn-primary inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium"
          >
            <span>Launch App</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
