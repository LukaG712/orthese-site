"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Compass,
  Globe,
  Laptop,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { DownloadDesktopButton } from "@/components/landing/DownloadDesktopButton";
import {
  Accordion,
  Announcement,
  Breadcrumb,
  Divider,
  Pagination,
  SearchField,
  SegmentedControl,
  Tabs,
  type AccordionEntry,
} from "@/components/primitives/BoardUIPrimitives";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import { cn } from "@/lib/cn";

interface SimpleDocSection {
  id: string;
  label: string;
  group: string;
  keywords: string;
}

const SIMPLE_SECTIONS: SimpleDocSection[] = [
  {
    id: "start",
    label: "Start in 60 seconds",
    group: "Quickstart",
    keywords: "start begin browser desktop download free setup 60 seconds",
  },
  {
    id: "starter-packs",
    label: "Pick a Starter Pack",
    group: "Quickstart",
    keywords: "starter pack web designer daily ai desk indie builder templates",
  },
  {
    id: "how-it-works",
    label: "How tools work together",
    group: "Using Orthese",
    keywords: "pieces panels workflow website builder prompt box copy paste",
  },
  {
    id: "ai-models",
    label: "Choosing an AI model",
    group: "Using Orthese",
    keywords: "models auto fast deep thinking claude gemini gpt router",
  },
  {
    id: "credits-privacy",
    label: "Credits & Privacy",
    group: "Account & Safety",
    keywords: "credits price free polar apple pay bancontact privacy safe files",
  },
  {
    id: "faq",
    label: "Common Questions",
    group: "Account & Safety",
    keywords: "faq questions help coding export zip subscription api key",
  },
];

const SIMPLE_GROUPS = ["Quickstart", "Using Orthese", "Account & Safety"] as const;

type StartWay = "browser" | "desktop";
type ModelPreset = "auto" | "fast" | "deep";

const MODEL_PRESETS: Record<
  ModelPreset,
  {
    title: string;
    badge: string;
    summary: string;
    bestFor: string[];
    costNote: string;
  }
> = {
  auto: {
    title: "Auto: Orthese picks for you",
    badge: "Recommended",
    summary:
      "Leave the model selector on Auto and Orthese automatically matches your request to the right AI: fast models for quick edits, stronger models for big plans.",
    bestFor: [
      "Everyday writing, brainstorming, and summarizing",
      "Building and tweaking landing pages",
      "Keeping your credit balance stretching further",
    ],
    costNote: "Balanced credit usage, and the best default for 90% of work.",
  },
  fast: {
    title: "Fast & Everyday",
    badge: "Snappy replies",
    summary:
      "Optimized for instant back-and-forth when you want rapid drafts, quick layout tweaks, or clean rewrites without waiting.",
    bestFor: [
      "Polishing emails, social copy, and headlines",
      "Quick visual iterations in Website Builder",
      "Turning rough voice notes into structured outlines",
    ],
    costNote: "Lowest credit usage per message.",
  },
  deep: {
    title: "Deep Thinking (Max)",
    badge: "Complex tasks",
    summary:
      "Takes a few extra seconds to reason through multi-step briefs, full site structures, or detailed product specs before answering.",
    bestFor: [
      "Planning a complete multi-section website from scratch",
      "Synthesizing long research documents and comparisons",
      "Auditing an entire workspace or complex brief",
    ],
    costNote: "Uses more credits per turn, ideal when quality matters most.",
  },
};

const SIMPLE_FAQ: AccordionEntry[] = [
  {
    id: "simple-no-code",
    title: "Do I need to know how to code to use Orthese?",
    content: (
      <p>
        Not at all. Everything in the browser workspace and Starter Packs works in plain
        language. Just describe what you want, preview results live, and click to export.
        Developer features stay neatly out of the way until you need them.
      </p>
    ),
  },
  {
    id: "simple-no-sub",
    title: "Is there a monthly subscription?",
    content: (
      <p>
        No. The Orthese workspace is free forever, and every new account starts with €2 in free
        credits so you can try everything right away. If you run low, you can top up once
        (starting at €10) and your credits never expire.
      </p>
    ),
  },
  {
    id: "simple-no-api-keys",
    title: "Do I need to sign up for OpenAI, Claude, or Gemini separately?",
    content: (
      <p>
        No API keys or separate billing portals are required. One Orthese credit balance works
        across all leading AI models automatically. If you already pay for a CLI AI plan and use
        our Desktop app, you can connect it later at zero extra cost.
      </p>
    ),
  },
  {
    id: "simple-export",
    title: "Can I download and host the websites I build?",
    content: (
      <p>
        Yes. Website Builder exports clean, standalone HTML/CSS/JS bundles as a one-click ZIP
        download that you can drop onto any host (Netlify, Vercel, Cloudflare Pages, or your
        own domain) with zero lock-in.
      </p>
    ),
  },
  {
    id: "simple-browser-vs-desktop",
    title: "Should I start in my browser or install the Desktop app?",
    content: (
      <p>
        Start in your browser. It opens in under 10 seconds with nothing to install and works
        great for prompting, writing, research, and Website Builder. Switch to the free Desktop
        app later if you want Orthese to work directly with folders on your computer or run
        offline/local AI models.
      </p>
    ),
  },
];

export function SimpleDocsClient() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/dashboard";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState<string>("start");
  const [startWay, setStartWay] = useState<StartWay>("browser");
  const [modelPreset, setModelPreset] = useState<ModelPreset>("auto");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const elements = SIMPLE_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveSectionId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0.05 }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SIMPLE_SECTIONS;
    return SIMPLE_SECTIONS.filter(
      (sec) =>
        sec.label.toLowerCase().includes(q) ||
        sec.group.toLowerCase().includes(q) ||
        sec.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeSection =
    SIMPLE_SECTIONS.find((s) => s.id === activeSectionId) ?? SIMPLE_SECTIONS[0];
  const activeIndex = Math.max(
    0,
    SIMPLE_SECTIONS.findIndex((s) => s.id === activeSection.id)
  );

  function jumpToSection(id: string) {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  }

  const activePreset = MODEL_PRESETS[modelPreset];

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="mx-auto max-w-[1160px] px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:items-start lg:gap-10">
          {/* FLOATING 260px BOARDUI SIDEBAR */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <div className="flex w-[260px] flex-col rounded-3xl border border-white/[0.08] bg-[#171717] p-3.5 shadow-[0_18px_48px_-14px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]">
              {/* Audience Mode Switcher */}
              <div className="mb-3 grid grid-cols-2 rounded-xl border border-white/[0.08] bg-[#121212] p-0.5 text-[11.5px] font-medium">
                <span
                  aria-current="page"
                  className="inline-flex items-center justify-center rounded-lg border border-white/[0.1] bg-[#262626] py-1.5 text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                >
                  Quickstart
                </span>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-lg py-1.5 text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                >
                  Tech &amp; Pro
                </Link>
              </div>

              {/* Search Field with Kbd hint */}
              <SearchField
                inputRef={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search guide..."
                ariaLabel="Search quickstart guide"
                kbdHint="/"
                size="small"
                shape="rounded"
              />

              {/* Grouped Nav Items */}
              <nav
                aria-label="Quickstart sections"
                className="mt-3.5 space-y-4 pr-0.5"
              >
                {filteredSections.length === 0 ? (
                  <div className="rounded-xl border border-white/[0.06] bg-[#121212] px-3 py-4 text-center">
                    <p className="text-[12px] text-[#737373]">
                      No topics match &ldquo;{searchQuery}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mt-2 font-mono text-[11px] text-[#fafafa] underline decoration-white/25 underline-offset-4 cursor-pointer"
                    >
                      Reset search
                    </button>
                  </div>
                ) : (
                  SIMPLE_GROUPS.map((group) => {
                    const groupItems = filteredSections.filter((s) => s.group === group);
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group}>
                        <div className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                          {group}
                        </div>
                        <ul className="space-y-0.5">
                          {groupItems.map((sec) => {
                            const active = activeSection.id === sec.id;
                            return (
                              <li key={sec.id}>
                                <a
                                  href={`#${sec.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    jumpToSection(sec.id);
                                  }}
                                  aria-current={active ? "location" : undefined}
                                  className={cn(
                                    "flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-[12.5px] transition-colors",
                                    active
                                      ? "bg-white/[0.09] font-medium text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                                      : "text-[#a3a3a3] hover:bg-white/[0.04] hover:text-[#fafafa]"
                                  )}
                                >
                                  <span className="truncate">{sec.label}</span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
                )}
              </nav>

              {/* Tech / Pro Version Callout inside Sidebar */}
              <div className="mt-4 border-t border-white/[0.07] pt-3">
                <Link
                  href="/docs"
                  className="group block rounded-2xl border border-white/[0.08] bg-[#121212] p-3 transition-colors hover:border-white/[0.18]"
                >
                  <div className="flex items-center justify-between text-[12px] font-medium text-[#fafafa]">
                    <span className="inline-flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-[#a3a3a3]" />
                      <span>Tech &amp; Pro Docs</span>
                    </span>
                    <ArrowRight className="h-3 w-3 text-[#737373] transition-transform group-hover:translate-x-0.5 group-hover:text-[#fafafa]" />
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-[#737373]">
                    Piece SDK, CLI commands, piece.json, SKILL.md &amp; MCP Hub.
                  </p>
                </Link>
              </div>
            </div>
          </aside>

          {/* MAIN GUIDE COLUMN */}
          <main className="min-w-0">
            {/* TOP BREADCRUMB + ANNOUNCEMENT */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Breadcrumb
                  items={[
                    { label: "Docs", href: "/docs" },
                    { label: "Quickstart", onClick: () => jumpToSection("start") },
                    { label: activeSection.label },
                  ]}
                />

                {/* Compact Mobile/Desktop Mode Pill */}
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#171717] px-3 py-1 text-[11.5px] font-medium text-[#d4d4d4] transition-colors hover:border-white/[0.2] hover:text-[#fafafa]"
                >
                  <Code2 className="h-3 w-3 text-[#a3a3a3]" />
                  <span>Tech &amp; Pro version</span>
                  <ArrowRight className="h-3 w-3 text-[#737373]" />
                </Link>
              </div>

              <Announcement
                badge="No code"
                title="Built for everyday work, with no terminal or API keys needed."
                description="Start free in your browser with €2 starter credits."
                actionLabel="Tech & Pro Docs"
                actionHref="/docs"
              />
            </div>

            {/* EDITORIAL HEADER */}
            <header className="mt-7 pb-8">
              <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                <BookOpen className="h-3.5 w-3.5 text-[#a3a3a3]" />
                <span>Non-Technical Quickstart</span>
              </div>
              <h1 className="mt-2.5 text-3xl font-medium tracking-[-0.04em] leading-[1.08] text-[#fafafa] sm:text-[42px]">
                Get started with <OrbitGradientText>Orthese.</OrbitGradientText>
              </h1>
              <p className="mt-3.5 max-w-2xl text-[14.5px] leading-relaxed text-[#a3a3a3] sm:text-[15.5px]">
                A calm, jargon-free guide to building websites, organizing research, and working
                with AI side by side, all in one clean workspace.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={appUrl}
                  className="bg-button-primary inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13.5px] font-medium"
                >
                  <span>Launch in Browser</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/docs"
                  className="bg-button-secondary inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13.5px] font-medium"
                >
                  <Code2 className="h-3.5 w-3.5 text-[#a3a3a3]" />
                  <span>Switch to Tech &amp; Pro Docs</span>
                </Link>
              </div>

              {/* Mobile Search + Jump Chips */}
              <div className="mt-6 space-y-2.5 lg:hidden">
                <SearchField
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search quickstart..."
                  ariaLabel="Search quickstart guide"
                  size="small"
                />
                <nav
                  aria-label="Jump to section"
                  className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1"
                >
                  {filteredSections.map((sec) => {
                    const active = activeSection.id === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          jumpToSection(sec.id);
                        }}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                          active
                            ? "border-white/20 bg-white/[0.1] font-medium text-[#fafafa]"
                            : "border-white/[0.09] bg-[#171717] text-[#a3a3a3] hover:text-[#fafafa]"
                        )}
                      >
                        {sec.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </header>

            <Divider />

            <div className="mt-10 space-y-14">
              {/* 1. START IN 60 SECONDS */}
              <section id="start" className="scroll-mt-24 space-y-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                      01 · Quickstart
                    </span>
                    <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                      Start in 60 seconds
                    </h2>
                  </div>

                  <SegmentedControl<StartWay>
                    ariaLabel="Choose how to run Orthese"
                    value={startWay}
                    onChange={setStartWay}
                    options={[
                      { id: "browser", label: "In your browser", meta: "Zero install" },
                      { id: "desktop", label: "Desktop App", meta: "Mac · Win · Linux" },
                    ]}
                  />
                </div>

                <motion.div
                  key={startWay}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {(startWay === "browser"
                      ? [
                          {
                            step: "Step 1",
                            title: "Open Orthese in your browser",
                            body: "Click Launch in Browser. It runs immediately in Chrome, Safari, or Firefox with €2 free starter credits and no downloads.",
                          },
                          {
                            step: "Step 2",
                            title: "Pick a ready-made Starter Pack",
                            body: "Choose Web Designer or Daily AI Desk so your prompt box and preview panels are already arranged for you.",
                          },
                          {
                            step: "Step 3",
                            title: "Describe what you want",
                            body: "Type in plain English (or use the microphone). Preview live changes and download your finished work in one click.",
                          },
                        ]
                      : [
                          {
                            step: "Step 1",
                            title: "Download the free Desktop App",
                            body: "Install Orthese for macOS, Windows, or Linux. Your workspace opens natively at 120fps.",
                          },
                          {
                            step: "Step 2",
                            title: "Choose a folder on your computer",
                            body: "Optionally point Orthese to a project folder. It always shows a clear preview and asks before editing any file.",
                          },
                          {
                            step: "Step 3",
                            title: "Work with credits or local AI",
                            body: "Use simple non-expiring credits, or connect your existing AI subscriptions on Desktop at zero extra cost.",
                          },
                        ]
                    ).map((item) => (
                      <div
                        key={item.step}
                        className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      >
                        <span className="inline-flex rounded-full border border-white/[0.1] bg-[#121212] px-2.5 py-0.5 font-mono text-[10.5px] text-[#a3a3a3]">
                          {item.step}
                        </span>
                        <h3 className="mt-3 text-[15px] font-medium text-[#fafafa]">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[#a3a3a3]">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Contextual Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#161618] px-5 py-4">
                    <div className="flex items-center gap-2.5 text-[13px] text-[#d4d4d4]">
                      {startWay === "browser" ? (
                        <Globe className="h-4 w-4 text-[#fafafa]" />
                      ) : (
                        <Laptop className="h-4 w-4 text-[#fafafa]" />
                      )}
                      <span>
                        {startWay === "browser"
                          ? "Ready now: no account setup needed to preview the workspace."
                          : "Free forever for macOS (Apple Silicon), Windows, and Linux."}
                      </span>
                    </div>

                    {startWay === "browser" ? (
                      <Link
                        href={appUrl}
                        className="bg-button-primary inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13px] font-medium"
                      >
                        <span>Open Browser Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <DownloadDesktopButton />
                    )}
                  </div>
                </motion.div>
              </section>

              <Divider />

              {/* 2. PICK A STARTER PACK */}
              <section id="starter-packs" className="scroll-mt-24 space-y-5">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    02 · Ready-Made Workspaces
                  </span>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    Pick a Starter Pack
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#a3a3a3]">
                    Instead of starting from an empty screen, choose a Starter Pack tailored to
                    what you&apos;re making today. All official packs are free.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    {
                      id: "pack.web-designer",
                      name: "Web Designer",
                      audience: "Sites & landing pages",
                      where: "Browser & Desktop",
                      icon: LayoutGrid,
                      desc: "Describe a page on the left, see the live website update on the right, and download a clean ZIP when ready.",
                    },
                    {
                      id: "pack.daily-ai-desk",
                      name: "Daily AI Desk",
                      audience: "Writing & research",
                      where: "Browser & Desktop",
                      icon: Compass,
                      desc: "Pair fast AI chat with a clean notes & research canvas for briefs, articles, and meeting summaries.",
                    },
                    {
                      id: "pack.indie-builder",
                      name: "Indie Builder",
                      audience: "Full product launches",
                      where: "Desktop App",
                      icon: Wand2,
                      desc: "Combine prompting, website previews, and code editing side by side when launching a product solo.",
                    },
                  ].map((pack) => {
                    const Icon = pack.icon;
                    return (
                      <Link
                        key={pack.id}
                        href={`/marketplace/${pack.id}`}
                        className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#171717] p-5 transition-colors hover:border-white/[0.18] hover:bg-[#1a1a1d]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-[#121212]">
                              <Icon className="h-4 w-4 text-[#d4d4d4]" />
                            </span>
                            <span className="rounded-full border border-white/[0.08] bg-[#121212] px-2.5 py-0.5 font-mono text-[10px] text-[#a3a3a3]">
                              Free
                            </span>
                          </div>

                          <h3 className="mt-4 text-[15.5px] font-medium text-[#fafafa]">
                            {pack.name}
                          </h3>
                          <div className="mt-0.5 text-[12px] text-[#737373]">
                            {pack.audience}
                          </div>
                          <p className="mt-2.5 text-[13px] leading-relaxed text-[#a3a3a3]">
                            {pack.desc}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11.5px]">
                          <span className="font-mono text-[#737373]">{pack.where}</span>
                          <span className="inline-flex items-center gap-1 font-medium text-[#d4d4d4] group-hover:text-[#fafafa]">
                            <span>Open pack</span>
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <Divider />

              {/* 3. HOW TOOLS WORK TOGETHER */}
              <section id="how-it-works" className="scroll-mt-24 space-y-5">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    03 · Modular Panels
                  </span>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    How tools work together (without copy-pasting)
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#a3a3a3]">
                    In Orthese, each tool on your screen is called a{" "}
                    <strong className="font-medium text-[#fafafa]">Piece</strong>. Because your
                    Pieces share one workspace, your ideas move between them automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    {
                      num: "1",
                      title: "Write your idea once",
                      body: "Draft a brief, outline, or rough prompt inside AI Prompt Box, or attach images and documents.",
                    },
                    {
                      num: "2",
                      title: "Send straight to another panel",
                      body: "Your structured brief flows automatically into Website Builder or Research Canvas with zero copy-paste.",
                    },
                    {
                      num: "3",
                      title: "Refine & export",
                      body: "Ask for visual or wording tweaks in plain English, then download your finished page or notes.",
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.12] bg-[#121212] font-mono text-[11px] font-medium text-[#fafafa]">
                        {step.num}
                      </span>
                      <h3 className="mt-3 text-[14.5px] font-medium text-[#fafafa]">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#a3a3a3]">
                        {step.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <Divider />

              {/* 4. CHOOSING AN AI MODEL (BOARDUI TABS) */}
              <section id="ai-models" className="scroll-mt-24 space-y-5">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    04 · Smart AI Selection
                  </span>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    Choosing an AI model
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#a3a3a3]">
                    You don&apos;t need to memorize model names. Pick the style of help you want
                    and Orthese handles the rest:
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <Tabs<ModelPreset>
                    ariaLabel="AI model presets"
                    value={modelPreset}
                    onChange={setModelPreset}
                    options={[
                      { id: "auto", label: "Auto", badge: "Best" },
                      { id: "fast", label: "Fast" },
                      { id: "deep", label: "Deep Thinking" },
                    ]}
                  />

                  <motion.div
                    key={modelPreset}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[16px] font-medium text-[#fafafa]">
                        {activePreset.title}
                      </h3>
                      <span className="rounded-full border border-white/[0.1] bg-[#121212] px-2.5 py-0.5 font-mono text-[10.5px] text-[#d4d4d4]">
                        {activePreset.badge}
                      </span>
                    </div>

                    <p className="mt-2 text-[13.5px] leading-relaxed text-[#a3a3a3]">
                      {activePreset.summary}
                    </p>

                    <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                      {activePreset.bestFor.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-[13px] text-[#d4d4d4]"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fafafa]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-3.5 text-[12px] text-[#737373]">
                      <span>{activePreset.costNote}</span>
                      <Link
                        href="/router"
                        className="inline-flex items-center gap-1 font-medium text-[#d4d4d4] hover:text-[#fafafa]"
                      >
                        <span>Compare all 44 models</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </section>

              <Divider />

              {/* 5. CREDITS & PRIVACY */}
              <section id="credits-privacy" className="scroll-mt-24 space-y-5">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    05 · Account &amp; Safety
                  </span>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    Simple Credits &amp; Clear Privacy
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Sparkles,
                      title: "Free dashboard forever",
                      body: "Start with €2 in free starter credits. No credit card required to open the workspace.",
                    },
                    {
                      icon: Check,
                      title: "Credits never expire",
                      body: "Top up €10, €25, or €50 whenever you need. Zero monthly bills or wasted balances.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "Always ask first",
                      body: "Browser tools stay safely sandboxed. On Desktop, Orthese asks your permission before editing files.",
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-white/[0.08] bg-[#171717] p-5"
                      >
                        <Icon className="h-4 w-4 text-[#fafafa]" />
                        <h3 className="mt-3 text-[14.5px] font-medium text-[#fafafa]">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[#a3a3a3]">
                          {card.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <p className="font-mono text-[11.5px] text-[#737373]">
                  Powered by Polar · Apple Pay · Google Pay · Bancontact · Credits never expire
                </p>
              </section>

              <Divider label="Common Questions" />

              {/* 6. COMMON QUESTIONS ACCORDION */}
              <section id="faq" className="scroll-mt-24 space-y-4">
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
                    06 · FAQ
                  </span>
                  <h2 className="mt-1.5 text-[23px] font-medium tracking-[-0.025em] text-[#fafafa]">
                    Common Questions
                  </h2>
                </div>

                <Accordion
                  items={SIMPLE_FAQ}
                  variant="separated"
                  indicator="plus"
                  defaultExpandedIds={["simple-no-code"]}
                />
              </section>

              {/* TECH & PRO DOCS HANDOFF CARD */}
              <section className="rounded-3xl border border-white/[0.09] bg-[#161618] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="max-w-lg">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-[#121212] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#a3a3a3]">
                      <Code2 className="h-3 w-3 text-[#d4d4d4]" />
                      <span>Developers &amp; Power Users</span>
                    </span>
                    <h2 className="mt-3 text-[21px] font-medium tracking-[-0.025em] text-[#fafafa]">
                      Ready for the Tech &amp; Pro version?
                    </h2>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3a3a3]">
                      Explore the full technical reference: CLI commands (
                      <code className="font-mono text-[12px] text-[#d4d4d4]">pnpm</code> /{" "}
                      <code className="font-mono text-[12px] text-[#d4d4d4]">npx skills</code>),
                      monorepo layout, <code className="font-mono text-[12px] text-[#d4d4d4]">piece.json</code>{" "}
                      SDK manifests, scoped MCP permissions, and Rust/GPUI architecture.
                    </p>
                  </div>

                  <Link
                    href="/docs"
                    className="bg-button-primary inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[13.5px] font-medium"
                  >
                    <span>Open Tech &amp; Pro Docs</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </section>

              {/* BOTTOM DIVIDER + PAGINATION */}
              <div className="space-y-6 pt-2">
                <Divider />
                <Pagination
                  pages={SIMPLE_SECTIONS.map((s) => ({
                    id: s.id,
                    label: s.label,
                    group: s.group,
                  }))}
                  currentIndex={activeIndex}
                  onSelectPage={(idx) => {
                    const target = SIMPLE_SECTIONS[idx];
                    if (target) jumpToSection(target.id);
                  }}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
