# RS Stack Hello World

A minimal full-stack starter using:
- React Router + Rsbuild (frontend)
- Hono (API server)
- Rstest + Playwright (tests)

Runtime requirement:
- Node.js `24.13.0+`

## Getting Started

1. Install dependencies:
   - `npm install`
2. Run development mode:
   - `npm run dev`
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3001`
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

## Commands

- `npm run test` - API tests
- `npm run test:browser` - browser tests
- `npm run test:all` - full test suite
- `npm run check` - lint + type check

## LLM TypeScript Style Skill

Use the repo-local skill `.codex/skills/ts-functional-blueprint/SKILL.md` when generating domain TypeScript with AI.

Expected outputs:
- discriminated unions with exhaustive `satisfies never` handling
- branded IDs for domain identifiers
- immutable `readonly` records and `ReadonlyArray` collections
- pure module-level functions instead of classes
