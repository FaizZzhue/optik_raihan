# Performance Standard

- Avoid premature optimization. Identify a credible bottleneck or requirement before adding complexity.
- Prefer simple, efficient data structures and bounded queries.
- Avoid repeated network requests, unnecessary rerenders, unbounded lists, and large client bundles when relevant.
- Use pagination, caching, lazy loading, memoization, code splitting, and database indexes when justified by the framework and evidence.
- Do not add memoization or caching indiscriminately; stale data and complexity are real costs.
- For animations, prefer performant properties and respect reduced-motion preferences.
- Compare before/after behavior or measurements when performance is the task.
- Do not claim performance improvements without evidence or a clear technical basis.
