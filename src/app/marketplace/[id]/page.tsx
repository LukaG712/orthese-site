import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";
import { getMarketplaceItem, MARKETPLACE_ITEMS } from "@/data/catalog";
import { AssetIcon } from "@/components/ui/Icon";
import { CodeBlock } from "@/components/primitives/CodeBlock";
import { ManifestSecurityPanel } from "@/components/marketplace/ManifestSecurityPanel";
import { MarketplaceItemActions } from "@/components/marketplace/MarketplaceItemActions";

export function generateStaticParams() {
  return MARKETPLACE_ITEMS.map((item) => ({ id: item.id }));
}

export default async function MarketplaceItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getMarketplaceItem(id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Marketplace</span>
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 md:flex-row md:items-start">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.14] bg-white/[0.04] text-white">
            <AssetIcon name={item.icon} className="h-6 w-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {item.name}
              </h1>
              {item.official && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-zinc-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Official
                </span>
              )}
              <span className="rounded border border-white/[0.09] px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                {item.kind}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              {item.id} · {item.authorHandle} · {item.installs.toLocaleString()} installs
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">
              {item.description}
            </p>
          </div>
        </div>

        <MarketplaceItemActions item={item} />
      </div>

      <div className="mt-8 space-y-6">
        {item.manifest && <ManifestSecurityPanel manifest={item.manifest} />}

        {item.skillPreview && (
          <div>
            <h2 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              SKILL.md Bundle
            </h2>
            <CodeBlock
              code={item.skillPreview}
              filename={`${item.id}/SKILL.md`}
              language="markdown"
            />
          </div>
        )}

        {item.includedPieceIds && item.includedPieceIds.length > 0 && (
          <div className="workstation-card rounded-xl p-5">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Included Pieces
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.includedPieceIds.map((pid) => (
                <Link
                  key={pid}
                  href={`/marketplace/${pid}`}
                  className="rounded-md border border-white/[0.1] bg-[#0a0a0a] px-3 py-1.5 font-mono text-xs text-zinc-200 hover:border-white/25 transition-colors"
                >
                  {pid} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="workstation-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Changelog
            </h2>
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <span>View Repository</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="mt-3 space-y-3">
            {item.changelog.map((entry) => (
              <div
                key={entry.version}
                className="rounded-lg border border-white/[0.07] bg-[#0a0a0a] p-4"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-semibold text-white">v{entry.version}</span>
                  <span className="text-zinc-500">{entry.date}</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-zinc-400">
                  {entry.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
