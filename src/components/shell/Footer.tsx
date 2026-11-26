import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Live Canvas", href: "/#workspace-demo" },
      { label: "Shared Context Bus", href: "/#shared-context" },
      { label: "Hybrid Routing", href: "/#hybrid-routing" },
      { label: "Base Harness", href: "/#base-harness" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { label: "Browse All", href: "/marketplace" },
      { label: "Website Builder", href: "/marketplace/orthese.website-builder" },
      { label: "AI Prompt Box", href: "/marketplace/orthese.ai-prompt-box" },
      { label: "Software Engineer", href: "/marketplace/orthese.software-engineer" },
      { label: "Skills (SKILL.md)", href: "/marketplace?tab=skill" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Piece SDK Docs", href: "/marketplace/orthese.website-builder" },
      { label: "piece.json Spec", href: "/#base-harness" },
      { label: "Desktop vs. WASM", href: "/#dual-target" },
      { label: "Changelog", href: "/marketplace/orthese.software-engineer" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/#pricing" },
      { label: "Privacy", href: "/#pricing" },
      { label: "Security", href: "/marketplace" },
      { label: "Polar Billing", href: "/#pricing" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/LukaG712/orthese", external: true },
      { label: "SDK Repo", href: "https://github.com/LukaG712/orthese-sdk", external: true },
      { label: "Registry", href: "https://github.com/LukaG712/orthese-marketplace", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#08090a]">
      <div className="mx-auto max-w-[1080px] px-5 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr]">
          {/* Far-Left Small Orthese Mark */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              aria-label="Orthese Home"
              className="inline-flex items-center gap-2 text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
                <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" />
                <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" />
                <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="currentColor" fillOpacity="0.38" />
              </svg>
            </Link>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-medium text-[#f7f8f8]">{col.title}</h3>
              <ul className="mt-4 space-y-2.5 text-[12.5px] text-[#5e626a]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#f7f8f8] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-[#f7f8f8] transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-2 text-[12px] text-[#5e626a] sm:flex-row sm:items-center">
          <span>© 2026 Orthese</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>All systems operational</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
