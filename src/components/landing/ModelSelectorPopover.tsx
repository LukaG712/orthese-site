"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ProviderId =
  | "router"
  | "anthropic"
  | "openai"
  | "google"
  | "xai"
  | "deepseek"
  | "qwen"
  | "mistral"
  | "meta"
  | "kimi"
  | "zhipu"
  | "ollama"
  | "cliproxy";

export type EffortLevel = "Low" | "Medium" | "High" | "Max";

export interface RealModelSpec {
  id: string;
  name: string;
  provider: ProviderId;
  providerLabel: string;
  baseCostCr: number;
  supportsEffort: boolean;
  defaultEffort: EffortLevel;
  badge?: string;
}

export const EFFORT_LEVELS: {
  id: EffortLevel;
  hint: string;
  multiplier: number;
}[] = [
  { id: "Low", hint: "Fastest · lowest token use", multiplier: 0.75 },
  { id: "Medium", hint: "Balanced depth & speed", multiplier: 1 },
  { id: "High", hint: "Extended multi-step thinking", multiplier: 1.4 },
  { id: "Max", hint: "Deepest architecture & audits", multiplier: 1.8 },
];

export const PROVIDERS: { id: ProviderId; label: string }[] = [
  { id: "router", label: "Orthese Router" },
  { id: "anthropic", label: "Anthropic (Claude)" },
  { id: "openai", label: "OpenAI" },
  { id: "google", label: "Google Gemini" },
  { id: "xai", label: "xAI (Grok)" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "qwen", label: "Qwen" },
  { id: "mistral", label: "Mistral" },
  { id: "meta", label: "Meta Llama" },
  { id: "kimi", label: "Moonshot Kimi" },
  { id: "zhipu", label: "Zhipu GLM" },
  { id: "ollama", label: "Ollama (Local)" },
  { id: "cliproxy", label: "CLIProxyAPI Local" },
];

export const REAL_MODELS: RealModelSpec[] = [
  // Orthese Router
  {
    id: "orthese-router",
    name: "Orthese Router",
    provider: "router",
    providerLabel: "Orthese Auto",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
    badge: "Auto",
  },
  {
    id: "orthese-router-frontier",
    name: "Orthese Router Max",
    provider: "router",
    providerLabel: "Orthese Auto",
    baseCostCr: 4,
    supportsEffort: true,
    defaultEffort: "High",
  },
  // Anthropic
  {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    provider: "anthropic",
    providerLabel: "Anthropic",
    baseCostCr: 3,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "claude-opus-4.5",
    name: "Claude Opus 4.5",
    provider: "anthropic",
    providerLabel: "Anthropic",
    baseCostCr: 6,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    providerLabel: "Anthropic",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // OpenAI
  {
    id: "gpt-5.2",
    name: "GPT-5.2",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 3,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "gpt-5.2-pro",
    name: "GPT-5.2 Pro",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 6,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "gpt-5.2-mini",
    name: "GPT-5.2 Mini",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 1,
    supportsEffort: true,
    defaultEffort: "Low",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "openai",
    providerLabel: "OpenAI",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  // Google Gemini
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    providerLabel: "Google",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    providerLabel: "Google",
    baseCostCr: 1,
    supportsEffort: true,
    defaultEffort: "Low",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "google",
    providerLabel: "Google",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // xAI Grok
  {
    id: "grok-4",
    name: "Grok 4",
    provider: "xai",
    providerLabel: "xAI",
    baseCostCr: 4,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "grok-4-mini",
    name: "Grok 4 Mini",
    provider: "xai",
    providerLabel: "xAI",
    baseCostCr: 1,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "grok-code-fast",
    name: "Grok Code Fast",
    provider: "xai",
    providerLabel: "xAI",
    baseCostCr: 2,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // DeepSeek
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "deepseek-v3.1",
    name: "DeepSeek V3.1",
    provider: "deepseek",
    providerLabel: "DeepSeek",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
  // Qwen
  {
    id: "qwen3-coder-480b",
    name: "Qwen3 Coder 480B",
    provider: "qwen",
    providerLabel: "Qwen",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "qwen3-235b-thinking",
    name: "Qwen3 235B Thinking",
    provider: "qwen",
    providerLabel: "Qwen",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "High",
  },
  {
    id: "qwen3-32b",
    name: "Qwen3 32B",
    provider: "qwen",
    providerLabel: "Qwen",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // Mistral
  {
    id: "mistral-large-2.1",
    name: "Mistral Large 2.1",
    provider: "mistral",
    providerLabel: "Mistral",
    baseCostCr: 2,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
  {
    id: "devstral-medium",
    name: "Devstral Medium",
    provider: "mistral",
    providerLabel: "Mistral",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "mistral",
    providerLabel: "Mistral",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // Meta Llama
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "meta",
    providerLabel: "Meta",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
  {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    provider: "meta",
    providerLabel: "Meta",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // Moonshot Kimi
  {
    id: "kimi-k2.5",
    name: "Kimi K2.5",
    provider: "kimi",
    providerLabel: "Moonshot",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    provider: "kimi",
    providerLabel: "Moonshot",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "High",
  },
  // Zhipu GLM
  {
    id: "glm-4.7",
    name: "GLM-4.7",
    provider: "zhipu",
    providerLabel: "Zhipu",
    baseCostCr: 2,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "glm-4.6-air",
    name: "GLM-4.6 Air",
    provider: "zhipu",
    providerLabel: "Zhipu",
    baseCostCr: 1,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  // Ollama (Local)
  {
    id: "ollama-qwen3-coder",
    name: "Qwen3 Coder (Local)",
    provider: "ollama",
    providerLabel: "Ollama · €0",
    baseCostCr: 0,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
  {
    id: "ollama-llama4-scout",
    name: "Llama 4 Scout (Local)",
    provider: "ollama",
    providerLabel: "Ollama · €0",
    baseCostCr: 0,
    supportsEffort: false,
    defaultEffort: "Low",
  },
  {
    id: "ollama-deepseek-r1",
    name: "DeepSeek R1 (Local)",
    provider: "ollama",
    providerLabel: "Ollama · €0",
    baseCostCr: 0,
    supportsEffort: true,
    defaultEffort: "High",
  },
  // Local CLIProxyAPI
  {
    id: "cliproxy-claude",
    name: "Claude Code OAuth",
    provider: "cliproxy",
    providerLabel: "CLIProxyAPI · €0",
    baseCostCr: 0,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "cliproxy-codex",
    name: "Codex CLI OAuth",
    provider: "cliproxy",
    providerLabel: "CLIProxyAPI · €0",
    baseCostCr: 0,
    supportsEffort: true,
    defaultEffort: "Medium",
  },
  {
    id: "cliproxy-gemini",
    name: "Gemini CLI OAuth",
    provider: "cliproxy",
    providerLabel: "CLIProxyAPI · €0",
    baseCostCr: 0,
    supportsEffort: false,
    defaultEffort: "Medium",
  },
];

export function ProviderGlyph({
  provider,
  className = "h-4 w-4",
}: {
  provider: ProviderId;
  className?: string;
}) {
  if (provider === "router") {
    return (
      <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
        <rect x="1.8" y="1.8" width="5" height="5" rx="1.2" fill="currentColor" />
        <rect
          x="9.2"
          y="1.8"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect
          x="1.8"
          y="9.2"
          width="5"
          height="5"
          rx="1.2"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect x="9.2" y="9.2" width="5" height="5" rx="1.2" fill="currentColor" fillOpacity="0.45" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Claude
  if (provider === "anthropic") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) OpenAI
  if (provider === "openai") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Gemini
  if (provider === "google") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Grok (xAI)
  if (provider === "xai") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) DeepSeek
  if (provider === "deepseek") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Qwen
  if (provider === "qwen") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M19.713 2.825h-5.907c0-.251-.066-.503-.196-.728L12.819.728A1.46 1.46 0 0 0 11.559 0h-1.58c-.52 0-1 .275-1.26.728l-2.42 4.19a1.45 1.45 0 0 0 0 1.453l.791 1.37c.26.448.74.727 1.26.727h11.36c.52 0 1-.275 1.26-.728l.79-1.37a1.45 1.45 0 0 0 0-1.451l-.79-1.37a1.46 1.46 0 0 0-1.26-.728zM.195 9.905l2.951 5.115a1.46 1.46 0 0 0-.531.531l-.791 1.37a1.45 1.45 0 0 0 0 1.452l.79 1.37c.26.448.74.727 1.26.727h4.84c.52 0 1-.275 1.26-.728l.79-1.37a1.45 1.45 0 0 0 0-1.451L5.086 7.083a1.46 1.46 0 0 0-1.26-.728h-1.58c-.52 0-1 .276-1.26.728l-.79 1.37a1.45 1.45 0 0 0 0 1.452m15.888 13.367 2.951-5.115c.217.125.469.196.728.196h1.582c.52 0 1-.275 1.26-.728l.79-1.37a1.45 1.45 0 0 0 0-1.451l-2.42-4.191a1.46 1.46 0 0 0-1.259-.728h-1.582c-.52 0-1 .276-1.259.728l-5.678 9.838a1.45 1.45 0 0 0 0 1.452l.79 1.37c.26.448.74.727 1.26.727h1.582c.52 0 1-.275 1.26-.728z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Mistral
  if (provider === "mistral") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          clipRule="evenodd"
          d="M3.428 3.4h3.429v3.428h3.429v3.429h-.002 3.431V6.828h3.427V3.4h3.43v13.714H24v3.429H13.714v-3.428h-3.428v-3.429h-3.43v3.428h3.43v3.429H0v-3.429h3.428V3.4zm10.286 13.715h3.428v-3.429h-3.427v3.429z"
        />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Meta
  if (provider === "meta") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Kimi
  if (provider === "kimi") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M21.846 0a1.923 1.923 0 110 3.846H20.15a.226.226 0 01-.227-.226V1.923C19.923.861 20.784 0 21.846 0z" />
        <path d="M11.065 11.199l7.257-7.2c.137-.136.06-.41-.116-.41H14.3a.164.164 0 00-.117.051l-7.82 7.756c-.122.12-.302.013-.302-.179V3.82c0-.127-.083-.23-.185-.23H3.186c-.103 0-.186.103-.186.23V19.77c0 .128.083.23.186.23h2.69c.103 0 .186-.102.186-.23v-3.25c0-.069.025-.135.069-.178l2.424-2.406a.158.158 0 01.205-.023l6.484 4.772a7.677 7.677 0 003.453 1.283c.108.012.2-.095.2-.23v-3.06c0-.117-.07-.212-.164-.227a5.028 5.028 0 01-2.027-.807l-5.613-4.064c-.117-.078-.132-.279-.028-.381z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Zhipu
  if (provider === "zhipu") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M11.991 23.503a.24.24 0 00-.244.248.24.24 0 00.244.249.24.24 0 00.245-.249.24.24 0 00-.22-.247l-.025-.001zM9.671 5.365a1.697 1.697 0 011.099 2.132l-.071.172-.016.04-.018.054c-.07.16-.104.32-.104.498-.035.71.47 1.279 1.186 1.314h.366c1.309.053 2.338 1.173 2.286 2.523-.052 1.332-1.152 2.38-2.478 2.327h-.174c-.715.018-1.274.64-1.239 1.368 0 .124.018.23.053.337.209.373.54.658.96.8.75.23 1.517-.125 1.9-.782l.018-.035c.402-.64 1.17-.96 1.92-.711.854.284 1.378 1.226 1.099 2.167a1.661 1.661 0 01-2.077 1.102 1.711 1.711 0 01-.907-.711l-.017-.035c-.2-.323-.463-.58-.851-.711l-.056-.018a1.646 1.646 0 00-1.954.746 1.66 1.66 0 01-1.065.764 1.677 1.677 0 01-1.989-1.279c-.209-.906.332-1.83 1.257-2.043a1.51 1.51 0 01.296-.035h.018c.68-.071 1.151-.622 1.116-1.333a1.307 1.307 0 00-.227-.693 2.515 2.515 0 01-.366-1.403 2.39 2.39 0 01.366-1.208c.14-.195.21-.444.227-.693.018-.71-.506-1.261-1.186-1.332l-.07-.018a1.43 1.43 0 01-.299-.07l-.05-.019a1.7 1.7 0 01-1.047-2.114 1.68 1.68 0 012.094-1.101zm-5.575 10.11c.26-.264.639-.367.994-.27.355.096.633.379.728.74.095.362-.007.748-.267 1.013-.402.41-1.053.41-1.455 0a1.062 1.062 0 010-1.482zm14.845-.294c.359-.09.738.024.992.297.254.274.344.665.237 1.025-.107.36-.396.634-.756.718-.551.128-1.1-.22-1.23-.781a1.05 1.05 0 01.757-1.26zm-.064-4.39c.314.32.49.753.49 1.206 0 .452-.176.886-.49 1.206-.315.32-.74.5-1.185.5-.444 0-.87-.18-1.184-.5a1.727 1.727 0 010-2.412 1.654 1.654 0 012.369 0zm-11.243.163c.364.484.447 1.128.218 1.691a1.665 1.665 0 01-2.188.923c-.855-.36-1.26-1.358-.907-2.228a1.68 1.68 0 011.33-1.038c.593-.08 1.183.169 1.547.652zm11.545-4.221c.368 0 .708.2.892.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.892.524c-.568 0-1.03-.47-1.03-1.048 0-.579.462-1.048 1.03-1.048zm-14.358 0c.368 0 .707.2.891.524.184.324.184.724 0 1.048a1.026 1.026 0 01-.891.524c-.569 0-1.03-.47-1.03-1.048 0-.579.461-1.048 1.03-1.048zm10.031-1.475c.925 0 1.675.764 1.675 1.706s-.75 1.705-1.675 1.705-1.674-.763-1.674-1.705c0-.942.75-1.706 1.674-1.706zm-2.626-.684c.362-.082.653-.356.761-.718a1.062 1.062 0 00-.238-1.028 1.017 1.017 0 00-.996-.294c-.547.14-.881.7-.752 1.257.13.558.675.907 1.225.783zm0 16.876c.359-.087.644-.36.75-.72a1.062 1.062 0 00-.237-1.019 1.018 1.018 0 00-.985-.301 1.037 1.037 0 00-.762.717c-.108.361-.017.754.239 1.028.245.263.606.377.953.305l.043-.01zM17.19 3.5a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64a.631.631 0 00-.628.64c0 .355.28.64.628.64zm-10.38 0a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64a.631.631 0 00-.628.64c0 .355.279.64.628.64zm-5.182 7.852a.631.631 0 00-.628.64c0 .354.28.639.628.639a.63.63 0 00.627-.606l.001-.034a.62.62 0 00-.628-.64zm5.182 9.13a.631.631 0 00-.628.64c0 .355.279.64.628.64a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm10.38.018a.631.631 0 00-.628.64c0 .355.28.64.628.64a.631.631 0 00.628-.64c0-.355-.279-.64-.628-.64zm5.182-9.148a.631.631 0 00-.628.64c0 .354.279.639.628.639a.631.631 0 00.628-.64c0-.355-.28-.64-.628-.64zm-.384-4.992a.24.24 0 00.244-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249c0 .142.122.249.244.249zM11.991.497a.24.24 0 00.245-.248A.24.24 0 0011.99 0a.24.24 0 00-.244.249c0 .133.108.236.223.247l.021.001zM2.011 6.36a.24.24 0 00.245-.249.24.24 0 00-.244-.249.24.24 0 00-.244.249.24.24 0 00.244.249zm0 11.263a.24.24 0 00-.243.248.24.24 0 00.244.249.24.24 0 00.244-.249.252.252 0 00-.244-.248zm19.995-.018a.24.24 0 00-.245.248.24.24 0 00.245.25.24.24 0 00.244-.25.252.252 0 00-.244-.248z" />
      </svg>
    );
  }
  // Official LobeHub (@lobehub/icons-static-svg) Ollama
  if (provider === "ollama") {
    return (
      <svg fill="currentColor" fillRule="evenodd" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d="M7.905 1.09c.216.085.411.225.588.41.295.306.544.744.734 1.263.191.522.315 1.1.362 1.68a5.054 5.054 0 012.049-.636l.051-.004c.87-.07 1.73.087 2.48.474.101.053.2.11.297.17.05-.569.172-1.134.36-1.644.19-.52.439-.957.733-1.264a1.67 1.67 0 01.589-.41c.257-.1.53-.118.796-.042.401.114.745.368 1.016.737.248.337.434.769.561 1.287.23.934.27 2.163.115 3.645l.053.04.026.019c.757.576 1.284 1.397 1.563 2.35.435 1.487.216 3.155-.534 4.088l-.018.021.002.003c.417.762.67 1.567.724 2.4l.002.03c.064 1.065-.2 2.137-.814 3.19l-.007.01.01.024c.472 1.157.62 2.322.438 3.486l-.006.039a.651.651 0 01-.747.536.648.648 0 01-.54-.742c.167-1.033.01-2.069-.48-3.123a.643.643 0 01.04-.617l.004-.006c.604-.924.854-1.83.8-2.72-.046-.779-.325-1.544-.8-2.273a.644.644 0 01.18-.886l.009-.006c.243-.159.467-.565.58-1.12a4.229 4.229 0 00-.095-1.974c-.205-.7-.58-1.284-1.105-1.683-.595-.454-1.383-.673-2.38-.61a.653.653 0 01-.632-.371c-.314-.665-.772-1.141-1.343-1.436a3.288 3.288 0 00-1.772-.332c-1.245.099-2.343.801-2.67 1.686a.652.652 0 01-.61.425c-1.067.002-1.893.252-2.497.703-.522.39-.878.935-1.066 1.588a4.07 4.07 0 00-.068 1.886c.112.558.331 1.02.582 1.269l.008.007c.212.207.257.53.109.785-.36.622-.629 1.549-.673 2.44-.05 1.018.186 1.902.719 2.536l.016.019a.643.643 0 01.095.69c-.576 1.236-.753 2.252-.562 3.052a.652.652 0 01-1.269.298c-.243-1.018-.078-2.184.473-3.498l.014-.035-.008-.012a4.339 4.339 0 01-.598-1.309l-.005-.019a5.764 5.764 0 01-.177-1.785c.044-.91.278-1.842.622-2.59l.012-.026-.002-.002c-.293-.418-.51-.953-.63-1.545l-.005-.024a5.352 5.352 0 01.093-2.49c.262-.915.777-1.701 1.536-2.269.06-.045.123-.09.186-.132-.159-1.493-.119-2.73.112-3.67.127-.518.314-.95.562-1.287.27-.368.614-.622 1.015-.737.266-.076.54-.059.797.042zm4.116 9.09c.936 0 1.8.313 2.446.855.63.527 1.005 1.235 1.005 1.94 0 .888-.406 1.58-1.133 2.022-.62.375-1.451.557-2.403.557-1.009 0-1.871-.259-2.493-.734-.617-.47-.963-1.13-.963-1.845 0-.707.398-1.417 1.056-1.946.668-.537 1.55-.849 2.485-.849zm0 .896a3.07 3.07 0 00-1.916.65c-.461.37-.722.835-.722 1.25 0 .428.21.829.61 1.134.455.347 1.124.548 1.943.548.799 0 1.473-.147 1.932-.426.463-.28.7-.686.7-1.257 0-.423-.246-.89-.683-1.256-.484-.405-1.14-.643-1.864-.643zm.662 1.21l.004.004c.12.151.095.37-.056.49l-.292.23v.446a.375.375 0 01-.376.373.375.375 0 01-.376-.373v-.46l-.271-.218a.347.347 0 01-.052-.49.353.353 0 01.494-.051l.215.172.22-.174a.353.353 0 01.49.051zm-5.04-1.919c.478 0 .867.39.867.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zm8.706 0c.48 0 .868.39.868.871a.87.87 0 01-.868.871.87.87 0 01-.867-.87.87.87 0 01.867-.872zM7.44 2.3l-.003.002a.659.659 0 00-.285.238l-.005.006c-.138.189-.258.467-.348.832-.17.692-.216 1.631-.124 2.782.43-.128.899-.208 1.404-.237l.01-.001.019-.034c.046-.082.095-.161.148-.239.123-.771.022-1.692-.253-2.444-.134-.364-.297-.65-.453-.813a.628.628 0 00-.107-.09L7.44 2.3zm9.174.04l-.002.001a.628.628 0 00-.107.09c-.156.163-.32.45-.453.814-.29.794-.387 1.776-.23 2.572l.058.097.008.014h.03a5.184 5.184 0 011.466.212c.086-1.124.038-2.043-.128-2.722-.09-.365-.21-.643-.349-.832l-.004-.006a.659.659 0 00-.285-.239h-.004z" />
      </svg>
    );
  }
  // CLIProxyAPI local sidecar terminal mark
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect
        x="2"
        y="3"
        width="12"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M5 6.4L7.2 8.2L5 10M8.6 10H11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ModelSelectorPopoverProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  selectedModelId: string;
  effort: EffortLevel;
  onSelectModel: (model: RealModelSpec) => void;
  onSelectEffort: (effort: EffortLevel) => void;
}

export function ModelSelectorPopover({
  open,
  onToggle,
  onClose,
  selectedModelId,
  effort,
  onSelectModel,
  onSelectEffort,
}: ModelSelectorPopoverProps) {
  const activeModel =
    REAL_MODELS.find((m) => m.id === selectedModelId) ?? REAL_MODELS[0];

  const [activeProvider, setActiveProvider] = useState<ProviderId>(activeModel.provider);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [effortMenuOpen, setEffortMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const activeProviderLabel =
    PROVIDERS.find((p) => p.id === activeProvider)?.label ?? "Models";

  const visibleModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return REAL_MODELS.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.providerLabel.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      );
    }
    return REAL_MODELS.filter((m) => m.provider === activeProvider);
  }, [activeProvider, searchQuery]);

  const handleOpenToggle = () => {
    if (!open) {
      setActiveProvider(activeModel.provider);
      setSearchOpen(false);
      setSearchQuery("");
      setEffortMenuOpen(false);
    }
    onToggle();
  };

  return (
    <div className="min-w-0 max-w-full sm:relative">
      {/* Quiet Trigger Button */}
      <button
        type="button"
        data-testid="composer-model-btn"
        onClick={handleOpenToggle}
        className={cn(
          "inline-flex h-8 max-w-full items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 text-[12px] sm:text-[12.5px] font-medium transition-colors cursor-pointer",
          open
            ? "bg-white/[0.08] text-[#f7f8f8]"
            : "text-[#9ca3af] hover:bg-white/[0.05] hover:text-[#f7f8f8]"
        )}
      >
        <ProviderGlyph
          provider={activeModel.provider}
          className="h-3.5 w-3.5 shrink-0 text-[#c4c8d0]"
        />
        <span className="truncate">{activeModel.name}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[#5e626a] transition-transform duration-150",
            open && "rotate-180 text-[#c4c8d0]"
          )}
        />
      </button>

      {/* Two-Pane Provider Rail + Models List Popover */}
      {open && (
        <div
          data-testid="composer-model-menu"
          className="absolute left-2 right-2 top-full mt-2 sm:left-auto sm:right-0 sm:top-10 sm:mt-0 z-40 flex h-[308px] sm:w-[366px] overflow-visible rounded-2xl border border-white/[0.11] bg-[#141518] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_70px_-14px_rgba(0,0,0,0.92)]"
        >
          {/* Left Scrollable Vertical Provider Icon Rail (13 Providers) */}
          <div
            className="flex w-[44px] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-white/[0.07] py-2"
            role="tablist"
            aria-label="AI model providers"
          >
            {PROVIDERS.map((prov) => {
              const selected = !searchQuery.trim() && activeProvider === prov.id;
              return (
                <button
                  key={prov.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  title={prov.label}
                  aria-label={prov.label}
                  data-testid={`provider-rail-${prov.id}`}
                  onClick={() => {
                    setActiveProvider(prov.id);
                    setSearchQuery("");
                    setSearchOpen(false);
                    setEffortMenuOpen(false);
                  }}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer",
                    selected
                      ? "bg-white/[0.11] text-[#f7f8f8] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-[#6b707a] hover:bg-white/[0.05] hover:text-[#d4d6dc]"
                  )}
                >
                  <ProviderGlyph provider={prov.id} className="h-[15px] w-[15px]" />
                </button>
              );
            })}
          </div>

          {/* Right Model List Column */}
          <div className="relative flex min-w-0 flex-1 flex-col p-2">
            {/* Top Bar: Active Provider Label + Quick Search */}
            <div className="flex h-7 shrink-0 items-center justify-between gap-2 px-2 pb-1">
              {searchOpen ? (
                <div className="flex flex-1 items-center gap-1.5 rounded-md border border-white/[0.1] bg-[#0c0d10] px-2 py-0.5">
                  <Search className="h-3 w-3 shrink-0 text-[#6b707a]" />
                  <input
                    ref={searchInputRef}
                    autoFocus
                    type="text"
                    data-testid="model-quick-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 35 models..."
                    className="h-5 w-full bg-transparent text-[11.5px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-[#6b707a] hover:text-[#f7f8f8] cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="truncate text-[11.5px] font-medium text-[#6b707a]">
                    {activeProviderLabel}
                  </span>
                  <button
                    type="button"
                    data-testid="model-quick-search-btn"
                    onClick={() => {
                      setSearchOpen(true);
                      window.setTimeout(() => searchInputRef.current?.focus(), 0);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 text-[11.5px] text-[#6b707a] hover:text-[#d4d6dc] transition-colors cursor-pointer"
                  >
                    <span>Quick Search</span>
                    <Search className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>

            {/* Model Rows */}
            <div className="mt-0.5 flex-1 space-y-0.5 overflow-y-auto pr-0.5">
              {visibleModels.length === 0 ? (
                <div className="py-8 text-center text-[12px] text-[#5e626a]">
                  No models match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                visibleModels.map((model) => {
                  const isSelected = model.id === activeModel.id;
                  return (
                    <div
                      key={model.id}
                      data-testid={`model-${model.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        onSelectModel(model);
                        setEffortMenuOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectModel(model);
                          setEffortMenuOpen(false);
                        }
                      }}
                      className={cn(
                        "group relative flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition-colors cursor-pointer",
                        isSelected
                          ? "bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <ProviderGlyph
                          provider={model.provider}
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isSelected ? "text-[#d4d6dc]" : "text-[#6b707a]"
                          )}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "truncate text-[13px] font-medium",
                                isSelected ? "text-[#f7f8f8]" : "text-[#d4d6dc]"
                              )}
                            >
                              {model.name}
                            </span>
                            {model.badge && !isSelected && (
                              <span className="rounded bg-[#818cf8]/15 px-1 py-0.5 font-mono text-[9.5px] text-[#a5b4fc]">
                                {model.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side: Effort pill (on active model) + Radio dot */}
                      <div className="flex shrink-0 items-center gap-2">
                        {isSelected && model.supportsEffort ? (
                          <button
                            type="button"
                            data-testid="effort-picker-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEffortMenuOpen((v) => !v);
                            }}
                            className="inline-flex items-center gap-0.5 rounded-full border border-white/[0.1] bg-[#0e0f12] px-2.5 py-0.5 text-[11px] font-medium text-[#c4c8d0] hover:border-white/[0.2] hover:text-white transition-colors cursor-pointer"
                          >
                            <span>{effort}</span>
                            <ChevronRight className="h-3 w-3 text-[#6b707a]" />
                          </button>
                        ) : (
                          <span className="font-mono text-[10.5px] tabular-nums text-[#5e626a]">
                            {model.baseCostCr === 0 ? "€0" : `${model.baseCostCr} cr`}
                          </span>
                        )}

                        {/* Tactile Radio Indicator */}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                            isSelected
                              ? "border-[#3b82f6] bg-[#3b82f6]"
                              : "border-white/[0.16] bg-transparent group-hover:border-white/[0.3]"
                          )}
                        >
                          {isSelected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Effort Submenu anchored cleanly inside right pane (never clipped by list scroll) */}
            {effortMenuOpen && activeModel.supportsEffort && (
              <div
                data-testid="effort-submenu"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-2.5 top-[42px] z-50 w-[212px] rounded-xl border border-white/[0.13] bg-[#121317] p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95)]"
              >
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#6b707a]">
                    Reasoning Effort
                  </span>
                  <button
                    type="button"
                    aria-label="Close reasoning effort"
                    onClick={() => setEffortMenuOpen(false)}
                    className="text-[#6b707a] hover:text-[#f7f8f8] cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                {EFFORT_LEVELS.map((lvl) => {
                  const activeLvl = effort === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      data-testid={`effort-${lvl.id.toLowerCase()}`}
                      onClick={() => {
                        onSelectEffort(lvl.id);
                        setEffortMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors cursor-pointer",
                        activeLvl
                          ? "bg-white/[0.08] text-[#f7f8f8]"
                          : "text-[#c4c8d0] hover:bg-white/[0.04]"
                      )}
                    >
                      <div>
                        <div className="text-[12px] font-medium">{lvl.id}</div>
                        <div className="text-[10px] text-[#6b707a]">{lvl.hint}</div>
                      </div>
                      <span
                        className={cn(
                          "h-3 w-3 shrink-0 rounded-full border",
                          activeLvl
                            ? "border-[#3b82f6] bg-[#3b82f6] ring-2 ring-inset ring-white/90"
                            : "border-white/[0.18]"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Subtle Footer Meta / Router Link */}
            <div className="mt-auto flex shrink-0 items-center justify-between border-t border-white/[0.07] px-2 pt-2 text-[11px] text-[#6b707a]">
              <span className="font-mono tabular-nums">
                {activeModel.baseCostCr === 0
                  ? "Local · €0"
                  : `~${Math.max(1, Math.round(activeModel.baseCostCr * (EFFORT_LEVELS.find((e) => e.id === effort)?.multiplier ?? 1)))} cr / turn`}
              </span>
              <Link
                href="/router"
                onClick={onClose}
                className="inline-flex items-center gap-0.5 text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
              >
                <span>Orthese Router</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
