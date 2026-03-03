# ExecPlan: Availity Users Dashboard via Strict TDD
## Goal
Replace the Hello World home view with a users dashboard table built with `@availity/element` (hardcoded data, client sorting + pagination), while keeping one backend example endpoint (`GET /api/v1/hello`).

## Success criteria (observable)
- Home route renders `User Dashboard` and `Hardcoded users dataset with client-side sorting and pagination.`
- Home route uses Availity table primitives from `@availity/element`.
- Home route shows hardcoded users dataset (>=12 rows) with columns: Name, Email, Role, Status, Last Active.
- Client-side sorting works for Name, Email, Role, Last Active.
- Pagination defaults to 5 rows and supports [5, 10, 25], resetting page to 0 when rows per page changes.
- Browser tests cover the approved 8 scenarios and pass.
- Existing API test for `/hello` remains passing and unchanged in behavior.
- `npm run test:all` and `npm run check` pass.

## Non-goals
- No backend/database changes beyond preserving the existing hello endpoint.
- No KPI widgets or additional dashboard modules.
- No removal/refactor of Counter component/tests.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: enabled (required for npm install).
- OS: macOS (Darwin), shell zsh.
- Package manager: npm + existing lockfile.
- Process: strict Red-Green-Refactor, one test at a time.

## Repo map (key files/dirs)
- `package.json`, `package-lock.json`
- `app/root.tsx`
- `app/routes/home.tsx`
- `app/routes/home.browser.test.tsx`
- `server/routes/hello.ts`
- `server/routes/hello.test.ts`

## Milestones
1. Dependency + root setup
   - Steps
   - Install `@availity/element`, `@emotion/react`, `@emotion/styled`.
   - Wrap app with `ThemeProvider` in `app/root.tsx` and update page title.
   - Validation: `npm run typecheck`
   - Expected signals: Type check passes with new imports.
   - Rollback: restore `package.json`, `package-lock.json`, `app/root.tsx`.

2. Browser TDD sequence for home dashboard
   - Steps
   - For each approved test in order:
     1) add one test; 2) run focused test and confirm RED; 3) implement minimal code; 4) rerun focused test GREEN; 5) run file-level browser tests.
   - Validation per step: `npx rstest --project browser --include "app/routes/home.browser.test.tsx" -t "<name>"` then `npx rstest --project browser --include "app/routes/home.browser.test.tsx"`
   - Expected signals: Each test transitions RED->GREEN without unrelated regressions.
   - Rollback: revert latest test/code chunk if unexpected behavior emerges.

3. Final regression + API preservation
   - Steps
   - Confirm `server/routes/hello.ts` behavior unchanged.
   - Run API test and full suite/check.
   - Validation: `npx rstest --project api --include "server/routes/hello.test.ts"`, `npm run test:all`, `npm run check`
   - Expected signals: all pass.
   - Rollback: revert last milestone edits.

## Decisions log (why changes)
- Use `@availity/element` package imports only (not hand-rolled table primitives) to satisfy project library discipline.
- Keep API endpoint as backend example but remove frontend dependence so dashboard data remains hardcoded.
- Implement sortable/paginated table as requested, with deterministic test fixtures.

## Progress log (ISO-8601 timestamps)
- 2026-03-03T10:56:00-05:00: Plan reset for dashboard implementation. Next: Milestone 1 dependency/root setup.
- 2026-03-03T10:59:00-05:00: Milestone 1 complete. Installed `@availity/element` + emotion peers and wired `ThemeProvider` in `app/root.tsx`.
- 2026-03-03T11:04:00-05:00: Milestone 2 complete via strict TDD. Added 8 browser tests first, verified RED->GREEN one-by-one, and implemented dashboard table with sorting + pagination.
- 2026-03-03T11:06:00-05:00: Milestone 3 complete. Validation passed: `npx rstest --project api --include \"server/routes/hello.test.ts\"`, `npm run test:all`, `npm run check`.
- 2026-03-03T11:12:00-05:00: Post-validation hardening. Resolved `window is not defined` build failure by moving Availity imports behind a client-only home wrapper (`npm run build` now passes).
- 2026-03-03T12:56:00-05:00: New mini-milestone started: replace `server/dev-fe-server.test.ts` with a simpler Playwright E2E regression for `/` (dev FE reachable, not-found absent, dashboard visible) and wire into test scripts.
- 2026-03-03T13:06:00-05:00: Mini-milestone complete. Replaced complex Node spawn/fetch dev FE test with Playwright E2E (`e2e/dev-fe.spec.ts`), added `playwright.config.ts`, removed `server/dev-fe-server.test.ts`, and wired `test:e2e` into `test:all` (all tests + check passing).
- 2026-03-03T13:25:00-05:00: Fixed browser runtime `Unexpected token 'export'` by enabling module script loading and replacing `HydratedRouter` bootstrap with SPA `createBrowserRouter` mount in `entry.client.tsx`. Updated E2E to verify `npm run dev` brings up frontend + API and dashboard view.
- 2026-03-03T13:40:00-05:00: Resolved Rsbuild warning `Can't resolve 'supports-color'` by adding `supports-color` dev dependency; verified by log-check script plus `npm run test:all` and `npm run check`.
- 2026-03-03T13:48:00-05:00: Removed direct `supports-color` dependency per user request and suppressed this specific optional-module warning via `tools.rspack.ignoreWarnings` in `rsbuild.config.ts`; validated warning absence and full suite green.
