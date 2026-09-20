import { beforeEach, describe, expect, it, vi } from "vitest";

const streamText = vi.fn((opts: { system: string; prompt: string }) => void opts || ({
  toTextStreamResponse: () => new Response("I built ATS integrations.", { headers: { "content-type": "text/plain" } }),
}));
vi.mock("ai", () => ({ streamText }));
vi.mock("@ai-sdk/google", () => ({ google: (id: string) => ({ id }) }));

process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
const { POST } = await import("./route");

const post = (body: unknown, ip = "1.1.1.1") =>
  POST(new Request("https://agustinzago.com/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));

describe("POST /api/ask", () => {
  beforeEach(() => streamText.mockClear());

  it("400 on missing, empty or oversized question", async () => {
    expect((await post({})).status).toBe(400);
    expect((await post({ question: "  " })).status).toBe(400);
    expect((await post({ question: "x".repeat(501) })).status).toBe(400);
    expect((await post("not json")).status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });

  it("streams an answer in first person with the CV as context", async () => {
    const res = await post({ question: "what did you build at Brainner?" }, "2.2.2.2");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("ATS integrations");
    const args = streamText.mock.calls[0][0];
    expect(args.system).toContain("You are Agustín Zago");
    expect(args.system).toContain("Lead Platform Engineer, Brainner");
    expect(args.prompt).toBe("what did you build at Brainner?");
  });

  it("503 when no API key is configured", async () => {
    const saved = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    expect((await post({ question: "hi" }, "9.9.9.9")).status).toBe(503);
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = saved;
  });

  it("429 once an IP exhausts its daily quota", async () => {
    let last: Response | undefined;
    for (let i = 0; i < 25; i++) last = await post({ question: "hi" }, "3.3.3.3");
    expect(last!.status).toBe(429);
  });
});
