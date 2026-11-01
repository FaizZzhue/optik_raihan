# Backend Standard

Adapt layer names and folder structure to the chosen backend framework. Do not force a specific language, framework, ORM, or architecture.

## Responsibilities

Separate these concerns when the project's complexity benefits from it:

- **Routes:** map HTTP method/path to a handler and middleware.
- **Controller/handler:** parse transport input, invoke application logic, and translate outcomes into HTTP responses.
- **Service/use case:** implement business rules and coordinate work.
- **Repository/data access:** isolate persistence queries when this boundary improves clarity/testability; simple projects may use a simpler approach.
- **Schema/DTO/types:** define and validate request/response contracts.
- **Middleware/policies:** authentication, authorization, rate limiting, request IDs, and shared concerns.
- **Persistence:** schema, migrations, constraints, transactions, and indexes.
- **Configuration:** validated environment/configuration, without hardcoded secrets.

Do not put all business logic into route handlers or controllers. Do not create layers that merely forward calls without adding responsibility.

## API design

- Use clear resource/action naming consistent with the existing API.
- Validate request body, query, path parameters, and relevant headers at the server boundary.
- Define response shapes and status codes consistently.
- Use pagination/filtering for potentially large collections.
- Avoid leaking internal stack traces, secrets, or database details to clients.
- Normalize errors into a predictable response contract.
- Consider idempotency, transactions, concurrency, and duplicate submissions where the use case requires them.
- Version or migrate contracts deliberately when breaking changes are needed.

## Authentication and authorization

- Authentication establishes identity; authorization checks what that identity can do.
- Protect each private endpoint server-side. Hiding frontend UI is not authorization.
- Verify session/token signature, expiry, issuer/audience as applicable, and secure storage/transport according to the auth design.
- Enforce ownership/tenant boundaries in data queries and mutation paths.
- Never trust user IDs, roles, prices, permissions, or ownership supplied only by the client.
- Do not invent an authentication scheme; inspect project requirements and existing provider first.

## Database and persistence

- Use migrations or the framework's established schema-change process.
- Review destructive changes and obtain permission for high-risk data changes.
- Apply appropriate constraints, indexes, transactions, and referential integrity.
- Avoid N+1 queries and unbounded result sets where relevant.
- Do not expose ORM/database objects indiscriminately as public API contracts.

## Operations

- Configure CORS with explicit allowed origins appropriate to each environment; do not use permissive production settings without justification.
- Apply rate limiting to sensitive or abuse-prone endpoints when appropriate.
- Use structured, useful logs without credentials, tokens, or unnecessary personal data.
- Validate required environment variables at startup where practical.
- Use graceful error handling and appropriate timeouts for external dependencies.
- Add health/readiness checks when the deployment environment needs them.

## Testing

Cover business rules, validation, authorization boundaries, error cases, and persistence behavior at the appropriate level. Never treat a mocked service test as proof that the live deployment or external integration works.
