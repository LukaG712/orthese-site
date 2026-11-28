"use client";

import { useState } from "react";
import { Check, ShieldAlert, Terminal, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

interface ApprovalCardProps {
  permission: string;
  command: string;
  scope: string;
  estimatedCredits?: number;
  className?: string;
}

export function ApprovalCard({
  permission,
  command,
  scope,
  estimatedCredits = 4,
  className,
}: ApprovalCardProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const approve = () => {
    setStatus("approved");
    toast.success("Guardrail approved", {
      description: `Executed ${permission} inside ${scope}`,
    });
  };

  const reject = () => {
    setStatus("rejected");
    toast.message("Guardrail rejected", {
      description: "Piece execution halted cleanly with zero file changes.",
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-white/[0.12] bg-[#131313] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.12] bg-white/[0.04] text-zinc-200">
            <ShieldAlert className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-100">
                Elevated Permission Request
              </span>
              <span className="rounded border border-white/[0.12] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
                {permission}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
              Scope: {scope} · Est. ~{estimatedCredits} credits
            </p>
          </div>
        </div>
        {status !== "pending" && (
          <button
            type="button"
            onClick={() => setStatus("pending")}
            className="font-mono text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md border border-white/[0.07] bg-[#0a0a0a] px-2.5 py-2 font-mono text-[11px] text-zinc-200">
        <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        <code className="truncate">{command}</code>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {status === "pending" ? (
          <>
            <span className="font-mono text-[10px] text-zinc-500">
              Folder-scoped Desktop guardrail
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={reject}
                className="inline-flex items-center gap-1 rounded-md border border-white/[0.1] bg-transparent px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
                Deny
              </button>
              <button
                type="button"
                onClick={approve}
                className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-black hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <Check className="h-3 w-3" />
                Approve Once
              </button>
            </div>
          </>
        ) : status === "approved" ? (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-200">
            <Check className="h-3.5 w-3.5 text-white" />
            <span>Approved: emitted orthese/git-diff (2 files, +48 −12)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
            <X className="h-3.5 w-3.5 text-zinc-400" />
            <span>Denied: sandbox remained read-only</span>
          </div>
        )}
      </div>
    </div>
  );
}
