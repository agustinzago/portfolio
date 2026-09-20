/**
 * Per-key daily counter. Returns an `allow(key, now)` function.
 *
 * ponytail: in-memory, so it resets whenever the serverless instance does and
 * is not shared across instances. The LLM provider's free-tier quota is the
 * real ceiling. Move to Upstash Redis if abuse ever shows up.
 */
export function createRateLimit(limit: number) {
  const counts = new Map<string, { day: string; n: number }>();
  return (key: string, now = new Date()): boolean => {
    const day = now.toISOString().slice(0, 10);
    const cur = counts.get(key);
    const n = cur?.day === day ? cur.n + 1 : 1;
    counts.set(key, { day, n });
    return n <= limit;
  };
}
