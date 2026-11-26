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
  // Official LobeHub (@lobehub/icons-static-svg) Claude icon
  if (provider === "anthropic") {
    return (
      <svg
        fill="currentColor"
        fillRule="evenodd"
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) OpenAI icon
  if (provider === "openai") {
    return (
      <svg
        fill="currentColor"
        fillRule="evenodd"
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Gemini icon
  if (provider === "google") {
    return (
      <svg
        fill="currentColor"
        fillRule="evenodd"
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) DeepSeek icon
  if (provider === "deepseek") {
    return (
      <svg
        fill="currentColor"
        fillRule="evenodd"
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" />
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
