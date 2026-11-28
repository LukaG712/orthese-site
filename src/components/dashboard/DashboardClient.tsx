"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Columns2,
  Cpu,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CREDIT_PACKS, MARKETPLACE_ITEMS, getMarketplaceItem } from "@/data/catalog";
import { Avatar } from "@/components/primitives/Avatar";
import { Kbd, SegmentedControl } from "@/components/primitives/BoardUIPrimitives";
import { useStorefront } from "@/components/shell/StorefrontContext";
import { AssetIcon } from "@/components/ui/Icon";
import type { MarketplaceItem } from "@/types/piece-sdk";
import { cn } from "@/lib/cn";
import {
  DASHBOARD_MCP_SERVERS,
  DASHBOARD_MODELS,
  INITIAL_BUS_EVENTS,
  INITIAL_WORKSPACES,
  createStarterWorkspaceFromPack,
  type BusEvent,
  type PaneSpan,
  type RoutingEngine,
  type WorkspaceTab,
} from "./dashboardTypes";
import { PiecePaneBody } from "./PiecePaneBody";
import { PiecePickerDrawer } from "./PiecePickerDrawer";

const WORKSPACE_STORAGE_KEY = "orthese.dashboard.workspaces.v1";

const SPAN_STEPS: PaneSpan[] = [4, 6, 8, 12];

function spanToGridClass(span: PaneSpan): string {
  if (span === 4) return "lg:col-span-4";
  if (span === 6) return "lg:col-span-6";
  if (span === 8) return "lg:col-span-8";
  return "lg:col-span-12";
}

function spanLabel(span: PaneSpan): string {
  if (span === 4) return "1/3";
  if (span === 6) return "1/2";
  if (span === 8) return "2/3";
  return "Full";
}

export function DashboardClient() {
  const { user, credits, adjustCredits, openCheckout, setCommandOpen } = useStorefront();

  const [workspaces, setWorkspaces] = useState<WorkspaceTab[]>(INITIAL_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(INITIAL_WORKSPACES[0].id);
  const [hydrated, setHydrated] = useState(false);

  const [routingEngine, setRoutingEngine] = useState<RoutingEngine>("credits");
  const [selectedModelId, setSelectedModelId] = useState<string>(DASHBOARD_MODELS[0].id);
  const [busEvents, setBusEvents] = useState<BusEvent[]>(INITIAL_BUS_EVENTS);
  const [maximizedPaneId, setMaximizedPaneId] = useState<string | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [routerMenuOpen, setRouterMenuOpen] = useState(false);
  const [hubMenuOpen, setHubMenuOpen] = useState(false);
  const [newWsMenuOpen, setNewWsMenuOpen] = useState(false);

  const routerMenuRef = useRef<HTMLDivElement | null>(null);
  const hubMenuRef = useRef<HTMLDivElement | null>(null);
  const newWsMenuRef = useRef<HTMLDivElement | null>(null);

  // Hydrate persisted workspaces + apply optional ?piece=<id> or ?pack=<id> query param
  useEffect(() => {
    let loaded = INITIAL_WORKSPACES;
    let initialActiveId = INITIAL_WORKSPACES[0].id;

    try {
      const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          workspaces?: WorkspaceTab[];
          activeId?: string;
        };
        if (Array.isArray(parsed.workspaces) && parsed.workspaces.length > 0) {
          loaded = parsed.workspaces;
          if (parsed.activeId && loaded.some((w) => w.id === parsed.activeId)) {
            initialActiveId = parsed.activeId;
          } else {
            initialActiveId = loaded[0].id;
          }
        }
      }
    } catch {
      // Ignore storage errors
    }

    const params = new URLSearchParams(window.location.search);
    const packParam = params.get("pack");
    const pieceParam = params.get("piece");

    if (packParam) {
      const pack = getMarketplaceItem(packParam);
      if (pack && pack.kind === "starter-pack") {
        const existing = loaded.find((w) => w.packId === pack.id);
        if (existing) {
          initialActiveId = existing.id;
        } else {
          const created = createStarterWorkspaceFromPack(pack);
          loaded = [...loaded, created];
          initialActiveId = created.id;
        }
      }
    } else if (pieceParam) {
      const item = getMarketplaceItem(pieceParam);
      if (item && item.kind === "piece") {
        const targetWs = loaded.find((w) => w.id === initialActiveId) ?? loaded[0];
        const alreadyOnCanvas = targetWs.panes.some((p) => p.pieceId === item.id);
        if (!alreadyOnCanvas) {
          const newPane = {
            instanceId: `pane-url-${Date.now().toString(36)}`,
            pieceId: item.id,
            span: 6 as PaneSpan,
          };
          loaded = loaded.map((w) =>
            w.id === targetWs.id ? { ...w, panes: [...w.panes, newPane] } : w
          );
        }
      }
    }

    setWorkspaces(loaded);
    setActiveWorkspaceId(initialActiveId);
    setHydrated(true);
  }, []);

  // Persist workspace layout changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        JSON.stringify({ workspaces, activeId: activeWorkspaceId })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [workspaces, activeWorkspaceId, hydrated]);

  // Dismiss open top-bar popovers on outside click / Escape
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (routerMenuRef.current && !routerMenuRef.current.contains(target)) {
        setRouterMenuOpen(false);
      }
      if (hubMenuRef.current && !hubMenuRef.current.contains(target)) {
        setHubMenuOpen(false);
      }
      if (newWsMenuRef.current && !newWsMenuRef.current.contains(target)) {
        setNewWsMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setRouterMenuOpen(false);
        setHubMenuOpen(false);
        setNewWsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];
  const activeModel =
    DASHBOARD_MODELS.find((m) => m.id === selectedModelId) ?? DASHBOARD_MODELS[0];

  const latestSpec = useMemo(
    () => busEvents.find((ev) => ev.mime === "orthese/spec") ?? busEvents[0] ?? null,
    [busEvents]
  );

  const starterPacks = useMemo(
    () => MARKETPLACE_ITEMS.filter((item) => item.kind === "starter-pack"),
    []
  );
  const allSkills = useMemo(
    () => MARKETPLACE_ITEMS.filter((item) => item.kind === "skill"),
    []
  );

  function updateActiveWorkspace(updater: (ws: WorkspaceTab) => WorkspaceTab) {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === activeWorkspace.id ? updater(ws) : ws))
    );
  }

  function handleAddPiece(item: MarketplaceItem) {
    const newPane = {
      instanceId: `pane-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      pieceId: item.id,
      span: (item.id === "orthese.website-builder" ? 8 : 4) as PaneSpan,
    };
    updateActiveWorkspace((ws) => ({ ...ws, panes: [...ws.panes, newPane] }));
    toast.success(`Snapped ${item.name} onto ${activeWorkspace.name}`);
  }

  function handleRemovePane(instanceId: string) {
    if (maximizedPaneId === instanceId) setMaximizedPaneId(null);
    updateActiveWorkspace((ws) => ({
      ...ws,
      panes: ws.panes.filter((p) => p.instanceId !== instanceId),
    }));
  }

  function handleCycleSpan(instanceId: string) {
    updateActiveWorkspace((ws) => ({
      ...ws,
      panes: ws.panes.map((p) => {
        if (p.instanceId !== instanceId) return p;
        const idx = SPAN_STEPS.indexOf(p.span);
        const nextSpan = SPAN_STEPS[(idx + 1) % SPAN_STEPS.length];
        return { ...p, span: nextSpan };
      }),
    }));
  }

  function handleMovePane(instanceId: string, direction: -1 | 1) {
    updateActiveWorkspace((ws) => {
      const idx = ws.panes.findIndex((p) => p.instanceId === instanceId);
      const targetIdx = idx + direction;
      if (idx < 0 || targetIdx < 0 || targetIdx >= ws.panes.length) return ws;
      const copy = [...ws.panes];
      const [moved] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, moved);
      return { ...ws, panes: copy };
    });
  }

  function handleToggleSkill(skillId: string) {
    updateActiveWorkspace((ws) => {
      const exists = ws.activeSkillIds.includes(skillId);
      return {
        ...ws,
        activeSkillIds: exists
          ? ws.activeSkillIds.filter((id) => id !== skillId)
          : [...ws.activeSkillIds, skillId],
      };
    });
  }

  function handleToggleMcp(mcpId: string) {
    updateActiveWorkspace((ws) => {
      const exists = ws.activeMcpIds.includes(mcpId);
      return {
        ...ws,
        activeMcpIds: exists
          ? ws.activeMcpIds.filter((id) => id !== mcpId)
          : [...ws.activeMcpIds, mcpId],
      };
    });
  }

  function handleOpenStarterPack(pack: MarketplaceItem) {
    const created = createStarterWorkspaceFromPack(pack);
    setWorkspaces((prev) => [...prev, created]);
    setActiveWorkspaceId(created.id);
    setMaximizedPaneId(null);
    toast.success(`Opened ${pack.name} workspace`);
  }

  function handleCreateBlankWorkspace() {
    const uid = Date.now().toString(36);
    const created: WorkspaceTab = {
      id: `ws-blank-${uid}`,
      name: `Canvas ${workspaces.length + 1}`,
      panes: [],
      activeSkillIds: ["orthese.skill-landing-architect"],
      activeMcpIds: ["browser"],
    };
    setWorkspaces((prev) => [...prev, created]);
    setActiveWorkspaceId(created.id);
    setMaximizedPaneId(null);
    setNewWsMenuOpen(false);
    setPickerOpen(true);
  }

  function handleCloseWorkspace(id: string) {
    if (workspaces.length <= 1) return;
    const remaining = workspaces.filter((w) => w.id !== id);
    setWorkspaces(remaining);
    if (activeWorkspaceId === id) {
      setActiveWorkspaceId(remaining[0].id);
      setMaximizedPaneId(null);
    }
  }

  function handleResetLayout() {
    setWorkspaces(INITIAL_WORKSPACES);
    setActiveWorkspaceId(INITIAL_WORKSPACES[0].id);
    setMaximizedPaneId(null);
    toast.info("Restored default Starter Pack workspaces");
  }

  function handleEmitBus(event: Omit<BusEvent, "id" | "timestamp">) {
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const created: BusEvent = {
      ...event,
      id: `bus-${Date.now().toString(36)}`,
      timestamp: timeLabel,
    };
    setBusEvents((prev) => [created, ...prev.slice(0, 7)]);
    toast.success(`Emitted ${event.mime} on Shared Context Bus`, {
      description: `${event.fromPieceName}: ${event.title}`,
    });
  }

  function handleSpendCredits(amount: number, reason: string): boolean {
    if (amount === 0) return true;
    if (credits < amount) {
      const builder = CREDIT_PACKS.find((p) => p.id === "builder") ?? CREDIT_PACKS[2];
      toast.error("Insufficient Orthese Credits", {
        description: `${reason} requires ${amount} cr. Top up to continue.`,
      });
      openCheckout({
        id: builder.id,
        title: builder.name,
        subtitle: `${builder.credits.toLocaleString()} Orthese Credits · Never expires`,
        priceEur: builder.priceEur,
        credits: builder.credits,
      });
      return false;
    }
    adjustCredits(-amount);
    return true;
  }

  function openTopUpModal() {
    const builder = CREDIT_PACKS.find((p) => p.id === "builder") ?? CREDIT_PACKS[2];
    openCheckout({
      id: builder.id,
      title: builder.name,
      subtitle: `${builder.credits.toLocaleString()} Orthese Credits · Never expires`,
      priceEur: builder.priceEur,
      credits: builder.credits,
    });
  }

  const visiblePanes = maximizedPaneId
    ? activeWorkspace.panes.filter((p) => p.instanceId === maximizedPaneId)
    : activeWorkspace.panes;

  return (
    <div className="flex min-h-[100svh] flex-col bg-[#121212] text-[#fafafa]">
      {/* TOP WORKSTATION CHROME: CREDITS/ROUTER BAR + WORKSPACE TABS */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#141416]/95 backdrop-blur-xl">
        {/* ROW 1: BRAND + ROUTER / CREDITS BAR + PIECE PICKER */}
        <div className="flex flex-col gap-2 px-3.5 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
          {/* Left: Home Mark + Canvas Badge (+ Mobile Add Piece action) */}
          <div className="flex items-center justify-between gap-2.5 sm:justify-start">
            <div className="flex items-center gap-2.5">
              <Link
                href="/"
                aria-label="Back to Orthese Home"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#1a1a1d] px-2.5 py-1.5 text-[13px] font-medium text-[#fafafa] transition-colors hover:border-white/[0.18]"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" />
                  <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" />
                  <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" />
                  <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="currentColor" fillOpacity="0.4" />
                </svg>
                <span>Orthese</span>
              </Link>

              <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#121212] px-2.5 py-1 font-mono text-[10.5px] text-[#a3a3a3] md:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Canvas Shell · WASM</span>
              </span>
            </div>

            {/* Mobile-only compact Add Piece + Account on Row 1 */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                type="button"
                data-testid="dashboard-add-piece-btn-mobile"
                onClick={() => setPickerOpen(true)}
                className="bg-button-primary inline-flex h-8 items-center gap-1 rounded-lg px-3 text-[12.5px] font-medium cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Piece</span>
              </button>
              {user && (
                <Link href="/auth" aria-label={`Signed in as ${user.name}`}>
                  <Avatar name={user.name} src={user.avatarUrl} size="sm" status="online" />
                </Link>
              )}
            </div>
          </div>

          {/* Right: Router Switcher, Live Credits, Skills/MCP/Bus Hub, Add Piece (sm+), Account */}
          <div className="flex items-center justify-between gap-1.5 sm:justify-end sm:gap-2">
            {/* Router & Model Popover */}
            <div ref={routerMenuRef} className="relative min-w-0 flex-1 sm:flex-none">
              <button
                type="button"
                data-testid="dashboard-router-btn"
                onClick={() => {
                  setRouterMenuOpen((v) => !v);
                  setHubMenuOpen(false);
                  setNewWsMenuOpen(false);
                }}
                className="inline-flex h-8 w-full items-center justify-between gap-1.5 rounded-xl border border-white/[0.09] bg-[#1a1a1d] px-2.5 text-[12px] font-medium text-[#fafafa] transition-colors hover:border-white/[0.18] sm:w-auto sm:justify-start cursor-pointer"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 shrink-0 text-[#a3a3a3]" />
                  <span className="truncate sm:max-w-[165px]">
                    {routingEngine === "cliproxy" ? "Local CLIProxyAPI" : activeModel.label}
                  </span>
                </span>
                <ChevronDown className="h-3 w-3 shrink-0 text-[#737373]" />
              </button>

              {routerMenuOpen && (
                <div
                  data-testid="dashboard-router-menu"
                  className="fixed inset-x-3 top-[92px] z-50 rounded-2xl border border-white/[0.12] bg-[#161618] p-3 shadow-[0_24px_64px_rgba(0,0,0,0.92)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[310px]"
                >
                  <div className="mb-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                    <span>AI Router Engine</span>
                    <Link href="/router" className="text-[#d4d4d4] hover:text-[#fafafa]">
                      Details →
                    </Link>
                  </div>

                  <SegmentedControl<RoutingEngine>
                    ariaLabel="Choose AI routing engine"
                    value={routingEngine}
                    onChange={setRoutingEngine}
                    className="w-full"
                    options={[
                      { id: "credits", label: "Orthese Credits" },
                      { id: "cliproxy", label: "Local OAuth" },
                    ]}
                  />

                  <div className="mt-3 space-y-1">
                    {DASHBOARD_MODELS.map((model) => {
                      const active = model.id === selectedModelId;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModelId(model.id);
                            setRouterMenuOpen(false);
                            toast.success(`Active model: ${model.label}`);
                          }}
                          className={cn(
                            "flex w-full items-start justify-between gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors cursor-pointer",
                            active
                              ? "border-white/[0.16] bg-white/[0.08]"
                              : "border-transparent hover:bg-white/[0.04]"
                          )}
                        >
                          <div className="min-w-0">
                            <div className="text-[12.5px] font-medium text-[#fafafa]">
                              {model.label}
                            </div>
                            <div className="text-[11px] text-[#737373]">{model.hint}</div>
                          </div>
                          <span className="shrink-0 font-mono text-[10.5px] text-[#a3a3a3]">
                            {routingEngine === "cliproxy" ? "0 cr" : `~${model.costCr} cr`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Live Credits Balance + Top-up */}
            <button
              type="button"
              data-testid="dashboard-credits-btn"
              onClick={openTopUpModal}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.09] bg-[#1a1a1d] px-2.5 font-mono text-[11.5px] tabular-nums text-[#fafafa] transition-colors hover:border-white/[0.2] cursor-pointer"
              title="Top up non-expiring Orthese Credits"
            >
              <Sparkles className="h-3 w-3 shrink-0 text-[#a3a3a3]" />
              <span>
                <NumberFlow value={credits} /> cr
              </span>
              <span className="hidden rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[9.5px] text-[#d4d4d4] sm:inline">
                + Top up
              </span>
            </button>

            {/* Shared Context Bus + Skills/MCP Hub Popover */}
            <div ref={hubMenuRef} className="relative shrink-0">
              <button
                type="button"
                data-testid="dashboard-hub-btn"
                onClick={() => {
                  setHubMenuOpen((v) => !v);
                  setRouterMenuOpen(false);
                  setNewWsMenuOpen(false);
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-white/[0.09] bg-[#1a1a1d] px-2.5 font-mono text-[11px] text-[#d4d4d4] transition-colors hover:border-white/[0.18] hover:text-[#fafafa] cursor-pointer"
              >
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Bus &amp; Hub</span>
                <span className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[10px] text-[#fafafa] tabular-nums">
                  {busEvents.length}
                </span>
              </button>

              {hubMenuOpen && (
                <div
                  data-testid="dashboard-hub-menu"
                  className="fixed inset-x-3 top-[92px] z-50 max-h-[75svh] overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#161618] p-3.5 shadow-[0_24px_64px_rgba(0,0,0,0.92)] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[340px]"
                >
                  {/* Bus feed */}
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                    <span>Shared Context Bus</span>
                    <span className="text-emerald-400">bus://workspace.default</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {busEvents.slice(0, 3).map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-xl border border-white/[0.06] bg-[#121212] p-2.5"
                      >
                        <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                          <span className="text-[#fafafa]">{ev.mime}</span>
                          <span className="text-[#737373]">{ev.timestamp}</span>
                        </div>
                        <div className="mt-1 truncate text-[12px] font-medium text-[#d4d4d4]">
                          {ev.title}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Active SKILL.md */}
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                    Workspace SKILL.md ({activeWorkspace.activeSkillIds.length})
                  </div>
                  <div className="mt-2 space-y-1">
                    {allSkills.map((sk) => {
                      const on = activeWorkspace.activeSkillIds.includes(sk.id);
                      return (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => handleToggleSkill(sk.id)}
                          className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[#121212] px-2.5 py-2 text-left text-[12px] transition-colors hover:border-white/[0.14] cursor-pointer"
                        >
                          <span className={on ? "text-[#fafafa]" : "text-[#737373]"}>
                            {sk.name}
                          </span>
                          <span className="font-mono text-[10px] text-[#a3a3a3]">
                            {on ? "Loaded" : "Off"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Scoped MCP Hub */}
                  <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                    Scoped MCP Allowlist
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1.5">
                    {DASHBOARD_MCP_SERVERS.map((srv) => {
                      const on = activeWorkspace.activeMcpIds.includes(srv.id);
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => handleToggleMcp(srv.id)}
                          className={cn(
                            "flex items-center justify-between rounded-xl border px-2.5 py-2 font-mono text-[11px] transition-colors cursor-pointer",
                            on
                              ? "border-white/[0.14] bg-[#1d1d20] text-[#fafafa]"
                              : "border-white/[0.06] bg-[#121212] text-[#737373]"
                          )}
                        >
                          <span className="truncate">{srv.name}</span>
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              on ? "bg-emerald-400" : "bg-[#404040]"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Add Piece Picker Trigger (sm+ desktop/tablet) */}
            <button
              type="button"
              data-testid="dashboard-add-piece-btn"
              onClick={() => setPickerOpen(true)}
              className="bg-button-primary hidden h-8 items-center gap-1 rounded-lg px-3 text-[12.5px] font-medium sm:inline-flex cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Piece</span>
            </button>

            {/* Command Palette Shortcut */}
            <button
              type="button"
              aria-label="Open Command Palette"
              onClick={() => setCommandOpen(true)}
              className="hidden h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#1a1a1d] px-2 text-[#a3a3a3] transition-colors hover:border-white/[0.18] hover:text-[#fafafa] sm:inline-flex cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <Kbd>⌘K</Kbd>
            </button>

            {/* Account or Sign In */}
            {user ? (
              <Link href="/auth" aria-label={`Signed in as ${user.name}`} className="hidden sm:inline-flex">
                <Avatar name={user.name} src={user.avatarUrl} size="sm" status="online" />
              </Link>
            ) : (
              <Link
                href="/auth?mode=login"
                className="bg-button-secondary hidden h-8 items-center rounded-lg px-3 text-[12.5px] font-medium md:inline-flex"
              >
                Log in
              </Link>
            )}
          </div>
        </div>

        {/* ROW 2: WORKSPACE TABS BAR */}
        <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] bg-[#121212]/90 px-3.5 py-2 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
              {workspaces.map((ws) => {
                const active = ws.id === activeWorkspace.id;
                return (
                  <div
                    key={ws.id}
                    className={cn(
                      "group inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] transition-colors",
                      active
                        ? "border-white/[0.14] bg-[#1d1d20] font-medium text-[#fafafa]"
                        : "border-transparent bg-transparent text-[#a3a3a3] hover:bg-white/[0.04] hover:text-[#fafafa]"
                    )}
                  >
                    <button
                      type="button"
                      data-testid={`ws-tab-${ws.id}`}
                      onClick={() => {
                        setActiveWorkspaceId(ws.id);
                        setMaximizedPaneId(null);
                      }}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Layers className="h-3 w-3 text-[#737373]" />
                      <span>{ws.name}</span>
                      <span className="font-mono text-[10px] text-[#737373]">
                        {ws.panes.length}
                      </span>
                    </button>

                    {workspaces.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Close ${ws.name} workspace`}
                        onClick={() => handleCloseWorkspace(ws.id)}
                        className="ml-0.5 rounded p-0.5 text-[#737373] transition-colors hover:bg-white/[0.08] hover:text-[#fafafa] cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* New Workspace Tab Dropdown (outside overflow-x-auto to prevent vertical clipping) */}
            <div ref={newWsMenuRef} className="relative shrink-0">
              <button
                type="button"
                data-testid="dashboard-new-ws-btn"
                onClick={() => {
                  setNewWsMenuOpen((v) => !v);
                  setRouterMenuOpen(false);
                  setHubMenuOpen(false);
                }}
                className="inline-flex h-7 items-center gap-1 rounded-xl border border-dashed border-white/[0.14] px-2.5 text-[11.5px] text-[#a3a3a3] transition-colors hover:border-white/[0.26] hover:text-[#fafafa] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span className="whitespace-nowrap">New Tab</span>
              </button>

              {newWsMenuOpen && (
                <div
                  data-testid="dashboard-new-ws-menu"
                  className="fixed inset-x-3 top-[138px] z-50 rounded-2xl border border-white/[0.12] bg-[#161618] p-2 shadow-[0_24px_64px_rgba(0,0,0,0.92)] sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-64"
                >
                  <div className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#737373]">
                    Start from Pack
                  </div>
                  {starterPacks.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => {
                        handleOpenStarterPack(pack);
                        setNewWsMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-[12.5px] text-[#d4d4d4] transition-colors hover:bg-white/[0.06] hover:text-[#fafafa] cursor-pointer"
                    >
                      <span>{pack.name}</span>
                      <Check className="h-3 w-3 text-[#737373]" />
                    </button>
                  ))}
                  <div className="my-1 border-t border-white/[0.06]" />
                  <button
                    type="button"
                    onClick={handleCreateBlankWorkspace}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[12.5px] font-medium text-[#fafafa] transition-colors hover:bg-white/[0.06] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#a3a3a3]" />
                    <span>Blank Canvas</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetLayout}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-[#737373] transition-colors hover:bg-white/[0.05] hover:text-[#fafafa] cursor-pointer"
            title="Restore default Starter Pack workspaces"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* MAIN MODULAR MULTI-PANE CANVAS */}
      <main className="relative flex-1 p-3.5 sm:p-5">
        {visiblePanes.length === 0 ? (
          <div className="mx-auto my-12 max-w-md rounded-3xl border border-dashed border-white/[0.12] bg-[#161618] p-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.1] bg-[#121212]">
              <Layers className="h-5 w-5 text-[#a3a3a3]" />
            </div>
            <h1 className="mt-4 text-[18px] font-medium tracking-[-0.02em] text-[#fafafa]">
              Empty canvas: {activeWorkspace.name}
            </h1>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#a3a3a3]">
              Snap any Piece from the Marketplace onto this workspace or load a Starter Pack.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="bg-button-primary inline-flex h-9 items-center gap-1.5 rounded-[10px] px-4 text-[13px] font-medium cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Open Piece Picker</span>
              </button>
              <button
                type="button"
                onClick={handleResetLayout}
                className="bg-button-secondary inline-flex h-9 items-center gap-1.5 rounded-[10px] px-4 text-[13px] font-medium cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Load Defaults</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            data-testid="dashboard-canvas-grid"
            className="grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            {visiblePanes.map((pane, idx) => {
              const item = getMarketplaceItem(pane.pieceId);
              if (!item) return null;
              const isMaximized = maximizedPaneId === pane.instanceId;

              return (
                <section
                  key={pane.instanceId}
                  data-testid={`canvas-pane-${pane.pieceId}`}
                  className={cn(
                    "flex min-h-[450px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
                    isMaximized ? "lg:col-span-12 min-h-[72svh]" : spanToGridClass(pane.span)
                  )}
                >
                  {/* Pane Chrome Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/[0.07] bg-[#19191c] px-3.5 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-[#121212]">
                        <AssetIcon name={item.icon} className="h-3.5 w-3.5 text-[#d4d4d4]" />
                      </span>
                      <h2 className="truncate text-[13px] font-medium text-[#fafafa]">
                        {item.name}
                      </h2>
                      {(isMaximized || pane.span >= 6) && (
                        <span className="hidden shrink-0 whitespace-nowrap rounded-md border border-white/[0.07] bg-[#121212] px-1.5 py-0.5 font-mono text-[9.5px] text-[#737373] sm:inline">
                          {item.manifest?.context.emits[0] ?? "piece"}
                        </span>
                      )}
                    </div>

                    {/* Pane Controls: Reorder, Resize Span, Maximize, Close */}
                    <div className="flex shrink-0 items-center gap-1">
                      {!isMaximized && activeWorkspace.panes.length > 1 && (
                        <>
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMovePane(pane.instanceId, -1)}
                            aria-label={`Move ${item.name} earlier`}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] disabled:opacity-25 cursor-pointer"
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === activeWorkspace.panes.length - 1}
                            onClick={() => handleMovePane(pane.instanceId, 1)}
                            aria-label={`Move ${item.name} later`}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] disabled:opacity-25 cursor-pointer"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </>
                      )}

                      {!isMaximized && (
                        <button
                          type="button"
                          onClick={() => handleCycleSpan(pane.instanceId)}
                          aria-label={`Resize ${item.name} width`}
                          title="Cycle pane width (1/3, 1/2, 2/3, Full)"
                          className="hidden h-6 items-center gap-1 rounded-md border border-white/[0.08] bg-[#121212] px-1.5 font-mono text-[10px] text-[#a3a3a3] transition-colors hover:border-white/[0.18] hover:text-[#fafafa] lg:inline-flex cursor-pointer"
                        >
                          <Columns2 className="h-3 w-3" />
                          <span>{spanLabel(pane.span)}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setMaximizedPaneId((curr) =>
                            curr === pane.instanceId ? null : pane.instanceId
                          )
                        }
                        aria-label={isMaximized ? `Restore ${item.name}` : `Maximize ${item.name}`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] cursor-pointer"
                      >
                        {isMaximized ? (
                          <Minimize2 className="h-3 w-3" />
                        ) : (
                          <Maximize2 className="h-3 w-3" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemovePane(pane.instanceId)}
                        aria-label={`Remove ${item.name} from canvas`}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white/[0.07] hover:text-rose-300 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Piece Content */}
                  <div className="flex-1 p-4">
                    <PiecePaneBody
                      item={item}
                      activeModel={activeModel}
                      routingEngine={routingEngine}
                      latestSpec={latestSpec}
                      onEmitBus={handleEmitBus}
                      onSpendCredits={handleSpendCredits}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* MARKETPLACE PIECE PICKER DRAWER */}
      <PiecePickerDrawer
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        activePieceIds={activeWorkspace.panes.map((p) => p.pieceId)}
        activeSkillIds={activeWorkspace.activeSkillIds}
        onAddPiece={handleAddPiece}
        onToggleSkill={handleToggleSkill}
        onOpenStarterPack={handleOpenStarterPack}
      />
    </div>
  );
}
