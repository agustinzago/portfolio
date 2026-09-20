# Portfolio — CONTEXT

Personal portfolio for Agustín Zago (backend & platform engineer). Live at **agustinzago.com** (DNS already on Vercel). Decided 2026-09-20 via grilling; this file is the glossary and the decision record.

## Concept

**Terminal + real API.** The terminal is the show; the API is the proof it is backend. One JSON source of truth feeds both.

Three doors, one dataset:

1. **Terminal** (desktop default): fake shell, fixed command list.
2. **Page view** (mobile default, `page` command on desktop): Swagger-style API-docs page. Each section is an endpoint card (`GET /api/experience`) that expands into readable content, with a raw-JSON toggle and a working copy-curl button.
3. **API**: real JSON endpoints, plus the **curl trick**: `curl agustinzago.com` (no browser) returns plain-text CV.

## Vocabulary

- **cv.json** — single source of truth for all résumé content. Site, API, and (later) the PDF derive from it. Never hand-copy content elsewhere.
- **Command** — one entry in the terminal's fixed command list. No virtual filesystem, no pipes, no WASM shell.
- **Easter egg** — a command that exists only for charm (`sudo`, `rm -rf /`, `exit`, `ls`, `cat`, `vim`). One line each.
- **Endpoint card** — a section of the page view, styled as an API route.
- **ask** — the LLM-backed command. First person, in character as Agustín, streams output, deflects off-topic questions back to career in one line.
- **Curl trick** — middleware that serves plain text when the client is `curl`/`Accept: text/plain`.

## Commands (fixed set)

`help` `about` `experience [company]` `skills` `education` `contact` `ask <question>` `resume` (PDF download) `page` (switch to page view) `clear`

Hidden until data exists: `projects` (shown only when `cv.json.projects` is non-empty).
Easter eggs: `sudo` `rm -rf /` `exit` `ls` `cat` `vim` `whoami`. Shell niceties: tab completion, arrow history, Ctrl+L, Ctrl+C.
Later, nearly free: `man` (résumé as man page).

## API

- `GET /api/cv` — whole cv.json
- `GET /api/experience`
- `GET /api/skills`
- `GET /api/education` — added so every page-view card is a real endpoint
- `GET /api/cv.txt` — plain text; what the curl trick rewrites to
- `POST /api/ask` — LLM, streaming

## Decisions (ADR-lite)

| # | Decision | Why | Rejected |
|---|----------|-----|----------|
| 1 | Terminal + API as core | Standout, backend-honest, cheap | Fake OS (3x work, same story), API-only, incident dashboard |
| 2 | `help` printed on boot + obvious "view as page" link | Recruiters must not bounce | Engineers-only, page-first with terminal easter egg |
| 3 | Real LLM for `ask`, Gemini Flash free tier via Vercel AI SDK | Cheap, differentiating; answers are easy | Canned keyword answers (feel broken), skip |
| 4 | `cv.json` single source of truth | No drift between terminal, page, API, PDF | PDF as master |
| 5 | Next.js App Router on Vercel | Domain already on Vercel; route handlers = API; user knows React | Cloudflare, AWS+SST (portfolio should ship, CV already proves AWS), static+api/ |
| 6 | English only | Target remote/EU; toggle later if wanted | ES/EN toggle |
| 7 | Fake shell, fixed commands | Ship. Virtual FS is a rabbit hole | Semi-real FS, WASM shell |
| 8 | Domain `agustinzago.com` | Already on Vercel DNS, nothing served | `.com.ar` (dead) |
| 9 | Modern dark terminal look (Warp/Ghostty), short skippable boot (<1s), prompt `agustin@zago:~$` | Readable; CRT is cliché | Retro CRT, light theme |
| 10 | Mobile → page view; desktop → terminal | Terminal on phone is painful | Terminal everywhere with command chips |
| 11 | Page view = API-docs style | Reuses API, phone-safe, recruiter-readable | man page (bonus command later), git-log graph, incident dashboard |
| 12 | `ask` rate limit: in-memory per instance; provider quota is the hard ceiling | Lazy; upgrade to Upstash if abused | Upstash Redis, Vercel Firewall |
| 13 | No `projects` section until 2+ exist; schema keeps `projects: []` | Empty section worse than none | — |
| 14 | Contact: email, LinkedIn, GitHub, location + "open to remote/relocation, EU work auth". No phone | Phone = spam; EU line = hiring signal | — |
| 15 | Public GitHub repo, linked from `about` and page footer | Code is part of the portfolio | Private |
| 16 | Existing PDF copied to `public/` for `resume`; regenerate from cv.json later | Ship now | Generate PDF now |
| 17 | Mobile is a hard redirect to `/cv` (phone can never reach terminal); iPad counts as desktop | Simplest; terminal on phone has no good mode | UA-based default with opt-in |
| 18 | Endpoint cards always open; "expand" means raw-JSON toggle | Less clicking on a phone | Collapsible cards |

## Open / later

- `man` command.
- PDF generated from `cv.json`.
- Upstash rate limit if `ask` gets abused.
- ES toggle.
- `/wizard` for: Google AI Studio key → Vercel env, GitHub repo creation, Vercel project link.
