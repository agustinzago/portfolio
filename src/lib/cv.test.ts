import { describe, expect, it } from "vitest";
import { cv, formatPeriod, toPlainText } from "./cv";

describe("cv", () => {
  it("loads the source of truth", () => {
    expect(cv.name).toBe("Agustín Zago");
    expect(cv.experience[0].company).toBe("Brainner");
  });

  it("formats periods with Present for open-ended roles", () => {
    expect(formatPeriod("2026-03", null)).toBe("Mar 2026 – Present");
    expect(formatPeriod("2025-01", "2026-03")).toBe("Jan 2025 – Mar 2026");
  });

  it("renders a plain-text CV for curl", () => {
    const txt = toPlainText();
    expect(txt).toContain("AGUSTÍN ZAGO");
    expect(txt).toContain("Lead Platform Engineer, Brainner");
    expect(txt).toContain("Mar 2026 – Present");
    expect(txt).toContain("- Built four production ATS integrations");
    expect(txt).toContain("Backend: Node.js, NestJS");
    expect(txt).not.toContain("+54");
  });
});
