"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/cn";

export function TooltipProvider({
  children,
  delay = 180,
  closeDelay = 80,
}: {
  children: ReactNode;
  delay?: number;
  closeDelay?: number;
}) {
  return (
    <Tooltip.Provider delay={delay} closeDelay={closeDelay}>
      {children}
    </Tooltip.Provider>
  );
}

export interface InfoTooltipProps {
  /** Short title shown at the top of the tooltip */
  title?: string;
  /** Descriptive body text */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
  triggerClassName?: string;
}

/**
 * Base UI Tooltip primitive styled for Orthese's BoardUI Dark Mode surfaces.
 */
export function InfoTooltip({
  title,
  content,
  children,
  side = "top",
  sideOffset = 8,
  className,
  triggerClassName,
}: InfoTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <span
            tabIndex={0}
            className={cn(
              "inline-flex items-center outline-none focus-visible:ring-1 focus-visible:ring-[#818cf8]/75 rounded",
              triggerClassName
            )}
          />
        }
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner
          side={side}
          sideOffset={sideOffset}
          collisionPadding={12}
          className="z-[80] outline-none"
        >
          <Tooltip.Popup
            className={cn(
              "max-w-[250px] origin-[var(--transform-origin)] rounded-lg border border-white/[0.13] bg-[#1f1f1f]/98 px-2.5 py-2 text-left text-[11.5px] leading-snug text-[#d4d4d4]",
              "shadow-[0_16px_40px_-8px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl",
              "transition-[transform,opacity] duration-150 ease-out",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
              className
            )}
          >
            {title && (
              <div className="mb-0.5 font-medium text-[#fafafa]">{title}</div>
            )}
            <div className="text-[#a3a3a3]">{content}</div>
            <Tooltip.Arrow className="data-[side=top]:bottom-[-5px] data-[side=bottom]:top-[-5px] data-[side=left]:right-[-5px] data-[side=right]:left-[-5px]">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                <path
                  d="M0 0L5 5L10 0"
                  className="fill-[#1f1f1f] stroke-white/[0.13]"
                  strokeWidth="1"
                />
              </svg>
            </Tooltip.Arrow>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export const PERMISSION_TIER_TOOLTIPS = {
  standard: {
    title: "Standard (Sandboxed)",
    description:
      "Uses sandbox-safe scopes only (AI generation & Shared Context Bus). Runs immediately in Browser WASM and Desktop with zero host access.",
  },
  elevated: {
    title: "Elevated (Desktop Prompt)",
    description:
      "Requests host capabilities such as filesystem writes, shell execution, or local stdio MCP. Requires click-to-approve guardrails on Desktop.",
  },
} as const;

export const RUNTIME_TOOLTIPS = {
  wasm: {
    title: "WASM + Desktop",
    description:
      "Compiles to WebAssembly (wasm32) for zero-install browser preview and runs natively at 120fps on Orthese Desktop (Rust + GPUI).",
  },
  desktop: {
    title: "Desktop Native (GPUI)",
    description:
      "Requires native Orthese Desktop (macOS Apple Silicon, Windows, Linux) for local repo, shell, or local CLIProxyAPI access.",
  },
} as const;

export const PERMISSION_SCOPE_DESCRIPTIONS: Record<string, string> = {
  "ai:generate":
    "Stream completions and structured tool calls through Orthese Router or local models.",
  "context:send":
    "Publish typed payloads (specs, HTML bundles, diffs) onto the Shared Context Bus.",
  "context:receive":
    "Subscribe to typed payloads emitted by other Pieces on the same canvas.",
  "storage:local":
    "Persist lightweight Piece state in isolated workspace storage.",
  "fs:read":
    "Read files inside explicitly granted workspace directories on Desktop.",
  "fs:write":
    "Propose and write file diffs inside granted folders with click-to-approve review.",
  "shell:exec":
    "Run terminal commands (tests, builds, linters) inside a per-turn approval gate.",
  "mcp:remote":
    "Connect to allowlisted Streamable HTTP MCP servers configured in the workspace hub.",
  "mcp:local":
    "Spawn allowlisted local stdio MCP servers on Desktop.",
  "net:fetch":
    "Perform outbound HTTPS requests to domains declared in the Piece manifest.",
  "db:read":
    "Run read-only SQL queries against configured workspace databases.",
};

export function describePermissionScope(scope: string): string {
  return (
    PERMISSION_SCOPE_DESCRIPTIONS[scope] ??
    `Declared capability scope (${scope}) enforced by the Orthese runtime permission sandbox.`
  );
}
