# Frontend Standard

Adapt to the project's framework and routing model.

## Responsibilities

- Pages/routes compose the screen and coordinate route-level concerns.
- Components own cohesive presentation and interaction behavior.
- Hooks/state modules encapsulate reusable stateful behavior where appropriate.
- Constants contain static, safe-to-expose content/configuration.
- Types/contracts describe UI and API data accurately.
- Client/API modules own network communication; components should not duplicate fetch logic everywhere.
- Business rules that must be enforced securely belong on the backend even if the frontend also validates for usability.

## UI behavior

- Implement loading, empty, error, disabled, and success states where relevant.
- Keep forms accessible with labels, validation feedback, and keyboard support.
- Avoid duplicating server state in unrelated local state.
- Follow server/client component boundaries and rendering rules for the chosen framework.
- Keep secrets and server-only modules out of browser bundles.
- Do not replace real API data with static mock data without making the development-only status explicit.

## Styling and components

- Prefer Tailwind CSS where compatible with the project.
- Prefer shadcn/ui for suitable components and React Bits for relevant animation/visual patterns.
- Check existing components and design tokens before introducing new UI patterns.
- Ensure responsive behavior, contrast, keyboard accessibility, reduced-motion considerations, and consistent interaction states.
