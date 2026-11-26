"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Cpu,
  FileCode2,
  FileText,
  GitBranch,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Plus,
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

type PermissionMode = "standard" | "ask" | "auto";
type ModelOptionId =
  | "claude-sonnet-4.5"
  | "claude-opus-4.5"
  | "gpt-5.2"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "cliproxy";
type AttachmentKind = "code" | "doc" | "image";

interface AttachmentTile {
  id: string;
  name: string;
  kind: AttachmentKind;
  progress: number; // 0..100, 100 = landed
}

interface ComposerRunResult {
  prompt: string;
  piece: string;
  contextType: string;
  summary: string;
  modelLabel: string;
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

const MODEL_OPTIONS: {
  id: ModelOptionId;
  label: string;
  shortLabel: string;
  meta: string;
  cost: number;
}[] = [
  {
    id: "claude-sonnet-4.5",
    label: "Claude Sonnet 4.5",
    shortLabel: "Claude Sonnet 4.5",
    meta: "Anthropic · 3 cr / turn",
    cost: 3,
  },
  {
    id: "claude-opus-4.5",
    label: "Claude Opus 4.5",
    shortLabel: "Claude Opus 4.5",
    meta: "Anthropic · 6 cr / turn",
    cost: 6,
  },
  {
    id: "gpt-5.2",
    label: "GPT-5.2",
    shortLabel: "GPT-5.2",
    meta: "OpenAI · 3 cr / turn",
    cost: 3,
  },
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    shortLabel: "Gemini 2.5 Pro",
    meta: "Google · 2 cr / turn",
    cost: 2,
  },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    shortLabel: "Gemini 2.5 Flash",
    meta: "Google · 1 cr / turn",
    cost: 1,
  },
  {
    id: "cliproxy",
    label: "CLIProxyAPI Local",
    shortLabel: "CLIProxy · €0",
    meta: "Desktop OAuth sidecar · €0",
    cost: 0,
  },
];

const SAMPLE_ATTACHMENTS: { name: string; kind: AttachmentKind; label: string }[] = [
  { name: "piece.json", kind: "code", label: "Attach piece.json manifest" },
  { name: "SKILL.md", kind: "doc", label: "Attach landing-page SKILL.md" },
  { name: "hero-ref.png", kind: "image", label: "Attach UI reference screenshot" },
];

const TRIGGER_SUGGESTIONS = {
  "@": [
    { token: "@orthese.website-builder", desc: "Live HTML/Tailwind UI Piece" },
    { token: "@orthese.software-engineer", desc: "Scoped repo diffs & tests" },
    { token: "@orthese.ai-prompt-box", desc: "Typed orthese/spec drafter" },
    { token: "@piece.json", desc: "Manifest permissions & contracts" },
  ],
  "/": [
    { token: "/build-site", desc: "Generate a responsive landing page" },
    { token: "/pipe-spec", desc: "Emit orthese/spec across panes" },
    { token: "/audit-permissions", desc: "Inspect standard vs elevated scopes" },
    { token: "/switch-cliproxy", desc: "Route via local Desktop OAuth (€0)" },
  ],
} as const;

const QUICK_PROMPTS = [
  "Build a monochrome hero with @orthese.website-builder",
  "/audit-permissions on piece.json",
  "Pipe orthese/spec to Software Engineer",
];

function buildRunResult(
  prompt: string,
  model: (typeof MODEL_OPTIONS)[number],
  perm: (typeof PERMISSION_MODES)[number]
): ComposerRunResult {
  const lower = prompt.toLowerCase();
  if (lower.includes("audit") || lower.includes("permission") || lower.includes("piece.json")) {
    return {
      prompt,
      piece: "orthese.security-auditor",
      contextType: "orthese/audit-report",
      summary:
        "Verified piece.json: ai:generate, context:send, and context:receive stay inside standard WASM bounds with zero unprompted shell calls.",
      modelLabel: model.label,
      permissionLabel: perm.label,
      cost: model.cost,
    };
  }
  if (lower.includes("engineer") || lower.includes("diff") || lower.includes("refactor")) {
    return {
      prompt,
      piece: "orthese.software-engineer",
      contextType: "orthese/git-diff",
      summary:
        "Received orthese/spec on bus://workspace.default, staged typed changes across 2 files, and verified zero TypeScript errors.",
      modelLabel: model.label,
      permissionLabel: perm.label,
      cost: model.cost,
    };
  }
  return {
    prompt,
    piece: "orthese.website-builder",
    contextType: "orthese/html-bundle",
    summary:
      "Drafted an obsidian #08090A layout bundle with hairline surfaces, tabular counters, and instant zero-install WASM preview.",
    modelLabel: model.label,
    permissionLabel: perm.label,
    cost: model.cost,
  };
}

export function HeroComposerPanel() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "#shared-context";

  const [prompt, setPrompt] = useState("");
  const [permission, setPermission] = useState<PermissionMode>("ask");
  const [modelId, setModelId] = useState<ModelOptionId>("claude-sonnet-4.5");
  const [attachments, setAttachments] = useState<AttachmentTile[]>([]);
  const [openMenu, setOpenMenu] = useState<"add" | "permission" | "model" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [credits, setCredits] = useState(197);
  const [lastResult, setLastResult] = useState<ComposerRunResult | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const activePerm =
    PERMISSION_MODES.find((p) => p.id === permission) ?? PERMISSION_MODES[1];
  const activeModel =
    MODEL_OPTIONS.find((m) => m.id === modelId) ?? MODEL_OPTIONS[0];

  // Detect active @ or / trigger at the end of the prompt
  const activeTrigger: "@" | "/" | null = (() => {
    const match = prompt.match(/(?:^|\s)([@/])$/);
    return match ? (match[1] as "@" | "/") : null;
  })();

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

  const queueAttachment = (name: string, kind: AttachmentKind) => {
    const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setAttachments((prev) => [...prev.slice(-4), { id, name, kind, progress: 15 }]);
    setOpenMenu(null);

    // Smoothly animate clockwise upload progress ring 15 -> 60 -> 100
    const t1 = window.setTimeout(() => {
      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, progress: 64 } : a))
      );
    }, 220);
    const t2 = window.setTimeout(() => {
      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, progress: 100 } : a))
      );
    }, 520);
    timersRef.current.push(t1, t2);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
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
        textareaRef.current?.focus();
      }
    };
    const tid = window.setTimeout(step, 180);
    timersRef.current.push(tid);
  };

  const insertTriggerToken = (token: string) => {
    setPrompt((prev) => prev.replace(/([@/])$/, `${token} `));
    textareaRef.current?.focus();
  };

  const stopRun = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    setIsWorking(false);
  };

  const submitPrompt = (override?: string) => {
    const text = (override ?? prompt).trim();
    if (!text || isWorking) return;

    setOpenMenu(null);
    setIsRecording(false);
    setIsWorking(true);
    setPrompt("");

    const tid = window.setTimeout(() => {
      const result = buildRunResult(text, activeModel, activePerm);
      if (result.cost > 0) {
        setCredits((c) => Math.max(0, c - result.cost));
      }
      setLastResult(result);
      setIsWorking(false);
      toast.success(`${result.piece} completed`, {
        description: `Emitted ${result.contextType} · ${result.cost > 0 ? `-${result.cost} cr` : "€0 local"}`,
      });
    }, 1450);

    timersRef.current.push(tid);
  };

  const PermIcon = activePerm.icon;

  return (
    <div id="workspace-demo" ref={panelRef} className="scroll-mt-24 mx-auto w-full max-w-[740px]">
      {/* Iridescent Rim Wrapper (lights up smoothly while agent is working) */}
      <div className="relative rounded-[22px] p-[1.5px]">
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
            "relative rounded-[20.5px] border bg-[#101114] transition-colors duration-300",
            isWorking
              ? "border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_28px_80px_-20px_rgba(0,0,0,0.92)]"
              : "border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.13),0_28px_80px_-24px_rgba(0,0,0,0.9)] hover:border-white/[0.15]"
          )}
        >
          {/* Optional 56px Attachment Tiles Strip */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-4 pt-3.5">
              {attachments.map((att) => {
                const done = att.progress >= 100;
                const radius = 24;
                const circumference = 2 * Math.PI * radius;
                const dashOffset = circumference * (1 - att.progress / 100);
                return (
                  <motion.div
                    key={att.id}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-white/[0.1] bg-[#16181d] px-1.5 text-center"
                  >
                    {!done && (
                      <svg
                        className="pointer-events-none absolute inset-0 h-14 w-14 -rotate-90"
                        viewBox="0 0 56 56"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="52"
                          height="52"
                          rx="11"
                          fill="none"
                          stroke="#818cf8"
                          strokeWidth="1.5"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                          className="transition-all duration-200"
                        />
                      </svg>
                    )}

                    {att.kind === "code" ? (
                      <FileCode2 className="h-4 w-4 text-[#818cf8]" />
                    ) : att.kind === "image" ? (
                      <ImageIcon className="h-4 w-4 text-[#38bdf8]" />
                    ) : (
                      <FileText className="h-4 w-4 text-[#e879f9]" />
                    )}
                    <span className="mt-1 w-full truncate font-mono text-[9px] text-[#c4c8d0]">
                      {att.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      aria-label={`Remove ${att.name}`}
                      className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white/[0.14] bg-[#0c0d10] text-[#c4c8d0] hover:bg-white hover:text-[#08090a] transition-colors cursor-pointer"
                    >
                      {done ? (
                        <X className="h-2.5 w-2.5" />
                      ) : (
                        <span className="font-mono text-[8px] tabular-nums">
                          {att.progress}
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ROW 1: Prompt Input */}
          <div className="relative px-4 pb-2 pt-3.5">
            <textarea
              ref={textareaRef}
              rows={2}
              data-testid="composer-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitPrompt();
                }
              }}
              placeholder="Ask Orthese to build a Piece, refactor code, or type @ or / ..."
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#f7f8f8] placeholder:text-[#5e626a] focus:outline-none"
            />

            {/* @ Mention & / Command Caret Menu */}
            {activeTrigger && (
              <div
                data-testid="composer-trigger-menu"
                className="absolute left-4 top-full z-30 mt-1 w-72 rounded-xl border border-white/[0.12] bg-[#121419] p-1.5 shadow-2xl"
              >
                <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5e626a]">
                  {activeTrigger === "@" ? "Pieces & Files" : "Workspace Commands"}
                </div>
                {TRIGGER_SUGGESTIONS[activeTrigger].map((item) => (
                  <button
                    key={item.token}
                    type="button"
                    onClick={() => insertTriggerToken(item.token)}
                    className="flex w-full flex-col rounded-lg px-2.5 py-1.5 text-left hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-[12px] text-[#f7f8f8]">
                      {item.token}
                    </span>
                    <span className="text-[11px] text-[#8a8f98]">{item.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ROW 2: Controls Bar (Add, Permission Mode | Model, Mic, Send) */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-3 pt-1">
            {/* Left Controls: + Add & Permission Mode */}
            <div className="flex items-center gap-1.5">
              {/* Hidden file input for real file attach */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const kind: AttachmentKind = file.type.startsWith("image/")
                      ? "image"
                      : /\.(ts|tsx|js|rs|json|css|html)$/i.test(file.name)
                        ? "code"
                        : "doc";
                    queueAttachment(file.name, kind);
                    e.target.value = "";
                  }
                }}
              />

              {/* + Add Button + Popover */}
              <div className="relative">
                <button
                  type="button"
                  data-testid="composer-add-btn"
                  aria-label="Add attachment or context"
                  onClick={() => setOpenMenu((m) => (m === "add" ? null : "add"))}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer",
                    openMenu === "add"
                      ? "border-white/25 bg-white/[0.12] text-[#f7f8f8]"
                      : "border-white/[0.09] bg-white/[0.04] text-[#c4c8d0] hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
                  )}
                >
                  <Plus className="h-4 w-4" />
                </button>

                {openMenu === "add" && (
                  <div
                    data-testid="composer-add-menu"
                    className="absolute top-10 left-0 z-30 w-64 rounded-xl border border-white/[0.12] bg-[#121419] p-1.5 shadow-2xl"
                  >
                    <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5e626a]">
                      Attach Context
                    </div>
                    {SAMPLE_ATTACHMENTS.map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        data-testid={`attach-${sample.name}`}
                        onClick={() => queueAttachment(sample.name, sample.kind)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-[#d4d6dc] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                      >
                        {sample.kind === "code" ? (
                          <FileCode2 className="h-3.5 w-3.5 text-[#818cf8]" />
                        ) : sample.kind === "image" ? (
                          <ImageIcon className="h-3.5 w-3.5 text-[#38bdf8]" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-[#e879f9]" />
                        )}
                        <span>{sample.label}</span>
                      </button>
                    ))}
                    <div className="my-1 border-t border-white/[0.07]" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] text-[#d4d6dc] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                    >
                      <Paperclip className="h-3.5 w-3.5 text-[#8a8f98]" />
                      <span>Upload from computer…</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Permission Mode Selector + Popover */}
              <div className="relative">
                <button
                  type="button"
                  data-testid="composer-permission-btn"
                  onClick={() =>
                    setOpenMenu((m) => (m === "permission" ? null : "permission"))
                  }
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors cursor-pointer",
                    openMenu === "permission"
                      ? "border-white/25 bg-white/[0.1] text-[#f7f8f8]"
                      : "border-white/[0.08] bg-white/[0.03] text-[#c4c8d0] hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", activePerm.dotClass)} />
                  <PermIcon className="h-3.5 w-3.5 text-[#8a8f98]" />
                  <span>{activePerm.shortLabel}</span>
                  <ChevronDown className="h-3 w-3 text-[#5e626a]" />
                </button>

                {openMenu === "permission" && (
                  <div
                    data-testid="composer-permission-menu"
                    className="absolute top-10 left-0 z-30 w-72 rounded-xl border border-white/[0.12] bg-[#121419] p-1.5 shadow-2xl"
                  >
                    <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5e626a]">
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
                            <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#f7f8f8]">
                              <span
                                className={cn("h-1.5 w-1.5 rounded-full", mode.dotClass)}
                              />
                              <span>{mode.label}</span>
                            </div>
                            <p className="mt-0.5 text-[11px] leading-snug text-[#8a8f98]">
                              {mode.description}
                            </p>
                          </div>
                          {active && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#f7f8f8]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Model Picker, Mic, Send */}
            <div className="flex items-center gap-1.5">
              {/* Model Picker + Popover */}
              <div className="relative">
                <button
                  type="button"
                  data-testid="composer-model-btn"
                  onClick={() => setOpenMenu((m) => (m === "model" ? null : "model"))}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors cursor-pointer",
                    openMenu === "model"
                      ? "border-white/25 bg-white/[0.1] text-[#f7f8f8]"
                      : "border-white/[0.08] bg-white/[0.03] text-[#c4c8d0] hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-[#f7f8f8]"
                  )}
                >
                  <Cpu className="h-3.5 w-3.5 text-[#818cf8]" />
                  <span>{activeModel.shortLabel}</span>
                  <ChevronDown className="h-3 w-3 text-[#5e626a]" />
                </button>

                {openMenu === "model" && (
                  <div
                    data-testid="composer-model-menu"
                    className="absolute top-10 right-0 z-30 w-64 rounded-xl border border-white/[0.12] bg-[#121419] p-1.5 shadow-2xl"
                  >
                    <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#5e626a]">
                      Model &amp; Routing
                    </div>
                    {MODEL_OPTIONS.map((m) => {
                      const active = m.id === modelId;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          data-testid={`model-${m.id}`}
                          onClick={() => {
                            setModelId(m.id);
                            setOpenMenu(null);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer",
                            active ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                          )}
                        >
                          <div>
                            <div className="text-[12.5px] font-medium text-[#f7f8f8]">
                              {m.label}
                            </div>
                            <div className="font-mono text-[10.5px] text-[#8a8f98]">
                              {m.meta}
                            </div>
                          </div>
                          {active && <Check className="h-3.5 w-3.5 shrink-0 text-[#f7f8f8]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Voice / Mic Button */}
              <button
                type="button"
                data-testid="composer-mic-btn"
                onClick={toggleRecording}
                aria-label={isRecording ? "Stop dictation" : "Voice dictation"}
                className={cn(
                  "flex h-8 items-center justify-center rounded-full border transition-all cursor-pointer",
                  isRecording
                    ? "gap-0.5 border-[#818cf8]/50 bg-[#818cf8]/15 px-2.5 text-[#c7d2fe]"
                    : "w-8 border-white/[0.08] bg-white/[0.03] text-[#c4c8d0] hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
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
                disabled={!isWorking && !prompt.trim()}
                aria-label={isWorking ? "Stop generation" : "Send prompt"}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer",
                  isWorking
                    ? "bg-white/[0.14] text-[#f7f8f8] hover:bg-white/[0.22]"
                    : "bg-[#f7f8f8] text-[#08090a] hover:bg-white disabled:opacity-35"
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
          className="mt-3 rounded-xl border border-white/[0.08] bg-[#0c0d10]/90 px-4 py-3 text-left"
        >
          {isWorking ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-[12.5px] text-[#c4c8d0]">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span>
                  Routing via <span className="text-[#f7f8f8] font-medium">{activeModel.label}</span>{" "}
                  under <span className="font-mono text-[11.5px] text-[#a5b4fc]">{activePerm.shortLabel}</span>…
                </span>
              </div>
              <span className="font-mono text-[10.5px] text-[#5e626a]">
                bus://workspace.default
              </span>
            </div>
          ) : lastResult ? (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#818cf8]" />
                  <span className="font-mono text-[11.5px] text-[#f7f8f8]">
                    {lastResult.piece}
                  </span>
                  <span className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#a5b4fc]">
                    {lastResult.contextType}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLastResult(null)}
                  aria-label="Dismiss output"
                  className="text-[#5e626a] hover:text-[#f7f8f8] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-[13px] leading-relaxed text-[#c4c8d0]">
                {lastResult.summary}
              </p>
            </div>
          ) : null}
        </motion.div>
      )}

      {/* Quiet Quick-Prompt Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => submitPrompt(q)}
            className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1 text-[12px] text-[#8a8f98] hover:border-white/[0.16] hover:bg-white/[0.05] hover:text-[#f7f8f8] transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Compact Workspace Status Bar + Primary Links */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-4 text-[12px]">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#5e626a]">
          <span className="inline-flex items-center gap-1.5 text-[#8a8f98]">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5 text-[#8a8f98]">
            <Radio className="h-3 w-3 text-emerald-400" />
            <span>MCP Hub</span>
          </span>
          <span>·</span>
          <span
            data-testid="composer-credit-counter"
            className="tabular-nums text-[#f7f8f8]"
          >
            <NumberFlow value={credits} /> cr
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={appUrl}
            className="btn-pill-white inline-flex h-8 items-center rounded-full px-4 text-[12.5px] font-medium"
          >
            Launch in Browser
          </Link>
          <Link
            href="#dual-target"
            className="inline-flex items-center gap-1 text-[12.5px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            <span>Download Desktop</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
