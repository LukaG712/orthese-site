import { Cpu, Globe, Layers, Radio, Shield, Terminal } from "lucide-react";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";

const ECOSYSTEM_MARKS = [
  { label: "Rust + GPUI", icon: Cpu },
  { label: "WebAssembly", icon: Globe },
  { label: "MCP Hub", icon: Radio },
  { label: "Cloudflare Edge", icon: Layers },
  { label: "CLIProxyAPI", icon: Terminal },
  { label: "Polar", icon: Shield },
];

export function EcosystemAndPillars() {
  return (
    <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
      {/* 3. Quiet Monochrome Ecosystem Strip */}
      <section aria-label="Technology ecosystem" className="py-16">
        <div className="grid grid-cols-2 items-center justify-items-start gap-y-6 sm:grid-cols-3 md:flex md:items-center md:justify-between">
          {ECOSYSTEM_MARKS.map((mark) => {
            const Icon = mark.icon;
            return (
              <div
                key={mark.label}
                className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[-0.01em] text-[#f7f8f8] opacity-50 transition-opacity duration-200 hover:opacity-90"
              >
                <Icon className="h-4 w-4 stroke-[1.6]" />
                <span>{mark.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Two-Tone Editorial Statement + 3 Boxless Wireframe Pillars */}
      <section id="architecture" className="scroll-mt-16 py-24 sm:py-32">
        <p className="max-w-[780px] text-2xl font-medium tracking-[-0.03em] leading-[1.25] text-[#8a8f98] md:text-[32px]">
          <span className="text-[#f7f8f8]">
            A new species of <OrbitGradientText>AI workstation.</OrbitGradientText>
          </span>{" "}
          Built on one Rust + GPUI core so your prompt box, website builder, and coding agent
          share context—with zero monthly subscription.
        </p>

        {/* 3-Column Unboxed Isometric Wireframe Pillars */}
        <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
          {/* Pillar 1: Isometric Stacked Planes */}
          <div>
            <div className="mask-fade-wireframe mb-7 flex h-40 items-center justify-start">
              <svg
                width="210"
                height="148"
                viewBox="0 0 210 148"
                fill="none"
                aria-hidden="true"
              >
                <polygon
                  points="105,14 188,52 105,90 22,52"
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth="1"
                />
                <polygon
                  points="105,40 188,78 105,116 22,78"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                />
                <polygon
                  points="105,66 188,104 105,142 22,104"
                  stroke="rgba(255,255,255,0.13)"
                  strokeWidth="1"
                />
                <line
                  x1="105"
                  y1="14"
                  x2="105"
                  y2="142"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-[#f7f8f8]">
              Snap &amp; pipe context
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#8a8f98]">
              Pass typed <code className="font-mono text-[12px] text-[#c4c8d0]">orthese/spec</code>{" "}
              and <code className="font-mono text-[12px] text-[#c4c8d0]">git-diff</code> payloads
              directly between Pieces.
            </p>
          </div>

          {/* Pillar 2: Isometric Routing Nodes */}
          <div>
            <div className="mask-fade-wireframe mb-7 flex h-40 items-center justify-start">
              <svg
                width="210"
                height="148"
                viewBox="0 0 210 148"
                fill="none"
                aria-hidden="true"
              >
                <polygon
                  points="62,28 102,48 102,92 62,112 22,92 22,48"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1"
                />
                <polygon
                  points="146,28 186,48 186,92 146,112 106,92 106,48"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1"
                />
                <polygon
                  points="104,54 144,74 144,118 104,138 64,118 64,74"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
                <line x1="62" y1="28" x2="62" y2="70" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                <line x1="146" y1="28" x2="146" y2="70" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
                <line x1="104" y1="54" x2="104" y2="96" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-[#f7f8f8]">
              Hybrid AI routing
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#8a8f98]">
              Run on managed Cloudflare Edge credits or switch seamlessly to your local{" "}
              <code className="font-mono text-[12px] text-[#c4c8d0]">CLIProxyAPI</code> sidecar.
            </p>
          </div>

          {/* Pillar 3: Isometric Dual-Target Viewport */}
          <div>
            <div className="mask-fade-wireframe mb-7 flex h-40 items-center justify-start">
              <svg
                width="210"
                height="148"
                viewBox="0 0 210 148"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M26 106 L86 24 L184 52 L124 134 Z"
                  stroke="rgba(255,255,255,0.26)"
                  strokeWidth="1"
                />
                <path
                  d="M44 102 L92 36 L168 58 L120 124 Z"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
                <line
                  x1="68"
                  y1="70"
                  x2="144"
                  y2="92"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                />
                <line
                  x1="26"
                  y1="106"
                  x2="178"
                  y2="136"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium tracking-[-0.015em] text-[#f7f8f8]">
              Native 120fps + WASM
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#8a8f98]">
              One Rust binary powers instant zero-install browser sessions and full local
              repository access on Desktop.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
