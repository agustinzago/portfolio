import data from "@/data/cv.json";

export type Experience = (typeof data.experience)[number];
export type Skills = typeof data.skills;
export type CV = typeof data;

export const cv: CV = data;

export type Project = { name: string; description: string; url?: string };
export const projects = cv.projects as Project[];

export const RESUME_PDF = "/AgustinZago_CV.pdf";
export const REPO_URL = `${cv.contact.github}/portfolio`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-03" -> "Mar 2026" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

export const SKILL_LABELS: Record<keyof Skills, string> = {
  languages: "Languages",
  backend: "Backend",
  frontend: "Frontend",
  cloud: "Cloud & Data",
  ai: "AI",
  practices: "Ways of working",
};

export function skillLines(): string[] {
  return (Object.keys(cv.skills) as (keyof Skills)[]).map(
    (k) => `${SKILL_LABELS[k]}: ${cv.skills[k].join(", ")}`,
  );
}

/** What /api/experience returns: roles with a human period. */
export function experienceView() {
  return cv.experience.map((e) => ({ ...e, period: formatPeriod(e.start, e.end) }));
}

/** What /api/education returns. */
export function educationView() {
  return { education: cv.education, languages: cv.languages };
}

export function languageLine(): string {
  return cv.languages.map((l) => `${l.name} (${l.level})`).join(", ");
}

/** Plain-text CV, what `curl agustinzago.com` returns. */
export function toPlainText(): string {
  const out: string[] = [];
  const h = (s: string) => out.push("", s.toUpperCase(), "=".repeat(s.length));

  out.push(cv.name.toUpperCase(), cv.title, `${cv.location} · ${cv.availability}`);
  out.push(cv.contact.email, cv.contact.linkedin, cv.contact.github);

  h("Summary");
  out.push(cv.summary);

  h("Experience");
  for (const e of cv.experience) {
    out.push("", `${e.role}, ${e.company}`, `${formatPeriod(e.start, e.end)} · ${e.location}`);
    if (e.tagline) out.push(e.tagline);
    for (const b of e.highlights) out.push(`- ${b}`);
  }

  h("Skills");
  out.push(...skillLines());

  h("Education");
  for (const ed of cv.education) {
    out.push("", `${ed.degree}, ${ed.institution}`, formatPeriod(ed.start, ed.end), ed.note);
  }

  h("Languages");
  out.push(languageLine());

  return out.join("\n") + "\n";
}
