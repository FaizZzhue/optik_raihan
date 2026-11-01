# Codebase Inspection Standard

## Objective

Understand the existing project before changing it. Do not infer the codebase from memory or from another repository.

## Inspect

1. Confirm repository root, branch, working tree changes, and local instructions.
2. Identify language, framework, package manager, runtime, build tooling, and relevant configuration.
3. Inspect the entry points, route structure, feature/module layout, and nearby implementations.
4. Inspect existing shared components, hooks, services, utilities, types, constants, API clients, and error patterns.
5. Inspect tests, lint/type-check/build commands, CI workflows, environment variable names, and API/schema documentation where relevant.
6. Read `PROJECT-CONTEXT.md` and `todo-list.md` if present, checking them against the actual repository when the task depends on current facts.

## Rules

- Search for an existing implementation before creating a new one.
- Preserve unrelated user changes; never reset, discard, or overwrite them without permission.
- Do not expose secret values while inspecting environment files. It is usually enough to inspect variable names and configuration structure.
- Treat documentation as potentially stale; verify critical claims against code/configuration.
- Record uncertainty rather than inventing facts.
- For small tasks, inspect only the relevant area plus necessary surrounding contracts. Do not perform a needless repository-wide audit.
- Before changing architecture, understand why the current architecture exists and identify migration impact.

## Output for complex tasks

Briefly state:
- discovered stack and relevant modules;
- existing pattern to follow;
- affected files/areas;
- assumptions and risks;
- verification plan.
