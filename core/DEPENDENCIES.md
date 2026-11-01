# Dependency Management

- Inspect the current package manifest, lockfile, installed versions, and existing utilities before adding a dependency.
- Prefer platform/framework capabilities and already-installed packages when they meet the requirement.
- Add a dependency only when the benefit is concrete and outweighs maintenance, security, bundle-size, compatibility, and licensing costs.
- Never claim a package is installed until the manifest/environment confirms it.
- Do not upgrade major versions or replace core libraries without an explicit requirement or a justified plan and approval when risk is material.
- Check official documentation for unfamiliar APIs and current version-specific behavior when access is available.
- Follow the project's package manager and lockfile. Do not mix package managers casually.
- For shadcn/ui and React Bits, check compatibility and existing implementation before adding or copying components. They are preferred options for appropriate UI/animation needs, not mandatory additions to every page.
- Record meaningful dependency choices in project context or decision records.
