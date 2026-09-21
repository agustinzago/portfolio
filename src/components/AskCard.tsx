"use client";

import { useState } from "react";
import { askStream } from "@/lib/ask-client";
import Thinking from "./Thinking";

export default function AskCard() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim() || busy) return;
    setBusy(true);
    setAnswer("");
    try {
      for await (const chunk of askStream(q)) setAnswer((a) => a + chunk);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='{ "question": "what did you build at Brainner?" }'
          aria-label="question"
          className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button disabled={busy} className="rounded border border-border px-3 py-2 text-sm text-prompt hover:bg-prompt/10 disabled:opacity-50">
          {busy ? "…" : "send"}
        </button>
      </form>
      {busy && !answer && <Thinking />}
      {answer && <pre className="whitespace-pre-wrap font-mono text-sm leading-6">{answer}</pre>}
    </div>
  );
}
