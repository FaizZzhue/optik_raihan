# Client and API Integration Standard

## Contract first

Before connecting frontend to backend, identify or define:
- HTTP method and path;
- authentication/session requirement;
- path/query/body schema;
- response schema;
- error response contract;
- loading, empty, and failure behavior;
- ownership of the implementation and verification.

Use an existing API specification or backend code as the source of truth. Do not invent an endpoint and assume it exists.

## Frontend API boundary

- Centralize base URL/configuration and shared HTTP behavior according to the project.
- Keep request functions in a client/API/service module rather than scattering raw fetch calls across UI components.
- Type request and response data when the stack supports it.
- Handle HTTP errors, network errors, timeouts, and unauthorized responses intentionally.
- Avoid storing secrets in browser environment variables.
- Do not log tokens or sensitive payloads.

## Missing backend work

If the frontend must be built before the backend endpoint exists:
1. Define the proposed contract in project context or API documentation.
2. Add a specific comment at the integration point, such as:
   `// TODO(BE): Implement authenticated GET /api/warehouse endpoint; see PROJECT-CONTEXT.md API Contracts.`
3. Add the corresponding backend item to `todo-list.md`.
4. Use a clearly labeled development mock only if needed for UI development.
5. Keep mock and production paths unmistakably separate.
6. Do not mark the integration complete until the real endpoint is implemented and tested end-to-end or through an agreed integration check.

## Status vocabulary

Use precise states: `not designed`, `contract proposed`, `backend pending`, `frontend pending`, `implemented`, `verified`, or `blocked`. Do not use “integrated” for a mock-only flow.
