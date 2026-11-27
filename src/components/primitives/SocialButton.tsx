"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type SocialBrand =
  | "google"
  | "github"
  | "apple"
  | "discord"
  | "microsoft"
  | "x"
  | "custom";

export interface SocialButtonProps {
  brand: SocialBrand;
  appearance?: "surface" | "solid" | "colorful";
  size?: "sm" | "md";
  fullWidth?: boolean;
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
  children?: ReactNode;
  customConfig?: {
    label?: string;
    icon: ReactNode;
    accentBg?: string;
  };
  className?: string;
  testId?: string;
}

const BRAND_META: Record<
  Exclude<SocialBrand, "custom">,
  { label: string; colorfulClass: string }
> = {
  google: {
    label: "Google",
    colorfulClass:
      "bg-[#1a73e8] border-[#3b82f6]/40 text-white hover:bg-[#1967d2]",
  },
  github: {
    label: "GitHub",
    colorfulClass:
      "bg-[#24292f] border-white/[0.16] text-white hover:bg-[#2f363d]",
  },
  apple: {
    label: "Apple",
    colorfulClass:
      "bg-[#fafafa] border-white/20 text-[#121212] hover:bg-white",
  },
  discord: {
    label: "Discord",
    colorfulClass:
      "bg-[#5865f2] border-[#7983f5]/40 text-white hover:bg-[#4752c4]",
  },
  microsoft: {
    label: "Microsoft",
    colorfulClass:
      "bg-[#2f2f2f] border-white/[0.14] text-white hover:bg-[#3a3a3a]",
  },
  x: {
    label: "X",
    colorfulClass:
      "bg-[#171717] border-white/[0.16] text-white hover:bg-[#1a1c22]",
  },
};

function BrandMark({
  brand,
  colorful,
}: {
  brand: Exclude<SocialBrand, "custom">;
  colorful: boolean;
}) {
  switch (brand) {
    case "google":
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill={colorful ? "currentColor" : "#4285F4"}
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
          />
          <path
            fill={colorful ? "currentColor" : "#34A853"}
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
          />
          <path
            fill={colorful ? "currentColor" : "#FBBC05"}
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
          />
          <path
            fill={colorful ? "currentColor" : "#EA4335"}
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
          />
        </svg>
      );
    case "github":
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
          />
        </svg>
      );
    case "apple":
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43Zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45Z" />
        </svg>
      );
    case "discord":
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill={colorful ? "currentColor" : "#5865F2"} aria-hidden="true">
          <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
        </svg>
      );
    case "microsoft":
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 21 21" aria-hidden="true">
          <rect x="1" y="1" width="9" height="9" fill={colorful ? "currentColor" : "#F25022"} />
          <rect x="11" y="1" width="9" height="9" fill={colorful ? "currentColor" : "#7FBA00"} />
          <rect x="1" y="11" width="9" height="9" fill={colorful ? "currentColor" : "#00A4EF"} />
          <rect x="11" y="11" width="9" height="9" fill={colorful ? "currentColor" : "#FFB900"} />
        </svg>
      );
    case "x":
      return (
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
  }
}

export function SocialButton({
  brand,
  appearance = "surface",
  size = "md",
  fullWidth = false,
  iconOnly = false,
  loading = false,
  disabled = false,
  href,
  onClick,
  children,
  customConfig,
  className,
  testId,
}: SocialButtonProps) {
  const brandLabel =
    brand === "custom"
      ? customConfig?.label ?? "SSO"
      : BRAND_META[brand].label;

  const textLabel = children ?? `Continue with ${brandLabel}`;

  const appearanceClass =
    appearance === "colorful"
      ? brand === "custom"
        ? customConfig?.accentBg ?? "bg-white/[0.08] border-white/[0.15] text-[#fafafa] hover:bg-white/[0.12]"
        : BRAND_META[brand].colorfulClass
      : appearance === "solid"
        ? "bg-[#fafafa] border-white/25 text-[#121212] hover:bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        : "bg-[#262626] border-white/[0.12] text-[#fafafa] hover:bg-[#2e2e2e] hover:border-white/[0.2] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]";

  const sizeClass = iconOnly
    ? size === "sm"
      ? "h-8 w-8"
      : "h-9 w-9"
    : size === "sm"
      ? "h-8 px-3 text-[12.5px]"
      : "h-9 px-4 text-[13px]";

  const classes = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-lg border font-medium transition-all duration-150 select-none",
    fullWidth && !iconOnly && "w-full",
    sizeClass,
    appearanceClass,
    disabled || loading
      ? "opacity-55 pointer-events-none"
      : "cursor-pointer active:scale-[0.99]",
    className
  );

  const iconNode = loading ? (
    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
  ) : brand === "custom" ? (
    customConfig?.icon
  ) : (
    <BrandMark brand={brand} colorful={appearance === "colorful"} />
  );

  if (href && !disabled && !loading) {
    return (
      <a
        href={href}
        data-testid={testId}
        aria-label={iconOnly ? `Continue with ${brandLabel}` : undefined}
        className={classes}
      >
        {iconNode}
        {!iconOnly && <span className="truncate">{textLabel}</span>}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={iconOnly ? `Continue with ${brandLabel}` : undefined}
      className={classes}
    >
      {iconNode}
      {!iconOnly && <span className="truncate">{textLabel}</span>}
    </button>
  );
}
