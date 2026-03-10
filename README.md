# RS Stack Hello World

A minimal full-stack starter using:
- React Router + Rsbuild (frontend)
- Hono (API server)
- Aspire stable C# AppHost (local orchestration + dashboard)
- Rstest + Playwright (tests)

Runtime requirement:
- Node.js `24.13.0+`
- .NET SDK `10.0+`

The package manifest intentionally keeps only 5 top-level scripts:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`
- `npm run check`

## Getting Started

1. Install dependencies:
   - `npm install`
   - `dotnet --version && aspire --version`
2. Run development mode:
   - `npm run dev`
   - Open the app at `http://localhost:5173`.
   - The API server runs on `http://localhost:3001`.
   - Aspire will print the local dashboard URL in the terminal.
3. Build and run production:
   - `npm run build`
   - `npm run start`

## Aspire Dashboard + MCP

- `npm run dev` starts the committed stable C# AppHost in `aspire/Poke.AppHost`, which manages both the frontend dev server and the API server.
- `dotnet --version && aspire --version` verifies that your machine has a compatible .NET SDK and Aspire CLI for the stable C# AppHost workflow.
- `PATH="$HOME/.aspire/bin:$PATH" aspire init --help | rg -- --language` is the optional polyglot check for the experimental TypeScript AppHost flow.
- Polyglot TypeScript AppHost support is optional for this repo.
- The Aspire dashboard URL and API key are local-only values. Use them for local MCP connections if you want dashboard access from an assistant, but do not commit them.

## Fix Aspire Setup

If `dotnet --version && aspire --version` fails:

1. Install .NET 10 SDK:
   - https://dotnet.microsoft.com/download/dotnet/10.0
2. Install the Aspire CLI:
   - macOS/Linux: `curl -sSL https://aspire.dev/install.sh | bash`
   - Windows PowerShell: `irm https://aspire.dev/install.ps1 | iex`
3. Update the Aspire CLI if it is already installed but too old:
   - `aspire update --self`
4. Re-run the repo check:
   - `dotnet --version && aspire --version`

If you want to experiment with the TypeScript AppHost flow as well:

1. Update Aspire first:
   - `aspire update --self`
2. Re-run the strict polyglot check:
   - `PATH="$HOME/.aspire/bin:$PATH" aspire init --help | rg -- --language`
3. If stable still does not expose it, try the latest daily Aspire CLI:
   - macOS/Linux: `curl -sSL https://aspire.dev/install.sh | bash -s -- -q dev`
   - Windows PowerShell: `iex "& { $(irm https://aspire.dev/install.ps1) } -Quality dev"`
4. Update the project packages after switching channels if needed:
   - `aspire update`
5. Re-run the strict polyglot check:
   - `PATH="$HOME/.aspire/bin:$PATH" aspire init --help | rg -- --language`
6. If that still fails, stay on the stable C# AppHost workflow for this repo.

## Hello API

`GET /api/v1/hello`

Example response:

```json
{
  "message": "Hello World from RS Stack"
}
```

## Direct Commands

- Frontend dev only: `npm exec rsbuild dev`
- API dev only: `npm exec tsx --watch server/main.ts`
- Browser tests: `npx rstest --project browser`
- End-to-end smoke test: `npx playwright test`
- Production smoke test: `node tests/e2e/prod-smoke.mjs`
- Full validation: `npx rstest --project api && npx rstest --project browser && npx playwright test && node tests/e2e/prod-smoke.mjs && npm run check`
- Stable Aspire check: `dotnet --version && aspire --version`
- Optional polyglot Aspire check: `PATH="$HOME/.aspire/bin:$PATH" aspire init --help | rg -- --language`
- Auto-fix lint: `npx biome check --fix`
- Format files: `npx biome format --write`
- Typecheck only: `npx tsc --noEmit`
- Browser test browser install: `npx playwright install chromium`
