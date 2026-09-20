/** Streams the answer to `question` from POST /api/ask as text chunks. */
export async function* askStream(question: string): AsyncGenerator<string> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok || !res.body) {
    const { error } = await res.json().catch(() => ({ error: `ask failed (${res.status})` }));
    yield `${error}.`;
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
