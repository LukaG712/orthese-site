"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Command } from "cmdk";
import { ArrowUpRight, CreditCard, Layers, Search, Sparkles } from "lucide-react";
import { CREDIT_PACKS, MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { useStorefront } from "./StorefrontContext";

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen, openCheckout } = useStorefront();

  const go = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 pt-[14vh] backdrop-blur-sm"
          onClick={() => setCommandOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="obsidian-card w-full max-w-xl overflow-hidden rounded-xl shadow-[0_32px_90px_rgba(0,0,0,0.92)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Orthese Command Palette" className="w-full">
              <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-4">
                <Search className="h-4 w-4 text-[#52525b]" />
                <Command.Input
                  autoFocus
                  placeholder="Search Pieces, Skills, Starter Packs, or jump to section..."
                  className="h-12 w-full bg-transparent text-[14px] text-[#fafafa] placeholder:text-[#52525b] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCommandOpen(false)}
                  className="rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-[#71717a] hover:text-[#fafafa] cursor-pointer"
                >
                  ESC
                </button>
              </div>

              <Command.List className="max-h-[380px] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-[13px] text-[#52525b]">
                  No matching Pieces, Skills, or commands.
                </Command.Empty>

                <Command.Group
                  heading="Navigate"
                  className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#52525b]"
                >
                  <Command.Item
                    value="launch browser wasm workspace canvas demo"
                    onSelect={() => go("/#workspace-demo")}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-[#d4d4d8] aria-selected:bg-white/[0.07] aria-selected:text-[#fafafa] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#71717a]" />
                      <span>Interactive Canvas (WASM)</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#52525b]" />
                  </Command.Item>
                  <Command.Item
                    value="browse marketplace registry pieces skills"
                    onSelect={() => go("/marketplace")}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-[#d4d4d8] aria-selected:bg-white/[0.07] aria-selected:text-[#fafafa] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Layers className="h-3.5 w-3.5 text-[#71717a]" />
                      <span>Open Marketplace</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#52525b]" />
                  </Command.Item>
                </Command.Group>

                <Command.Group
                  heading="Pieces, Skills & Starter Packs"
                  className="mt-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#52525b]"
                >
                  {MARKETPLACE_ITEMS.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.name} ${item.id} ${item.kind} ${item.tags.join(" ")}`}
                      onSelect={() => go(`/marketplace/${item.id}`)}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-[#d4d4d8] aria-selected:bg-white/[0.07] aria-selected:text-[#fafafa] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <AssetIcon name={item.icon} className="h-3.5 w-3.5 shrink-0 text-[#71717a]" />
                        <span className="truncate font-medium">{item.name}</span>
                        <span className="hidden truncate font-mono text-[11px] text-[#52525b] sm:inline">
                          {item.id}
                        </span>
                      </span>
                      <span className="ml-2 shrink-0 font-mono text-[10px] uppercase text-[#71717a]">
                        {item.kind}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Credit Packs"
                  className="mt-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#52525b]"
                >
                  {CREDIT_PACKS.filter((p) => p.priceEur > 0).map((pack) => (
                    <Command.Item
                      key={pack.id}
                      value={`${pack.name} pricing credits ${pack.priceEur}`}
                      onSelect={() => {
                        setCommandOpen(false);
                        openCheckout({
                          id: pack.id,
                          title: pack.name,
                          subtitle: `${pack.credits.toLocaleString()} Orthese Credits · Never expires`,
                          priceEur: pack.priceEur,
                          credits: pack.credits,
                        });
                      }}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] text-[#d4d4d8] aria-selected:bg-white/[0.07] aria-selected:text-[#fafafa] cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <CreditCard className="h-3.5 w-3.5 text-[#71717a]" />
                        <span>{pack.name}</span>
                        <span className="font-mono text-[11px] tabular-nums text-[#52525b]">
                          {pack.credits.toLocaleString()} cr
                        </span>
                      </span>
                      <span className="font-mono text-[12px] tabular-nums text-[#fafafa]">
                        €{pack.priceEur}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.015] px-4 py-2 font-mono text-[10px] text-[#52525b]">
                <span>↑↓ Navigate · ↵ Select · ESC Close</span>
                <span>orthese.com</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
