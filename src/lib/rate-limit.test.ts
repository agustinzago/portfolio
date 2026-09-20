import { describe, expect, it } from "vitest";
import { createRateLimit } from "./rate-limit";

describe("rate limit", () => {
  it("allows up to limit per key per day, then blocks", () => {
    const allow = createRateLimit(2);
    const day = () => new Date("2026-09-20T10:00:00Z");
    expect(allow("a", day())).toBe(true);
    expect(allow("a", day())).toBe(true);
    expect(allow("a", day())).toBe(false);
    expect(allow("b", day())).toBe(true);
  });

  it("resets on a new day", () => {
    const allow = createRateLimit(1);
    expect(allow("a", new Date("2026-09-20T23:59:00Z"))).toBe(true);
    expect(allow("a", new Date("2026-09-20T23:59:30Z"))).toBe(false);
    expect(allow("a", new Date("2026-09-21T00:00:01Z"))).toBe(true);
  });
});
