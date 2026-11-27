"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ContextMenuItemDef {
  type?: "item";
  id: string;
  label: string;
  icon?: LucideIcon;
  shortcut?: string;
  variant?: "default" | "danger";
  disabled?: boolean;
  checked?: boolean;
  keepOpen?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuSubmenuDef {
  type: "submenu";
  id: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
  items: ContextMenuEntry[];
}

export interface ContextMenuSeparatorDef {
  type: "separator";
  id?: string;
}

export interface ContextMenuSectionDef {
  type: "section";
  id: string;
  title?: string;
  items: ContextMenuItemDef[];
}

export type ContextMenuEntry =
  | ContextMenuItemDef
  | ContextMenuSubmenuDef
  | ContextMenuSeparatorDef
  | ContextMenuSectionDef;

interface ContextMenuTriggerProps {
  ariaLabel: string;
  entries: ContextMenuEntry[];
  disabled?: boolean;
  className?: string;
  children: ReactNode | ((state: { isOpen: boolean }) => ReactNode);
}

interface MenuCoords {
  x: number;
  y: number;
}

function flattenInteractiveIds(entries: ContextMenuEntry[]): string[] {
  const ids: string[] = [];
  for (const entry of entries) {
    if (entry.type === "separator") continue;
    if (entry.type === "section") {
      for (const item of entry.items) {
        if (!item.disabled) ids.push(item.id);
      }
      continue;
    }
    if (!entry.disabled) {
      ids.push(entry.id);
    }
  }
  return ids;
}

function findEntryById(
  entries: ContextMenuEntry[],
  id: string
): ContextMenuItemDef | ContextMenuSubmenuDef | null {
  for (const entry of entries) {
    if (entry.type === "separator") continue;
    if (entry.type === "section") {
      const hit = entry.items.find((i) => i.id === id);
      if (hit) return hit;
      continue;
    }
    if (entry.id === id) return entry;
  }
  return null;
}

function SubmenuPanel({
  submenu,
  anchorRect,
  onCloseAll,
}: {
  submenu: ContextMenuSubmenuDef;
  anchorRect: DOMRect;
  onCloseAll: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: anchorRect.right + 4,
    top: anchorRect.top - 4,
  });

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    let left = anchorRect.right + 4;
    let top = anchorRect.top - 4;
    if (left + rect.width > window.innerWidth - 8) {
      left = Math.max(8, anchorRect.left - rect.width - 4);
    }
    if (top + rect.height > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - rect.height - 8);
    }
    setPos({ left, top });
  }, [anchorRect]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      role="menu"
      data-orthese-ctx-submenu="true"
      aria-label={submenu.label}
      style={{ left: pos.left, top: pos.top }}
      className="fixed z-[110] min-w-[188px] rounded-xl border border-white/[0.13] bg-[#242424]/98 p-1 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
    >
      {submenu.items.map((entry, idx) => {
        if (entry.type === "separator") {
          return (
            <div
              key={entry.id ?? `sub-sep-${idx}`}
              role="separator"
              className="my-1 h-px bg-white/[0.08]"
            />
          );
        }
        if (entry.type === "section" || entry.type === "submenu") return null;
        const Icon = entry.icon;
        return (
          <button
            key={entry.id}
            type="button"
            role="menuitem"
            disabled={entry.disabled}
            onClick={() => {
              if (entry.disabled) return;
              entry.onSelect?.();
              if (!entry.keepOpen) onCloseAll();
            }}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
              entry.disabled
                ? "cursor-not-allowed opacity-40 text-[#a3a3a3]"
                : entry.variant === "danger"
                  ? "cursor-pointer text-rose-300 hover:bg-rose-500/15 hover:text-rose-200"
                  : "cursor-pointer text-[#d4d4d4] hover:bg-white/[0.08] hover:text-[#fafafa]"
            )}
          >
            <span className="flex items-center gap-2 min-w-0">
              {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-75" />}
              <span className="truncate">{entry.label}</span>
            </span>
            {entry.shortcut && (
              <span className="shrink-0 font-mono text-[10.5px] text-[#737373]">
                {entry.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>,
    document.body
  );
}

export function ContextMenuTrigger({
  ariaLabel,
  entries,
  disabled = false,
  className,
  children,
}: ContextMenuTriggerProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<MenuCoords>({ x: 0, y: 0 });
  const [clampedPos, setClampedPos] = useState<MenuCoords>({ x: 0, y: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    def: ContextMenuSubmenuDef;
    rect: DOMRect;
  } | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const longPressTimerRef = useRef<number | null>(null);

  const closeMenu = useCallback((returnFocus = false) => {
    setOpen(false);
    setOpenSubmenu(null);
    setActiveId(null);
    if (returnFocus && triggerRef.current) {
      const focusable = triggerRef.current.querySelector<HTMLElement>(
        "button, [tabindex], a"
      );
      (focusable ?? triggerRef.current).focus();
    }
  }, []);

  const openAt = useCallback(
    (x: number, y: number, highlightFirst = false) => {
      if (disabled) return;
      setCoords({ x, y });
      setClampedPos({ x, y });
      setOpenSubmenu(null);
      setOpen(true);
      if (highlightFirst) {
        const ids = flattenInteractiveIds(entries);
        setActiveId(ids[0] ?? null);
      } else {
        setActiveId(null);
      }
    },
    [disabled, entries]
  );

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let nextX = coords.x;
    let nextY = coords.y;
    if (nextX + rect.width > window.innerWidth - 10) {
      nextX = Math.max(10, window.innerWidth - rect.width - 10);
    }
    if (nextY + rect.height > window.innerHeight - 10) {
      nextY = Math.max(10, window.innerHeight - rect.height - 10);
    }
    setClampedPos({ x: nextX, y: nextY });
  }, [open, coords]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-orthese-ctx-submenu]")) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        closeMenu(false);
      }
    };
    const handleScroll = () => closeMenu(false);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
        return;
      }

      const ids = flattenInteractiveIds(entries);
      if (ids.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const cur = activeId ? ids.indexOf(activeId) : -1;
        setActiveId(ids[(cur + 1) % ids.length]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const cur = activeId ? ids.indexOf(activeId) : 0;
        setActiveId(ids[(cur - 1 + ids.length) % ids.length]);
      } else if (e.key === "ArrowLeft" && openSubmenu) {
        e.preventDefault();
        setOpenSubmenu(null);
      } else if ((e.key === "Enter" || e.key === "ArrowRight") && activeId) {
        const target = findEntryById(entries, activeId);
        if (!target) return;
        if (target.type === "submenu") {
          e.preventDefault();
          const btn = menuRef.current?.querySelector<HTMLElement>(
            `[data-ctx-id="${target.id}"]`
          );
          if (btn) {
            setOpenSubmenu({ def: target, rect: btn.getBoundingClientRect() });
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          target.onSelect?.();
          if (!target.keepOpen) closeMenu(false);
        }
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, entries, activeId, openSubmenu, closeMenu]);

  function handleContextMenu(e: ReactMouseEvent<HTMLDivElement>) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    openAt(e.clientX, e.clientY, false);
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") {
      e.preventDefault();
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      openAt(rect.left + Math.min(24, rect.width / 2), rect.bottom + 4, true);
    }
  }

  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    if (disabled || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    longPressTimerRef.current = window.setTimeout(() => {
      openAt(x, y, false);
    }, 480);
  }

  function clearLongPress() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function renderItem(item: ContextMenuItemDef) {
    const Icon = item.icon;
    const isActive = activeId === item.id;
    const hasCheck = typeof item.checked === "boolean";

    return (
      <button
        key={item.id}
        type="button"
        role={hasCheck ? "menuitemcheckbox" : "menuitem"}
        aria-checked={hasCheck ? item.checked : undefined}
        data-ctx-id={item.id}
        disabled={item.disabled}
        onMouseEnter={() => {
          setActiveId(item.id);
          setOpenSubmenu(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (item.disabled) return;
          item.onSelect?.();
          if (!item.keepOpen) closeMenu(false);
        }}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
          item.disabled
            ? "cursor-not-allowed opacity-40 text-[#a3a3a3]"
            : item.variant === "danger"
              ? cn(
                  "cursor-pointer text-rose-300",
                  isActive ? "bg-rose-500/15 text-rose-200" : "hover:bg-rose-500/15 hover:text-rose-200"
                )
              : cn(
                  "cursor-pointer text-[#d4d4d4]",
                  isActive ? "bg-white/[0.08] text-[#fafafa]" : "hover:bg-white/[0.08] hover:text-[#fafafa]"
                )
        )}
      >
        <span className="flex items-center gap-2 min-w-0">
          {hasCheck ? (
            <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
              {item.checked && <Check className="h-3.5 w-3.5 text-[#818cf8]" />}
            </span>
          ) : Icon ? (
            <Icon className="h-3.5 w-3.5 shrink-0 opacity-75" />
          ) : null}
          <span className="truncate">{item.label}</span>
        </span>
        {item.shortcut && (
          <span className="shrink-0 font-mono text-[10.5px] text-[#737373]">
            {item.shortcut}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      ref={triggerRef}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={clearLongPress}
      onTouchMove={clearLongPress}
      className={className}
    >
      {typeof children === "function" ? children({ isOpen: open }) : children}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            data-testid="orthese-context-menu"
            aria-label={ariaLabel}
            style={{ left: clampedPos.x, top: clampedPos.y }}
            className="fixed z-[100] min-w-[216px] rounded-xl border border-white/[0.13] bg-[#1f1f1f]/98 p-1 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
          >
            {entries.map((entry, idx) => {
              if (entry.type === "separator") {
                return (
                  <div
                    key={entry.id ?? `sep-${idx}`}
                    role="separator"
                    className="my-1 h-px bg-white/[0.08]"
                  />
                );
              }
              if (entry.type === "section") {
                return (
                  <div key={entry.id} role="group" aria-label={entry.title}>
                    {entry.title && (
                      <div className="px-2.5 pb-1 pt-1 text-[10.5px] font-medium text-[#737373]">
                        {entry.title}
                      </div>
                    )}
                    {entry.items.map(renderItem)}
                  </div>
                );
              }
              if (entry.type === "submenu") {
                const Icon = entry.icon;
                const isActive = activeId === entry.id || openSubmenu?.def.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={openSubmenu?.def.id === entry.id}
                    data-ctx-id={entry.id}
                    disabled={entry.disabled}
                    onMouseEnter={(e) => {
                      if (entry.disabled) return;
                      setActiveId(entry.id);
                      setOpenSubmenu({
                        def: entry,
                        rect: e.currentTarget.getBoundingClientRect(),
                      });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (entry.disabled) return;
                      setOpenSubmenu({
                        def: entry,
                        rect: e.currentTarget.getBoundingClientRect(),
                      });
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] transition-colors",
                      entry.disabled
                        ? "cursor-not-allowed opacity-40 text-[#a3a3a3]"
                        : cn(
                            "cursor-pointer text-[#d4d4d4]",
                            isActive
                              ? "bg-white/[0.08] text-[#fafafa]"
                              : "hover:bg-white/[0.08] hover:text-[#fafafa]"
                          )
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-75" />}
                      <span className="truncate">{entry.label}</span>
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                  </button>
                );
              }
              return renderItem(entry);
            })}

            {openSubmenu && (
              <SubmenuPanel
                submenu={openSubmenu.def}
                anchorRect={openSubmenu.rect}
                onCloseAll={() => closeMenu(false)}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
