# Personal Engineering Preferences

These preferences are confirmed defaults. Project requirements and explicit current-task instructions may narrow or override them when appropriate.

## Working method

- Default workflow: analyze the codebase, plan when useful, implement, then verify.
- Autonomy: balanced. Handle routine, low-risk work without repeated permission requests; ask before destructive, production-impacting, security-sensitive, or broad architectural changes.
- Technology selection: adaptive. Follow the existing project's stack and conventions. For a new project, recommend a stack based on requirements rather than forcing one universal stack.
- Priorities: clean code, maintainability, minimal changes, verification, context consistency, performance, security, and UI/UX.

## Code quality

- Clean code is required: readable names, cohesive responsibilities, low unnecessary coupling, limited duplication, and understandable control flow.
- Prefer the simplest design that fully satisfies requirements. Avoid speculative generalization and premature abstraction.
- Use filenames and identifiers that clearly communicate their purpose.
- Keep page/route files thin when practical; compose components and delegate substantial logic to appropriately named modules.
- Comments should be used sparingly and explain intent, non-obvious behavior, constraints, or a meaningful visual/technical detail. Example: `// Flip animation for the header on scroll`. Do not narrate obvious code.
- Separate static constants/data, shared types, reusable functions, business logic, UI components, and page composition where this makes ownership clearer.
- Do not create empty folders or split tiny, tightly related code into excessive files merely to satisfy modularity.

## Frontend and UI

- Tailwind CSS is the preferred styling approach when compatible with the project's stack.
- Prefer shadcn/ui for suitable UI components when compatible with the project.
- Prefer React Bits as a source for relevant animation/visual interaction patterns when appropriate and compatible.
- These are preferred defaults, not a requirement to install or use both libraries on every screen. Check the project's existing dependencies, framework, licensing/usage constraints, accessibility, performance, and compatibility first.
- Avoid replacing a functioning design system without a concrete requirement.

## Fullstack boundaries

- Keep frontend presentation/state, backend business rules, persistence, and client/API communication clearly separated.
- Define API contracts and integration states explicitly.
- If the frontend depends on backend work that does not yet exist, mark the exact integration point with a clear `TODO(BE)` comment and record the missing endpoint/contract in project documentation.
- Never make mock data or a placeholder appear to be a completed live integration.
- Backend architecture should be appropriate to the chosen framework and project scale; do not force a particular framework or ORM.

## Context hygiene

- Treat each project as isolated. Do not assume another project's stack, decisions, requirements, or progress.
- Distinguish discovered facts from assumptions and recommendations.
- Update `PROJECT-CONTEXT.md` and `todo-list.md` when work changes project facts or progress materially.
