# Company Intelligence Agent

A production-quality MVP that generates professional business intelligence reports from a company website URL.All analysis is produced by a deterministic, rule-based engine.

## Live Demo

https://company-intelligence-f6t2.vercel.app

## GitHub Repository

https://github.com/varunsudharshan1-cloud/company-intelligence


## API Endpoints

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /api/health  |
| GET    | /api/status  |
| GET    | /api/version |
| POST   | /api/analyze |

### Full URLs

https://company-intelligence-f6t2.vercel.app/api/health

https://company-intelligence-f6t2.vercel.app/api/status

https://company-intelligence-f6t2.vercel.app/api/version

https://company-intelligence-f6t2.vercel.app/api/analyze



## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Node.js
- Vercel



## Features

- URL validation & domain extraction
- Deterministic company name + industry classification
- Executive summary, overview, products/services, business model
- Stakeholder mapping
- Competitor lookup (curated dataset with generic fallback)
- Industry-mapped SWOT analysis
- Risk assessment
- Rule-based Investment Score (0–100) across 5 weighted categories
- PDF report export

## Project Structure

```
company-intel-agent/
├── app/
│   ├── api/analyze/route.ts     # POST endpoint: URL -> CompanyReport
│   ├── report/page.tsx          # Report results page (reads sessionStorage)
│   ├── layout.tsx
│   ├── page.tsx                 # Homepage
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── UrlForm.tsx
│   ├── FeatureCards.tsx
│   ├── SectionCard.tsx
│   ├── OverviewCard.tsx
│   ├── SWOTCard.tsx
│   ├── CompetitorCard.tsx
│   ├── ScoreCard.tsx
│   └── RecommendationCard.tsx
├── lib/
│   ├── urlUtils.ts               # validation + domain extraction
│   ├── industryClassifier.ts
│   ├── swotEngine.ts
│   ├── competitorEngine.ts
│   ├── investmentEngine.ts
│   ├── seededRandom.ts           # deterministic pseudo-random helper
│   ├── reportEngine.ts           # orchestrates the full report
│   └── pdfGenerator.ts
├── data/
│   ├── competitors.json
│   ├── industries.json
│   └── swotTemplates.json
├── types/
│   └── index.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## How the Analysis Engine Works

1. **URL validation** — `lib/urlUtils.ts` normalizes and validates the input.
2. **Domain extraction** — derives a brand key (e.g. `microsoft.com` → `microsoft`).
3. **Company naming** — capitalizes the domain key into a display name (`Microsoft`).
4. **Industry classification** — looks up `data/industries.json`, with keyword-based fallback heuristics.
5. **Content generation** — combines industry templates (`data/swotTemplates.json`) with the company name to produce SWOT, business model, risk factors, etc.
6. **Competitor lookup** — `data/competitors.json` maps known brands to real competitor names, with a generic fallback for unknown domains.
7. **Investment scoring** — a weighted, rule-based score derived from an industry baseline plus deterministic variance seeded from the domain name (same domain always produces the same score).

No network calls, no AI APIs, no database — entirely deterministic and reproducible.

## Installation

```bash
git clone <your-repo-url>
cd company-intel-agent
npm install
```

## Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Build for Production

```bash
npm run build
npm run start
```

## Try It

On the homepage, enter any of these (or any company domain):

- `microsoft.com`
- `tesla.com`
- `netflix.com`
- `stripe.com`
- `apple.com`

## Git Workflow

```bash
git init
git add .
git commit -m "Initial commit: Company Intelligence Agent MVP"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Collaboration Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git add .
git commit -m "feat: describe your change"

# Push and open a Pull Request
git push -u origin feature/your-feature-name
```

Recommended branch protections: require PR review before merging to `main`, enable CI (lint + build) as a required check.

## Deployment on Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `next build` (default). Output directory: default.
5. No environment variables are required for this MVP.
6. Click **Deploy**.

Alternatively, via CLI:

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Notes & Limitations

- This is a deterministic MVP intended for demos, internships, and portfolio use. Report content is generated from rule-based templates and curated reference data, not live company financials or real-time web scraping.
- No authentication or database is included by design, per MVP scope.
- All content is clearly illustrative and should not be used as real investment advice.

## License

MIT — free to use for personal, educational, and portfolio purposes.
