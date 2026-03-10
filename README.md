# RS Stack Hello World

A minimal full-stack starter using:
- React Router + Rsbuild (frontend)
- Hono (API server)
- Rstest + Playwright (tests)

Runtime requirement:
- Node.js `24.13.0+`

The package manifest intentionally keeps only 5 top-level scripts:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`
- `npm run check`

## Getting Started

1. Install dependencies:
   - `npm install`
2. Run development mode:
   - `npm run dev`
   - Open the app at `http://localhost:5173`.
   - The API server runs on `http://localhost:3001`.
3. Build and run production:
   - `npm run build`
   - `npm run start`

## Hello API

`GET /api/v1/hello`

Example response:

```json
{
  "message": "Hello World from RS Stack"
}
```

## Direct Commands

- Frontend dev only: `npx rsbuild dev`
- API dev only: `PORT=3001 npx tsx --watch server/main.ts`
- Browser tests: `npx rstest --project browser`
- End-to-end smoke test: `npx playwright test`
- Production smoke test: `node tests/e2e/prod-smoke.mjs`
- Full validation: `npx rstest --project api && npx rstest --project browser && npx playwright test && node tests/e2e/prod-smoke.mjs && npm run check`
- Auto-fix lint: `npx biome check --fix`
- Format files: `npx biome format --write`
- Typecheck only: `npx tsc --noEmit`
- Browser test browser install: `npx playwright install chromium`
