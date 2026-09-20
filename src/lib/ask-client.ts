/** Streams the answer to `question` from POST /api/ask as text chunks. */
export async function* askStream(question: string, signal?: AbortSignal): AsyncGenerator<string> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  if (!res.ok || !res.body) {
    const msg = { 429: "quota hit, try again tomorrow.", 503: "ask is offline right now." }[res.status];
    yield msg ?? `ask failed (${res.status}).`;
    return;
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let got = false;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    got = true;
    yield value;
  }
  if (!got) yield "no answer came back. try again in a moment.";
}
