"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AtSign, Slash, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type TriggerChar = "@" | "/";

export interface PromptToken {
  id: string;
  trigger: TriggerChar;
  label: string;
  value: string;
}

export interface TriggerOption {
  value: string;
  label: string;
  description: string;
  group?: string;
}

interface TokenInputProps {
  tokens: PromptToken[];
  onTokensChange: (tokens: PromptToken[]) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  mentionOptions: TriggerOption[];
  commandOptions: TriggerOption[];
  testId?: string;
  className?: string;
}

export function serializeTokenPrompt(tokens: PromptToken[], text: string): string {
  const tokenPrefix = tokens.map((t) => `${t.trigger}${t.label}`).join(" ");
  const cleanText = text.trim();
  return [tokenPrefix, cleanText].filter(Boolean).join(" ").trim();
}

export function TokenInput({
  tokens,
  onTokensChange,
  value,
  onChange,
  onSubmit,
  placeholder,
  mentionOptions,
  commandOptions,
  testId = "composer-prompt-input",
  className,
}: TokenInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedTriggerText, setDismissedTriggerText] = useState<string | null>(null);

  // Detect active @mention or /command query at the end of the text
  const triggerMatch = useMemo(() => {
    const match = value.match(/(?:^|\s)([@/])([^\s]*)$/);
    if (!match) return null;
    const trigger = match[1] as TriggerChar;
    const query = match[2] ?? "";
    const fullFragment = `${trigger}${query}`;
    if (dismissedTriggerText === fullFragment) return null;
    return {
      trigger,
      query,
      fullFragment,
      matchStart: match.index! + (match[0].startsWith(" ") ? 1 : 0),
    };
  }, [value, dismissedTriggerText]);

  const filteredOptions = useMemo(() => {
    if (!triggerMatch) return [];
    const pool = triggerMatch.trigger === "@" ? mentionOptions : commandOptions;
    const q = triggerMatch.query.toLowerCase();
    if (!q) return pool;
    return pool.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.description.toLowerCase().includes(q)
    );
  }, [triggerMatch, mentionOptions, commandOptions]);

  const menuOpen = Boolean(triggerMatch && filteredOptions.length > 0);

  useEffect(() => {
    setActiveIndex(0);
  }, [triggerMatch?.trigger, triggerMatch?.query]);

  // Reset dismissal once user edits away from that exact fragment
  useEffect(() => {
    if (dismissedTriggerText && !value.endsWith(dismissedTriggerText)) {
      setDismissedTriggerText(null);
    }
  }, [value, dismissedTriggerText]);

  function commitOption(opt: TriggerOption) {
    if (!triggerMatch) return;
    const nextToken: PromptToken = {
      id: `${triggerMatch.trigger}-${opt.value}-${Date.now()}`,
      trigger: triggerMatch.trigger,
      label: opt.label,
      value: opt.value,
    };

    // Avoid exact duplicate tokens
    const alreadyExists = tokens.some(
      (t) => t.trigger === nextToken.trigger && t.value === nextToken.value
    );
    if (!alreadyExists) {
      onTokensChange([...tokens, nextToken]);
    }

    const before = value.slice(0, triggerMatch.matchStart).trimEnd();
    onChange(before ? `${before} ` : "");
    setDismissedTriggerText(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function removeToken(id: string) {
    onTokensChange(tokens.filter((t) => t.id !== id));
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (menuOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const picked = filteredOptions[activeIndex] ?? filteredOptions[0];
        if (picked) commitOption(picked);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (triggerMatch) setDismissedTriggerText(triggerMatch.fullFragment);
        return;
      }
    }

    // Backspace at caret 0 deletes the last inline token chip
    if (
      e.key === "Backspace" &&
      tokens.length > 0 &&
      textareaRef.current &&
      textareaRef.current.selectionStart === 0 &&
      textareaRef.current.selectionEnd === 0
    ) {
      e.preventDefault();
      onTokensChange(tokens.slice(0, -1));
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div
      className={cn("relative", className)}
      onClick={() => textareaRef.current?.focus()}
    >
      {/* Inline Token Chips (@mentions & /commands) */}
      {tokens.length > 0 && (
        <div
          data-testid="composer-token-chips"
          className="mb-2 flex flex-wrap items-center gap-1.5"
        >
          {tokens.map((tok) => {
            const isCommand = tok.trigger === "/";
            return (
              <span
                key={tok.id}
                data-testid={`token-chip-${tok.value}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[12px] font-medium transition-colors",
                  isCommand
                    ? "border-sky-400/25 bg-sky-400/10 text-sky-200"
                    : "border-indigo-400/25 bg-indigo-400/12 text-indigo-200"
                )}
              >
                {isCommand ? (
                  <Slash className="h-3 w-3 text-sky-300/80" />
                ) : (
                  <AtSign className="h-3 w-3 text-indigo-300/80" />
                )}
                <span>{tok.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeToken(tok.id);
                  }}
                  aria-label={`Remove ${tok.trigger}${tok.label}`}
                  className="ml-0.5 rounded p-0.5 text-white/55 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <textarea
        ref={textareaRef}
        rows={2}
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          tokens.length > 0
            ? "Describe what to build or press Enter to run..."
            : placeholder
        }
        className="min-h-[54px] sm:min-h-[62px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#fafafa] placeholder:text-[#737373] focus:outline-none"
      />

      {/* Caret-triggered @ Mentions & / Commands Popover */}
      {menuOpen && triggerMatch && (
        <div
          role="listbox"
          data-testid="composer-trigger-menu"
          aria-label={
            triggerMatch.trigger === "@"
              ? "Mention Pieces and workspace files"
              : "Run slash commands"
          }
          className="absolute left-0 top-full z-40 mt-1.5 w-80 max-w-[calc(100vw-3rem)] rounded-xl border border-white/[0.13] bg-[#1f1f1f]/98 p-1.5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between px-2.5 py-1 text-[10.5px] font-medium text-[#737373]">
            <span>
              {triggerMatch.trigger === "@"
                ? "Mention Piece or file"
                : "Slash commands"}
            </span>
            <span className="font-mono text-[10px] text-[#737373]">
              ↑↓ · ↵
            </span>
          </div>

          <div className="space-y-0.5">
            {filteredOptions.map((opt, idx) => {
              const isHighlighted = idx === activeIndex;
              const isCommand = triggerMatch.trigger === "/";
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isHighlighted}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commitOption(opt);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left transition-colors cursor-pointer",
                    isHighlighted
                      ? "bg-white/[0.08] text-[#fafafa]"
                      : "text-[#d4d4d4] hover:bg-white/[0.05]"
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px]",
                        isCommand
                          ? "border-sky-400/25 bg-sky-400/10 text-sky-300"
                          : "border-indigo-400/25 bg-indigo-400/10 text-indigo-300"
                      )}
                    >
                      {isCommand ? "/" : "@"}
                    </span>
                    <span className="truncate text-[12.5px] font-medium text-[#fafafa]">
                      {opt.label}
                    </span>
                  </span>
                  <span className="truncate text-[11px] text-[#737373]">
                    {opt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
