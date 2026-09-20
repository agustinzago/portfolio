"use client";

import { useState } from "react";
import { cv } from "@/lib/cv";

type Props = {
  method?: "GET" | "POST";
  path: string;
  summary: string;
  raw?: unknown;
  children: React.ReactNode;
};


export default function EndpointCard({ method = "GET", path, summary, raw, children }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const curl = `curl ${cv.contact.website}${path}`;

  async function copy() {
    await navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section className="rounded-lg border border-border bg-panel">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3">
        <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${method === "GET" ? "bg-prompt/15 text-prompt" : "bg-accent/15 text-accent"}`}>
          {method}
        </span>
        <a href={method === "GET" ? path : undefined} className="text-sm text-foreground hover:underline">
          {path}
        </a>
        <span className="text-xs text-dim">{summary}</span>
        <span className="ml-auto flex gap-2 text-xs">
          {raw !== undefined && (
            <button onClick={() => setShowRaw((v) => !v)} className="text-dim hover:text-foreground">
              {showRaw ? "readable" : "raw json"}
            </button>
          )}
          {method === "GET" && (
            <button onClick={copy} className="text-dim hover:text-foreground">
              {copied ? "copied" : "copy curl"}
            </button>
          )}
        </span>
      </header>
      <div className="px-4 py-4 text-sm leading-6">
        {showRaw ? (
          <pre className="whitespace-pre-wrap break-words text-xs leading-5 text-accent">{JSON.stringify(raw, null, 2)}</pre>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
