"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

type PlatformFamily = "macos" | "windows" | "linux" | "unknown";

export interface DownloadOption {
  id: string;
  family: Exclude<PlatformFamily, "unknown">;
  label: string;
  archHint: string;
  filename: string;
  fullLabel: string;
}

interface DownloadGroup {
  family: Exclude<PlatformFamily, "unknown">;
  heading: string;
  options: DownloadOption[];
}

const DOWNLOAD_GROUPS: DownloadGroup[] = [
  {
    family: "macos",
    heading: "macOS",
    options: [
      {
        id: "macos-arm64",
        family: "macos",
        label: "Apple Silicon",
        archHint: ".dmg",
        filename: "Orthese-Desktop-macos-arm64.dmg",
        fullLabel: "macOS (Apple Silicon)",
      },
      {
        id: "macos-x64",
        family: "macos",
        label: "Intel",
        archHint: ".dmg",
        filename: "Orthese-Desktop-macos-x64.dmg",
        fullLabel: "macOS (Intel)",
      },
    ],
  },
  {
    family: "windows",
    heading: "Windows",
    options: [
      {
        id: "windows-x64",
        family: "windows",
        label: "x64",
        archHint: ".msi",
        filename: "Orthese-Desktop-windows-x64.msi",
        fullLabel: "Windows (x64)",
      },
      {
        id: "windows-arm64",
        family: "windows",
        label: "ARM64",
        archHint: ".msi",
        filename: "Orthese-Desktop-windows-arm64.msi",
        fullLabel: "Windows (ARM64)",
      },
    ],
  },
  {
    family: "linux",
    heading: "Linux",
    options: [
      {
        id: "linux-universal",
        family: "linux",
        label: "x64 and ARM64",
        archHint: ".AppImage",
        filename: "Orthese-Desktop-linux.AppImage",
        fullLabel: "Linux (x64 & ARM64)",
      },
    ],
  },
];

const ALL_OPTIONS: DownloadOption[] = DOWNLOAD_GROUPS.flatMap((g) => g.options);

interface DetectedTarget {
  family: PlatformFamily;
  optionId: string | null;
  buttonLabel: string;
}

const DEFAULT_TARGET: DetectedTarget = {
  family: "unknown",
  optionId: null,
  buttonLabel: "Download Desktop",
};

interface NavigatorUAData {
  platform?: string;
  mobile?: boolean;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
}

function detectInitialPlatform(): DetectedTarget {
  if (typeof navigator === "undefined") return DEFAULT_TARGET;

  const nav = navigator as Navigator & { userAgentData?: NavigatorUAData };
  const ua = (navigator.userAgent || "").toLowerCase();
  const plat = (nav.userAgentData?.platform || navigator.platform || "").toLowerCase();

  // Mobile visitors get the generic label and open the platform picker on click
  if (nav.userAgentData?.mobile || /iphone|ipad|ipod|android/.test(ua)) {
    return DEFAULT_TARGET;
  }

  const isArm = /arm64|aarch64/.test(ua) || /arm64|aarch64/.test(plat);

  if (plat.includes("mac") || ua.includes("macintosh") || ua.includes("mac os")) {
    return {
      family: "macos",
      optionId: "macos-arm64",
      buttonLabel: "Download for macOS",
    };
  }

  if (plat.includes("win") || ua.includes("windows")) {
    return {
      family: "windows",
      optionId: isArm ? "windows-arm64" : "windows-x64",
      buttonLabel: "Download for Windows",
    };
  }

  if (plat.includes("linux") || ua.includes("linux") || ua.includes("x11")) {
    return {
      family: "linux",
      optionId: "linux-universal",
      buttonLabel: "Download for Linux",
    };
  }

  return DEFAULT_TARGET;
}

export function DownloadDesktopButton() {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [detected, setDetected] = useState<DetectedTarget>(DEFAULT_TARGET);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function toggleMenu() {
    setOpen((prev) => {
      const next = !prev;
      if (next && containerRef.current && typeof window !== "undefined") {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setOpenUpward(spaceBelow < 216 && spaceAbove > spaceBelow);
      }
      return next;
    });
  }

  useEffect(() => {
    const initial = detectInitialPlatform();
    setDetected(initial);

    // Refine CPU architecture via UA Client Hints where supported (Chromium)
    const nav = navigator as Navigator & { userAgentData?: NavigatorUAData };
    if (
      (initial.family === "macos" || initial.family === "windows") &&
      typeof nav.userAgentData?.getHighEntropyValues === "function"
    ) {
      nav.userAgentData
        .getHighEntropyValues(["architecture"])
        .then(({ architecture }) => {
          const arch = (architecture || "").toLowerCase();
          if (!arch) return;
          if (initial.family === "macos") {
            setDetected((prev) => ({
              ...prev,
              optionId: arch.includes("x86") ? "macos-x64" : "macos-arm64",
            }));
          } else if (initial.family === "windows") {
            setDetected((prev) => ({
              ...prev,
              optionId: arch.includes("arm") ? "windows-arm64" : "windows-x64",
            }));
          }
        })
        .catch(() => {
          // Ignore browsers that decline high-entropy hints
        });
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function triggerDownload(option: DownloadOption) {
    setOpen(false);
    const releasesBaseUrl = process.env.NEXT_PUBLIC_DESKTOP_RELEASES_URL?.replace(/\/+$/, "");

    if (releasesBaseUrl) {
      const link = document.createElement("a");
      link.href = `${releasesBaseUrl}/${option.filename}`;
      link.download = option.filename;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading Orthese for ${option.fullLabel}`, {
        description: option.filename,
      });
      return;
    }

    toast.info(`Orthese Desktop · ${option.fullLabel}`, {
      description: `${option.filename} — native GPUI installer queued (preview build).`,
    });
  }

  function handlePrimaryClick() {
    const matched = detected.optionId
      ? ALL_OPTIONS.find((opt) => opt.id === detected.optionId)
      : null;

    if (matched) {
      triggerDownload(matched);
    } else {
      toggleMenu();
    }
  }

  return (
    <div ref={containerRef} className="relative inline-flex" data-testid="download-desktop-split">
      {/* Split pill button: OS-aware direct download + platform dropdown toggle */}
      <div
        className={cn(
          "inline-flex h-9 items-stretch rounded-full border bg-[#121419]/95 text-[#f7f8f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_4px_18px_rgba(0,0,0,0.45)] transition-colors",
          open ? "border-white/[0.24]" : "border-white/[0.13] hover:border-white/[0.2]"
        )}
      >
        <button
          type="button"
          data-testid="download-desktop-primary"
          onClick={handlePrimaryClick}
          className="inline-flex items-center gap-2 rounded-l-full pl-4 pr-3.5 text-[13px] font-medium text-[#e5e7eb] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="h-3.5 w-3.5 text-[#8a8f98]" />
          <span>{detected.buttonLabel}</span>
        </button>

        <span aria-hidden="true" className="w-px bg-white/[0.12]" />

        <button
          type="button"
          data-testid="download-desktop-toggle"
          onClick={toggleMenu}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Choose desktop platform"
          className="inline-flex w-9 items-center justify-center rounded-r-full text-[#9ba1ab] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-150",
              open && "rotate-180 text-[#f7f8f8]"
            )}
          />
        </button>
      </div>

      {/* Grouped Platform Dropdown Menu */}
      {open && (
        <div
          role="menu"
          data-testid="download-desktop-menu"
          aria-label="Download Orthese Desktop"
          className={cn(
            "absolute left-1/2 z-40 w-[232px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/[0.13] bg-[#121318]/98 text-left shadow-[0_24px_64px_-12px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:left-0 sm:translate-x-0",
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          <div className="divide-y divide-white/[0.08]">
            {DOWNLOAD_GROUPS.map((group) => (
              <div key={group.family} className="py-1.5">
                <div className="px-3.5 pb-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f7f8f8]">
                  {group.heading}
                </div>
                <div className="px-1.5">
                  {group.options.map((opt) => {
                    const isDetected = detected.optionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="menuitem"
                        data-testid={`download-opt-${opt.id}`}
                        onClick={() => triggerDownload(opt)}
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-[3px] text-left transition-colors hover:bg-white/[0.07] cursor-pointer group"
                      >
                        <span className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.03em] text-[#b4b9c2] group-hover:text-[#f7f8f8]">
                          <span>{opt.label}</span>
                          {isDetected && (
                            <span
                              title="Detected for this device"
                              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                            />
                          )}
                        </span>
                        <span className="font-mono text-[10px] text-[#5e626a] group-hover:text-[#8a8f98]">
                          {opt.archHint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
