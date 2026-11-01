# Implementation Workflow

1. Confirm the plan and acceptance criteria for complex tasks.
2. Implement in the smallest coherent sequence.
3. Follow existing conventions and project-specific context.
4. Keep frontend, client/API, backend, and persistence responsibilities separate.
5. Use typed contracts and validation where applicable.
6. Add or update tests for meaningful behavior.
7. Keep documentation and `todo-list.md` in sync with actual changes.
8. Inspect the final diff for unrelated edits, dead code, missing imports, secrets, and incomplete TODOs.
9. Run the relevant verification commands.
10. Report actual results and remaining work.

Do not claim an integration is complete when only the frontend placeholder or mock exists. If work is blocked by a missing backend endpoint, document the contract, add a clear `TODO(BE)` at the integration point if appropriate, and record the backend task in `todo-list.md`.
