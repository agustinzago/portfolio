import Link from "next/link";
import { cv, educationView, experienceView, formatPeriod, languageLine, REPO_URL, RESUME_PDF, SKILL_LABELS, type Skills } from "@/lib/cv";
import EndpointCard from "@/components/EndpointCard";
import AskCard from "@/components/AskCard";

export const metadata = { title: `${cv.name} — CV` };

export default function CvPage() {
  const experience = experienceView();
  const education = educationView();

  return (
    <main className="mx-auto w-full min-w-0 max-w-3xl px-4 py-8 sm:py-12 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{cv.name}</h1>
        <p className="text-dim">{cv.title}</p>
        <p className="text-sm text-dim">{cv.location} · {cv.availability}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <a className="text-accent hover:underline" href={`mailto:${cv.contact.email}`}>email</a>
          <a className="text-accent hover:underline" href={cv.contact.linkedin} target="_blank" rel="noreferrer">linkedin</a>
          <a className="text-accent hover:underline" href={cv.contact.github} target="_blank" rel="noreferrer">github</a>
          <a className="text-accent hover:underline" href={RESUME_PDF} download>pdf</a>
          <Link className="text-prompt hover:underline max-sm:hidden" href="/">open terminal →</Link>
        </p>
      </header>

      <p className="text-xs text-dim">
        This page is the API, rendered. Every card below is a real endpoint. Try{" "}
        <code className="text-foreground">curl agustinzago.com</code> from a shell.
      </p>

      <EndpointCard path="/api/cv" summary="who I am" raw={cv}>
        <p>{cv.summary}</p>
      </EndpointCard>

      <EndpointCard path="/api/experience" summary="roles, newest first" raw={experience}>
        <ol className="space-y-6">
          {experience.map((e) => (
            <li key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h2 className="font-semibold">{e.role}, {e.company}</h2>
                <span className="text-xs text-dim">{e.period} · {e.location}</span>
              </div>
              {e.tagline && <p className="text-dim">{e.tagline}</p>}
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {e.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </EndpointCard>

      <EndpointCard path="/api/skills" summary="what I work with" raw={cv.skills}>
        <dl className="grid gap-y-2 sm:grid-cols-[10rem_1fr]">
          {(Object.keys(cv.skills) as (keyof Skills)[]).map((k) => (
            <div key={k} className="contents">
              <dt className="text-dim">{SKILL_LABELS[k]}</dt>
              <dd>{cv.skills[k].join(", ")}</dd>
            </div>
          ))}
        </dl>
      </EndpointCard>

      <EndpointCard path="/api/education" summary="degree, certificates, languages" raw={education}>
        <ul className="space-y-3">
          {cv.education.map((e) => (
            <li key={e.institution}>
              <div className="font-semibold">{e.degree}, {e.institution}</div>
              <div className="text-xs text-dim">{formatPeriod(e.start, e.end)} · {e.note}</div>
            </li>
          ))}
          <li className="text-dim">{languageLine()}</li>
        </ul>
      </EndpointCard>

      <EndpointCard method="POST" path="/api/ask" summary="ask me anything about my work">
        <AskCard />
      </EndpointCard>

      <footer className="pt-4 text-xs text-dim">
        source: <a className="hover:text-foreground underline" href={REPO_URL} target="_blank" rel="noreferrer">{REPO_URL.replace("https://", "")}</a>
        {" · "}data: <a className="hover:text-foreground underline" href="/api/cv">cv.json</a>
      </footer>
    </main>
  );
}
