# AI Agent Instructions

## Mission

Produce correct, maintainable, secure, minimal, and verifiable changes. Avoid AI slop: unnecessary abstractions, speculative features, duplicate files, fake integrations, and unsupported completion claims.

## Required startup sequence

1. Identify the repository root and the active project.
2. Read applicable repository instructions and the project's `PROJECT-CONTEXT.md` and `todo-list.md` if they exist.
3. Inspect the relevant source files, package/config files, existing patterns, tests, API contracts, and Git status before editing.
4. Classify the task as small/routine, complex, or high-risk.
5. For complex tasks, state a concise plan before implementation. For routine low-risk tasks, proceed directly after sufficient inspection.
6. Read only the PADS documents relevant to the task. Do not load every document unnecessarily.

## Work cycle

**Analyze → Plan when needed → Implement → Verify → Handoff.**

- Make the smallest coherent change that meets the requirement.
- Follow the actual stack and architecture discovered in the repository.
- Keep data/constants, types, functions/business logic, components, and pages separated by responsibility where that improves clarity.
- Keep pages thin: compose components and pass data/props; do not turn a page into a dumping ground for business logic.
- Do not add dependencies, architecture layers, files, or features without a concrete reason.
- Preserve unrelated changes and inspect Git status before destructive operations.
- Ask before destructive, production-impacting, security-sensitive, or architecture-wide changes outside the task's clear authorization.
- If a requirement is materially ambiguous, ask a focused question. For low-risk ambiguity, state a reasonable assumption and proceed.

## Relevant documents

- Codebase inspection: `core/CODEBASE.md`
- Architecture: `core/ARCHITECTURE.md`
- Modularization: `core/MODULARIZATION.md`
- Coding rules: `core/CODING-STANDARDS.md`
- Engineering trade-offs: `core/ENGINEERING-PRINCIPLES.md`
- Dependency decisions: `core/DEPENDENCIES.md`
- Analysis and planning: `workflows/ANALYZE-AND-PLAN.md`
- Implementation: `workflows/IMPLEMENTATION.md`
- Debugging: `workflows/DEBUGGING.md`
- Verification: `workflows/TESTING-AND-VERIFICATION.md` and `standards/QUALITY-GATES.md`
- Frontend: `standards/FRONTEND.md`
- Backend: `standards/BACKEND.md`
- Client/API integration: `standards/CLIENT-API-INTEGRATION.md`
- UI/UX: `standards/UI-UX.md`
- Security: `standards/SECURITY.md`
- Performance: `standards/PERFORMANCE.md`
- Documentation and progress: `standards/DOCUMENTATION.md`, `workflows/HANDOFF.md`

## Instruction priority

1. Applicable platform/safety rules.
2. The user's explicit current-task instruction.
3. Project requirements and accepted project decisions.
4. This PADS standard.
5. Existing codebase conventions, if consistent with higher-priority requirements.
6. Agent assumptions and recommendations.

If instructions of similar priority conflict materially, explain the conflict and ask for clarification. Do not silently choose a high-impact interpretation.

## Project context and progress

- Treat each repository as a separate project context.
- Never import assumptions from another project.
- `PROJECT-CONTEXT.md` describes this project's actual stack, architecture, features, constraints, and integration state. Update it when material facts change.
- `todo-list.md` records actionable work, status, priority, dependencies, and verification. Keep it accurate; do not mark work complete without evidence.
- Do not overwrite user-authored context or progress notes without preserving their meaning.

## Required handoff

Report:
- what changed and why;
- files/modules affected;
- checks actually run and their real outcomes;
- known limitations, assumptions, and unverified areas;
- TODOs or follow-up work.

Never claim that a build, test, endpoint, integration, or deployment succeeded unless it was actually checked.
