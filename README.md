# Full-Stack AI RS Template (Modern.js)

A full-stack template using Modern.js (Rspack + Rsbuild), BFF API routes, Rstest, and OpenRouter for AI inference.

## Getting Started

1. Install dependencies:
   - `npm install`
2. Optional: build shared utils:
   - `npm run build:shared`
3. Start the dev server (default: http://localhost:8080):
   - `npm run dev` — requires `GROK_KEY` for AI features
   - `npm run dev:mock` — mock AI responses, no API key needed
4. Build for production:
   - `npm run build`
5. Run the production server:
   - `npm run serve`
6. Run tests:
   - `npm test` — runs node tests only (API/lambda)
   - `npm run test:browser` — runs browser tests only (requires Playwright)
   - `npm run test:all` — runs both node and browser tests
   - `npm run test:browser:install` — installs Chromium for Playwright (run once)

## Mock Server

For local development without an API key, use the mock server:

```bash
npm run dev:mock
```

This starts:
- Modern.js dev server on port 8081 (internal)
- Mock proxy server on port 8080 (use this URL)

The mock server intercepts `/api/v1/chat/*` endpoints and returns simulated AI responses. All other requests are proxied to the real Modern.js dev server.

Environment variables for mock server:
- `MOCK_PORT` — mock server port (default: 8080)
- `MODERN_PORT` — Modern.js internal port (default: 8081)
- `MOCK_DELAY_MS` — simulated API latency in ms (default: 500)

## Rs-family toolchain

This template uses the **rs-family** stack: **Rspack** (app build), **Rsbuild** (test bundling), **Rstest** (tests).

| Concern | Where to configure |
|--------|---------------------|
| **App build (Rspack)** | `modern.config.ts` — use `tools.rspack` to customize. See `rspack.config.ts` for a reference comment. |
| **Test bundling (Rsbuild)** | `rstest.config.ts` — per-project `plugins`, `resolve.alias`, etc. See `rsbuild.config.ts` for reference. |
| **Tests (Rstest)** | `rstest.config.ts` — projects (browser vs node), coverage, Playwright provider. |

There are no standalone Rspack/Rsbuild config files that drive the build; the entry points above are the single source of truth.

## API

`POST /api/v1/chat/completions` — OpenAI-compatible Chat Completions. Use the `openai` package:

```typescript
import OpenAI from 'openai';

// Token comes from auth/SSO session — wire your auth provider. No keys stored in frontend.
const token = getAuthToken(); // from auth context / SSO session

const openai = new OpenAI({
  baseURL: 'http://localhost:8080/api/v1',
  apiKey: token ?? 'dummy',  // pass token from session; backend validates if API_TOKEN set
  dangerouslyAllowBrowser: true,
});

const completion = await openai.chat.completions.create({
  model: 'x-ai/grok-4.1-fast',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

Set `GROK_KEY` for OpenRouter. Bearer auth uses `API_TOKEN` on the server; the client sends the token from the auth/SSO session (no keys in frontend).

## Environment

Set your OpenRouter key:

```bash
export GROK_KEY=your_openrouter_key
```

Optional bearer auth (token from auth/SSO session, not stored in frontend):

```bash
export API_TOKEN=your_secret_token
```

When set, the backend expects `Authorization: Bearer <token>`. The client obtains the token from the auth/SSO layer at runtime (session, auth context, etc.). If unset, no auth is required.

Optional OpenRouter headers:

```bash
export OPENROUTER_REFERER=https://your-app.example
export OPENROUTER_TITLE="Full-Stack AI RS Template"
```
