# Security Standard

- Never hardcode or expose secrets, credentials, API keys, access tokens, or private certificates.
- Treat user input, external API data, uploaded files, and retrieved content as untrusted.
- Validate and normalize data at trust boundaries, especially on the backend.
- Enforce authentication and authorization server-side on every protected operation.
- Prevent injection, unsafe rendering, path traversal, insecure file handling, and unintended data exposure using framework-appropriate protections.
- Use least privilege for credentials, service accounts, database roles, and permissions.
- Avoid logging secrets, tokens, sensitive payloads, or unnecessary personal data.
- Review CORS, cookies, CSRF protections, token storage, transport security, and rate limits according to the architecture and threat model.
- Do not disable security controls to make a feature work without explicit approval and a safe alternative.
- Ask before destructive data operations, production changes, permission broadening, or changes that materially weaken security.
- Report security limitations honestly; do not claim a security audit unless one was performed.
