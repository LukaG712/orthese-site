"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { HighlighterCore } from "shiki/core";
import { toast } from "sonner";
import { cn } from "@/lib/cn";

const highlightCache = new Map<string, string>();
let highlighterPromise: Promise<HighlighterCore> | null = null;

async function getOrtheseHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [
        { createHighlighterCore },
        { createJavaScriptRegexEngine },
        githubDarkDefault,
        langJson,
        langRust,
        langMarkdown,
        langDiff,
        langTs,
        langTsx,
        langJs,
        langBash,
        langSql,
        langCss,
        langHtml,
      ] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
        import("shiki/themes/github-dark-default.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/rust.mjs"),
        import("shiki/langs/markdown.mjs"),
        import("shiki/langs/diff.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/javascript.mjs"),
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/sql.mjs"),
        import("shiki/langs/css.mjs"),
        import("shiki/langs/html.mjs"),
      ]);

      return createHighlighterCore({
        themes: [githubDarkDefault.default],
        langs: [
          langJson.default,
          langRust.default,
          langMarkdown.default,
          langDiff.default,
          langTs.default,
          langTsx.default,
          langJs.default,
          langBash.default,
          langSql.default,
          langCss.default,
          langHtml.default,
        ],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }
  return highlighterPromise;
}

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  rs: "rust",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  jsx: "tsx",
};

const LANGUAGE_LABELS: Record<string, string> = {
  json: "JSON",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  rs: "Rust",
  rust: "Rust",
  md: "Markdown",
  markdown: "Markdown",
  diff: "Diff",
  bash: "Bash",
  sh: "Shell",
  toml: "TOML",
  yaml: "YAML",
  yml: "YAML",
  css: "CSS",
  html: "HTML",
  sql: "SQL",
  python: "Python",
  py: "Python",
  text: "Text",
};

function formatLanguageLabel(language: string): string {
  const key = language.toLowerCase().trim();
  return LANGUAGE_LABELS[key] ?? language.toUpperCase();
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Composable header/toolbar slot modeled on prompt-kit's CodeBlockGroup (MIT).
 */
export function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] py-2 pr-2 pl-3.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CodeBlockCopyButtonProps {
  code: string;
  filename?: string;
  className?: string;
}

export function CodeBlockCopyButton({
  code,
  filename,
  className,
}: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(filename ? `Copied ${filename}` : "Copied snippet to clipboard");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Clipboard unavailable in this browser context");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied code" : "Copy code"}
      title={copied ? "Copied" : "Copy code"}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md text-[#a3a3a3] transition-colors hover:bg-white/[0.07] hover:text-[#fafafa] cursor-pointer",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: string;
  maxHeight?: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Shiki-powered syntax-highlighted code pane modeled on prompt-kit's CodeBlockCode (MIT).
 */
export function CodeBlockCode({
  code,
  language = "tsx",
  theme = "github-dark-default",
  maxHeight,
  className,
  ...props
}: CodeBlockCodeProps) {
  const normalizedCode = code.trimEnd();
  const resolvedLang =
    LANGUAGE_ALIASES[language.toLowerCase().trim()] ?? language.toLowerCase().trim();
  const cacheKey = `${resolvedLang}:${theme}:${normalizedCode}`;
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(
    () => highlightCache.get(cacheKey) ?? null
  );

  useEffect(() => {
    let cancelled = false;

    const cached = highlightCache.get(cacheKey);
    if (cached) {
      setHighlightedHtml(cached);
      return;
    }

    async function highlight() {
      if (!normalizedCode) {
        if (!cancelled) setHighlightedHtml("<pre><code></code></pre>");
        return;
      }

      try {
        const highlighter = await getOrtheseHighlighter();
        const loadedLangs = highlighter.getLoadedLanguages();
        const safeLang = loadedLangs.includes(resolvedLang) ? resolvedLang : "text";
        const html = highlighter.codeToHtml(normalizedCode, {
          lang: safeLang,
          theme: "github-dark-default",
        });
        highlightCache.set(cacheKey, html);
        if (!cancelled) {
          setHighlightedHtml(html);
        }
      } catch {
        if (!cancelled) {
          setHighlightedHtml(null);
        }
      }
    }

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [cacheKey, normalizedCode, resolvedLang]);

  const containerClasses = cn(
    "w-full overflow-auto font-mono text-[12.5px] leading-[1.65]",
    "[&>pre]:!bg-transparent [&>pre]:px-4 [&>pre]:py-3.5 [&>pre]:m-0 [&>pre]:font-mono",
    "[&_code]:font-mono",
    maxHeight,
    className
  );

  return highlightedHtml ? (
    <div
      data-shiki-highlighted="true"
      className={containerClasses}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={containerClasses} {...props}>
      <pre className="text-[#d4d4d4]">
        <code>{normalizedCode}</code>
      </pre>
    </div>
  );
}

export type CodeBlockProps = {
  /** Composable prompt-kit usage: pass CodeBlockGroup + CodeBlockCode as children */
  children?: React.ReactNode;
  /** Convenience shorthand: pass code directly to render header + Shiki body */
  code?: string;
  filename?: string;
  language?: string;
  theme?: string;
  maxHeight?: string;
  showHeader?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Orthese CodeBlock modeled on prompt-kit (https://www.prompt-kit.com/docs/code-block, MIT).
 * Supports both prompt-kit's composable API (`<CodeBlock><CodeBlockGroup /><CodeBlockCode /></CodeBlock>`)
 * and direct shorthand (`<CodeBlock code={...} language="json" filename="piece.json" />`).
 */
export function CodeBlock({
  children,
  code,
  filename,
  language = "json",
  theme = "github-dark-default",
  maxHeight = "max-h-[380px]",
  showHeader = true,
  className,
  ...props
}: CodeBlockProps) {
  const hasChildren = children !== undefined && children !== null;

  return (
    <div
      data-slot="code-block"
      className={cn(
        "not-prose flex w-full flex-col overflow-clip rounded-xl border border-white/[0.09] bg-[#171717] text-[#fafafa]",
        className
      )}
      {...props}
    >
      {hasChildren ? (
        children
      ) : (
        <>
          {showHeader && (
            <CodeBlockGroup>
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 rounded-md bg-white/[0.07] px-2 py-0.5 text-[11px] font-medium text-[#e5e5e5]">
                  {formatLanguageLabel(language)}
                </span>
                {filename && (
                  <span className="truncate font-mono text-[12px] text-[#a3a3a3]">
                    {filename}
                  </span>
                )}
              </div>
              <CodeBlockCopyButton code={code ?? ""} filename={filename} />
            </CodeBlockGroup>
          )}
          <CodeBlockCode
            code={code ?? ""}
            language={language}
            theme={theme}
            maxHeight={maxHeight}
          />
        </>
      )}
    </div>
  );
}
