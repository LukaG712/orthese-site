import type { Metadata } from "next";
import { RouterPageClient } from "@/components/router/RouterPageClient";

export const metadata: Metadata = {
  title: "Orthese Router — Automatic Real-Model Selection for Every Piece",
  description:
    "Automatic model selection across Gemini 4 Hydrogen, Gemini 4 Neon, GPT-6.2 Sol, Claude Opus 5.5, and GPT-6.2 Astra. Maintain frontier quality and cut Orthese token spend by up to 63%.",
};

export default function RouterPage() {
  return <RouterPageClient />;
}
