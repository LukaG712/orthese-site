"use client";

import React, { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* Kbd                                                                        */
/* -------------------------------------------------------------------------- */

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-white/[0.11] bg-[#1f1f21] px-1.5 font-mono text-[10px] font-medium leading-none text-[#a3a3a3] shadow-[inset_0_-1px_0_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)]",
        className
      )}
    >
      {children}
    </kbd>
  );
}

/* -------------------------------------------------------------------------- */
/* SearchField (BoardUI Dark Mode)                                            */
/* -------------------------------------------------------------------------- */

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  kbdHint?: string;
  shape?: "pill" | "rounded";
  size?: "small" | "default";
  inputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  ariaLabel = "Search",
  kbdHint,
  shape = "rounded",
  size = "default",
  inputRef,
  className,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "group relative flex items-center border border-white/[0.09] bg-[#121212] transition-colors focus-within:border-white/[0.22] focus-within:bg-[#141416]",
        shape === "pill" ? "rounded-full" : "rounded-xl",
        size === "small" ? "h-8.5 px-2.5" : "h-9.5 px-3",
        className
      )}
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-[#737373] transition-colors group-focus-within:text-[#d4d4d4]" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full min-w-0 bg-transparent px-2 text-[12.5px] text-[#fafafa] placeholder:text-[#737373] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[#737373] hover:bg-white/[0.08] hover:text-[#fafafa] transition-colors cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      ) : kbdHint ? (
        <Kbd className="shrink-0">{kbdHint}</Kbd>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Breadcrumb                                                                 */
/* -------------------------------------------------------------------------- */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[#525252]"
                />
              )}
              {isLast ? (
                <span aria-current="page" className="font-medium text-[#fafafa]">
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="text-[#a3a3a3] transition-colors hover:text-[#fafafa] cursor-pointer"
                >
                  {item.label}
                </button>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#a3a3a3]">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Announcement                                                               */
/* -------------------------------------------------------------------------- */

export interface AnnouncementProps {
  badge?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  dismissible?: boolean;
  className?: string;
}

export function Announcement({
  badge = "Preview",
  title,
  description,
  actionLabel,
  actionHref,
  dismissible = true,
  className,
}: AnnouncementProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence initial={false}>
      {!dismissed && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#171717] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]",
            className
          )}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={cn("flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5", dismissible && "pr-7 sm:pr-0")}>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.07] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[#fafafa]">
                <Sparkles className="h-2.5 w-2.5 text-[#d4d4d4]" />
                {badge}
              </span>
              <span className="text-[13px] font-medium text-[#fafafa]">{title}</span>
              {description && (
                <span className="text-[12.5px] text-[#a3a3a3]">{description}</span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {actionLabel && actionHref && (
                <Link
                  href={actionHref}
                  className="inline-flex items-center gap-1 rounded-full border border-white/[0.1] bg-[#262626] px-2.5 py-1 text-[11.5px] font-medium text-[#fafafa] transition-colors hover:border-white/[0.2] hover:bg-[#303030]"
                >
                  <span>{actionLabel}</span>
                  <ChevronRight className="h-3 w-3 text-[#a3a3a3]" />
                </Link>
              )}
              {dismissible && (
                <button
                  type="button"
                  aria-label="Dismiss announcement"
                  onClick={() => setDismissed(true)}
                  className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] sm:static cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* TreeView                                                                   */
/* -------------------------------------------------------------------------- */

export interface TreeNodeItem {
  id: string;
  label: string;
  kind: "folder" | "file";
  badge?: string;
  children?: TreeNodeItem[];
}

export interface TreeViewProps {
  nodes: TreeNodeItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  defaultExpandedIds?: string[];
  ariaLabel?: string;
  className?: string;
}

export function TreeView({
  nodes,
  selectedId,
  onSelect,
  defaultExpandedIds = [],
  ariaLabel = "File tree",
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedIds)
  );

  function toggleFolder(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function renderNodes(items: TreeNodeItem[], depth: number) {
    return (
      <ul
        role={depth === 0 ? "tree" : "group"}
        aria-label={depth === 0 ? ariaLabel : undefined}
        className={cn(
          "space-y-0.5",
          depth > 0 && "ml-3.5 border-l border-white/[0.08] pl-2.5 mt-0.5"
        )}
      >
        {items.map((node) => {
          const isFolder = node.kind === "folder";
          const isOpen = isFolder && expanded.has(node.id);
          const isSelected = !isFolder && selectedId === node.id;

          return (
            <li
              key={node.id}
              role="treeitem"
              aria-expanded={isFolder ? isOpen : undefined}
              aria-selected={isSelected}
            >
              <button
                type="button"
                data-testid={`docs-tree-${node.id}`}
                onClick={() => (isFolder ? toggleFolder(node.id) : onSelect(node.id))}
                className={cn(
                  "group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left font-mono text-[12px] transition-colors cursor-pointer",
                  isSelected
                    ? "bg-white/[0.1] text-[#fafafa] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "text-[#a3a3a3] hover:bg-white/[0.04] hover:text-[#fafafa]"
                )}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  {isFolder ? (
                    <>
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 shrink-0 text-[#737373] transition-transform duration-150",
                          isOpen && "rotate-90 text-[#d4d4d4]"
                        )}
                      />
                      {isOpen ? (
                        <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#d4d4d4]" />
                      ) : (
                        <Folder className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
                      )}
                    </>
                  ) : (
                    <>
                      <span className="w-3 shrink-0" aria-hidden="true" />
                      <FileCode2
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          isSelected ? "text-[#fafafa]" : "text-[#737373]"
                        )}
                      />
                    </>
                  )}
                  <span className="truncate">{node.label}</span>
                </span>

                {node.badge && (
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-1.5 py-0.5 text-[9.5px] leading-none",
                      isSelected
                        ? "border-white/[0.16] bg-white/[0.08] text-[#fafafa]"
                        : "border-white/[0.07] bg-[#121212] text-[#737373]"
                    )}
                  >
                    {node.badge}
                  </span>
                )}
              </button>

              {isFolder && isOpen && node.children && node.children.length > 0 && (
                <div className="mt-0.5">{renderNodes(node.children, depth + 1)}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return <div className={cn("select-none", className)}>{renderNodes(nodes, 0)}</div>;
}

/* -------------------------------------------------------------------------- */
/* Tabs (BoardUI underline tab bar)                                           */
/* -------------------------------------------------------------------------- */

export interface TabOption<T extends string> {
  id: T;
  label: string;
  badge?: string;
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "Tabs",
  className,
}: {
  options: TabOption<T>[];
  value: T;
  onChange: (next: T) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const layoutGroup = useId();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1 overflow-x-auto border-b border-white/[0.08]",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            data-testid={`docs-tab-${opt.id}`}
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2 text-[12.5px] font-medium transition-colors cursor-pointer",
              active ? "text-[#fafafa]" : "text-[#a3a3a3] hover:text-[#fafafa]"
            )}
          >
            <span className="font-mono">{opt.label}</span>
            {opt.badge && (
              <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[#a3a3a3]">
                {opt.badge}
              </span>
            )}
            {active && (
              <motion.span
                layoutId={`boardui-tab-indicator-${layoutGroup}`}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-x-1 -bottom-px h-[2px] rounded-full bg-[#fafafa]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SegmentedControl (BoardUI exclusive pill switcher)                         */
/* -------------------------------------------------------------------------- */

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  meta?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "Segmented control",
  className,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const layoutGroup = useId();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-grid grid-flow-col auto-cols-fr rounded-xl border border-white/[0.08] bg-[#121212] p-1",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            data-testid={`docs-segment-${opt.id}`}
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer whitespace-nowrap",
              active ? "text-[#fafafa]" : "text-[#a3a3a3] hover:text-[#fafafa]"
            )}
          >
            {active && (
              <motion.span
                layoutId={`boardui-segment-pill-${layoutGroup}`}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-lg border border-white/[0.1] bg-[#262626] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              />
            )}
            <span className="relative z-10">{opt.label}</span>
            {opt.meta && (
              <span
                className={cn(
                  "relative z-10 hidden font-mono text-[10.5px] sm:inline",
                  active ? "text-[#d4d4d4]" : "text-[#737373]"
                )}
              >
                {opt.meta}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Accordion (BoardUI contained & separated variants)                         */
/* -------------------------------------------------------------------------- */

export interface AccordionEntry {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeTone?: "neutral" | "elevated" | "standard";
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionEntry[];
  variant?: "contained" | "separated";
  indicator?: "chevron" | "plus";
  allowsMultipleExpanded?: boolean;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedChange?: (next: string[]) => void;
  className?: string;
}

export function Accordion({
  items,
  variant = "contained",
  indicator = "chevron",
  allowsMultipleExpanded = false,
  defaultExpandedIds = [],
  expandedIds: controlledExpanded,
  onExpandedChange,
  className,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] =
    useState<string[]>(defaultExpandedIds);
  const expanded = controlledExpanded ?? internalExpanded;

  function toggle(id: string) {
    const isOpen = expanded.includes(id);
    let next: string[];
    if (isOpen) {
      next = expanded.filter((item) => item !== id);
    } else {
      next = allowsMultipleExpanded ? [...expanded, id] : [id];
    }
    if (onExpandedChange) {
      onExpandedChange(next);
    } else {
      setInternalExpanded(next);
    }
  }

  return (
    <div
      className={cn(
        variant === "contained"
          ? "divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717]"
          : "space-y-2.5",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = expanded.includes(item.id);
        const panelId = `accordion-panel-${item.id}`;
        const buttonId = `accordion-btn-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              variant === "separated" &&
                "overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171717] transition-colors",
              variant === "separated" && isOpen && "border-white/[0.15]"
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                data-testid={`accordion-${item.id}`}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.025] sm:px-5 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-medium text-[#fafafa]">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 font-mono text-[10px] leading-none",
                          item.badgeTone === "elevated"
                            ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
                            : item.badgeTone === "standard"
                              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                              : "border-white/[0.1] bg-[#121212] text-[#a3a3a3]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="mt-0.5 text-[12px] text-[#737373]">{item.subtitle}</p>
                  )}
                </div>

                {indicator === "plus" ? (
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#737373] transition-transform duration-200",
                      isOpen && "rotate-45 text-[#fafafa]"
                    )}
                  />
                ) : (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#737373] transition-transform duration-200",
                      isOpen && "rotate-180 text-[#fafafa]"
                    )}
                  />
                )}
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.05] px-4 py-3.5 text-[13.5px] leading-relaxed text-[#a3a3a3] sm:px-5">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Divider                                                                    */
/* -------------------------------------------------------------------------- */

export function Divider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  if (!label) {
    return (
      <hr
        className={cn("border-0 border-t border-white/[0.07]", className)}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-label={label}
      className={cn("flex items-center gap-3", className)}
    >
      <span className="h-px flex-1 bg-white/[0.07]" />
      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#737373]">
        {label}
      </span>
      <span className="h-px flex-1 bg-white/[0.07]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination (Chapter Prev/Next + Page Rail)                                 */
/* -------------------------------------------------------------------------- */

export interface PaginationPage {
  id: string;
  label: string;
  group?: string;
}

export function Pagination({
  pages,
  currentIndex,
  onSelectPage,
  className,
}: {
  pages: PaginationPage[];
  currentIndex: number;
  onSelectPage: (index: number) => void;
  className?: string;
}) {
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <nav aria-label="Documentation pagination" className={cn("space-y-5", className)}>
      {/* Prev / Next Chapter Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prevPage ? (
          <button
            type="button"
            onClick={() => onSelectPage(currentIndex - 1)}
            className="group flex flex-col items-start rounded-2xl border border-white/[0.08] bg-[#171717] p-4 text-left transition-colors hover:border-white/[0.18] hover:bg-[#1c1c1e] cursor-pointer"
          >
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#737373]">
              <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              <span>Previous</span>
            </span>
            <span className="mt-1.5 text-[14px] font-medium text-[#fafafa]">
              {prevPage.label}
            </span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextPage && (
          <button
            type="button"
            onClick={() => onSelectPage(currentIndex + 1)}
            className="group flex flex-col items-end rounded-2xl border border-white/[0.08] bg-[#171717] p-4 text-right transition-colors hover:border-white/[0.18] hover:bg-[#1c1c1e] cursor-pointer"
          >
            <span className="inline-flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#737373]">
              <span>Next</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-1.5 text-[14px] font-medium text-[#fafafa]">
              {nextPage.label}
            </span>
          </button>
        )}
      </div>

      {/* BoardUI Compact Page-Number Rail */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[11.5px] text-[#737373] tabular-nums">
          Section {currentIndex + 1} of {pages.length}
        </span>

        <div className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#171717] p-1">
          <button
            type="button"
            disabled={!prevPage}
            aria-label="Previous section"
            onClick={() => prevPage && onSelectPage(currentIndex - 1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#a3a3a3] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {pages.map((page, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={page.id}
                type="button"
                aria-label={`Jump to ${page.label}`}
                aria-current={active ? "page" : undefined}
                onClick={() => onSelectPage(idx)}
                className={cn(
                  "inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 font-mono text-[11.5px] tabular-nums transition-colors cursor-pointer",
                  active
                    ? "bg-[#fafafa] font-medium text-[#121212]"
                    : "text-[#a3a3a3] hover:bg-white/[0.07] hover:text-[#fafafa]"
                )}
              >
                {idx + 1}
              </button>
            );
          })}

          <button
            type="button"
            disabled={!nextPage}
            aria-label="Next section"
            onClick={() => nextPage && onSelectPage(currentIndex + 1)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#a3a3a3] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
