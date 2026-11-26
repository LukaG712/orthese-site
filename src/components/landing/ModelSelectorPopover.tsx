"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ProviderId =
  | "router"
  | "anthropic"
  | "openai"
  | "google"
  | "deepseek"
  | "cliproxy";

export type EffortLevel = "Low" | "Medium" | "High" | "Max";

export interface RealModelSpec {
  id: string;
  name: string;
  provider: ProviderId;
  providerLabel: string;
  baseCostCr: number;
  supportsEffort: boolean;
  defaultEffort: EffortLevel;
  badge?: string;
}

export const EFFORT_LEVELS: {
  id: EffortLevel;
  hint: string;
  multiplier: number;
}[] = [
  { id: "Low", hint: "Fastest · lowest token use", multiplier: 0.75 },
  { id: "Medium", hint: "Balanced depth & speed", multiplier: 1 },
  { id: "High", hint: "Extended multi-step thinking", multiplier: 1.4 },
  { id: "Max", hint: "Deepest architecture & audits", multiplier: 1.8 },
];

export const PROVIDERS: { id: ProviderId; label: string }[] = [
  { id: "router", label: "Orthese Router" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openai", label: "OpenAI" },
  { id: "google", label: "Google" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "cliproxy", label: "CLIProxyAPI Local" },
];

export const REAL_MODELS: RealModelSpec[] = [
  // Orthese Router
  {
    id: "orthese-router",
    name: "Orthese Router",
    provider: "router",
    providerLabel: "Orthese Auto",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
    badge: "Auto",
  },
  {
    id: "orthese-router-frontier",
    name: "Orthese Router Max",
    provider: "router",
    providerLabel: "Orthese Auto",
    baseCostCr: 4,
    supportsEffort: true,
    defaultEffort: "High",
  },
  // Anthropic
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    providerLabel: "Anthropic",
    baseCostCr: 3,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "anthropic",
    providerLabel: "Anthropic",
    baseCostCr: 6,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    providerLabel: "Anthropic",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // OpenAI
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 3,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "gpt-5.2-pro",
    name: "GPT-5.2 Pro",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 6,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "gpt-5.2-mini",
    name: "GPT-5.2 Mini",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 1,
    supportsEffort: true,
    defaultEffort: "Low",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  // Google
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    providerLabel: "Google",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    providerLabel: "Google",
    baseCostCr: 1,
    supportsEffort: true,
    defaultEffort: "Low",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "google",
    providerLabel: "Google",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // DeepSeek
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "deepseek-v3.1",
    name: "DeepSeek V3.1",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
  // Local CLIProxyAPI
  {
    id: "cliproxy-claude",
    name: "Claude Code OAuth",
    provider: "cliproxy",
    providerLabel: "CLIProxyAPI · €0",
    baseCostCr: 0,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "cliproxy-codex",
    name: "Codex CLI OAuth",
    provider: "cliproxy",
    providerLabel: "CLIProxyAPI · €0",
    baseCostCr: 0,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "cliproxy-gemini",
    name: "Gemini CLI OAuth",
    provider: "cliproxy",
    providerLabel: "CLIProxyAPI · €0",
    baseCostCr: 0,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
];

export function ProviderGlyph({
  provider,
  className = "h-4 w-4",
}: {
  provider: ProviderId;
  className?: string;
}) {
  if (provider === "router") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <rect x="1.8" y="1.8" width="5" height="5" rx="1.2" fill="currentColor" />
        <rect
          x="9.2"
          y="1.8"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect
          x="1.8"
          y="9.2"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect x="9.2" y="9.2" width="5" height="5" rx="1.2" fill="currentColor" fillOpacity="0.45" />
      </svg>
    );
  }
  if (provider === "anthropic") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path
          d="M8 1.6v12.8M1.6 8h12.8M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (provider === "openai") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M8 2.4v5.6l4.6 2.8M8 8L3.4 10.8M5.2 4.1l5.6 3.2"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (provider === "google") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path
          d="M8 1.5C8.5 5.1 10.9 7.5 14.5 8C10.9 8.5 8.5 10.9 8 14.5C7.5 10.9 5.1 8.5 1.5 8C5.1 7.5 7.5 5.1 8 1.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (provider === "deepseek") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <path
          d="M2.2 9.2c1.4-3.1 4.6-4.8 8.3-4.2 1.2.2 2.4.9 3.3 1.9-1.1 3-4.3 4.8-8 4.4-1.5-.2-2.7-.9-3.6-2.1Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <circle cx="10.2" cy="7.6" r="1" fill="currentColor" />
      </svg>
    );
  }
  // CLIProxyAPI local sidecar terminal mark
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect
        x="2"
        y="3"
        width="12"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 6.4L7.2 8.2L5 10M8.6 10H11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ModelSelectorPopoverProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  selectedModelId: string;
  effort: EffortLevel;
  onSelectModel: (model: RealModelSpec) => void;
  onSelectEffort: (effort: EffortLevel) => void;
}

export function ModelSelectorPopover({
  open,
  onToggle,
  onClose,
  selectedModelId,
  effort,
  onSelectModel,
  onSelectEffort,
}: ModelSelectorPopoverProps) {
  const activeModel =
    REAL_MODELS.find((m) => m.id === selectedModelId) ?? REAL_MODELS[0];

  const [activeProvider, setActiveProvider] = useState<ProviderId>(activeModel.provider);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [effortMenuOpen, setEffortMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const visibleModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return REAL_MODELS.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.providerLabel.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      );
    }
    return REAL_MODELS.filter((m) => m.provider === activeProvider);
  }, [activeProvider, searchQuery]);

  const handleOpenToggle = () => {
    if (!open) {
      setActiveProvider(activeModel.provider);
      setSearchOpen(false);
      setSearchQuery("");
      setEffortMenuOpen(false);
    }
    onToggle();
  };

  return (
    <div className="relative">
      {/* Quiet Trigger Button (matches Composer Row 2 right control) */}
      <button
        type="button"
        data-testid="composer-model-btn"
        onClick={handleOpenToggle}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[12.5px] font-medium transition-colors cursor-pointer",
          open
            ? "bg-white/[0.08] text-[#f7f8f8]"
            : "text-[#9ca3af] hover:bg-white/[0.05] hover:text-[#f7f8f8]"
        )}
      >
        <ProviderGlyph provider={activeModel.provider} className="h-3.5 w-3.5 text-[#c4c8d0]" />
        <span>{activeModel.name}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-[#5e626a] transition-transform duration-150",
            open && "rotate-180 text-[#c4c8d0]"
          )}
        />
      </button>

      {/* Two-Pane Provider Rail + Models List Popover */}
      {open && (
        <div
          data-testid="composer-model-menu"
          className="absolute top-10 right-0 z-40 flex w-[332px] sm:w-[356px] overflow-visible rounded-2xl border border-white/[0.11] bg-[#141518] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_70px_-14px_rgba(0,0,0,0.92)]"
        >
          {/* Left Vertical Provider Icon Rail */}
          <div
            className="flex w-[44px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.07] py-2.5"
            role="tablist"
            aria-label="AI model providers"
          >
            {PROVIDERS.map((prov) => {
              const selected = !searchQuery.trim() && activeProvider === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  title={prov.label}
                  aria-label={prov.label}
                  data-testid={`provider-rail-${prov.id}`}
                  onClick={() => {
                    setActiveProvider(prov.id);
                    setSearchQuery("");
                    setSearchOpen(false);
                    setEffortMenuOpen(false);
                  }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
                    selected
                      ? "bg-white/[0.11] text-[#f7f8f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-[#6b707a] hover:bg-white/[0.05] hover:text-[#d4d6dc]"
                  )}
                >
                  <ProviderGlyph provider={prov.id} className="h-[15px] w-[15px]" />
                </button>
              );
            })}
          </div>

          {/* Right Model List Column */}
          <div className="flex min-w-0 flex-1 flex-col p-2">
            {/* Top Bar: Models label + Quick Search */}
            <div className="flex h-7 items-center justify-between gap-2 px-2 pb-1">
              {searchOpen ? (
                <div className="flex flex-1 items-center gap-1.5 rounded-md border border-white/[0.1] bg-[#0c0d10] px-2 py-0.5">
                  <Search className="h-3 w-3 shrink-0 text-[#6b707a]" />
                  <input
                    ref={searchInputRef}
                    autoFocus
                    type="text"
                    data-testid="model-quick-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all models..."
                    className="h-5 w-full bg-transparent text-[11.5px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-[#6b707a] hover:text-[#f7f8f8] cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-[11.5px] font-medium text-[#6b707a]">
                    Models
                  </span>
                  <button
                    type="button"
                    data-testid="model-quick-search-btn"
                    onClick={() => {
                      setSearchOpen(true);
                      window.setTimeout(() => searchInputRef.current?.focus(), 0);
                    }}
                    className="inline-flex items-center gap-1.5 text-[11.5px] text-[#6b707a] hover:text-[#d4d6dc] transition-colors cursor-pointer"
                  >
                    <span>Quick Search</span>
                    <Search className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>

            {/* Model Rows */}
            <div className="mt-0.5 space-y-0.5">
              {visibleModels.length === 0 ? (
                <div className="py-6 text-center text-[12px] text-[#5e626a]">
                  No models match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                visibleModels.map((model) => {
                  const isSelected = model.id === activeModel.id;
                  return (
                    <div
                      key={model.id}
                      data-testid={`model-${model.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onSelectModel(model);
                        setEffortMenuOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectModel(model);
                          setEffortMenuOpen(false);
                        }
                      }}
                      className={cn(
                        "group relative flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <ProviderGlyph
                          provider={model.provider}
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isSelected ? "text-[#d4d6dc]" : "text-[#6b707a]"
                          )}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "truncate text-[13px] font-medium",
                                isSelected ? "text-[#f7f8f8]" : "text-[#d4d6dc]"
                              )}
                            >
                              {model.name}
                            </span>
                            {model.badge && !isSelected && (
                              <span className="rounded bg-[#818cf8]/15 px-1 py-0.5 font-mono text-[9.5px] text-[#a5b4fc]">
                                {model.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side: Effort pill (on active model) + Radio dot */}
                      <div className="flex shrink-0 items-center gap-2">
                        {isSelected && model.supportsEffort ? (
                          <div className="relative">
                            <button
                              type="button"
                              data-testid="effort-picker-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEffortMenuOpen((v) => !v);
                              }}
                              className="inline-flex items-center gap-0.5 rounded-full border border-white/[0.1] bg-[#0e0f12] px-2.5 py-0.5 text-[11px] font-medium text-[#c4c8d0] hover:border-white/[0.2] hover:text-white transition-colors cursor-pointer"
                            >
                              <span>{effort}</span>
                              <ChevronRight className="h-3 w-3 text-[#6b707a]" />
                            </button>

                            {effortMenuOpen && (
                              <div
                                data-testid="effort-submenu"
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-7 z-50 w-48 rounded-xl border border-white/[0.12] bg-[#121317] p-1 shadow-2xl"
                              >
                                <div className="px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#5e626a]">
                                  Reasoning Effort
                                </div>
                                {EFFORT_LEVELS.map((lvl) => {
                                  const activeLvl = effort === lvl.id;
                                  return (
                                    <button
                                      key={lvl.id}
                                      type="button"
                                      data-testid={`effort-${lvl.id.toLowerCase()}`}
                                      onClick={() => {
                                        onSelectEffort(lvl.id);
                                        setEffortMenuOpen(false);
                                      }}
                                      className={cn(
                                        "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer",
                                        activeLvl
                                          ? "bg-white/[0.08] text-[#f7f8f8]"
                                          : "text-[#c4c8d0] hover:bg-white/[0.04]"
                                      )}
                                    >
                                      <div>
                                        <div className="text-[12px] font-medium">{lvl.id}</div>
                                        <div className="text-[10px] text-[#6b707a]">{lvl.hint}</div>
                                      </div>
                                      <span
                                        className={cn(
                                          "h-3 w-3 rounded-full border",
                                          activeLvl
                                            ? "border-[#3b82f6] bg-[#3b82f6] ring-2 ring-inset ring-white/90"
                                            : "border-white/[0.18]"
                                        )}
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono text-[10.5px] tabular-nums text-[#5e626a]">
                            {model.baseCostCr === 0 ? "€0" : `${model.baseCostCr} cr`}
                          </span>
                        )}

                        {/* Tactile Radio Indicator */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                            isSelected
                              ? "border-[#3b82f6] bg-[#3b82f6]"
                              : "border-white/[0.16] bg-transparent group-hover:border-white/[0.3]"
                          )}
                        >
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Subtle Footer Meta / Router Link */}
            <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] px-2 pt-2 text-[11px] text-[#6b707a]">
              <span className="font-mono tabular-nums">
                {activeModel.baseCostCr === 0
                  ? "Local OAuth · €0"
                  : `~${Math.max(1, Math.round(activeModel.baseCostCr * (EFFORT_LEVELS.find((e) => e.id === effort)?.multiplier ?? 1)))} cr / turn`}
              </span>
              <Link
                href="/router"
                onClick={onClose}
                className="inline-flex items-center gap-0.5 text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
              >
                <span>Orthese Router</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
