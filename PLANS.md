# ExecPlan: Restore Frontend Route Health
## Goal
Remove the client-only dashboard boot path so the home route renders the real dashboard immediately, and align the client entry with the React Router framework hydration path used by the installed Rsbuild plugin.

## Success criteria (observable)
- `/` renders the dashboard table immediately instead of first rendering a placeholder shell.
- The app uses the React Router framework default client entry instead of a custom `app/entry.client.tsx` bootstrap.
- Browser tests for the home route pass without waiting for a dynamic dashboard module import.
- `npm run test`, `npx rstest --project browser`, `npm run build`, `npx playwright test`, and `npm run check` pass.

## Non-goals
- Redesign the dashboard visual system.
- Change the API contract or the user table data model.
- Rework the Aspire/dev-server topology.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: allowed, but do not add dependencies for this fix.
- OS: macOS local workspace.
- Preserve unrelated worktree changes.
- Follow TDD: add failing tests before production edits.

## Repo map (key files/dirs)
- `app/routes/home.tsx`
- `app/components/UserDashboardContent.tsx`
- `tests/browser/app/routes/home.browser.test.tsx`
- `tests/api/server/`

## Milestones
1. Lock the intended frontend behavior with failing tests
   - Steps
     - Update the home route browser test to require immediate dashboard rendering.
     - Add a small source contract test for the client entry hydration path.
   - Validation: `npx rstest --project browser tests/browser/app/routes/home.browser.test.tsx` and `npm run test`
   - Expected signals: the new assertions fail against the current lazy route/module bootstrap.
   - Rollback: revert the new test expectations.

2. Remove the unhealthy boot path
   - Steps
     - Render the dashboard route synchronously in `app/routes/home.tsx`.
     - Replace the manual client router bootstrap with `HydratedRouter`.
   - Validation: `npx rstest --project browser tests/browser/app/routes/home.browser.test.tsx` and `npm run test`
   - Expected signals: targeted tests turn green.
   - Rollback: restore the previous route and entry files.

3. Run full frontend validation
   - Steps
     - Run the broader browser, build, E2E, and repo checks.
   - Validation:
     - `npx rstest --project browser`
     - `npm run build`
     - `npx playwright test`
     - `npm run check`
   - Expected signals: all validations pass and the route is healthy in the tested runtime paths.
   - Rollback: revert the route/entry changes if regressions remain unresolved.

## Decisions log (why changes)
- The current `home.tsx` dynamically imports the only dashboard route component, which delays the real UI behind a placeholder and creates avoidable hydration churn.
- The repo is already using React Router framework-mode tooling, so `entry.client.tsx` should match that contract rather than hand-building a separate browser router tree.
- A small source contract test is acceptable here because the client entry file is integration glue, not domain behavior.
- The best stable client-entry fix in this repo is to remove the custom `app/entry.client.tsx` entirely and fall back to the framework default entry, because the custom file fought the static build path.
- `@availity/element` is not safe on this route's static-build import path due to `window` access inside `@availity/message-core`, so the dashboard surface now uses server-safe MUI primitives instead.
- MUI `TablePagination` exposes next/previous controls rather than the old numeric page button markup, so the browser tests now assert behavior through those accessible controls.
- Local Playwright runs should reuse an already-running dev server on `:5173` instead of failing on a port collision; CI still starts a fresh server.

## Progress log (ISO-8601 timestamps)
- 2026-03-10T00:00:00Z: ExecPlan initialized for frontend route-health cleanup after identifying the lazy home route and manual client router bootstrap as the main issues.
- 2026-03-10T00:07:00Z: Milestone 1 complete. Added failing route and client-entry contract tests and verified they failed against the lazy route and manual browser-router bootstrap.
- 2026-03-10T00:15:00Z: Milestone 2 partially complete. Removed the lazy route boot path, then replaced the custom client entry with the framework default after the intermediate custom `HydratedRouter` file conflicted with static builds.
- 2026-03-10T00:24:00Z: Discovered the direct route render exposed an import-time `window` dependency in `@availity/element`; switched the dashboard table to MUI primitives and added a source contract test to keep the static-build-safe import path.
- 2026-03-10T00:33:00Z: Milestone 3 complete. `npm run test`, `npx rstest --project browser`, `npm run build`, `npx playwright test`, and `npm run check` all passed after updating the pagination tests and local Playwright server reuse.
