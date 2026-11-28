"use client";

import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ComponentType,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

/**
 * BoardUI Button (https://www.boardui.com/components/button)
 *
 * Variant matrix: primary | secondary | ghost | danger
 * Size matrix:
 *   - medium: h-9 (36px), rounded-[10px], px-3, text-[13.5px] font-medium
 *   - small:  h-8 (32px), rounded-lg (8px), px-2.5, text-[12.5px] font-medium
 *   - xs:     h-7 (28px), rounded-md (6px), px-2, text-[11.5px] font-medium
 */

export type BoardButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type BoardButtonSize = "medium" | "small" | "xs";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const BASE_CLASS = [
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap overflow-hidden",
  "font-sans font-medium select-none cursor-pointer",
  "button-press-motion",
  "outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8]/75 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]",
  "disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed",
].join(" ");

const SIZE_CLASSES: Record<BoardButtonSize, string> = {
  medium: "h-9 rounded-[10px] px-3.5 text-[13.5px]",
  small: "h-8 rounded-lg px-3 text-[12.5px]",
  xs: "h-7 rounded-md px-2.5 text-[11.5px]",
};

const ICON_ONLY_SIZE_CLASSES: Record<BoardButtonSize, string> = {
  medium: "h-9 w-9 p-0",
  small: "h-8 w-8 p-0",
  xs: "h-7 w-7 p-0",
};

const ICON_CLASSES: Record<BoardButtonSize, string> = {
  medium: "h-4 w-4 shrink-0",
  small: "h-3.5 w-3.5 shrink-0",
  xs: "h-3.5 w-3.5 shrink-0",
};

const VARIANT_CLASSES: Record<BoardButtonVariant, string> = {
  primary: "bg-button-primary",
  secondary: "bg-button-secondary",
  danger: "bg-button-danger",
  ghost:
    "bg-transparent text-[#d4d4d4] hover:bg-white/[0.07] hover:text-[#fafafa] active:bg-white/[0.11]",
};

export function boardButtonClasses({
  variant = "primary",
  size = "medium",
  iconOnly = false,
  className,
}: {
  variant?: BoardButtonVariant;
  size?: BoardButtonSize;
  iconOnly?: boolean;
  className?: string;
} = {}) {
  return cn(
    BASE_CLASS,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    iconOnly && ICON_ONLY_SIZE_CLASSES[size],
    className
  );
}

export interface BoardButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: BoardButtonVariant;
  size?: BoardButtonSize;
  iconOnly?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  children?: ReactNode;
}

export function BoardButton({
  variant = "primary",
  size = "medium",
  iconOnly = false,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
  className,
  type = "button",
  ...props
}: BoardButtonProps) {
  return (
    <button
      type={type}
      className={boardButtonClasses({ variant, size, iconOnly, className })}
      {...props}
    >
      {Leading ? <Leading className={ICON_CLASSES[size]} aria-hidden="true" /> : null}
      {!iconOnly && children}
      {!iconOnly && Trailing ? <Trailing className={ICON_CLASSES[size]} aria-hidden="true" /> : null}
    </button>
  );
}

export interface BoardButtonLinkProps
  extends Omit<ComponentProps<typeof Link>, "children"> {
  variant?: BoardButtonVariant;
  size?: BoardButtonSize;
  iconOnly?: boolean;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  children?: ReactNode;
}

export function BoardButtonLink({
  variant = "primary",
  size = "medium",
  iconOnly = false,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
  className,
  ...props
}: BoardButtonLinkProps) {
  return (
    <Link
      className={boardButtonClasses({ variant, size, iconOnly, className })}
      {...props}
    >
      {Leading ? <Leading className={ICON_CLASSES[size]} aria-hidden="true" /> : null}
      {!iconOnly && children}
      {!iconOnly && Trailing ? <Trailing className={ICON_CLASSES[size]} aria-hidden="true" /> : null}
    </Link>
  );
}
