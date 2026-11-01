## Design Context and Decision Rules

## Design Decision Traceability

- Distinguish explicit client requirements, user-provided design preferences, existing project conventions, and assistant recommendations.
- Do not present an assistant recommendation as an approved client or user decision.
- When meaningful design trade-offs exist, explain the relevant options and recommend an approach based on the project context.
- Do not ask for approval for every minor implementation detail. Make reasonable decisions within established requirements and constraints.
- Seek clarification or approval when an unresolved conflict materially affects the design direction, scope, or expected outcome.
- For substantial design changes, record the relevant decision, rationale, and approved reference in the appropriate project documentation.
- Keep documentation proportional to project complexity. Do not create unnecessary files or duplicate existing rules.
- When continuing work, consult existing design decisions before proposing a conflicting direction.

### 1. Core Principle

Design decisions must follow the project's context, user intent, approved requirements, and existing implementation.

- Do not impose a default AI-generated visual style on every project.
- Do not assume that modern, premium, minimalist, or visually complex designs are always better.
- Prioritize usability, visual consistency, accessibility, maintainability, and project-specific requirements.
- Treat design as a problem-solving process, not merely a visual styling exercise.
- Apply the appropriate design mode before proposing or implementing UI/UX changes.

### 2. Design Modes

Determine the applicable design mode before implementing UI/UX changes.

#### A. Client Project Mode

Use this mode when working on a project for a client, organization, company, or external stakeholder.

**Priority:** Approved client requirements and project objectives.

Rules:

- Follow the client's brief, brand guidelines, colors, typography, layout requirements, assets, and approved design references.
- Consider the user's design ideas as additional input when developing or evaluating the proposed solution.
- Compare design ideas against client requirements, usability, accessibility, technical feasibility, and visual consistency.
- When useful, present alternative approaches with clear benefits and trade-offs.
- Do not silently override approved client requirements or change the established visual identity.
- If the user's proposed design conflicts with the client's requirements, explain the conflict and recommend an appropriate solution.
- Seek clarification or approval before making material changes that conflict with approved requirements.
- For unspecified design details, make reasonable decisions based on the client's brand, target audience, project goals, and existing constraints.
- Do not introduce unnecessary visual complexity, dependencies, or effects without a clear benefit.

Client requirements do not override essential accessibility, security, or technical correctness. When a requirement introduces a significant problem, explain the issue and propose a suitable alternative.

#### B. Learning Project Mode

Use this mode for personal projects, educational exercises, experiments, and projects primarily intended for learning.

**Priority:** The user's preferences, learning objectives, and explicitly requested design direction.

Rules:

- Follow the user's requested colors, typography, layout, visual style, components, and interaction patterns.
- Treat the user's explicit design preferences as the primary direction for the project.
- Allow experimentation when requested, including alternative layouts, animations, visual effects, and component approaches.
- Offer alternatives only when they provide meaningful value or help the user understand relevant trade-offs.
- Explain notable usability, accessibility, performance, or maintainability concerns without unnecessarily overriding the user's preferences.
- Avoid imposing generic design trends or the assistant's preferred aesthetic.
- Keep the implementation aligned with the project's learning objectives and technical scope.
- Avoid unnecessary abstractions, dependencies, and visual complexity that do not support the learning goal.

#### C. Existing Project Mode

Use this mode when continuing, maintaining, completing, or improving a project that already has an established implementation.

**Priority:** Preserve existing functionality, visual identity, design patterns, and approved requirements.

Rules:

- Inspect the relevant pages, components, styles, design tokens, assets, and interactions before making changes.
- Identify incomplete features, bugs, visual inconsistencies, usability issues, responsive problems, and explicitly requested improvements.
- Preserve functioning layouts, colors, typography, spacing, navigation, components, and interaction patterns by default.
- Reuse existing components, styles, assets, and design tokens whenever appropriate.
- Fix identified problems using the smallest sufficient change.
- Do not redesign completed pages or unrelated components merely to make them appear more modern.
- Do not replace functioning components, change global design tokens, introduce a competing design system, or refactor unrelated UI without justification.
- Preserve existing functionality unless a change is explicitly required.
- When an existing design has a genuine usability or accessibility problem, explain the issue and scope the fix to the affected area whenever possible.
- When a broader redesign is necessary, explain why and obtain the appropriate direction or approval before expanding the scope.
- Verify that the changes do not introduce visual inconsistencies or regressions in existing functionality.

The objective is to complete and improve the existing project, not to restart its design without justification.

### 3. Design Reference and Requirement Priority

When multiple sources influence design decisions, apply the following principles:

1. Explicit, approved project requirements and applicable client constraints.
2. Existing project conventions and approved design references when continuation is required.
3. The user's explicit design direction and preferences within the applicable project context.
4. The applicable project design system and established component patterns.
5. General UI/UX best practices and the assistant's recommendations.

This ordering is contextual rather than absolute. Explicit redesign requests may authorize changes to existing conventions, and higher-priority requirements must be reconciled when they conflict.

- Do not assume that a screenshot or reference must be copied exactly unless requested.
- Identify which reference elements are mandatory and which are open to interpretation.
- When references conflict with one another, determine which is authoritative before making significant changes.
- Do not invent brand rules, approved decisions, or design constraints that have not been established.
- If a material ambiguity cannot be resolved from available context, ask a focused clarification.

### 4. Design Change Scope

Classify proposed changes before implementation:

- **Required Changes:** Explicitly requested features, fixes, and improvements.
- **Necessary Supporting Changes:** Changes required to implement the requested work correctly.
- **Optional Improvements:** Enhancements that may be beneficial but are not necessary to complete the task.

Rules:

- Implement required changes and necessary supporting changes within the agreed scope.
- Do not silently expand the task to include unrelated optional improvements.
- Suggest optional improvements separately when they provide meaningful value.
- Avoid unrelated refactoring or broad visual changes when a targeted fix is sufficient.
- For changes affecting shared components or global design tokens, evaluate their impact on dependent pages before implementation.
- If a requested change could significantly affect existing behavior or visual consistency, explain the impact before proceeding when approval is needed.

### 5. Anti-AI-Slop Decision Rules

Apply these rules across all design modes.

- Do not default to generic SaaS layouts, oversized hero sections, repetitive cards, excessive gradients, unnecessary glassmorphism, decorative blur, excessive shadows, or meaningless animations.
- Do not add visual effects simply because they are popular in AI-generated interfaces.
- Do not use arbitrary colors, typography, spacing, radius values, or icon styles when established design rules exist.
- Do not prioritize visual novelty over information hierarchy, readability, accessibility, performance, or usability.
- Select layouts and components according to the actual content, user workflow, product identity, target audience, and project requirements.
- Reuse established visual patterns where appropriate while allowing purposeful variation when content or interaction requires it.
- Use decorative effects only when they have a clear purpose, fit the project's visual direction, and do not introduce avoidable usability or performance problems.
- Do not add components, sections, illustrations, or animations that do not serve a defined requirement or user benefit.
- Avoid generic placeholder content and arbitrary dashboard metrics when realistic project data or requirements are available.
- Prefer purposeful, context-specific design decisions over visual complexity for its own sake.

These rules do not prohibit particular visual styles. Gradients, glassmorphism, animations, cards, and other effects are acceptable when they are intentional, appropriate to the project, and implemented well.

### 6. Design Verification

After implementing UI/UX changes:

- Compare the result against the applicable project requirements, design references, and established design system.
- Check relevant viewport sizes, layout consistency, interaction states, and accessibility.
- Verify that existing functionality remains intact.
- Review whether the implemented changes solve the original problem without introducing unnecessary visual complexity.
- Inspect the rendered interface when the available tools permit.
- Run relevant automated checks when available and appropriate.
- Report what changed, what was preserved, and why significant design decisions were made.
- Identify deviations from approved requirements and explain their reasons.
- Clearly state which checks were performed and which remain unverified.
- Never claim visual inspection, functional testing, or verification that was not actually performed.

### 7. Completion Criteria

A UI/UX task is complete when:

- The requested requirements and agreed scope are satisfied.
- The design follows the applicable design mode and project constraints.
- Existing design patterns and functionality are preserved where required.
- Relevant usability, responsive, accessibility, and interaction requirements are addressed.
- Available verification has been performed and its results are reported honestly.
- Known limitations and unverified aspects are documented.

A successful result does not necessarily require a new or more elaborate design. In an existing project, a small and precise improvement that preserves the established visual identity may be the best solution.