# ExecPlan: PR #3 Second-Pass Comment Remediation
## Goal
Implement the worthwhile second-pass PR review fixes: make the initial dashboard sort explicit, make `"default"` truly unsorted, strengthen the domain sort tests so they catch wrong-key bugs, and replace the brittle `app/root` source check with a real export contract.

## Success criteria (observable)
- The dashboard renders with `name` descending as an active initial sort, and the first click on `name` toggles to ascending.
- `getDisplayUsers(..., { kind: 'default' })` preserves input order instead of applying an implicit sort.
- Domain tests use a local fixture with uncorrelated field values and assert the active sort field ordering rather than a coincidental first name.
- The root export contract test verifies `Layout`, `default`, and `HydrateFallback` via a real module import.
- Targeted browser/API validations plus the smoke script pass.

## Non-goals
- Adding Windows-specific script support or new orchestration dependencies.
- Reworking the rate limiter, tie-break sorting policy, or other deferred PR comments.
- Replacing the existing sort-state model beyond making its initial semantics explicit.
- Building a mocked subprocess harness for `prod-smoke.mjs`.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: allowed but avoid new dependencies.
- OS: macOS local workspace.
- Preserve the current direct Node dev contract and its source tests.
- Keep changes limited to the accepted second-pass PR comments plus directly related regression tests.

## Repo map (key files/dirs)
- `app/components/UserDashboardContent.tsx`
- `app/domain/userDashboard.ts`
- `app/root.tsx`
- `tests/api/server/pr-comment-remediation-contract.test.ts`
- `tests/browser/app/domain/userDashboard.browser.test.tsx`
- `tests/browser/app/routes/home.browser.test.tsx`
- `tests/e2e/prod-smoke.mjs`

## Milestones
1. Lock the second-pass behavior with failing tests
   - Steps
     - Add domain assertions for explicit initial sort semantics and truly unsorted `"default"` behavior.
     - Replace the weak cross-key domain assertions with checks against a small local fixture whose fields sort differently.
     - Replace the string-based root export contract with a real module import.
     - Update the browser spec to expect initial descending `name` sort and first-click ascending behavior.
   - Validation:
     - `npx rstest --project api --include "tests/api/server/pr-comment-remediation-contract.test.ts"`
     - `npx rstest --project browser --include "tests/browser/app/domain/userDashboard.browser.test.tsx"`
     - `npx rstest --project browser --include "tests/browser/app/routes/home.browser.test.tsx"`
   - Expected signals: new assertions fail against current production code for the intended reasons.
   - Rollback: remove the new assertions.

2. Implement the production changes
   - Steps
     - Make the initial dashboard sort explicit in the domain API.
     - Make the `"default"` branch preserve input order.
     - Keep the current first-render UI order while aligning the active sort indicator with it.
     - Convert the root export contract test to import-based assertions while leaving the smoke-script check source-based.
   - Validation:
     - `npm run check`
     - `npx rstest --project api --include "tests/api/server/pr-comment-remediation-contract.test.ts"`
     - `npx rstest --project browser --include "tests/browser/app/domain/userDashboard.browser.test.tsx"`
     - `npx rstest --project browser --include "tests/browser/app/routes/home.browser.test.tsx"`
   - Expected signals: all targeted tests pass with the new behavior.
   - Rollback: revert the touched app/test files to the pre-remediation state.

3. Run full acceptance checks
   - Steps
     - Re-run the approved acceptance commands, including the production smoke flow.
   - Validation:
     - `npm run check`
     - `npx rstest --project api --include "tests/api/server/pr-comment-remediation-contract.test.ts"`
     - `npx rstest --project browser --include "tests/browser/app/domain/userDashboard.browser.test.tsx"`
     - `npx rstest --project browser --include "tests/browser/app/routes/home.browser.test.tsx"`
     - `node tests/e2e/prod-smoke.mjs`
   - Expected signals: acceptance commands succeed without introducing new dependency or workflow drift.
   - Rollback: revert the remediation commits if acceptance regresses.

## Decisions log (why changes)
- The second-pass PR comment work should focus on the remaining correctness and test-quality issues, not low-value polish.
- Cross-platform script changes remain out of scope because the repo explicitly avoids new orchestration dependencies and already source-tests the current Unix-style workflow.
- The initial sort should stay visually `name` descending on first render, but it should be explicit in state rather than hidden behind `"default"`.
- The root export contract is worth making import-based because it is low-risk and removes formatting brittleness.

## Progress log (ISO-8601 timestamps)
- 2026-03-10T00:00:00Z: ExecPlan initialized for the PR #3 remediation work.
- 2026-03-11T01:05:00Z: Milestone 1 complete. Added failing browser assertions for `aria-sort`, stable pagination selectors, page retention on same-column toggles, and a source-contract test for `Layout` plus prod-smoke early-exit handling.
- 2026-03-11T01:18:00Z: Milestone 2 complete. Updated dashboard sort/pagination behavior, added sortable header `sortDirection`, exported `Layout`, improved the unreachable sort-state error, and hardened the prod-smoke script.
- 2026-03-11T01:24:05Z: Milestone 3 complete. Verified `npm run check`, the new source-contract test, both targeted browser specs, and `node tests/e2e/prod-smoke.mjs`.
- 2026-03-11T00:00:00Z: Second-pass remediation started for the explicit initial sort, stronger domain fixture coverage, and import-based `app/root` contract test.
- 2026-03-11T01:54:00Z: Second-pass Milestone 1 complete. Added failing assertions for explicit initial sort semantics, truly unsorted `default` behavior, stronger local-fixture key ordering, and a less brittle `app/root` contract check.
- 2026-03-11T02:02:00Z: Second-pass Milestone 2 complete. Made the initial sort explicit as `name desc`, changed the `default` branch to preserve input order, and aligned the browser expectations with the now-visible initial sort state.
- 2026-03-11T02:07:11Z: Second-pass Milestone 3 complete. Verified the updated API contract test, both targeted browser specs, `npm run check`, and `node tests/e2e/prod-smoke.mjs`.
