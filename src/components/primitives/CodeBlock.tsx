"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  filename,
  language = "json",
  className,
  maxHeight = "max-h-[380px]",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(filename ? `Copied ${filename}` : "Copied snippet to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Clipboard unavailable in this browser context");
    }
  };

  const lines = code.trimEnd().split("\n");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c0c0c]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
          <span className="font-mono text-[11px] text-zinc-300">
            {filename ?? `snippet.${language}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-300 hover:border-white/[0.18] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <div className={cn("overflow-auto p-3", maxHeight)}>
        <pre className="font-mono text-[12px] leading-relaxed text-zinc-300">
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-[2.2rem_1fr] gap-2">
              <span className="select-none text-right text-zinc-600">{i + 1}</span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
