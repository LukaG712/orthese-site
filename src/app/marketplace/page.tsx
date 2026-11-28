import type { Metadata } from "next";
import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace | Orthese Pieces, Skills & Starter Packs",
  description:
    "Browse official and community Pieces, portable SKILL.md bundles, and one-click Starter Packs with transparent piece.json permissions.",
};

export default function MarketplacePage() {
  return <MarketplaceClient />;
}
