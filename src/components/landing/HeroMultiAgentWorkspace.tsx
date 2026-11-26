"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import NumberFlow from "@number-flow/react";
import {
  ArrowUp,
  Cpu,
  PanelRightClose,
  PanelRightOpen,
  Pin,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AgentOrbAvatar,
  type AgentAvatarSpec,
  type AvatarExpression,
  type AvatarShape,
} from "@/components/landing/AgentOrbAvatar";
import { cn } from "@/lib/cn";

type ModelTier = "fast" | "balanced" | "reasoning";

interface OrtheseAgent {
  id: string;
  name: string;
  handle: string;
  description: string;
  tier: ModelTier;
  emitsContext: boolean;
  contextType: string;
  avatar: AgentAvatarSpec;
}

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  agentId?: string;
  text: string;
  timestamp: string;
  contextBadge?: string;
}

interface Conversation {
  id: string;
  title: string;
  participantIds: string[];
  pinned?: boolean;
  messages: ChatMessage[];
}

const AVATAR_COLORS = [
  { hex: "#818cf8", label: "Indigo" },
  { hex: "#38bdf8", label: "Sky" },
  { hex: "#e879f9", label: "Orchid" },
  { hex: "#34d399", label: "Emerald" },
  { hex: "#fbbf24", label: "Amber" },
  { hex: "#e4e4e7", label: "Silver" },
];

const SHAPES: { id: AvatarShape; label: string }[] = [
  { id: "orb", label: "Orb" },
  { id: "squircle", label: "Squircle" },
  { id: "diamond", label: "Diamond" },
  { id: "hex", label: "Hex" },
];

const EXPRESSIONS: { id: AvatarExpression; label: string }[] = [
  { id: "focused", label: "Focused" },
  { id: "curious", label: "Curious" },
  { id: "happy", label: "Happy" },
  { id: "alert", label: "Alert" },
];

const TIERS: { id: ModelTier; label: string; cost: number }[] = [
  { id: "fast", label: "fast", cost: 1 },
  { id: "balanced", label: "balanced", cost: 3 },
  { id: "reasoning", label: "reasoning", cost: 5 },
];

const INITIAL_AGENTS: OrtheseAgent[] = [
  {
    id: "website-builder",
    name: "Website Builder",
    handle: "orthese.website-builder",
    description:
      "Turns structured specs into live HTML/Tailwind layouts with crisp typography and dark-mode restraint.",
    tier: "balanced",
    emitsContext: true,
    contextType: "orthese/html-bundle",
    avatar: { shape: "squircle", expression: "focused", color: "#818cf8" },
  },
  {
    id: "ai-prompt-box",
    name: "AI Prompt Box",
    handle: "orthese.ai-prompt-box",
    description:
      "Refines rough ideas into typed orthese/spec payloads and coordinates multi-Piece runs.",
    tier: "fast",
    emitsContext: true,
    contextType: "orthese/spec",
    avatar: { shape: "orb", expression: "curious", color: "#38bdf8" },
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    handle: "orthese.software-engineer",
    description:
      "Applies scoped repository diffs, runs tests, and verifies Rust + TypeScript contracts.",
    tier: "reasoning",
    emitsContext: true,
    contextType: "orthese/git-diff",
    avatar: { shape: "hex", expression: "focused", color: "#34d399" },
  },
  {
    id: "security-auditor",
    name: "Security Agent",
    handle: "orthese.security-auditor",
    description:
      "Audits piece.json permissions, MCP allowlists, and elevated desktop shell boundaries.",
    tier: "reasoning",
    emitsContext: true,
    contextType: "orthese/audit-report",
    avatar: { shape: "diamond", expression: "alert", color: "#e879f9" },
  },
  {
    id: "research-canvas",
    name: "Research Canvas",
    handle: "orthese.research-canvas",
    description:
      "Synthesizes benchmarks, documentation, and competitor patterns into concise briefs.",
    tier: "balanced",
    emitsContext: true,
    contextType: "text/markdown",
    avatar: { shape: "orb", expression: "happy", color: "#fbbf24" },
  },
  {
    id: "cloud-engineer",
    name: "Cloud Engineer",
    handle: "orthese.cloud-engineer",
    description:
      "Configures Cloudflare Workers routing, edge caching, and hybrid CLIProxyAPI failover.",
    tier: "balanced",
    emitsContext: true,
    contextType: "orthese/edge-config",
    avatar: { shape: "hex", expression: "curious", color: "#e4e4e7" },
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-web-builder",
    title: "Website Builder",
    participantIds: ["website-builder"],
    pinned: true,
    messages: [
      {
        id: "m1",
        role: "user",
        text: "How can we make the landing page hero feel clearer?",
        timestamp: "10:14",
      },
      {
        id: "m2",
        role: "agent",
        agentId: "website-builder",
        text: "Give the hero one clear action. Lead with the outcome, pair it with a focused interactive preview, and keep secondary links quiet until below the fold.",
        timestamp: "10:14",
        contextBadge: "orthese/html-bundle",
      },
      {
        id: "m3",
        role: "agent",
        agentId: "website-builder",
        text: "For the next chapter, let each Piece show one concrete capability—typed context piping, hybrid routing, and zero-install WASM.",
        timestamp: "10:15",
      },
    ],
  },
  {
    id: "conv-launch-squad",
    title: "Launch Squad",
    participantIds: ["ai-prompt-box", "website-builder", "software-engineer"],
    pinned: true,
    messages: [
      {
        id: "m4",
        role: "user",
        text: "Ship the new pricing section and wire Polar checkout in one pass.",
        timestamp: "09:42",
      },
      {
        id: "m5",
        role: "agent",
        agentId: "ai-prompt-box",
        text: "Drafted the 4-tier non-expiring credit matrix (€0, €10, €25, €50) and emitted the typed payload to the bus.",
        timestamp: "09:42",
        contextBadge: "orthese/spec",
      },
      {
        id: "m6",
        role: "agent",
        agentId: "website-builder",
        text: "Rendered the hairline-divided pricing strip on #08090A with NumberFlow credit counters and zero card clutter.",
        timestamp: "09:43",
        contextBadge: "orthese/html-bundle",
      },
      {
        id: "m7",
        role: "agent",
        agentId: "software-engineer",
        text: "Connected openCheckout() handlers and verified tsc + next build cleanly across all 16 static routes.",
        timestamp: "09:43",
        contextBadge: "orthese/git-diff",
      },
    ],
  },
  {
    id: "conv-security",
    title: "Security Agent",
    participantIds: ["security-auditor"],
    messages: [
      {
        id: "m8",
        role: "user",
        text: "Check our Piece manifests before opening Marketplace submissions.",
        timestamp: "Yesterday",
      },
      {
        id: "m9",
        role: "agent",
        agentId: "security-auditor",
        text: "Verified all 3 official Pieces: Website Builder and AI Prompt Box run strictly on standard WASM permissions, while Software Engineer gates fs:write and shell:exec behind explicit Desktop prompts.",
        timestamp: "Yesterday",
        contextBadge: "orthese/audit-report",
      },
    ],
  },
  {
    id: "conv-prompt-box",
    title: "AI Prompt Box",
    participantIds: ["ai-prompt-box"],
    messages: [
      {
        id: "m10",
        role: "agent",
        agentId: "ai-prompt-box",
        text: "Ready on bus://workspace.default. Drop a rough product goal and I'll emit a clean orthese/spec for downstream Pieces.",
        timestamp: "Yesterday",
        contextBadge: "orthese/spec",
      },
    ],
  },
  {
    id: "conv-cloud",
    title: "Cloud Engineer",
    participantIds: ["cloud-engineer"],
    messages: [
      {
        id: "m11",
        role: "agent",
        agentId: "cloud-engineer",
        text: "Cloudflare Edge routing sits at 28ms p50. Flip to local CLIProxyAPI on Desktop anytime to route through your existing OAuth quotas at €0.",
        timestamp: "Tue",
        contextBadge: "orthese/edge-config",
      },
    ],
  },
];

function generateAgentReply(agent: OrtheseAgent, prompt: string, isGroupFollowUp: boolean): string {
  const lower = prompt.toLowerCase();
  if (agent.id === "website-builder") {
    if (lower.includes("hero") || lower.includes("copy") || lower.includes("design")) {
      return "Tightened the hero cadence: crisp two-line display headline, animated prismatic focal text, and an immediately interactive workspace directly beneath.";
    }
    return isGroupFollowUp
      ? "Picked up the orthese/spec from the Shared Context Bus—updated the live preview tokens and verified contrast on #08090A."
      : `Built a responsive obsidian layout for "${prompt.slice(0, 48)}${prompt.length > 48 ? "…" : ""}" with hairline borders and zero extra wrapper boxes.`;
  }
  if (agent.id === "ai-prompt-box") {
    return `Structured "${prompt.slice(0, 46)}${prompt.length > 46 ? "…" : ""}" into an orthese/spec with acceptance criteria and piped it to the active workspace bus.`;
  }
  if (agent.id === "software-engineer") {
    return isGroupFollowUp
      ? "Synced the schema and component props against the new bundle—0 TypeScript errors and clean static export."
      : "Prepared a scoped patch across apps/web and packages/piece-sdk with strict types and zero elevated shell calls.";
  }
  if (agent.id === "security-auditor") {
    return "Permissions check passed: standard AI and context-bus scopes only, no unverified MCP endpoints, and sandbox isolation intact.";
  }
  if (agent.id === "cloud-engineer") {
    return "Verified hybrid routing: managed Cloudflare Edge credits active for instant web sessions, with automatic CLIProxyAPI handoff on Desktop.";
  }
  if (agent.id === "research-canvas") {
    return "Synthesized 3 key takeaways into a concise brief and attached references for the other Pieces in this workspace.";
  }
  return `${agent.name} processed your prompt on the ${agent.tier} tier and shared updated context with the thread.`;
}

const QUICK_PROMPTS = [
  "Tighten the hero copy & layout",
  "Audit piece.json permissions",
  "Pipe spec across all agents",
];

export function HeroMultiAgentWorkspace() {
  const [agents, setAgents] = useState<OrtheseAgent[]>(INITIAL_AGENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [composerValue, setComposerValue] = useState("");
  const [routing, setRouting] = useState<"edge" | "cliproxy">("edge");
  const [credits, setCredits] = useState(197);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [inspectedAgentId, setInspectedAgentId] = useState<string>("website-builder");
  const [thinkingAgentId, setThinkingAgentId] = useState<string | null>(null);
  const [isNewChatMode, setIsNewChatMode] = useState(false);
  const [selectedNewIds, setSelectedNewIds] = useState<string[]>([
    "website-builder",
    "software-engineer",
  ]);
  const [inviteOpen, setInviteOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const agentMap = useMemo(
    () => new Map(agents.map((a) => [a.id, a])),
    [agents]
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConvId) ?? conversations[0],
    [conversations, activeConvId]
  );

  const inspectedAgent = useMemo(
    () => agentMap.get(inspectedAgentId) ?? agents[0],
    [agentMap, inspectedAgentId, agents]
  );

  const filteredConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = q
      ? conversations.filter((c) => {
          const lastText = c.messages[c.messages.length - 1]?.text ?? "";
          return (
            c.title.toLowerCase().includes(q) ||
            lastText.toLowerCase().includes(q)
          );
        })
      : conversations;
    return [...list].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [conversations, searchQuery]);

  const activeParticipants = useMemo(
    () =>
      activeConversation.participantIds
        .map((id) => agentMap.get(id))
        .filter((a): a is OrtheseAgent => Boolean(a)),
    [activeConversation, agentMap]
  );

  const primaryAgent = activeParticipants[0] ?? agents[0];

  const selectConversation = (conv: Conversation) => {
    setIsNewChatMode(false);
    setInviteOpen(false);
    setActiveConvId(conv.id);
    const first = conv.participantIds[0];
    if (first) setInspectedAgentId(first);
  };

  const togglePin = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const updateInspectedAgent = (patch: Partial<OrtheseAgent>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === inspectedAgent.id ? { ...a, ...patch } : a))
    );
    if (patch.name) {
      setConversations((prev) =>
        prev.map((c) =>
          c.participantIds.length === 1 && c.participantIds[0] === inspectedAgent.id
            ? { ...c, title: patch.name! }
            : c
        )
      );
    }
  };

  const updateInspectedAvatar = (patch: Partial<AgentAvatarSpec>) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === inspectedAgent.id
          ? { ...a, avatar: { ...a.avatar, ...patch } }
          : a
      )
    );
  };

  const createCustomAgent = () => {
    const idx = agents.length + 1;
    const palette = AVATAR_COLORS[idx % AVATAR_COLORS.length].hex;
    const shape = SHAPES[idx % SHAPES.length].id;
    const newId = `custom-agent-${idx}`;
    const created: OrtheseAgent = {
      id: newId,
      name: `Custom Agent ${idx}`,
      handle: `community.agent-${idx}`,
      description: "Tailored Piece running on Orthese Base Harness with custom context rules.",
      tier: "balanced",
      emitsContext: true,
      contextType: "orthese/spec",
      avatar: { shape, expression: "curious", color: palette },
    };
    const newConv: Conversation = {
      id: `conv-${newId}`,
      title: created.name,
      participantIds: [newId],
      messages: [
        {
          id: `msg-init-${newId}`,
          role: "agent",
          agentId: newId,
          text: `${created.name} is online. Customize my shape, expression, or model tier in the inspector—then send a prompt.`,
          timestamp: "Now",
          contextBadge: "orthese/spec",
        },
      ],
    };
    setAgents((prev) => [created, ...prev]);
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
    setInspectedAgentId(newId);
    setIsNewChatMode(false);
    setInspectorOpen(true);
    toast.success(`Created ${created.name}`, {
      description: "Added to your Orthese multi-agent workspace",
    });
  };

  const toggleParticipantInNewChat = (agentId: string) => {
    setSelectedNewIds((prev) =>
      prev.includes(agentId)
        ? prev.length > 1
          ? prev.filter((id) => id !== agentId)
          : prev
        : [...prev, agentId]
    );
    setInspectedAgentId(agentId);
  };

  const inviteAgentToActiveThread = (agentId: string) => {
    const invited = agentMap.get(agentId);
    if (!invited) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c;
        if (c.participantIds.includes(agentId)) return c;
        const nextIds = [...c.participantIds, agentId];
        return {
          ...c,
          title:
            nextIds.length === 2
              ? `${agentMap.get(nextIds[0])?.name.split(" ")[0] ?? "Agent"} + ${invited.name.split(" ")[0]}`
              : c.title,
          participantIds: nextIds,
        };
      })
    );
    setInviteOpen(false);
    setInspectedAgentId(agentId);
    toast.success(`${invited.name} joined the thread`, {
      description: `Listening on ${invited.contextType}`,
    });
  };

  const startNewConversationWithPrompt = (initialPrompt?: string) => {
    const ids = selectedNewIds.length > 0 ? selectedNewIds : [agents[0].id];
    const chosen = ids
      .map((id) => agentMap.get(id))
      .filter((a): a is OrtheseAgent => Boolean(a));
    const title =
      chosen.length === 1
        ? chosen[0].name
        : chosen.length === 2
          ? `${chosen[0].name.split(" ")[0]} + ${chosen[1].name.split(" ")[0]}`
          : `${chosen[0].name.split(" ")[0]} Squad (${chosen.length})`;

    const convId = `conv-custom-${Date.now()}`;
    const createdConv: Conversation = {
      id: convId,
      title,
      participantIds: ids,
      messages: initialPrompt
        ? []
        : [
            {
              id: `msg-welcome-${Date.now()}`,
              role: "agent",
              agentId: chosen[0].id,
              text:
                chosen.length > 1
                  ? `${chosen.map((a) => a.name).join(", ")} gathered in this room. Send a prompt and we'll coordinate via the Shared Context Bus.`
                  : `${chosen[0].name} is ready. What are we building?`,
              timestamp: "Now",
            },
          ],
    };

    setConversations((prev) => [createdConv, ...prev]);
    setActiveConvId(convId);
    setInspectedAgentId(chosen[0].id);
    setIsNewChatMode(false);

    if (initialPrompt) {
      dispatchMessage(convId, ids, initialPrompt);
    }
  };

  const dispatchMessage = (convId: string, participantIds: string[], rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: "Now",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, messages: [...c.messages, userMsg] } : c
      )
    );
    setComposerValue("");

    const responders = participantIds
      .slice(0, 2)
      .map((id) => agentMap.get(id))
      .filter((a): a is OrtheseAgent => Boolean(a));

    if (responders.length === 0) return;

    responders.forEach((responder, idx) => {
      const startDelay = idx === 0 ? 120 : 1050;
      const finishDelay = idx === 0 ? 820 : 1850;

      const tStart = window.setTimeout(() => {
        setThinkingAgentId(responder.id);
      }, startDelay);

      const tFinish = window.setTimeout(() => {
        const tierCost =
          routing === "cliproxy"
            ? 0
            : (TIERS.find((t) => t.id === responder.tier)?.cost ?? 2);
        if (tierCost > 0) {
          setCredits((c) => Math.max(0, c - tierCost));
        }

        const replyMsg: ChatMessage = {
          id: `a-${Date.now()}-${idx}`,
          role: "agent",
          agentId: responder.id,
          text: generateAgentReply(responder, trimmed, idx > 0),
          timestamp: "Now",
          contextBadge: responder.emitsContext ? responder.contextType : undefined,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, replyMsg] } : c
          )
        );
        if (idx === responders.length - 1) {
          setThinkingAgentId(null);
        }
        if (idx === 0 && responders.length > 1) {
          toast.message(`Context piped → ${responders[1].name}`, {
            description: `${responder.contextType} handed off via bus://workspace.default`,
          });
        }
      }, finishDelay);

      timeoutsRef.current.push(tStart, tFinish);
    });
  };

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? composerValue).trim();
    if (!text) return;
    if (isNewChatMode) {
      startNewConversationWithPrompt(text);
    } else {
      dispatchMessage(activeConversation.id, activeConversation.participantIds, text);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeConversation.messages.length, thinkingAgentId]);

  const thinkingAgent = thinkingAgentId ? agentMap.get(thinkingAgentId) : null;
  const invitableAgents = agents.filter(
    (a) => !activeConversation.participantIds.includes(a.id)
  );

  return (
    <div
      id="workspace-demo"
      className="scroll-mt-20 overflow-hidden rounded-xl border border-white/[0.12] bg-[#0b0c0e] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_40px_100px_-20px_rgba(0,0,0,0.9)]"
    >
      {/* Top Window Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0e1013] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/[0.14]" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/[0.14]" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/[0.14]" />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-[#08090a] px-2.5 py-0.5 font-mono text-[11px] text-[#8a8f98]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>app.orthese.com/agents</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setRouting((r) => (r === "edge" ? "cliproxy" : "edge"))}
            data-testid="hero-routing-toggle"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#08090a] px-2.5 py-1 font-mono text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors cursor-pointer"
            title="Switch between Cloudflare Edge credits and local CLIProxyAPI"
          >
            <Cpu className="h-3 w-3 text-[#818cf8]" />
            <span>{routing === "edge" ? "Cloudflare Edge" : "CLIProxyAPI · €0"}</span>
          </button>

          <div
            data-testid="hero-credit-counter"
            className="flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-[#08090a] px-2.5 py-1 font-mono text-[11px] tabular-nums text-[#f7f8f8]"
          >
            <NumberFlow value={credits} />
            <span className="text-[#5e626a]">cr</span>
          </div>

          <button
            type="button"
            data-testid="toggle-agent-inspector"
            onClick={() => setInspectorOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11.5px] font-medium text-[#d4d6dc] hover:bg-white/[0.08] hover:text-[#f7f8f8] transition-colors cursor-pointer"
          >
            {inspectorOpen ? (
              <PanelRightClose className="h-3.5 w-3.5" />
            ) : (
              <PanelRightOpen className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Inspector</span>
          </button>
        </div>
      </div>

      {/* Main 3-Pane Multi-Agent Workspace */}
      <div className="grid min-h-[540px] grid-cols-1 md:grid-cols-[232px_1fr] lg:grid-cols-[236px_1fr_auto]">
        {/* LEFT PANE: Searchable Conversations Sidebar */}
        <aside className="flex flex-col border-b border-white/[0.07] bg-[#090a0c] md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 border-b border-white/[0.06] p-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5e626a]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads..."
                aria-label="Search conversations"
                className="h-8 w-full rounded-md border border-white/[0.07] bg-[#0e1013] pl-8 pr-2.5 text-[12px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:border-white/20 focus:outline-none"
              />
            </div>
            <button
              type="button"
              data-testid="new-group-chat-btn"
              onClick={() => setIsNewChatMode((m) => !m)}
              title="New multi-agent chat"
              aria-label="New multi-agent chat"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer",
                isNewChatMode
                  ? "border-white/25 bg-white text-[#08090a]"
                  : "border-white/[0.08] bg-white/[0.04] text-[#d4d6dc] hover:bg-white/[0.1] hover:text-white"
              )}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-0.5 overflow-y-auto p-2 max-h-[220px] md:max-h-[430px]">
            {filteredConversations.map((conv) => {
              const active = !isNewChatMode && conv.id === activeConversation.id;
              const members = conv.participantIds
                .map((id) => agentMap.get(id))
                .filter((a): a is OrtheseAgent => Boolean(a));
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isGroup = members.length > 1;

              return (
                <div
                  key={conv.id}
                  role="button"
                  tabIndex={0}
                  data-testid={`thread-${conv.id}`}
                  onClick={() => selectConversation(conv)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectConversation(conv);
                    }
                  }}
                  className={cn(
                    "group relative flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer",
                    active
                      ? "bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "hover:bg-white/[0.035]"
                  )}
                >
                  {/* Single or Stacked Group Avatar */}
                  <div className="relative mt-0.5 flex shrink-0 items-center">
                    {isGroup ? (
                      <div className="flex -space-x-2.5">
                        {members.slice(0, 2).map((m) => (
                          <AgentOrbAvatar key={m.id} spec={m.avatar} size={24} />
                        ))}
                      </div>
                    ) : members[0] ? (
                      <AgentOrbAvatar spec={members[0].avatar} size={28} />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="truncate text-[12.5px] font-medium text-[#f7f8f8]">
                        {conv.title}
                      </span>
                      <div className="flex items-center gap-1">
                        {isGroup && (
                          <span className="rounded bg-white/[0.06] px-1 py-0.5 font-mono text-[9.5px] text-[#8a8f98]">
                            {members.length}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(conv.id);
                          }}
                          aria-label={conv.pinned ? "Unpin thread" : "Pin thread"}
                          className={cn(
                            "rounded p-0.5 transition-opacity cursor-pointer",
                            conv.pinned
                              ? "text-[#8a8f98] opacity-90"
                              : "text-[#5e626a] opacity-0 group-hover:opacity-100 hover:text-[#f7f8f8]"
                          )}
                        >
                          <Pin className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-0.5 truncate text-[11.5px] text-[#8a8f98]">
                      {lastMsg?.text ?? "Start a conversation"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2.5 text-[11.5px] text-[#8a8f98]">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 hover:text-[#f7f8f8] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#818cf8]" />
              <span>Pieces Marketplace</span>
            </Link>
            <span className="font-mono text-[10.5px] text-[#5e626a]">
              {agents.length} agents
            </span>
          </div>
        </aside>

        {/* CENTER PANE: Live Multi-Agent Conversation or New Group Cluster Picker */}
        <div className="flex min-w-0 flex-col bg-[#0b0c0e]">
          {/* Active Thread Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
            {isNewChatMode ? (
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Users className="h-4 w-4 shrink-0 text-[#818cf8]" />
                <span className="truncate text-[13px] font-medium text-[#f7f8f8]">
                  New multi-agent conversation
                </span>
              </div>
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <div className="flex shrink-0 -space-x-2">
                  {activeParticipants.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => {
                        setInspectedAgentId(agent.id);
                        setInspectorOpen(true);
                      }}
                      title={`Inspect ${agent.name}`}
                      className="rounded-full transition-transform hover:scale-110 cursor-pointer"
                    >
                      <AgentOrbAvatar
                        spec={agent.avatar}
                        size={28}
                        thinking={thinkingAgentId === agent.id}
                      />
                    </button>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[13px] font-medium text-[#f7f8f8]">
                      {activeConversation.title}
                    </span>
                    <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-[#8a8f98]">
                      {primaryAgent.tier}
                    </span>
                  </div>
                  <div className="truncate font-mono text-[10.5px] text-[#5e626a]">
                    {activeParticipants.map((a) => a.handle).join(" · ")}
                  </div>
                </div>
              </div>
            )}

            <div className="relative flex shrink-0 items-center gap-2">
              {!isNewChatMode && invitableAgents.length > 0 && (
                <>
                  <button
                    type="button"
                    data-testid="invite-agent-btn"
                    onClick={() => setInviteOpen((v) => !v)}
                    className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11.5px] text-[#c4c8d0] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add agent</span>
                  </button>

                  {inviteOpen && (
                    <div className="absolute right-0 top-9 z-20 w-56 rounded-lg border border-white/[0.12] bg-[#111317] p-1.5 shadow-2xl">
                      <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                        Invite to Shared Bus
                      </div>
                      {invitableAgents.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => inviteAgentToActiveThread(a.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-[#d4d6dc] hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                        >
                          <AgentOrbAvatar spec={a.avatar} size={20} />
                          <span className="truncate">{a.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {isNewChatMode && (
                <button
                  type="button"
                  onClick={() => setIsNewChatMode(false)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] text-[#8a8f98] hover:text-[#f7f8f8] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Center Body: Either Gathering Avatar Cluster Picker OR Message Feed */}
          {isNewChatMode ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
              {/* Gathering Animated Avatar Cluster */}
              <div className="flex min-h-[76px] items-center justify-center -space-x-3">
                {selectedNewIds.map((id) => {
                  const agent = agentMap.get(id);
                  if (!agent) return null;
                  return (
                    <motion.div
                      key={agent.id}
                      layout
                      initial={{ scale: 0.65, opacity: 0, y: 12 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="rounded-full p-0.5"
                    >
                      <AgentOrbAvatar spec={agent.avatar} size={54} />
                    </motion.div>
                  );
                })}
              </div>

              <h3 className="mt-4 text-[15px] font-medium tracking-[-0.02em] text-[#f7f8f8]">
                Assemble your agents
              </h3>
              <p className="mt-1 max-w-sm text-[12.5px] text-[#8a8f98]">
                Pick one or more Orthese Pieces. Their avatars gather into a shared
                context room when you send your first prompt.
              </p>

              {/* Compact Agent Pills */}
              <div className="mt-5 flex max-w-md flex-wrap justify-center gap-2">
                {agents.map((agent) => {
                  const selected = selectedNewIds.includes(agent.id);
                  return (
                    <button
                      key={agent.id}
                      type="button"
                      data-testid={`pick-agent-${agent.id}`}
                      onClick={() => toggleParticipantInNewChat(agent.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer",
                        selected
                          ? "border-white/25 bg-white/[0.12] text-[#f7f8f8]"
                          : "border-white/[0.08] bg-white/[0.02] text-[#8a8f98] hover:border-white/[0.16] hover:text-[#f7f8f8]"
                      )}
                    >
                      <AgentOrbAvatar spec={agent.avatar} size={18} />
                      <span>{agent.name}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                data-testid="start-group-btn"
                onClick={() => startNewConversationWithPrompt()}
                className="btn-pill-white mt-6 inline-flex h-8 items-center rounded-full px-4 text-[12.5px] font-medium cursor-pointer"
              >
                Start {selectedNewIds.length > 1 ? `group (${selectedNewIds.length})` : "chat"}
              </button>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 max-h-[370px]">
              <div className="flex items-center justify-center">
                <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 font-mono text-[10px] text-[#5e626a]">
                  Today
                </span>
              </div>

              {activeConversation.messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[82%] rounded-2xl rounded-br-sm border border-white/[0.1] bg-white/[0.08] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#f7f8f8]">
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                }

                const sender = (msg.agentId && agentMap.get(msg.agentId)) || primaryAgent;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setInspectedAgentId(sender.id);
                        setInspectorOpen(true);
                      }}
                      className="mt-0.5 shrink-0 cursor-pointer"
                      title={`Customize ${sender.name}`}
                    >
                      <AgentOrbAvatar spec={sender.avatar} size={28} />
                    </button>
                    <div className="min-w-0 max-w-[85%] space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-medium text-[#f7f8f8]">
                          {sender.name}
                        </span>
                        {msg.contextBadge && (
                          <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-[#a5b4fc]">
                            {msg.contextBadge}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-[#5e626a]">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-[#c4c8d0]">
                        {msg.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Animated Thinking State */}
              {thinkingAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <AgentOrbAvatar spec={thinkingAgent.avatar} size={28} thinking />
                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[12px] text-[#8a8f98]">
                    <span className="text-[#f7f8f8] font-medium">
                      {thinkingAgent.name}
                    </span>
                    <span>Thinking…</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Interactive Composer */}
          <div className="border-t border-white/[0.06] bg-[#0d0e11] p-3">
            {/* Quick Suggestion Chips */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSend(chip)}
                  className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-0.5 text-[11px] text-[#8a8f98] hover:border-white/[0.16] hover:text-[#f7f8f8] transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#08090a] px-3 py-1.5 focus-within:border-white/25 transition-colors"
            >
              <input
                type="text"
                data-testid="multi-agent-composer"
                value={composerValue}
                onChange={(e) => setComposerValue(e.target.value)}
                placeholder={
                  isNewChatMode
                    ? `Message ${selectedNewIds.length} selected agent${selectedNewIds.length > 1 ? "s" : ""}...`
                    : `Message ${activeConversation.title}...`
                }
                className="h-7 flex-1 bg-transparent text-[13px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:outline-none"
              />
              <button
                type="submit"
                data-testid="multi-agent-send"
                disabled={!composerValue.trim()}
                aria-label="Send message"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#f7f8f8] text-[#08090a] transition-opacity hover:bg-white disabled:opacity-35 cursor-pointer"
              >
                <ArrowUp className="h-3.5 w-3.5 stroke-[2.4]" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANE: Live Agent Creator / Inspector */}
        {inspectorOpen && (
          <aside
            data-testid="agent-inspector-panel"
            className="flex w-full flex-col justify-between border-t border-white/[0.07] bg-[#090a0c] p-4 lg:w-[272px] lg:border-l lg:border-t-0"
          >
            <div className="space-y-4">
              {/* Live Canvas Avatar Stage */}
              <div className="flex flex-col items-center rounded-lg border border-white/[0.06] bg-[#0c0d10] py-4">
                <AgentOrbAvatar
                  spec={inspectedAgent.avatar}
                  size={84}
                  thinking={thinkingAgentId === inspectedAgent.id}
                />
                <span className="mt-2 font-mono text-[10.5px] text-[#5e626a]">
                  {inspectedAgent.handle}
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                  Name
                </label>
                <input
                  type="text"
                  data-testid="inspector-name-input"
                  value={inspectedAgent.name}
                  onChange={(e) => updateInspectedAgent({ name: e.target.value })}
                  className="h-8 w-full rounded-md border border-white/[0.08] bg-[#0e1013] px-2.5 text-[12.5px] text-[#f7f8f8] focus:border-white/25 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={inspectedAgent.description}
                  onChange={(e) => updateInspectedAgent({ description: e.target.value })}
                  className="w-full resize-none rounded-md border border-white/[0.08] bg-[#0e1013] px-2.5 py-1.5 text-[11.5px] leading-relaxed text-[#c4c8d0] focus:border-white/25 focus:outline-none"
                />
              </div>

              {/* Shape Selector */}
              <div>
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                  Avatar Shape
                </span>
                <div className="grid grid-cols-4 gap-1 rounded-md border border-white/[0.07] bg-[#0d0e11] p-0.5">
                  {SHAPES.map((s) => {
                    const active = inspectedAgent.avatar.shape === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        data-testid={`shape-${s.id}`}
                        onClick={() => updateInspectedAvatar({ shape: s.id })}
                        className={cn(
                          "rounded py-1 text-[11px] font-medium transition-colors cursor-pointer",
                          active
                            ? "bg-white/[0.12] text-[#f7f8f8]"
                            : "text-[#8a8f98] hover:text-[#f7f8f8]"
                        )}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expression Selector */}
              <div>
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                  Expression
                </span>
                <div className="grid grid-cols-4 gap-1 rounded-md border border-white/[0.07] bg-[#0d0e11] p-0.5">
                  {EXPRESSIONS.map((exp) => {
                    const active = inspectedAgent.avatar.expression === exp.id;
                    return (
                      <button
                        key={exp.id}
                        type="button"
                        data-testid={`expr-${exp.id}`}
                        onClick={() => updateInspectedAvatar({ expression: exp.id })}
                        className={cn(
                          "rounded py-1 text-[11px] font-medium transition-colors cursor-pointer",
                          active
                            ? "bg-white/[0.12] text-[#f7f8f8]"
                            : "text-[#8a8f98] hover:text-[#f7f8f8]"
                        )}
                      >
                        {exp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Swatches */}
              <div>
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                  Identity Color
                </span>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((c) => {
                    const active = inspectedAgent.avatar.color === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        aria-label={`Set color ${c.label}`}
                        onClick={() => updateInspectedAvatar({ color: c.hex })}
                        style={{ backgroundColor: c.hex }}
                        className={cn(
                          "h-4.5 w-4.5 rounded-full transition-transform cursor-pointer",
                          active
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#090a0c]"
                            : "opacity-75 hover:opacity-100"
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Model Tier */}
              <div>
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-[#5e626a]">
                  Model Tier
                </span>
                <div className="grid grid-cols-3 gap-1 rounded-md border border-white/[0.07] bg-[#0d0e11] p-0.5">
                  {TIERS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateInspectedAgent({ tier: t.id })}
                      className={cn(
                        "rounded py-1 font-mono text-[10.5px] transition-colors cursor-pointer",
                        inspectedAgent.tier === t.id
                          ? "bg-white/[0.12] text-[#f7f8f8]"
                          : "text-[#8a8f98] hover:text-[#f7f8f8]"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              data-testid="create-custom-agent-btn"
              onClick={createCustomAgent}
              className="mt-4 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.04] text-[12px] font-medium text-[#f7f8f8] hover:bg-white/[0.09] transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create custom agent</span>
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}
