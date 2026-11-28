import type { Metadata } from "next";
import { DocsClient } from "@/components/docs/DocsClient";

export const metadata: Metadata = {
  title: "Docs | Orthese",
  description:
    "Documentation for Orthese Piece SDK v0.1, piece.json manifests, Shared Context Bus, progressive SKILL.md packs, scoped MCP permissions, and WASM / Desktop GPUI runtimes.",
};

export default function DocsPage() {
  return <DocsClient />;
}
