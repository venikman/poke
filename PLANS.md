# ExecPlan: RS Stack Hello World + Dependency Upgrades
## Goal
Replace AI chat functionality with a minimal Hello World full-stack example, and upgrade project dependencies to their latest versions.

## Success criteria (observable)
- No AI chat route, AI SDK usage, or AI environment variables remain in app/server/docs.
- API exposes a simple Hello World endpoint and tests cover it.
- Home page is a simple Hello World RS stack example with passing browser tests.
- Dependencies are upgraded to latest available versions and lockfile is updated.
- `npm run test:all` and `npm run check` pass.

## Non-goals
- Introducing new product features beyond Hello World.
- Redesigning the Counter component behavior.
- Adding authentication or external integrations.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: `workspace-write`.
- Network: restricted in sandbox; npm registry actions may require escalated execution.
- OS: macOS (Darwin), zsh shell.
- Package manager: npm with existing `package-lock.json`.

## Repo map (key files/dirs)
- `package.json`, `package-lock.json`
- `server/main.ts`
- `server/routes/hello.ts`, `server/routes/hello.test.ts`
- `app/routes/home.tsx`, `app/routes/home.browser.test.tsx`
- `app/root.tsx`
- `README.md`

## Milestones
1. Define target behavior with tests (RED)
   - Steps
   - Rewrite API test to assert Hello endpoint response shape/content.
   - Rewrite browser test to assert minimal Hello World UI.
   - Validation: `npm run test`
   - Expected signals: API tests fail for missing/new behavior.
   - Rollback: `git checkout -- server/routes/*.test.ts app/routes/home.browser.test.tsx`
2. Implement Hello World replacement (GREEN)
   - Steps
   - Replace chat route with hello route and wire in `server/main.ts`.
   - Simplify home route to Hello World example and remove AI logic.
   - Update root title and docs/scripts to remove AI references.
   - Validation: `npm run test:all`
   - Expected signals: API + browser tests pass.
   - Rollback: revert touched app/server/doc files.
3. Upgrade dependencies and refresh lockfile
   - Steps
   - Upgrade top-level deps/devDeps to latest, remove unused entries.
   - Run install to refresh `package-lock.json`.
   - Validation: `npm outdated --json`, `npm run check`
   - Expected signals: no outdated direct dependencies; check passes.
   - Rollback: restore `package.json` and `package-lock.json` from git.
4. Final verification and cleanup
   - Steps
   - Confirm no residual AI references.
   - Run full test/check commands and capture outputs.
   - Validation: `rg -n "OpenAI|OpenRouter|GROK|chat/completions|/api/v1/chat" -S`, `npm run test:all`, `npm run check`
   - Expected signals: no matches in source/docs (except historical AGENTS content), all validations pass.
   - Rollback: revert last milestone commit if regressions appear.

## Decisions log (why changes)
- Keep Counter demo to preserve existing component/test value while removing AI complexity.
- Provide explicit API hello endpoint to keep full-stack example (frontend + backend) in place.

## Progress log (ISO-8601 timestamps)
- 2026-03-03T13:19:00-05:00: Plan created. Next: Milestone 1 (write failing tests for Hello World behavior).
- 2026-03-03T13:27:00-05:00: Milestone 1 complete. RED confirmed (`npm run test` failed with expected 404 for `/hello`; browser build failed on legacy `openai` import).
- 2026-03-03T13:35:00-05:00: Milestone 2 complete. Implemented `hello` route + frontend Hello World replacement. `npm run test:all` passed.
- 2026-03-03T13:40:00-05:00: Milestone 3 complete. Upgraded all direct dependencies to latest; lockfile refreshed; `npm outdated --json` returned `{}`.
- 2026-03-03T13:43:00-05:00: Milestone 4 complete. Final validation clean: no source/docs AI references, `npm run test:all` and `npm run check` passed.
