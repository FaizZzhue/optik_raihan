# Modularization Standard

## Goal

Each file and module should have a clear responsibility. Modularization is for comprehension and change isolation, not for maximizing file count.

## Responsibility categories

- **Constants/static data:** fixed labels, navigation definitions, static content, defaults, and configuration that is safe to expose.
- **Types/contracts:** TypeScript types, interfaces, domain models, and API schemas placed at the narrowest sensible shared scope.
- **Functions/utilities:** pure formatting, parsing, mapping, and reusable helpers.
- **Hooks/state:** reusable UI state and lifecycle logic, following the framework's rules.
- **Services/use cases:** application or business logic and orchestration.
- **Data access:** API calls, queries, repositories, and persistence-specific code.
- **Components:** reusable presentation units with clear props.
- **Pages/routes:** composition and route-level orchestration; keep thin where practical.
- **Styles/assets:** only where the project convention benefits from separate files; Tailwind classes may remain beside components.

## Rules

1. Keep data, types, functions, UI, and page composition separate when the distinction improves clarity.
2. Keep related small items together when splitting them would make navigation harder.
3. Place a module close to the feature that owns it; promote it to a shared location only when genuinely shared.
4. Avoid circular dependencies and unclear ownership.
5. Avoid catch-all files such as `misc.ts`, `helpers.ts`, or `common.ts` becoming dumping grounds. Prefer specific names such as `format-currency.ts`.
6. Avoid giant files with unrelated responsibilities.
7. Avoid one-file-per-trivial-expression over-fragmentation.
8. Export only what other modules need. Keep implementation details private by default.
9. Keep constants immutable where practical; do not put dynamic API responses or user-specific runtime data in static constants.
10. Use props/contracts to make component dependencies explicit.
11. Do not duplicate the same domain type, validation rule, or business rule across modules.
12. Respect framework conventions (for example, route files, server/client boundaries, and colocated tests).

## Example: thin React page

This is an illustrative React + TypeScript example, not a mandated stack:

```tsx
import { homeData } from "@/features/home/constants/home-data";
import { WarehouseSummary } from "@/features/home/components/WarehouseSummary";

export default function Home() {
  return (
    <main className="text-foreground">
      <WarehouseSummary data={homeData.warehouse} />
    </main>
  );
}
```

Static data:

```ts
export const homeData = {
  warehouse: { name: "Gudang Utama" },
} as const;
```

Component:

```tsx
type WarehouseSummaryProps = {
  data: { name: string };
};

export function WarehouseSummary({ data }: WarehouseSummaryProps) {
  return (
    <section className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold">{data.name}</h2>
    </section>
  );
}
```

Use this pattern when it fits. Do not extract every piece of markup into a component automatically.
