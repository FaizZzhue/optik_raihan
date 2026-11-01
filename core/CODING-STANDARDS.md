# Coding Standards

## Readability and clean code

- Clean code is mandatory: make intent apparent through naming, structure, and simple control flow.
- Choose descriptive, consistent filenames and identifiers. Follow the ecosystem's conventions (for example, PascalCase React component files if that is the repository convention).
- Prefer small cohesive functions and components; split when a unit has multiple responsibilities or becomes difficult to reason about.
- Avoid unexplained magic values, deeply nested conditionals, hidden side effects, and clever code that is harder to maintain.
- Remove duplication when it represents the same rule or behavior; do not create abstractions for superficial similarities.
- Handle errors intentionally. Do not silently swallow failures or use broad catches without a clear recovery/reporting purpose.
- Keep types useful and precise. Avoid `any` or unsafe casts when the type can reasonably be modeled.
- Do not suppress lint, type, or test failures just to make a command pass. If suppression is justified, scope it narrowly and explain why.
- Follow formatter, linter, naming, import, and test conventions already used in the repository.

## Comments

- Use comments sparingly.
- Explain intent, constraints, non-obvious behavior, workarounds, or meaningful animation/interaction details.
- A short descriptive comment is acceptable, for example: `// Flip animation for the header on scroll`.
- Do not comment every line or repeat what the code already says.
- Keep TODOs actionable and attributable, such as `TODO(BE): Add authenticated GET /api/profile endpoint`; document the corresponding contract and task.
- Remove stale comments when behavior changes.

## Change scope

- Do not reformat or rewrite unrelated files.
- Avoid drive-by refactors. If a refactor is necessary, explain why and keep it scoped.
- Preserve public behavior unless the task requires a change.
- Avoid adding compatibility wrappers, configuration flags, or fallback paths without a real requirement.
