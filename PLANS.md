# ExecPlan: Make Playwright Dev-Only
## Goal
Run Playwright E2E only against the development server flow and remove the production-mode branch from the Playwright config.

## Success criteria (observable)
- `playwright.config.ts` only contains development-mode server wiring.
- `npm run test:e2e` runs against `npm run dev` on `http://localhost:5173`.
- No Playwright config code remains for `npm run build && npm run start`.
- `npm run test`, `npm run test:e2e`, `npm run test:all`, and `npm run check` pass.

## Non-goals
- No changes to browser-test coverage.
- No changes to production app runtime scripts.
- No TypeScript config changes.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: not required.
- OS: macOS local workspace.
- Preserve unrelated in-progress worktree changes.

## Repo map (key files/dirs)
- `playwright.config.ts`
- `package.json`
- `tests/api/server/dev-ports.test.ts`

## Milestones
1. Lock the target with a failing test
   - Steps
     - Assert Playwright uses dev-only wiring and no production branch.
   - Validation: `npm run test`
   - Expected signals: fails before implementation.
   - Rollback: remove the new assertions.

2. Simplify Playwright config to dev-only
   - Steps
     - Remove the mode switch and production branch from `playwright.config.ts`.
     - Keep `test:e2e` using default Playwright config discovery.
   - Validation:
     - `npm run test`
     - `npm run test:e2e`
   - Expected signals: API tests and Playwright smoke test pass.
   - Rollback: restore the dev/prod switch if validation fails.

3. Validate repo health
   - Steps
     - Run the aggregate test path and lint/type checks.
   - Validation:
     - `npm run test:all`
     - `npm run check`
   - Expected signals: all suites pass with dev-only Playwright.
   - Rollback: revert the simplification if validation exposes regressions.

## Decisions log (why changes)
- The user wants the E2E path to validate only the dev-server experience.
- One explicit dev-only config is simpler than carrying dead production-mode branching.
- Production runtime validation remains available through build/start scripts and other checks, but no longer through Playwright.

## Progress log (ISO-8601 timestamps)
- 2026-03-09T01:40:00Z: ExecPlan initialized for dev-only Playwright.
- 2026-03-09T01:42:00Z: Milestone 1 complete. Added a failing API assertion that forbids Playwright production branching and requires dev-only wiring.
- 2026-03-09T01:45:00Z: Milestone 2 complete. Removed the Playwright mode switch and production branch, leaving a single dev-only config.
- 2026-03-09T01:49:00Z: Milestone 3 complete. `npm run test`, `npm run test:e2e`, `npm run test:all`, and `npm run check` all passed with dev-only Playwright.
