"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { complete, execute } from "@/lib/commands";
import { askStream } from "@/lib/ask-client";

const PROMPT = "agustin@zago:~$";
const BOOT = [
  "booting agustinzago.com ...",
  "loading cv.json ............ ok",
  "mounting /api .............. ok",
  "starting shell",
];
const WELCOME = ["", `Hi, I'm Agustín. Backend & platform engineer. Type \`help\`, or \`page\` for the boring version.`, ""];

type Entry = { input?: string; lines: string[] };

const URL_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;

function Line({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <div className="whitespace-pre-wrap break-words min-h-[1.5em]">
      {parts.map((p, i) =>
        URL_RE.test(p) ? (
          <a key={i} href={p.includes("@") ? `mailto:${p}` : p} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2">
            {p}
          </a>
        ) : (
          p
        ),
      )}
    </div>
  );
}

export default function Terminal() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [booted, setBooted] = useState(false);
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // boot sequence, skippable with any key
  useEffect(() => {
    let i = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(t);
      setEntries([{ lines: [...BOOT, ...WELCOME] }]);
      setBooted(true);
    };
    const t = setInterval(() => {
      i++;
      if (i >= BOOT.length) return finish();
      setEntries([{ lines: BOOT.slice(0, i) }]);
    }, 120);
    window.addEventListener("keydown", finish, { once: true });
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", finish);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [entries, input]);

  const push = (e: Entry) => setEntries((prev) => [...prev, e]);
  const appendToLast = (chunk: string) =>
    setEntries((prev) => {
      const last = prev[prev.length - 1];
      const lines = last.lines.length ? [...last.lines] : [""];
      const merged = (lines.pop() + chunk).split("\n");
      return [...prev.slice(0, -1), { ...last, lines: [...lines, ...merged] }];
    });

  async function run(line: string) {
    history.current.push(line);
    histIdx.current = history.current.length;
    const r = execute(line);
    switch (r.type) {
      case "clear":
        return setEntries([]);
      case "navigate":
        push({ input: line, lines: [] });
        return router.push(r.href);
      case "open":
        push({ input: line, lines: [`opening ${r.href}`] });
        return window.open(r.href, "_blank");
      case "ask": {
        push({ input: line, lines: [] });
        setBusy(true);
        try {
          for await (const chunk of askStream(r.question)) appendToLast(chunk);
        } finally {
          setBusy(false);
        }
        return;
      }
      case "text":
        return push({ input: line, lines: r.lines });
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !busy) {
      const line = input;
      setInput("");
      if (line.trim()) void run(line);
      else push({ input: "", lines: [] });
    } else if (e.key === "Tab") {
      e.preventDefault();
      const c = complete(input);
      if (c.length === 1) setInput(c[0] + " ");
      else if (c.length > 1) push({ input, lines: [c.join("   ")] });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx.current > 0) setInput(history.current[--histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current < history.current.length - 1) setInput(history.current[++histIdx.current]);
      else {
        histIdx.current = history.current.length;
        setInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    } else if (e.key === "c" && e.ctrlKey) {
      setInput("");
      push({ input: input + "^C", lines: [] });
    }
  }

  return (
    <div className="min-h-dvh p-4 sm:p-6 font-mono text-[15px] leading-6 cursor-text" onClick={() => inputRef.current?.focus()}>
      <div className="mx-auto max-w-3xl">
        {entries.map((e, i) => (
          <div key={i}>
            {e.input !== undefined && (
              <div>
                <span className="text-prompt">{PROMPT}</span> {e.input}
              </div>
            )}
            {e.lines.map((l, j) => (
              <Line key={j} text={l} />
            ))}
          </div>
        ))}
        {booted && (
          <div className="flex">
            <span className="text-prompt shrink-0">{PROMPT}&nbsp;</span>
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={busy}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="terminal input"
              className="flex-1 bg-transparent outline-none caret-prompt"
            />
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
