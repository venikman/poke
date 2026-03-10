# ExecPlan: Remove Aspire AppHost
## Goal
Remove Aspire from the repository entirely and return local development and test orchestration to direct Node-based commands.

## Success criteria (observable)
- `npm run dev` starts the API server and frontend dev server without requiring .NET or Aspire.
- The repo has no tracked Aspire AppHost files or solution files.
- README no longer documents Aspire setup, dashboard, or MCP wiring.
- `npm run test`, `npx rstest --project browser`, `npx playwright test`, `npm run build`, and `npm run check` pass.

## Non-goals
- Redesign the frontend or API behavior.
- Change production runtime behavior.
- Add new dependencies for process orchestration.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: allowed but avoid new dependencies.
- OS: macOS local workspace.
- Preserve existing non-Aspire changes already in the worktree.
- Keep the package manifest at 5 top-level scripts.

## Repo map (key files/dirs)
- `package.json`
- `playwright.config.ts`
- `README.md`
- `aspire/`
- `poke.slnx`
- `tests/api/server/`

## Milestones
1. Lock the new non-Aspire dev contract with a failing test
   - Steps
     - Add a source contract test for `package.json` and `playwright.config.ts`.
   - Validation: `npm run test`
   - Expected signals: the new contract test fails while the repo still references Aspire.
   - Rollback: remove the new test file.

2. Remove Aspire wiring and files
   - Steps
     - Replace `npm run dev` with a direct Node dev loop.
     - Point Playwright at direct frontend/API startup instead of `npm run dev`.
     - Remove Aspire AppHost files and the solution file.
     - Delete Aspire-specific tests and update docs.
   - Validation:
     - `npm run test`
     - `npm run check`
   - Expected signals: no tracked Aspire references remain in runtime config and tests are green.
   - Rollback: restore the deleted AppHost files and script wiring.

3. Run full repo validation
   - Steps
     - Run browser, E2E, build, and repo checks.
   - Validation:
     - `npx rstest --project browser`
     - `npx playwright test`
     - `npm run build`
     - `npm run check`
   - Expected signals: direct Node-based dev/test flow works without Aspire.
   - Rollback: revert the migration if runtime parity regresses.

## Decisions log (why changes)
- Aspire is being removed completely, so the repo should not retain partial AppHost contracts, docs, or healthcheck tests.
- The direct Node dev loop should stay dependency-free and use the local npm script PATH instead of `npm exec`.
- Playwright should start the frontend and API separately so E2E does not depend on a composite shell script.

## Progress log (ISO-8601 timestamps)
- 2026-03-10T00:00:00Z: ExecPlan initialized for full Aspire removal and direct Node dev workflow restoration.
- 2026-03-10T00:08:00Z: Milestone 1 complete. Added a failing source contract test for the direct dev workflow and verified it failed while `package.json` and Playwright still depended on the AppHost.
- 2026-03-10T00:18:00Z: Milestone 2 complete. Replaced the AppHost-backed `dev` script with a direct Node loop, switched Playwright to separate frontend/API servers, removed AppHost files and solution artifacts, and deleted the AppHost health contract test.
- 2026-03-10T00:28:00Z: Milestone 3 complete. Verified API tests, browser tests, build, Playwright smoke, repo checks, and a direct `npm run dev` smoke after tightening Rsbuild to `strictPort: true`.
