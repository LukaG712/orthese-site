import type { Metadata } from "next";
import { SimpleDocsClient } from "@/components/docs/SimpleDocsClient";

export const metadata: Metadata = {
  title: "Quickstart Guide | Orthese",
  description:
    "Jargon-free quickstart guide to Orthese: start in your browser in 60 seconds, pick a Starter Pack, and work with AI side by side, with no coding required.",
};

export default function DocsQuickstartPage() {
  return <SimpleDocsClient />;
}
