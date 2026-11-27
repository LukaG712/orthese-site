"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Copy,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Film,
  Info,
  Presentation,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  ContextMenuTrigger,
  type ContextMenuEntry,
} from "@/components/primitives/ContextMenu";
import { cn } from "@/lib/cn";

export type AttachmentKind =
  | "image"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "code"
  | "video";

export interface ComposerAttachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  src?: string;
  /** 0..100 while queued/uploading; undefined means already landed */
  progress?: number;
  sizeLabel?: string;
}

export function inferAttachmentKind(filename: string): AttachmentKind {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(ext)) return "image";
  if (["xlsx", "xls", "csv", "tsv", "numbers"].includes(ext)) return "spreadsheet";
  if (["key", "pptx", "ppt", "odp"].includes(ext)) return "presentation";
  if (["mp4", "mov", "webm", "mkv", "avi"].includes(ext)) return "video";
  if (
    ["ts", "tsx", "js", "jsx", "json", "rs", "py", "go", "css", "html", "sql", "toml", "yaml", "yml"].includes(
      ext
    )
  ) {
    return "code";
  }
  return "document";
}

/** Crisp SVG data URI thumbnail for previewing image attachments without external asset hits */
export const SAMPLE_IMAGE_THUMBNAIL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="48%" stop-color="#312e81"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><radialGradient id="glow" cx="62%" cy="32%" r="55%"><stop offset="0%" stop-color="#38bdf8" stop-opacity="0.72"/><stop offset="50%" stop-color="#e879f9" stop-opacity="0.35"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="112" height="112" fill="url(#g)"/><rect width="112" height="112" fill="url(#glow)"/><rect x="14" y="22" width="84" height="52" rx="8" fill="#0b0c10" fill-opacity="0.78" stroke="#ffffff" stroke-opacity="0.22"/><rect x="24" y="34" width="42" height="6" rx="3" fill="#f7f8f8" fill-opacity="0.88"/><rect x="24" y="46" width="60" height="4" rx="2" fill="#818cf8" fill-opacity="0.72"/><rect x="24" y="55" width="32" height="4" rx="2" fill="#38bdf8" fill-opacity="0.6"/><circle cx="84" cy="86" r="9" fill="#f7f8f8" fill-opacity="0.9"/></svg>`
  );

const KIND_STYLES: Record<
  Exclude<AttachmentKind, "image">,
  { icon: typeof FileText; colorClass: string; bgClass: string }
> = {
  document: {
    icon: FileText,
    colorClass: "text-sky-400",
    bgClass: "bg-sky-500/12",
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/12",
  },
  presentation: {
    icon: Presentation,
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/12",
  },
  code: {
    icon: FileCode2,
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-500/12",
  },
  video: {
    icon: Film,
    colorClass: "text-fuchsia-400",
    bgClass: "bg-fuchsia-500/12",
  },
};

/**
 * Sequential upload queue simulator: any attachment with `progress: 0` waits its turn,
 * then traces 0 -> 100 over `uploadDuration` ms with `uploadGap` ms between files.
 */
export function useAttachmentQueue(
  attachments: ComposerAttachment[],
  setAttachments: React.Dispatch<React.SetStateAction<ComposerAttachment[]>>,
  options?: {
    uploadDuration?: number;
    uploadGap?: number;
    onUploadComplete?: (file: ComposerAttachment) => void;
    onAllUploaded?: () => void;
  }
) {
  const uploadDuration = options?.uploadDuration ?? 1050;
  const uploadGap = options?.uploadGap ?? 220;
  const activeIdRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const gapTimerRef = useRef<number | null>(null);
  const onCompleteRef = useRef(options?.onUploadComplete);
  const onAllRef = useRef(options?.onAllUploaded);

  useEffect(() => {
    onCompleteRef.current = options?.onUploadComplete;
    onAllRef.current = options?.onAllUploaded;
  }, [options?.onUploadComplete, options?.onAllUploaded]);

  useEffect(() => {
    // If an active upload was removed mid-flight, reset activeIdRef
    if (
      activeIdRef.current &&
      !attachments.some((a) => a.id === activeIdRef.current)
    ) {
      activeIdRef.current = null;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (gapTimerRef.current !== null) window.clearTimeout(gapTimerRef.current);
    }

    if (activeIdRef.current) return;

    const nextQueued = attachments.find(
      (a) => typeof a.progress === "number" && a.progress < 100
    );
    if (!nextQueued) return;

    const targetId = nextQueued.id;
    activeIdRef.current = targetId;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / uploadDuration);
      // Ease-out curve for crisp ring landing
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      const pct = Math.min(100, Math.round(eased * 100));

      setAttachments((prev) =>
        prev.map((item) =>
          item.id === targetId ? { ...item, progress: pct } : item
        )
      );

      if (ratio < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        onCompleteRef.current?.({ ...nextQueued, progress: 100 });
        gapTimerRef.current = window.setTimeout(() => {
          // Clear progress to undefined -> landed state
          setAttachments((prev) => {
            const updated = prev.map((item) =>
              item.id === targetId ? { ...item, progress: undefined } : item
            );
            const stillPending = updated.some(
              (item) => typeof item.progress === "number" && item.progress < 100
            );
            if (!stillPending) {
              onAllRef.current?.();
            }
            return updated;
          });
          activeIdRef.current = null;
        }, uploadGap);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [attachments, setAttachments, uploadDuration, uploadGap]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (gapTimerRef.current !== null) window.clearTimeout(gapTimerRef.current);
    };
  }, []);
}

export function ComposerAttachmentTile({
  attachment,
  onRemove,
  onInsertMention,
}: {
  attachment: ComposerAttachment;
  onRemove: () => void;
  onInsertMention?: (filename: string) => void;
}) {
  const isUploading =
    typeof attachment.progress === "number" && attachment.progress < 100;
  const pct = attachment.progress ?? 100;
  const isImage = attachment.kind === "image" && Boolean(attachment.src);

  // Perimeter of 52x52 rounded rect (rx=11) ≈ 4*(52-22) + 2*pi*11 ≈ 189.1
  const perimeter = 189.1;
  const dashOffset = perimeter * (1 - pct / 100);

  const menuEntries: ContextMenuEntry[] = [
    {
      id: "mention",
      label: "Mention in prompt",
      icon: Copy,
      shortcut: "@",
      onSelect: () => {
        if (onInsertMention) {
          onInsertMention(attachment.name);
        } else {
          navigator.clipboard?.writeText(`@${attachment.name}`).catch(() => {});
          toast.info(`Copied @${attachment.name}`);
        }
      },
    },
    {
      id: "inspect",
      label: "Inspect attachment",
      icon: Info,
      onSelect: () => {
        toast.info(attachment.name, {
          description: `${attachment.kind} · ${attachment.sizeLabel ?? "ready in workspace context"}`,
        });
      },
    },
    { type: "separator" },
    {
      id: "remove",
      label: "Remove",
      icon: Trash2,
      shortcut: "⌫",
      variant: "danger",
      onSelect: onRemove,
    },
  ];

  const nonImageMeta =
    attachment.kind !== "image" ? KIND_STYLES[attachment.kind] : null;
  const NonImageIcon = nonImageMeta?.icon ?? FileText;

  return (
    <ContextMenuTrigger
      ariaLabel={`Actions for ${attachment.name}`}
      entries={menuEntries}
      className="inline-flex"
    >
      {({ isOpen }) => (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.84 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          data-testid={`attachment-tile-${attachment.kind}`}
          title={`${attachment.name} · Right-click for actions`}
          className={cn(
            "group relative flex h-14 w-14 flex-col items-center justify-center rounded-xl border bg-[#16181f] text-center select-none transition-colors",
            isOpen
              ? "border-[#818cf8]/70 ring-2 ring-[#818cf8]/25"
              : "border-white/[0.1] hover:border-white/[0.2]"
          )}
        >
          {/* Image fills tile edge-to-edge; non-images show crisp 24px icon + 9px truncated filename */}
          {isImage ? (
            <div className="relative h-full w-full overflow-hidden rounded-[11px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachment.src}
                alt={attachment.name}
                className={cn(
                  "h-full w-full object-cover transition-all duration-300",
                  isUploading && "scale-[1.03] brightness-75"
                )}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-1 pb-0.5 pt-2">
                <span className="block w-full truncate text-[8.5px] font-medium text-white/90">
                  {attachment.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center px-1.5">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  nonImageMeta?.bgClass
                )}
              >
                <NonImageIcon
                  className={cn("h-4 w-4", nonImageMeta?.colorClass)}
                />
              </span>
              <span className="mt-1 w-full truncate text-[9px] leading-none text-[#c4c8d0]">
                {attachment.name}
              </span>
            </div>
          )}

          {/* Clockwise perimeter progress ring while uploading */}
          {isUploading && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-14 w-14"
              viewBox="0 0 56 56"
            >
              <rect
                x="1.5"
                y="1.5"
                width="53"
                height="53"
                rx="11"
                fill="none"
                stroke="rgba(129, 140, 248, 0.95)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeDasharray={perimeter}
                strokeDashoffset={dashOffset}
              />
            </svg>
          )}

          {/* Top-right corner: 9px % counter blurs out at 100%, dismiss × blurs in on exact same spot */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${attachment.name}`}
            className={cn(
              "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border px-1 transition-all duration-200 cursor-pointer",
              isImage && !isUploading
                ? "border-white/30 bg-white/85 text-[#08090a] backdrop-blur-md hover:bg-white shadow-md"
                : "border-white/[0.16] bg-[#0c0d11]/95 text-[#c4c8d0] hover:bg-white hover:text-[#08090a]"
            )}
          >
            <span
              className={cn(
                "font-mono text-[8.5px] font-medium tabular-nums leading-none transition-all duration-200",
                isUploading
                  ? "opacity-100 blur-0 scale-100"
                  : "pointer-events-none absolute opacity-0 blur-[3px] scale-75"
              )}
            >
              {pct}%
            </span>
            <X
              className={cn(
                "h-2.5 w-2.5 transition-all duration-200",
                !isUploading
                  ? "opacity-100 blur-0 scale-100"
                  : "pointer-events-none absolute opacity-0 blur-[3px] scale-75"
              )}
            />
          </button>
        </motion.div>
      )}
    </ContextMenuTrigger>
  );
}

export function ComposerAttachmentStrip({
  attachments,
  onRemove,
  onInsertMention,
  className,
}: {
  attachments: ComposerAttachment[];
  onRemove: (id: string) => void;
  onInsertMention?: (filename: string) => void;
  className?: string;
}) {
  if (attachments.length === 0) return null;

  return (
    <div
      data-testid="composer-attachment-strip"
      className={cn("flex flex-wrap items-center gap-2.5", className)}
    >
      {attachments.map((att) => (
        <ComposerAttachmentTile
          key={att.id}
          attachment={att}
          onRemove={() => onRemove(att.id)}
          onInsertMention={onInsertMention}
        />
      ))}
    </div>
  );
}
