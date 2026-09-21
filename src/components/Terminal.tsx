"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { complete, execute, helpLines } from "@/lib/commands";
import { askStream } from "@/lib/ask-client";
import { BANNER } from "@/lib/banner";
import { cv } from "@/lib/cv";
import Thinking from "./Thinking";

const PROMPT = "agustin@zago:~$";
const BOOT = [
  "booting agustinzago.com ...",
  "loading cv.json ............ ok",
  "mounting /api .............. ok",
  "starting shell",
];
const WELCOME = [`${cv.name} · ${cv.title}`, `${cv.location} · ${cv.availability}`, "", ...helpLines(), "", "Prefer to read? Type `page` for the API docs, or use the link top right.", ""];

type Entry = { input?: string; lines: string[]; banner?: boolean };

const URL_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+)/;

function Line({ text }: { text: string }) {
  // split with a capturing group: odd indexes are the matches
  const parts = text.split(URL_RE);
  return (
    <div className="whitespace-pre-wrap break-words min-h-[1.5em]">
      {parts.map((p, i) =>
        i % 2 === 1 ? (
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
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
      setEntries([{ lines: BOOT }, { lines: BANNER, banner: true }, { lines: WELCOME }]);
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
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
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
    const result = execute(line);
    switch (result.type) {
      case "clear":
        return setEntries([]);
      case "navigate":
        push({ input: line, lines: [] });
        return router.push(result.href);
      case "download": {
        push({ input: line, lines: [`downloading ${result.href}`] });
        const a = Object.assign(document.createElement("a"), { href: result.href, download: "" });
        return a.click();
      }
      case "ask": {
        push({ input: line, lines: [] });
        setBusy(true);
        setThinking(true);
        try {
          for await (const chunk of askStream(result.question)) {
            setThinking(false);
            appendToLast(chunk);
          }
        } finally {
          setBusy(false);
          setThinking(false);
        }
        return;
      }
      case "text":
        return push({ input: line, lines: result.lines });
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
      const candidates = complete(input);
      if (candidates.length === 1) setInput(candidates[0] + " ");
      else if (candidates.length > 1) push({ input, lines: [candidates.join("   ")] });
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
    <div ref={scrollRef} className="h-full overflow-y-auto p-4 sm:p-5 font-mono text-[14px] leading-6 cursor-text" onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus()}>
      <div>
        {entries.map((e, i) => (
          <div key={i} className={e.banner ? "my-3 text-prompt whitespace-pre overflow-hidden leading-[1.05] [text-shadow:0_0_14px_rgba(126,231,135,.35)] *:min-h-0" : undefined}>
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
        {thinking && <Thinking />}
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
