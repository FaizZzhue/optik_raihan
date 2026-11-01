# Testing and Verification Workflow

## Select checks

Inspect project scripts and CI configuration, then choose checks appropriate to the change:
- focused unit/integration/e2e tests;
- type checking;
- lint/format checks;
- build;
- API contract or schema checks;
- manual browser/runtime checks when available.

Do not run unrelated expensive suites without a reason, but do not skip important checks merely for convenience.

## Rules

- Run commands that exist in the project; do not invent scripts.
- Report exact commands or clearly identify the checks performed.
- Distinguish passed, failed, skipped, and not-run checks.
- If a check cannot run because of missing services, credentials, or tooling, explain the blocker.
- Do not say “all tests pass” if only a subset was run.
- Review changed behavior and adjacent failure modes, not just whether code compiles.
- Never weaken tests or disable checks solely to achieve a green result.
