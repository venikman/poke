# ExecPlan: PR #3 Comment Remediation
## Goal
Implement the accepted PR review fixes for dashboard sorting, accessibility, root shell layout sharing, and production smoke-test hardening without broadening scope into deferred platform or infrastructure follow-ups.

## Success criteria (observable)
- Sorting keeps the current page when toggling sort direction on the same column and still resets to page 1 when the sort key changes.
- Sortable header cells expose `aria-sort` through MUI `TableCell.sortDirection`.
- The root route exports `Layout` and shares the same document shell across `Root` and `HydrateFallback`.
- The production smoke script fails immediately on any early server exit and uses a resilient root-shell assertion.
- Targeted browser/source validations and the smoke script pass.

## Non-goals
- Adding Windows-specific script support or new orchestration dependencies.
- Reworking the rate limiter, tie-break sorting policy, or other deferred PR comments.
- Replacing the existing sort-state model.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: allowed but avoid new dependencies.
- OS: macOS local workspace.
- Preserve the current direct Node dev contract and its source tests.
- Keep changes limited to the accepted PR comment set plus directly related regression tests.

## Repo map (key files/dirs)
- `app/components/UserDashboardContent.tsx`
- `app/domain/userDashboard.ts`
- `app/root.tsx`
- `tests/api/server/pr-comment-remediation-contract.test.ts`
- `tests/browser/app/domain/userDashboard.browser.test.tsx`
- `tests/browser/app/routes/home.browser.test.tsx`
- `tests/e2e/prod-smoke.mjs`

## Milestones
1. Lock the accepted behavior with failing tests
   - Steps
     - Add browser assertions for page retention on sort-direction toggle, page reset on sort-key change, accessible sort headers, and stable pagination selectors.
     - Add a source contract for the shared root layout export and prod-smoke script shape.
   - Validation:
     - `npx rstest --project api --include "tests/api/server/pr-comment-remediation-contract.test.ts"`
     - `npx rstest --project browser --include "tests/browser/app/routes/home.browser.test.tsx"`
   - Expected signals: new assertions fail against current production code for the intended reasons.
   - Rollback: remove the new assertions.

2. Implement the production changes
   - Steps
     - Update dashboard sorting/pagination logic and header cell accessibility props.
     - Export `Layout` from `app/root.tsx` and align `Root`/`HydrateFallback` with it.
     - Harden the smoke test startup race and root-shell assertion.
     - Improve the unreachable sort-state error message.
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
- The PR comment pass should focus on correctness and accessibility issues that affect current behavior or framework conformance.
- Cross-platform script changes remain out of scope because the repo explicitly avoids new orchestration dependencies and already source-tests the current Unix-style workflow.
- The review follow-ups that touch the same files are worth taking now when they strengthen regression coverage or robustness with low scope cost.

## Progress log (ISO-8601 timestamps)
- 2026-03-10T00:00:00Z: ExecPlan initialized for the PR #3 remediation work.
- 2026-03-11T01:05:00Z: Milestone 1 complete. Added failing browser assertions for `aria-sort`, stable pagination selectors, page retention on same-column toggles, and a source-contract test for `Layout` plus prod-smoke early-exit handling.
- 2026-03-11T01:18:00Z: Milestone 2 complete. Updated dashboard sort/pagination behavior, added sortable header `sortDirection`, exported `Layout`, improved the unreachable sort-state error, and hardened the prod-smoke script.
- 2026-03-11T01:24:05Z: Milestone 3 complete. Verified `npm run check`, the new source-contract test, both targeted browser specs, and `node tests/e2e/prod-smoke.mjs`.
