# Architecture Standard

## Principles

- Follow the project's existing architecture unless it fails a requirement or creates a demonstrated problem.
- Separate responsibilities and dependency directions. UI should not own persistence details; controllers/handlers should not become the home of all business logic.
- Prefer cohesive modules with explicit interfaces over broad, globally coupled modules.
- Keep boundaries understandable. Do not add layers without a real responsibility or testing/maintenance benefit.
- Use dependency injection or interfaces when they materially improve testability or decoupling, not automatically everywhere.
- Make data flow and error flow visible.
- Keep project-specific architectural decisions in `PROJECT-CONTEXT.md` and important trade-offs in the project's decision documentation if one exists.

## Fullstack boundary

Typical conceptual boundaries, adapted to the chosen framework:

- **Frontend/presentation:** page composition, UI components, interaction state, view formatting.
- **Client/API layer:** HTTP client, request/response mapping, API error normalization, auth token/session integration as appropriate.
- **Backend transport layer:** routes, controllers, handlers, middleware, request parsing.
- **Application/business layer:** use cases and business rules.
- **Data access layer:** repositories/queries/ORM access where complexity warrants it.
- **Persistence:** database schema, migrations, constraints, transactions.
- **Shared contracts:** API schemas/types only where sharing is safe and technically appropriate.

Do not import server-only modules, secrets, database clients, or backend internals into browser code. Do not share types by creating unsafe coupling between frontend and backend.

## Adapt to stack

Framework conventions may combine or rename these layers. Follow idiomatic patterns for the selected framework and explain meaningful deviations. Do not force a folder layout just because it appears in this document.
