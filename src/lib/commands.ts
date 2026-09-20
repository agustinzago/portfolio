import { cv, formatPeriod, projects, REPO_URL, RESUME_PDF, skillLines } from "./cv";

export type CommandResult =
  | { type: "text"; lines: string[] }
  | { type: "clear" }
  | { type: "navigate"; href: string }
  | { type: "download"; href: string }
  | { type: "ask"; question: string };

const text = (...lines: string[]): CommandResult => ({ type: "text", lines });

type Command = { desc: string; run: (arg: string) => CommandResult; hidden?: boolean };

const commands: Record<string, Command> = {
  help: { desc: "list commands", run: () => text(...helpLines()) },
  about: {
    desc: "who I am",
    run: () => text(cv.name, cv.title, `${cv.location} · ${cv.availability}`, "", cv.summary, "", `source: ${REPO_URL}`),
  },
  experience: {
    desc: "roles, or `experience <company>` for one",
    run: (arg) => {
      if (!arg) return text(...cv.experience.map((e) => `${formatPeriod(e.start, e.end).padEnd(22)} ${e.role}, ${e.company}`), "", "experience <company> for details");
      const q = arg.toLowerCase();
      const hits = cv.experience.filter((e) => e.company.toLowerCase().includes(q) || e.id.includes(q));
      if (!hits.length) return text(`no role matching "${arg}". Try: ${companies().join(", ")}`);
      return text(...hits.flatMap((e) => [
        `${e.role}, ${e.company}`,
        `${formatPeriod(e.start, e.end)} · ${e.location}`,
        ...(e.tagline ? [e.tagline] : []),
        "",
        ...e.highlights.map((h) => `  - ${h}`),
        "",
      ]));
    },
  },
  skills: { desc: "what I work with", run: () => text(...skillLines()) },
  education: {
    desc: "degree and certificates",
    run: () => text(...cv.education.flatMap((e) => [`${e.degree}, ${e.institution}`, `${formatPeriod(e.start, e.end)} · ${e.note}`, ""])),
  },
  contact: {
    desc: "how to reach me",
    run: () => text(`email     ${cv.contact.email}`, `linkedin  ${cv.contact.linkedin}`, `github    ${cv.contact.github}`, `location  ${cv.location}`, `          ${cv.availability}`),
  },
  projects: {
    desc: "side projects",
    hidden: projects.length === 0,
    run: () => text(...projects.map((p) => `${p.name}: ${p.description}`)),
  },
  ask: {
    desc: "ask me anything about my work (AI, answers as me)",
    run: (arg) => (arg ? { type: "ask", question: arg } : text("usage: ask <question>")),
  },
  resume: { desc: "download the PDF", run: () => ({ type: "download", href: RESUME_PDF }) },
  page: { desc: "view as a page instead", run: () => ({ type: "navigate", href: "/cv" }) },
  clear: { desc: "clear the screen", run: () => ({ type: "clear" }) },

  // easter eggs
  sudo: { desc: "", hidden: true, run: () => text("agustin is not in the sudoers file. This incident will be reported.") },
  rm: { desc: "", hidden: true, run: () => text("nice try. the data lives in cv.json and git remembers everything.") },
  vim: { desc: "", hidden: true, run: () => text("you're in vim now. nobody knows how to exit. try `help` instead.") },
  exit: { desc: "", hidden: true, run: () => text("there is no exit, only `page`.") },
  ls: { desc: "", hidden: true, run: () => text(...publicNames()) },
  cat: {
    desc: "",
    hidden: true,
    run: (arg) => {
      const r = arg && commands[arg] && !commands[arg].hidden ? commands[arg].run("") : null;
      return r?.type === "text" ? r : text("cat: try `cat skills` or `cat about`");
    },
  },
  whoami: { desc: "", hidden: true, run: () => text("agustin") },
};

const companies = () => [...new Set(cv.experience.map((e) => e.company.toLowerCase()))];
const publicNames = () => Object.entries(commands).filter(([, c]) => !c.hidden).map(([n]) => n);
export const helpLines = () => publicNames().map((n) => `${n.padEnd(12)} ${commands[n].desc}`);

export function execute(line: string): CommandResult {
  const [name = "", ...rest] = line.trim().split(/\s+/);
  if (!name) return text();
  const cmd = commands[name.toLowerCase()];
  if (!cmd) return text(`command not found: ${name}. Try \`help\`.`);
  return cmd.run(rest.join(" "));
}

/** Tab completion candidates for the whole input line. */
export function complete(line: string): string[] {
  const [name = "", ...rest] = line.trimStart().split(/\s+/);
  if (rest.length === 0 && !line.endsWith(" "))
    return publicNames().filter((n) => n.startsWith(name.toLowerCase())).sort();
  if (name === "experience" || name === "cat") {
    const pool = name === "experience" ? companies() : publicNames();
    const q = rest.join(" ").toLowerCase();
    return pool.filter((c) => c.startsWith(q)).sort().map((c) => `${name} ${c}`);
  }
  return [];
}
