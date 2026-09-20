# agustinzago.com

Portfolio with three doors and one dataset (`src/data/cv.json`):

- **Terminal** (desktop): `help`, `experience brainner`, `ask what did you build?`
- **Page** (`/cv`, phones): the API rendered as endpoint cards
- **API**: `/api/cv`, `/api/experience`, `/api/skills`, `/api/education`, `POST /api/ask`
- **curl trick**: `curl agustinzago.com` returns the plain-text CV

```bash
npm install
cp .env.example .env.local   # add GOOGLE_GENERATIVE_AI_API_KEY for `ask`
npm run dev
npm test
```

Next.js 16 on Vercel. Design decisions live in [CONTEXT.md](CONTEXT.md).
