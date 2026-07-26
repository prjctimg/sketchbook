# LOOP.md — sketchbook

Next.js app that showcases p5.js sketches hosted on GitHub Gists.

## Active Loops

### Issue Triage (L1 — report only)
- Cadence: 1d weekdays
- Skill: `loop-triage`
- State: STATE.md
- Phase: Report-only initially. L2 after trust established.
- Handoff: Design decisions, new features, API changes.

### PR Review (L2 — assisted)
- Cadence: on PR creation
- Skill: `loop-triage` + `loop-verifier`
- State: STATE.md
- Phase: Assisted — verifier runs `next build` + `next lint` in worktree.
- Handoff: Anything touching app/, lib/, or components/.

## Worktrees

- Use isolated git worktrees for any L2 code changes.
- One worktree per fix attempt; discard after verifier REJECT or escalation.

## Budget & Observability

- Token caps: `loop-budget.md`
- Run history: `loop-run-log.md`
- Kill switch: `loop-pause-all` label in STATE.md

## Safety

- Never auto-merge changes to `app/` or `lib/`.
- All TypeScript changes must pass `next build` + `next lint` before merge.
- Gist API integration changes require manual review.
