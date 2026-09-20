import { describe, expect, it } from "vitest";
import { complete, execute } from "./commands";

const text = (line: string) => {
  const r = execute(line);
  if (r.type !== "text") throw new Error(`expected text, got ${r.type}`);
  return r.lines.join("\n");
};

describe("execute", () => {
  it("help lists every public command, not easter eggs", () => {
    const out = text("help");
    for (const c of ["about", "experience", "skills", "education", "contact", "ask", "resume", "page", "clear"])
      expect(out).toContain(c);
    expect(out).not.toContain("sudo");
    expect(out).not.toContain("projects"); // hidden while cv.projects is empty
  });

  it("about prints name, title and summary", () => {
    const out = text("about");
    expect(out).toContain("Agustín Zago");
    expect(out).toContain("Backend & Platform");
    expect(out).toContain("flaky upstream APIs");
  });

  it("experience lists roles, experience <company> expands one", () => {
    const list = text("experience");
    expect(list).toContain("Brainner");
    expect(list).toContain("Winclap");
    expect(list).not.toContain("BambooHR");
    const one = text("experience brainner");
    expect(one).toContain("BambooHR");
    expect(one).not.toContain("Winclap");
  });

  it("experience matches case-insensitively and reports misses", () => {
    expect(text("experience WINCLAP")).toContain("Serverless media");
    expect(text("experience google")).toContain("no role matching");
  });

  it("skills, education, contact", () => {
    expect(text("skills")).toContain("Backend: Node.js");
    expect(text("education")).toContain("UTN FRC");
    const c = text("contact");
    expect(c).toContain("zagoagus@gmail.com");
    expect(c).toContain("Córdoba");
    expect(c).toContain("EU work authorisation");
    expect(text("about")).toContain("github.com/agustinzago/portfolio");
    expect(c).not.toContain("+54");
  });

  it("ask needs a question", () => {
    expect(execute("ask what did you build at Brainner?")).toEqual({
      type: "ask",
      question: "what did you build at Brainner?",
    });
    expect(text("ask")).toContain("usage: ask <question>");
  });

  it("resume, page, clear are actions", () => {
    expect(execute("resume")).toEqual({ type: "download", href: "/AgustinZago_CV.pdf" });
    expect(execute("page")).toEqual({ type: "navigate", href: "/cv" });
    expect(execute("clear")).toEqual({ type: "clear" });
  });

  it("easter eggs answer, unknown commands hint at help", () => {
    expect(text("sudo rm -rf /")).toMatch(/not in the sudoers/);
    expect(text("rm -rf /")).toMatch(/nice try/i);
    expect(text("vim")).toMatch(/exit/i);
    expect(text("ls")).toContain("experience");
    expect(execute("cat clear").type).toBe("text");
    expect(text("cat skills")).toContain("Backend:");
    expect(text("foo")).toBe("command not found: foo. Try `help`.");
  });

  it("ignores blank input and surrounding whitespace", () => {
    expect(execute("   ")).toEqual({ type: "text", lines: [] });
    expect(text("  skills  ")).toContain("Backend:");
  });
});

describe("complete", () => {
  it("completes command names", () => {
    expect(complete("exp")).toEqual(["experience"]);
    expect(complete("e")).toEqual(["education", "experience"]);
  });
  it("completes company for experience", () => {
    expect(complete("experience w")).toEqual(["experience winclap"]);
  });
});
