# Code Review Workflow

Review the diff for:

- correctness against the requirement;
- clean code and cohesive responsibilities;
- adherence to project architecture and naming;
- unnecessary files, abstractions, dependencies, or duplicated logic;
- unsafe types, unvalidated input, incorrect auth boundaries, or exposed secrets;
- API contract mismatch and frontend/backend integration gaps;
- error handling, loading/empty/error states, and accessibility where relevant;
- performance regressions or unnecessary rerenders/queries;
- missing tests, stale docs, TODOs, and unverified claims;
- unrelated modifications.

Prioritize actionable findings by severity. Do not report stylistic preferences as defects unless they conflict with established conventions or materially reduce clarity.
