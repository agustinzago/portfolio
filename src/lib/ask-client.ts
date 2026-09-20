/** Streams the answer to `question` from POST /api/ask as text chunks. */
export async function* askStream(question: string, signal?: AbortSignal): AsyncGenerator<string> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question }),
    signal,
  });
  if (!res.ok || !res.body) {
    yield res.status === 429 ? "quota hit, try again tomorrow." : `ask failed (${res.status}).`;
    return;
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    yield value;
  }
}
