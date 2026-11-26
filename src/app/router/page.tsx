import type { Metadata } from "next";
import { RouterPageClient } from "@/components/router/RouterPageClient";

export const metadata: Metadata = {
  title: "Orthese Router — Automatic Real-Model Selection for Every Piece",
  description:
    "Automatic model selection across Gemini 2.5 Flash, Claude Sonnet 4.5, GPT-5.2, and Claude Opus 4.5. Maintain frontier quality and cut Orthese token spend by up to 63%.",
};

export default function RouterPage() {
  return <RouterPageClient />;
}
