"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Film,
  Image as ImageIcon,
  Layers,
  Mic,
  Paperclip,
  Plus,
  Presentation,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DownloadDesktopButton } from "@/components/landing/DownloadDesktopButton";
import {
  EFFORT_LEVELS,
  ModelSelectorPopover,
  REAL_MODELS,
  type EffortLevel,
  type RealModelSpec,
} from "@/components/landing/ModelSelectorPopover";
import {
  ComposerAttachmentStrip,
  SAMPLE_IMAGE_THUMBNAIL,
  inferAttachmentKind,
  useAttachmentQueue,
  type AttachmentKind,
  type ComposerAttachment,
} from "@/components/primitives/ComposerAttachments";
import {
  TokenInput,
  serializeTokenPrompt,
  type PromptToken,
  type TriggerOption,
} from "@/components/primitives/TokenInput";
import { cn } from "@/lib/cn";

type PermissionMode = "standard" | "ask" | "auto";

interface ComposerRunResult {
  prompt: string;
  piece: string;
  contextType: string;
  summary: string;
  modelLabel: string;
  routedByAuto?: boolean;
  permissionLabel: string;
  cost: number;
}

const PERMISSION_MODES: {
  id: PermissionMode;
  label: string;
  shortLabel: string;
  description: string;
  dotClass: string;
  icon: typeof ShieldCheck;
}[] = [
  {
    id: "standard",
    label: "Standard (WASM)",
    shortLabel: "Standard",
    description: "Zero-install browser sandbox · ai:generate & context bus only",
    dotClass: "bg-emerald-400",
    icon: ShieldCheck,
  },
  {
    id: "ask",
    label: "Ask on Elevated",
    shortLabel: "Ask permissions",
    description: "Prompts before fs:write, shell:exec, or local stdio MCP calls",
    dotClass: "bg-amber-400",
    icon: Shield,
  },
  {
    id: "auto",
    label: "Auto-Approve (Desktop)",
    shortLabel: "Bypass all",
    description: "Trusted local Desktop repository with automatic diff guardrails",
    dotClass: "bg-violet-400",
    icon: ShieldAlert,
  },
];

const SAMPLE_ATTACHMENTS: {
  name: string;
  kind: AttachmentKind;
  label: string;
  sizeLabel: string;
  src?: string;
}[] = [
  {
    name: "hero-ref.png",
    kind: "image",
    label: "hero-ref.png",
    sizeLabel: "840 KB · image",
    src: SAMPLE_IMAGE_THUMBNAIL,
  },
  {
    name: "piece.json",
    kind: "code",
    label: "piece.json",
    sizeLabel: "4.2 KB · manifest",
  },
  {
    name: "SKILL.md",
    kind: "document",
    label: "SKILL.md",
    sizeLabel: "11.8 KB · skill",
  },
  {
    name: "router-budget.xlsx",
    kind: "spreadsheet",
    label: "router-budget.xlsx",
    sizeLabel: "48 KB · sheet",
  },
  {
    name: "launch-deck.key",
    kind: "presentation",
    label: "launch-deck.key",
    sizeLabel: "3.4 MB · slides",
  },
  {
    name: "canvas-demo.mp4",
    kind: "video",
    label: "canvas-demo.mp4",
    sizeLabel: "14.2 MB · video",
  },
];

const MENTION_OPTIONS: TriggerOption[] = [
  {
    value: "orthese.website-builder",
    label: "orthese.website-builder",
    description: "Live HTML/Tailwind UI Piece",
  },
  {
    value: "orthese.software-engineer",
    label: "orthese.software-engineer",
    description: "Scoped repo diffs & tests",
  },
  {
    value: "orthese.ai-prompt-box",
    label: "orthese.ai-prompt-box",
    description: "Typed orthese/spec drafter",
  },
  {
    value: "piece.json",
    label: "piece.json",
    description: "Manifest permissions & contracts",
  },
  {
    value: "SKILL.md",
    label: "SKILL.md",
    description: "Progressive skill instructions",
  },
];

const COMMAND_OPTIONS: TriggerOption[] = [
  {
    value: "build-site",
    label: "build-site",
    description: "Generate a responsive landing page",
  },
  {
    value: "pipe-spec",
    label: "pipe-spec",
    description: "Emit orthese/spec across panes",
  },
  {
    value: "audit-permissions",
    label: "audit-permissions",
    description: "Inspect standard vs elevated scopes",
  },
  {
    value: "switch-cliproxy",
    label: "switch-cliproxy",
    description: "Route via local Desktop OAuth (Free)",
  },
];

function buildRunResult(
  prompt: string,
  model: RealModelSpec,
  effort: EffortLevel,
  perm: (typeof PERMISSION_MODES)[number]
): ComposerRunResult {
  const lower = prompt.toLowerCase();
  const isAuto = model.provider === "router";
  const mult = EFFORT_LEVELS.find((e) => e.id === effort)?.multiplier ?? 1;
  const scaledCost =
    model.baseCostCr === 0 ? 0 : Math.max(1, Math.round(model.baseCostCr * mult));

  if (lower.includes("audit") || lower.includes("permission") || lower.includes("piece.json")) {
    return {
      prompt,
      piece: "orthese.security-auditor",
      contextType: "orthese/audit-report",
      summary:
        "Verified piece.json: ai:generate, context:send, and context:receive stay inside standard WASM bounds with zero unprompted shell calls.",
      modelLabel: isAuto ? "Claude Opus 5.5" : model.fullName,
      routedByAuto: isAuto,
      permissionLabel: perm.label,
      cost: isAuto ? 5 : scaledCost,
    };
  }
  if (lower.includes("engineer") || lower.includes("diff") || lower.includes("refactor")) {
    return {
      prompt,
      piece: "orthese.software-engineer",
      contextType: "orthese/git-diff",
      summary:
        "Received orthese/spec on bus://workspace.default, staged typed changes across 2 files, and verified zero TypeScript errors.",
      modelLabel: isAuto ? "Gemini 4 Neon" : model.fullName,
      routedByAuto: isAuto,
      permissionLabel: perm.label,
      cost: isAuto ? 4 : scaledCost,
    };
  }
  return {
    prompt,
    piece: "orthese.website-builder",
    contextType: "orthese/html-bundle",
    summary:
      "Drafted an obsidian #121212 layout bundle with hairline surfaces, tabular counters, and instant zero-install WASM preview.",
    modelLabel: isAuto ? "GPT-6.2 Sol" : model.fullName,
    routedByAuto: isAuto,
    permissionLabel: perm.label,
    cost: isAuto ? 3 : scaledCost,
  };
}

export function HeroComposerPanel() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "#shared-context";

  const [prompt, setPrompt] = useState("");
  const [tokens, setTokens] = useState<PromptToken[]>([]);
  const [permission, setPermission] = useState<PermissionMode>("ask");
  const [modelId, setModelId] = useState<string>("orthese-router");
  const [effort, setEffort] = useState<EffortLevel>("Medium");
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [openMenu, setOpenMenu] = useState<"add" | "permission" | "model" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [lastResult, setLastResult] = useState<ComposerRunResult | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const activePerm =
    PERMISSION_MODES.find((p) => p.id === permission) ?? PERMISSION_MODES[1];
  const activeModel =
    REAL_MODELS.find((m) => m.id === modelId) ?? REAL_MODELS[0];

  useAttachmentQueue(attachments, setAttachments, {
    uploadDuration: 1000,
    uploadGap: 200,
  });

  // Close menus on outside click or Escape
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const queueAttachment = (
    name: string,
    kind: AttachmentKind,
    extra?: { src?: string; sizeLabel?: string }
  ) => {
    const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setAttachments((prev) => [
      ...prev.slice(-5),
      { id, name, kind, progress: 0, src: extra?.src, sizeLabel: extra?.sizeLabel },
    ]);
    setOpenMenu(null);
  };

  const queueDemoBatch = () => {
    const batch = [SAMPLE_ATTACHMENTS[0], SAMPLE_ATTACHMENTS[1], SAMPLE_ATTACHMENTS[3]];
    const now = Date.now();
    setAttachments((prev) => [
      ...prev.slice(-3),
      ...batch.map((item, idx) => ({
        id: `att-${now}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        name: item.name,
        kind: item.kind,
        src: item.src,
        sizeLabel: item.sizeLabel,
        progress: 0,
      })),
    ]);
    setOpenMenu(null);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const insertFileMention = (filename: string) => {
    setTokens((prev) => {
      if (prev.some((t) => t.trigger === "@" && t.value === filename)) return prev;
      return [
        ...prev,
        {
          id: `@-${filename}-${Date.now()}`,
          trigger: "@",
          label: filename,
          value: filename,
        },
      ];
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    const dictated = "Draft a dark obsidian landing hero and pipe orthese/spec to Website Builder";
    let idx = 0;
    const step = () => {
      idx += 4;
      setPrompt(dictated.slice(0, idx));
      if (idx < dictated.length) {
        const tid = window.setTimeout(step, 55);
        timersRef.current.push(tid);
      } else {
        setIsRecording(false);
      }
    };
    const tid = window.setTimeout(step, 180);
    timersRef.current.push(tid);
  };

  const stopRun = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setIsWorking(false);
  };

  const submitPrompt = (override?: string) => {
    const text = (override ?? serializeTokenPrompt(tokens, prompt)).trim();
    if (!text || isWorking) return;

    setOpenMenu(null);
    setIsRecording(false);
    setIsWorking(true);
    setPrompt("");
    setTokens([]);

    const tid = window.setTimeout(() => {
      const result = buildRunResult(text, activeModel, effort, activePerm);
      setLastResult(result);
      setIsWorking(false);
      toast.success(`${result.piece} completed`, {
        description: `Emitted ${result.contextType} · ${result.cost > 0 ? `-${result.cost} cr` : "Free · local"}`,
      });
    }, 1450);

    timersRef.current.push(tid);
  };

  const PermIcon = activePerm.icon;

  return (
    <div id="workspace-demo" ref={panelRef} className="scroll-mt-24 relative mx-auto w-full max-w-[740px]">
      {/* Soft ambient prismatic aura linking the headline light field to the Composer */}
      <div
        aria-hidden="true"
        className="hero-composer-aura pointer-events-none absolute -inset-x-10 -inset-y-8 rounded-[40px]"
      />

      {/* Iridescent Rim Wrapper (lights up smoothly while agent is working) */}
      <div
        className={cn(
          "relative rounded-[22px] p-[1.5px] focus-within:z-30",
          openMenu ? "z-30" : "z-10"
        )}
      >
        {/* Soft inner/outer bloom when working */}
        <div
          aria-hidden="true"
          className={cn(
            "composer-rim-bloom pointer-events-none absolute -inset-1 rounded-[26px] transition-opacity duration-500",
            isWorking ? "opacity-100" : "opacity-0"
          )}
        />
        {/* Crisp traveling refraction rim when working */}
        <div
          aria-hidden="true"
          className={cn(
            "composer-rim-beam pointer-events-none absolute inset-0 rounded-[22px] transition-opacity duration-500",
            isWorking ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Core Two-Row Composer Panel Surface */}
        <div
          className={cn(
            "relative rounded-[20.5px] border bg-[#1f1f1f]/95 backdrop-blur-xl transition-all duration-300",
            isWorking
              ? "border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_32px_90px_-20px_rgba(0,0,0,0.95)]"
              : "border-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_30px_84px_-22px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.03)] hover:border-white/[0.17] focus-within:border-white/[0.22] focus-within:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_32px_96px_-20px_rgba(0,0,0,0.96),0_0_0_1px_rgba(51,146,255,0.22)]"
          )}
        >
          {/* Sequential 56px Attachment Tiles Strip (6 kinds + right-click ContextMenu) */}
          <ComposerAttachmentStrip
            attachments={attachments}
            onRemove={removeAttachment}
            onInsertMention={insertFileMention}
            className="px-4 sm:px-5 pt-4"
          />

          {/* ROW 1: Token Input (@ Mentions & / Commands as inline chips) */}
          <div className="relative px-4 pb-2 pt-4 sm:px-5 sm:pt-4.5">
            <TokenInput
              tokens={tokens}
              onTokensChange={setTokens}
              value={prompt}
              onChange={setPrompt}
              onSubmit={() => submitPrompt()}
              mentionOptions={MENTION_OPTIONS}
              commandOptions={COMMAND_OPTIONS}
              placeholder="Ask Orthese to build a Piece, refactor code, or type @ or / ..."
            />
          </div>

          {/* ROW 2: Controls Bar (Add, Permission Mode | Model, Mic, Send) */}
          <div className="relative flex items-center justify-between gap-1.5 px-2.5 pb-3 pt-1 sm:gap-2 sm:px-3">
            {/* Left Controls: + Add & Permission Mode */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              {/* Hidden multi-file input for real file attach */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length > 0) {
                    const now = Date.now();
                    setAttachments((prev) => [
                      ...prev,
                      ...files.map((file, idx) => {
                        const kind = inferAttachmentKind(file.name);
                        return {
                          id: `att-${now}-${idx}`,
                          name: file.name,
                          kind,
                          src:
                            kind === "image"
                              ? URL.createObjectURL(file)
                              : undefined,
                          sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                          progress: 0,
                        };
                      }),
                    ]);
                    setOpenMenu(null);
                    e.target.value = "";
                  }
                }}
              />

              {/* + Add Button + Popover */}
              <div className="sm:relative">
                <button
                  type="button"
                  data-testid="composer-add-btn"
                  aria-label="Add attachment or context"
                  onClick={() => setOpenMenu((m) => (m === "add" ? null : "add"))}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer",
                    openMenu === "add"
                      ? "border-white/25 bg-white/[0.12] text-[#fafafa]"
                      : "border-white/[0.09] bg-white/[0.04] text-[#d4d4d4] hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
                  )}
                >
                  <Plus className="h-4 w-4" />
                </button>

                {openMenu === "add" && (
                  <div
                    data-testid="composer-add-menu"
                    className="absolute left-2 right-2 top-full mt-2 sm:left-0 sm:right-auto sm:top-10 sm:mt-0 sm:w-64 z-30 rounded-xl border border-white/[0.12] bg-[#1f1f1f]/98 backdrop-blur-xl p-1.5 shadow-2xl"
                  >
                    <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-medium text-[#737373]">
                      <span>Attach context</span>
                      <span className="text-[10px] text-[#737373]">Right-click tiles</span>
                    </div>

                    <button
                      type="button"
                      data-testid="attach-batch-3"
                      onClick={queueDemoBatch}
                      className="flex w-full items-center justify-between gap-2 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-left text-[12.5px] font-medium text-[#fafafa] hover:bg-white/[0.09] transition-colors cursor-pointer mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-[#818cf8]" />
                        <span>Attach 3 files (queue)</span>
                      </span>
                      <span className="text-[10.5px] text-[#a3a3a3]">Demo</span>
                    </button>

                    {SAMPLE_ATTACHMENTS.map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        data-testid={`attach-${sample.name}`}
                        onClick={() =>
                          queueAttachment(sample.name, sample.kind, {
                            src: sample.src,
                            sizeLabel: sample.sizeLabel,
                          })
                        }
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          {sample.kind === "code" ? (
                            <FileCode2 className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                          ) : sample.kind === "image" ? (
                            <ImageIcon className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                          ) : sample.kind === "spreadsheet" ? (
                            <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          ) : sample.kind === "presentation" ? (
                            <Presentation className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                          ) : sample.kind === "video" ? (
                            <Film className="h-3.5 w-3.5 shrink-0 text-fuchsia-400" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                          )}
                          <span className="truncate">{sample.label}</span>
                        </span>
                        <span className="shrink-0 text-[10.5px] text-[#737373]">
                          {sample.kind}
                        </span>
                      </button>
                    ))}
                    <div className="my-1 border-t border-white/[0.07]" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-[#d4d4d4] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-[#a3a3a3]" />
                      <span>Upload from computer…</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Permission Mode Selector + Popover */}
              <div className="sm:relative">
                <button
                  type="button"
                  data-testid="composer-permission-btn"
                  onClick={() =>
                    setOpenMenu((m) => (m === "permission" ? null : "permission"))
                  }
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2 sm:px-3 text-[12px] font-medium transition-colors cursor-pointer",
                    openMenu === "permission"
                      ? "border-white/25 bg-white/[0.1] text-[#fafafa]"
                      : "border-white/[0.08] bg-white/[0.03] text-[#d4d4d4] hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-[#fafafa]"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", activePerm.dotClass)} />
                  <PermIcon className="hidden sm:block h-3.5 w-3.5 shrink-0 text-[#a3a3a3]" />
                  <span className="hidden sm:inline">{activePerm.shortLabel}</span>
                  <span className="sm:hidden">
                    {activePerm.id === "standard"
                      ? "Std"
                      : activePerm.id === "ask"
                        ? "Ask"
                        : "Auto"}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 text-[#737373]" />
                </button>

                {openMenu === "permission" && (
                  <div
                    data-testid="composer-permission-menu"
                    className="absolute left-2 right-2 top-full mt-2 sm:left-0 sm:right-auto sm:top-10 sm:mt-0 sm:w-72 z-30 rounded-xl border border-white/[0.12] bg-[#1f1f1f] p-1.5 shadow-2xl"
                  >
                    <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                      Piece Permission Mode
                    </div>
                    {PERMISSION_MODES.map((mode) => {
                      const active = mode.id === permission;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          data-testid={`perm-${mode.id}`}
                          onClick={() => {
                            setPermission(mode.id);
                            setOpenMenu(null);
                          }}
                          className={cn(
                            "flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer",
                            active ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                          )}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#fafafa]">
                              <span
                                className={cn("h-1.5 w-1.5 rounded-full", mode.dotClass)}
                              />
                              <span>{mode.label}</span>
                            </div>
                            <p className="mt-0.5 text-[11px] leading-snug text-[#a3a3a3]">
                              {mode.description}
                            </p>
                          </div>
                          {active && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fafafa]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Model Picker, Mic, Send */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:flex-initial sm:gap-1.5">
              {/* Two-Pane Provider-Rail Model Picker + Effort Submenu */}
              <ModelSelectorPopover
                open={openMenu === "model"}
                onToggle={() => setOpenMenu((m) => (m === "model" ? null : "model"))}
                onClose={() => setOpenMenu(null)}
                selectedModelId={modelId}
                effort={effort}
                onSelectModel={(model) => {
                  setModelId(model.id);
                  setEffort(model.defaultEffort);
                }}
                onSelectEffort={(next) => setEffort(next)}
              />

              {/* Voice / Mic Button */}
              <button
                type="button"
                data-testid="composer-mic-btn"
                onClick={toggleRecording}
                aria-label={isRecording ? "Stop dictation" : "Voice dictation"}
                className={cn(
                  "flex h-8 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer",
                  isRecording
                    ? "gap-0.5 border-[#818cf8]/50 bg-[#818cf8]/15 px-2.5 text-[#c7d2fe]"
                    : "w-8 border-white/[0.08] bg-white/[0.03] text-[#d4d4d4] hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {isRecording ? (
                  <>
                    <span className="mic-bar h-3 w-0.5 rounded-full bg-[#818cf8]" />
                    <span
                      className="mic-bar h-3.5 w-0.5 rounded-full bg-[#38bdf8]"
                      style={{ animationDelay: "120ms" }}
                    />
                    <span
                      className="mic-bar h-2.5 w-0.5 rounded-full bg-[#e879f9]"
                      style={{ animationDelay: "240ms" }}
                    />
                  </>
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Send / Stop Circular Button */}
              <button
                type="button"
                data-testid="composer-send-btn"
                onClick={() => (isWorking ? stopRun() : submitPrompt())}
                disabled={!isWorking && !prompt.trim() && tokens.length === 0}
                aria-label={isWorking ? "Stop generation" : "Send prompt"}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer",
                  isWorking
                    ? "bg-white/[0.14] text-[#fafafa] hover:bg-white/[0.22]"
                    : "bg-[#fafafa] text-[#121212] hover:bg-white disabled:opacity-35"
                )}
              >
                {isWorking ? (
                  <Square className="h-3 w-3 fill-current" />
                ) : (
                  <ArrowUp className="h-4 w-4 stroke-[2.4]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Working / Result Card (unfolds cleanly right below the composer) */}
      {(isWorking || lastResult) && (
        <motion.div
          key={isWorking ? "working" : lastResult?.prompt}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          data-testid="composer-run-output"
          className="mt-3 rounded-xl border border-white/[0.08] bg-[#171717]/90 px-4 py-3 text-left"
        >
          {isWorking ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[12.5px] text-[#d4d4d4]">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span>
                  Routing via{" "}
                  <span className="text-[#fafafa] font-medium">
                    {activeModel.name}
                    {activeModel.supportsEffort ? ` (${effort})` : ""}
                  </span>{" "}
                  under{" "}
                  <span className="font-mono text-[11.5px] text-[#a5b4fc]">
                    {activePerm.shortLabel}
                  </span>
                  …
                </span>
              </div>
              <span className="font-mono text-[10.5px] text-[#737373]">
                bus://workspace.default
              </span>
            </div>
          ) : lastResult ? (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#818cf8]" />
                  <span className="font-mono text-[11.5px] text-[#fafafa]">
                    {lastResult.piece}
                  </span>
                  <span className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#a5b4fc]">
                    {lastResult.contextType}
                  </span>
                  <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                    {lastResult.routedByAuto ? `Routed → ${lastResult.modelLabel}` : lastResult.modelLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLastResult(null)}
                  aria-label="Dismiss output"
                  className="text-[#737373] hover:text-[#fafafa] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[13px] leading-relaxed text-[#d4d4d4]">
                {lastResult.summary}
              </p>
            </div>
          ) : null}
        </motion.div>
      )}

      {/* Primary Hero Links */}
      <div className="relative z-20 mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={appUrl}
          className="btn-pill-white inline-flex h-9 items-center rounded-full px-5 text-[13px] font-medium"
        >
          Launch in Browser
        </Link>
        <DownloadDesktopButton />
      </div>
    </div>
  );
}
