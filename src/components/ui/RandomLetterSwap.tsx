"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

export interface RandomLetterSwapProps {
  /** Text string to animate character-by-character */
  label: string;
  /** "forward" sweeps once and resets silently; "ping-pong" reverses on hover end */
  mode?: "forward" | "ping-pong";
  /** Slide upward (true, default) or downward (false) */
  reverse?: boolean;
  /** Delay step (seconds) between shuffled letter starts */
  staggerDuration?: number;
  /** Duration (ms) for each individual character vertical swap */
  durationMs?: number;
  /** CSS easing curve for each character swap */
  easing?: string;
  /** Optional class applied to the incoming duplicate glyphs */
  secondaryClassName?: string;
  /** Optional external counter; incrementing it triggers the forward swap from a parent Link/button */
  triggerCount?: number;
  className?: string;
}

function buildShuffledDelaysMs(count: number, stepSec: number): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const stepMs = stepSec * 1000;
  const delays = new Array<number>(count);
  for (let rank = 0; rank < count; rank++) {
    delays[order[rank]] = rank * stepMs;
  }
  return delays;
}

/**
 * Orthese Random Letter Swap primitive.
 * Inspired by Cnippet UI's Random Letter Swap Navigation & Daniel Petho's
 * Fancy Components (MIT) pattern: splits text into per-character vertical
 * slots and swaps letters in a randomized stagger order on hover or focus
 * using compositor-threaded Web Animations (WAAPI).
 */
export function RandomLetterSwap({
  label,
  mode = "forward",
  reverse = true,
  staggerDuration = 0.022,
  durationMs = 340,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  secondaryClassName,
  triggerCount,
  className,
}: RandomLetterSwapProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const animatingRef = useRef(false);
  const activeAnimsRef = useRef<Animation[]>([]);
  const lastTriggerRef = useRef(triggerCount ?? 0);

  const chars = useMemo(() => Array.from(label), [label]);

  const cancelActive = useCallback(() => {
    for (const anim of activeAnimsRef.current) {
      try {
        anim.cancel();
      } catch {
        // Ignore already-finished animations
      }
    }
    activeAnimsRef.current = [];
  }, []);

  useEffect(() => cancelActive, [cancelActive]);

  const runSwap = useCallback(
    async (direction: "in" | "out") => {
      const root = containerRef.current;
      if (prefersReducedMotion || chars.length === 0 || !root) return;
      if (typeof root.animate !== "function") return;
      if (mode === "forward" && animatingRef.current) return;

      cancelActive();
      animatingRef.current = true;

      const delays = buildShuffledDelaysMs(chars.length, staggerDuration);
      const primaryFrom = direction === "in" ? "translateY(0%)" : reverse ? "translateY(-100%)" : "translateY(100%)";
      const primaryTo = direction === "in" ? (reverse ? "translateY(-100%)" : "translateY(100%)") : "translateY(0%)";
      const secondaryFrom = direction === "in" ? (reverse ? "translateY(100%)" : "translateY(-100%)") : "translateY(0%)";
      const secondaryTo = direction === "in" ? "translateY(0%)" : reverse ? "translateY(100%)" : "translateY(-100%)";

      const anims: Animation[] = [];
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === " ") continue;
        const primaryEl = root.querySelector<HTMLElement>(`[data-rls-primary="${i}"]`);
        const secondaryEl = root.querySelector<HTMLElement>(`[data-rls-secondary="${i}"]`);
        if (!primaryEl || !secondaryEl) continue;

        const opts: KeyframeAnimationOptions = {
          duration: durationMs,
          delay: delays[i],
          easing,
          fill: "forwards",
        };
        anims.push(primaryEl.animate([{ transform: primaryFrom }, { transform: primaryTo }], opts));
        anims.push(secondaryEl.animate([{ transform: secondaryFrom }, { transform: secondaryTo }], opts));
      }

      activeAnimsRef.current = anims;

      try {
        await Promise.all(anims.map((a) => a.finished));
        if (mode === "forward" && activeAnimsRef.current === anims) {
          // Silently snap back to visually identical rest frame for the next hover
          cancelActive();
        }
      } catch {
        // Animation was cancelled mid-flight (e.g. unmount or reverse hover)
      } finally {
        animatingRef.current = false;
      }
    },
    [cancelActive, chars, durationMs, easing, mode, prefersReducedMotion, reverse, staggerDuration]
  );

  const handleEnter = useCallback(() => {
    void runSwap("in");
  }, [runSwap]);

  const handleLeave = useCallback(() => {
    if (mode === "ping-pong") {
      void runSwap("out");
    }
  }, [mode, runSwap]);

  useEffect(() => {
    if (triggerCount !== undefined && triggerCount > lastTriggerRef.current) {
      lastTriggerRef.current = triggerCount;
      void runSwap("in");
    }
  }, [triggerCount, runSwap]);

  const selfHover = triggerCount === undefined;

  return (
    <span
      ref={containerRef}
      onMouseEnter={selfHover ? handleEnter : undefined}
      onMouseLeave={selfHover ? handleLeave : undefined}
      onFocus={selfHover ? handleEnter : undefined}
      onBlur={selfHover ? handleLeave : undefined}
      className={cn("inline-flex items-baseline whitespace-pre", className)}
    >
      <span className="sr-only">{label}</span>
      {chars.map((char, i) => {
        if (char === " ") {
          return (
            <span key={i} aria-hidden="true" className="inline-block">
              {"\u00A0"}
            </span>
          );
        }

        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-flex overflow-hidden py-[0.06em] -my-[0.06em]"
          >
            <span
              data-rls-primary={i}
              className="inline-block will-change-transform"
              style={{ transform: "translateY(0%)" }}
            >
              {char}
            </span>
            <span
              data-rls-secondary={i}
              className={cn(
                "pointer-events-none absolute inset-x-0 top-[0.06em] inline-block will-change-transform",
                secondaryClassName
              )}
              style={{
                transform: reverse ? "translateY(100%)" : "translateY(-100%)",
              }}
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
}
