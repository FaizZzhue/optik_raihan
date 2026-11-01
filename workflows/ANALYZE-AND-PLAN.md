# Analyze and Plan Workflow

## Analyze

- Restate the requested outcome internally and identify acceptance criteria.
- Inspect repository instructions, relevant source, contracts, and current changes.
- Identify what is known, unknown, and assumed.
- Find existing implementations before adding new ones.
- Trace the impact across UI, client/API, backend, persistence, and tests when relevant.

## Plan

For complex, cross-layer, risky, or architecture-changing work, provide a concise plan with:
- target behavior and acceptance criteria;
- modules/files expected to change;
- API/data contract changes;
- risk and compatibility considerations;
- verification steps.

For small, low-risk tasks, keep planning lightweight and avoid unnecessary ceremony.

## Clarification and autonomy

- Proceed with low-risk, reversible assumptions and state them where useful.
- Ask a focused question when ambiguity materially affects data integrity, security, architecture, or the expected result.
- Obtain permission before destructive or production-impacting actions unless explicitly authorized.
- Do not expand scope just because additional improvements are possible.
