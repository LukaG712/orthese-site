"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { ArrowUpRight, CreditCard, Layers, Search, Sparkles } from "lucide-react";
import { CREDIT_PACKS, MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { useStorefront } from "./StorefrontContext";

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, setCommandOpen, openCheckout } = useStorefront();

  if (!commandOpen) return null;

  const go = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setCommandOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-white/[0.12] bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Orthese Command Palette" className="w-full">
          <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-3.5">
            <Search className="h-4 w-4 text-zinc-500" />
            <Command.Input
              autoFocus
              placeholder="Search Pieces, Skills, Starter Packs, or Pricing..."
              className="h-12 w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setCommandOpen(false)}
              className="rounded border border-white/[0.1] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 hover:text-white cursor-pointer"
            >
              ESC
            </button>
          </div>

          <Command.List className="max-h-[380px] overflow-y-auto p-2">
            <Command.Empty className="py-10 text-center text-xs text-zinc-500">
              No matching Pieces, Skills, or commands found.
            </Command.Empty>

            <Command.Group
              heading="Quick Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-500"
            >
              <Command.Item
                value="launch browser wasm workspace demo"
                onSelect={() => go("/#workspace-demo")}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-zinc-200 aria-selected:bg-white/[0.08] aria-selected:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Try Live Canvas Preview (WASM)</span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
              </Command.Item>
              <Command.Item
                value="browse marketplace catalog pieces skills"
                onSelect={() => go("/marketplace")}
                className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-zinc-200 aria-selected:bg-white/[0.08] aria-selected:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Open Marketplace Registry</span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Pieces, Skills & Starter Packs"
              className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-500"
            >
              {MARKETPLACE_ITEMS.map((item) => (
                <Command.Item
                  key={item.id}
                  value={`${item.name} ${item.id} ${item.kind} ${item.tags.join(" ")}`}
                  onSelect={() => go(`/marketplace/${item.id}`)}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-zinc-200 aria-selected:bg-white/[0.08] aria-selected:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <AssetIcon name={item.icon} className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="hidden truncate font-mono text-[10px] text-zinc-500 sm:inline">
                      {item.id}
                    </span>
                  </span>
                  <span className="ml-2 shrink-0 rounded border border-white/[0.09] px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                    {item.kind}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group
              heading="Credit Packs (Non-Expiring)"
              className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-500"
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
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-zinc-200 aria-selected:bg-white/[0.08] aria-selected:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{pack.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {pack.credits.toLocaleString()} credits
                    </span>
                  </span>
                  <span className="font-mono text-xs text-zinc-200">€{pack.priceEur}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-3.5 py-2 font-mono text-[10px] text-zinc-500">
            <span>↑↓ Navigate · ↵ Open · ESC Close</span>
            <span>orthese.com registry</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
