# Documentation and Context Standard

## Project files

- `PROJECT-CONTEXT.md` records actual project facts: stack, architecture, requirements, decisions, integration contracts, and current known limitations.
- `todo-list.md` records actionable work, status, priority, dependencies, verification, and next actions.
- Keep both concise, current, and specific. They are operational context, not a transcript of every session.

## Rules

- Distinguish confirmed facts, proposals, assumptions, and unknowns.
- Update context when the stack, architecture, feature behavior, API contract, or integration status materially changes.
- Update tasks when work starts, is blocked, verified, or completed.
- Do not mark a task complete solely because code was generated.
- Do not copy entire source files into Markdown; link/name modules and explain their responsibilities.
- Avoid duplicating the same rules across documents. Link to the authoritative file instead.
- Keep examples clearly labeled as examples and not project facts.
- Never copy context from another project unless the user explicitly requests reuse and confirms relevance.
