# sketchbook - Agent Notes

## Build & Test

```bash
bun run dev                    # start dev server
bun run build                  # build for production
bun run lint                   # lint check
```

## Overview

Next.js app that showcases p5.js sketches hosted on GitHub Gists. Each gist must contain a `sketch.js` file and optionally a `p5.json` file. All sketches must be in instance mode.

## Configuration

Edit `sitemeta.json` to configure site metadata and GitHub username.

## Coding Guidelines

- Follow Next.js conventions (app router, server components)
- Use TypeScript with proper types
- Follow conventional commit guidelines

## Loop Engineering

This repo uses loop engineering patterns. See:
- `.opencode/STATE.md` — current loop memory
- `.opencode/LOOP.md` — active loops and cadence
- `.opencode/loop-budget.md` — token caps
- `.opencode/loop-constraints.md` — binding agent rules
- `.opencode/loop-run-log.md` — run history
- `.opencode/gate.yaml` — path denylist + auto-merge allowlist
- `.opencode/skills/` — triage and verifier skills

Start a loop: `opencode run "Run loop-triage. Update .opencode/STATE.md."`
Verify changes: `opencode run "Verify diff in worktree" --agent verifier`
