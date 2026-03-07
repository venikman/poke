# ExecPlan: TS Functional Blueprint Skill + Dashboard Domain Refactor
## Goal
Create a reusable repo skill from the F#-inspired TypeScript article and apply it to the users dashboard domain model with strict red-green-refactor for the new domain behavior.

## Success criteria (observable)
- Repo has a local skill at `.codex/skills/ts-functional-blueprint/SKILL.md` with actionable rules, prompt header, and review checklist.
- Dashboard domain logic uses branded IDs, immutable records, and a discriminated-union sort state.
- Sorting logic is implemented as pure functions with exhaustive `satisfies never` handling.
- New automated test covers sort-state transitions and sorted output behavior.
- Existing dashboard browser tests still pass.
- `npm run test:browser` and `npm run check` pass.

## Non-goals
- No UI redesign.
- No backend contract changes.
- No dependency upgrades.

## Constraints (sandbox, network, OS, time, dependencies)
- Sandbox: danger-full-access.
- Network: enabled but not required.
- OS: Linux container.
- Tooling: npm, rstest, biome, TypeScript strict mode.

## Repo map (key files/dirs)
- `app/components/UserDashboardContent.tsx`
- `app/domain/*` (new)
- `app/routes/home.browser.test.tsx`
- `.codex/skills/ts-functional-blueprint/SKILL.md` (new)
- `README.md`

## Milestones
1. Plan and red test setup
   - Steps
     - Update this ExecPlan.
     - Add a new failing browser test for domain sorting/state transitions.
   - Validation: `npx rstest --project browser --include "app/domain/userDashboard.browser.test.tsx"`
   - Expected signals: fails before implementation (red).
   - Rollback: remove new test file.

2. Implement functional domain model + wire component
   - Steps
     - Add `app/domain/userDashboard.ts` with Brand, immutable user model, DU sort state, pure sort helpers.
     - Refactor dashboard component to consume domain module.
   - Validation:
     - `npx rstest --project browser --include "app/domain/userDashboard.browser.test.tsx"`
     - `npx rstest --project browser --include "app/routes/home.browser.test.tsx"`
   - Expected signals: both pass (green).
   - Rollback: revert domain and component edits.

3. Skill + docs + regression
   - Steps
     - Add `.codex/skills/ts-functional-blueprint/SKILL.md`.
     - Add README pointer.
     - Run browser tests and lint/type checks.
   - Validation:
     - `npm run test:browser`
     - `npm run check`
   - Expected signals: pass.
   - Rollback: revert docs/skill changes.

## Decisions log (why changes)
- Keep domain logic separate from UI to preserve testability and composability.
- Use `satisfies never` in DU switch defaults to force exhaustiveness at compile time.
- Keep API unchanged; refactor is scoped to frontend domain modeling and team guidance.

## Progress log (ISO-8601 timestamps)
- 2026-03-07T00:00:00Z: ExecPlan initialized. Next: add red test for domain sort-state behavior.

- 2026-03-07T07:03:00Z: Milestone 1 complete. Added failing domain test (`app/domain/userDashboard.browser.test.tsx`) and observed RED due missing module.
- 2026-03-07T07:07:00Z: Milestone 2 complete. Implemented `app/domain/userDashboard.ts` and refactored dashboard component to use DU sort-state + immutable domain model; domain tests GREEN.
- 2026-03-07T07:10:00Z: Milestone 3 in progress. Added repo-local TS skill and README pointer; next run full browser + lint/type checks.
- 2026-03-07T07:16:00Z: Milestone 3 complete. Added `.codex/skills/ts-functional-blueprint/SKILL.md`, updated README guidance, and validated `CI=true npm run test:browser` + `npm run check` both passing.
