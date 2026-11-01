# Engineering Principles

Priority order for everyday decisions:

1. Correctness and user requirements.
2. Security and data integrity.
3. Maintainability and clarity.
4. Minimal, scoped changes.
5. Verification and regression prevention.
6. Performance appropriate to measured or credible needs.
7. UI/UX consistency and accessibility.

These priorities are not an excuse to ignore any of them; use judgment when they trade off.

## Avoid AI slop

Do not:
- invent requirements, endpoints, schema fields, data, test results, or project history;
- add unnecessary abstractions, design patterns, packages, layers, or configuration;
- duplicate existing components or utilities;
- generate placeholder code that looks production-ready;
- leave unexplained TODOs, dead code, fake API clients, or unused imports;
- rewrite working areas unrelated to the request;
- use broad `try/catch`, `any`, lint disables, or hardcoded secrets to silence problems;
- claim completion without verification.

Prefer a small correct change over a large speculative rewrite. If the requested solution would create significant technical debt or security risk, explain the concern and offer a focused alternative.
