"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import NumberFlow from "@number-flow/react";
import { Check, Lock, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useStorefront } from "./StorefrontContext";

export function CheckoutModal() {
  const { checkoutTarget, closeCheckout } = useStorefront();
  const [selectedRail, setSelectedRail] = useState<"apple-pay" | "google-pay" | "card" | "bancontact">("apple-pay");
  const [processing, setProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!checkoutTarget) return;

    // If a live Polar Checkout Link is configured, open Polar Embedded Checkout directly
    if (checkoutTarget.polarUrl) {
      try {
        const { PolarEmbedCheckout } = await import("@polar-sh/checkout/embed");
        closeCheckout();
        await PolarEmbedCheckout.create(checkoutTarget.polarUrl, { theme: "dark" });
        return;
      } catch {
        toast.error("Could not load Polar Embedded Checkout", {
          description: "Falling back to preview confirmation.",
        });
      }
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success(`${checkoutTarget.title} confirmed (Preview Mode)`, {
        description: checkoutTarget.credits
          ? `Added ${checkoutTarget.credits.toLocaleString()} Orthese Credits via Polar (${selectedRail}).`
          : `Unlocked ${checkoutTarget.title} via Polar Embedded Checkout.`,
      });
      closeCheckout();
    }, 550);
  };

  return (
    <Dialog.Root
      open={Boolean(checkoutTarget)}
      onOpenChange={(open) => {
        if (!open) closeCheckout();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/[0.12] bg-[#111111] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.18)] focus:outline-none">
          {checkoutTarget && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
                      POLAR EMBEDDED
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      Merchant of Record · VAT included
                    </span>
                  </div>
                  <Dialog.Title className="mt-2.5 text-lg font-semibold tracking-tight text-white">
                    {checkoutTarget.title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-xs text-zinc-400">
                    {checkoutTarget.subtitle}
                  </Dialog.Description>
                </div>
                <Dialog.Close className="rounded-md border border-white/[0.08] p-1.5 text-zinc-400 hover:bg-white/[0.05] hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              <div className="mt-5 flex items-baseline justify-between rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-4 py-3.5">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    All-in one-time total
                  </span>
                  <span className="text-xs text-zinc-400">
                    No recurring charges · Processing fees absorbed
                  </span>
                </div>
                <div className="font-mono text-2xl font-semibold text-white">
                  €<NumberFlow value={checkoutTarget.priceEur} />
                </div>
              </div>

              <div className="mt-4">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Payment Method
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: "apple-pay", label: "Apple Pay" },
                      { id: "google-pay", label: "Google Pay" },
                      { id: "card", label: "Card (Stripe)" },
                      { id: "bancontact", label: "Bancontact" },
                    ] as const
                  ).map((rail) => {
                    const active = selectedRail === rail.id;
                    return (
                      <button
                        key={rail.id}
                        type="button"
                        onClick={() => setSelectedRail(rail.id)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? "border-white/30 bg-white/[0.08] text-white"
                            : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.15] hover:text-zinc-200"
                        }`}
                      >
                        <span>{rail.label}</span>
                        {active && <Check className="h-3.5 w-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={processing}
                onClick={handleConfirm}
                className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-xs font-semibold text-black hover:bg-zinc-200 disabled:opacity-60 transition-colors cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                {processing
                  ? "Authorizing via Polar..."
                  : checkoutTarget.polarUrl
                    ? `Continue to Polar Checkout · €${checkoutTarget.priceEur}`
                    : `Complete Preview Checkout · €${checkoutTarget.priceEur}`}
              </button>

              <div className="mt-3.5 flex items-center justify-center gap-1.5 font-mono text-[10px] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
                <span>
                  {checkoutTarget.polarUrl
                    ? "Live Polar Checkout Link connected"
                    : "Preview mode · Set NEXT_PUBLIC_POLAR_CHECKOUT_* to go live"}
                </span>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
