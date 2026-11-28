import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Orthese",
  description:
    "Orthese modular AI workspace canvas: snap Pieces, manage Workspace tabs, switch AI models, and pipe artifacts over the Shared Context Bus.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
