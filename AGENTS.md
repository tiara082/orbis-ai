# AGENTS.md — Product UI/UX & Frontend Engineering

## 1. Purpose

This file defines the development instructions for Codex and other compatible AI coding agents working in this repository.

The primary objective is to build **distinctive, polished, accessible, maintainable, and production-quality applications**.

The application must not look like a generic AI-generated template.

Prioritize:

- Strong visual identity and thoughtful design decisions.
- Excellent usability and clear information hierarchy.
- Clean, maintainable, and understandable code.
- Responsive and accessible interfaces.
- Consistency across components and screens.
- Reliable interactions and functional completeness.
- Performance and production readiness.

**Beautiful UI must also be usable, functional, and maintainable.**

---

## 2. Project Context First

Before implementing a task:

1. Read the relevant project documentation and existing code.
2. Identify the actual technology stack and installed dependencies.
3. Understand the product's purpose and target users.
4. Inspect existing components, layouts, and design tokens.
5. Identify relevant Agent Skills.
6. Understand the requested scope and expected result.

Do not assume the application is a landing page, dashboard, SaaS, or e-commerce product without evidence.

Do not impose a framework, architectural pattern, or design system that conflicts with the existing repository.

Follow the user's established visual direction.

If the user supplies screenshots, Figma designs, videos, or visual references, use them as the primary design reference.

---

## 3. Automatic Agent Skills Routing

Automatically identify and use relevant installed Agent Skills without requiring the user to mention them explicitly.

Discover supported project-level and global skills.

Load only the `SKILL.md` files relevant to the current task.

Never load all skills unnecessarily.

### 3.1 ui-ux-pro-max

Use `ui-ux-pro-max` automatically when performing:

- UI/UX design.
- Page creation and redesign.
- Layout composition.
- Visual hierarchy improvements.
- Design system creation.
- Typography and color selection.
- Responsive interface implementation.
- User experience optimization.
- Dashboard and application interface design.
- Accessibility and visual consistency reviews.

Use its guidance to make design decisions appropriate to the product.

Do not blindly copy examples or impose the same aesthetic on every project.

If the skill is unavailable, continue using established UI/UX engineering principles.

### 3.2 shadcn

Use `shadcn` automatically when the repository uses shadcn/ui or the user explicitly selects it.

Prioritize:

- Reusing existing project components.
- Following existing `components.json` configuration.
- Using the project's design tokens.
- Accessible component composition.
- Correct component states and interactions.
- Consistent styling and responsive behavior.

Do not automatically install shadcn/ui or add unnecessary components without checking the repository.

Do not use shadcn/ui for frameworks that it does not support.

Avoid retaining generic default component styling when the established product design calls for appropriate customization.

### 3.3 Global Engineering Skills

Use relevant installed engineering skills when appropriate:

- `writing-plans`: complex implementation planning.
- `executing-plans`: staged implementation.
- `test-driven-development`: behavior changes and testable logic.
- `systematic-debugging`: root-cause investigation.
- `requesting-code-review`: significant code review.
- `receiving-code-review`: validating review feedback.
- `verification-before-completion`: final verification.
- `code-simplification`: safe, targeted readability improvements, if installed.
- `karpathy-guidelines`: maintainability and avoiding unnecessary complexity, if installed.

Do not assume a skill exists without checking.

Choose the minimum useful set of skills for each task.

---

## 4. Anti-AI-Slop Design Policy

Never produce an interface that looks generic, repetitive, unfinished, or artificially decorative.

Avoid the following unless deliberately justified by the product's visual direction:

- Excessive gradients.
- Random glowing backgrounds.
- Decorative floating orbs and blobs.
- Unnecessary glassmorphism.
- Overused purple-blue SaaS aesthetics.
- Oversized rounded cards everywhere.
- Generic three-column layouts repeated across sections.
- Excessive shadows and borders.
- Random icon decorations.
- Identical spacing and composition for every section.
- Unnecessary animations.
- Generic marketing headlines and filler text.
- Visually impressive components with weak usability.

Do not remove all gradients, shadows, rounded corners, or animation by default.

Use them intentionally when they reinforce the established design.

Prefer distinctive composition, excellent typography, appropriate spacing, and a coherent visual language over decoration.

**Distinctive design comes from thoughtful decisions, not visual effects alone.**

---

## 5. Visual Design Quality

Every major interface should have a clear visual direction.

Consider:

- Product identity.
- Target audience.
- Content density.
- Primary user actions.
- Layout rhythm.
- Typography hierarchy.
- Color relationships.
- Alignment and whitespace.
- Component proportions.
- Interaction feedback.
- Context-appropriate visual references.

Create a coherent design system instead of styling each component independently.

Do not automatically choose a dark theme or futuristic aesthetic.

Choose the visual treatment that best supports the product and the user's direction.

When no visual direction exists, propose a coherent approach based on the product requirements rather than assembling random popular design trends.

---

## 6. Design System and Components

Prefer consistent, reusable design foundations.

Use centralized tokens for:

- Colors.
- Typography.
- Spacing.
- Border radius.
- Shadows.
- Motion.
- Breakpoints.
- Surface and text states.

Reuse existing design tokens before creating new ones.

Components should have clear responsibilities and predictable behavior.

Avoid:

- Duplicated components.
- Excessive prop combinations.
- Deeply nested presentation logic.
- Unnecessary wrappers.
- Premature abstraction.
- Component variants that are never used.

Build reusable components when repetition or maintenance needs justify them.

Do not overengineer a simple interface.

---

## 7. Layout and Responsiveness

Design for actual user environments.

Support relevant desktop, tablet, and mobile layouts.

Do not merely shrink desktop layouts onto mobile screens.

Review:

- Content hierarchy.
- Navigation behavior.
- Touch target sizes.
- Text readability.
- Horizontal overflow.
- Form usability.
- Dialog and drawer behavior.
- Sticky and fixed element placement.
- Keyboard and on-screen keyboard behavior.
- Image and media sizing.

Use responsive layouts appropriate to each component.

Prefer stable, maintainable CSS over unnecessary JavaScript measurements.

---

## 8. Interaction and Motion

Animations must improve usability, reinforce hierarchy, or communicate state.

Good uses include:

- Page transitions.
- Modal and drawer transitions.
- Hover and focus feedback.
- Loading feedback.
- Content reveals.
- Meaningful micro-interactions.

Avoid:

- Unnecessary bounce effects.
- Large layout shifts.
- Constant decorative movement.
- Excessive parallax.
- Animation that delays common actions.
- Heavy motion that competes with content.

Respect `prefers-reduced-motion`.

Use the animation tools already appropriate to the project.

Do not introduce GSAP, Three.js, Motion, or another library merely for decoration.

If advanced animation is part of the approved design, implement it carefully and optimize performance.

---

## 9. UX and Functional Completeness

Every interactive element must have a meaningful function.

Do not create buttons, navigation items, filters, or controls that look functional but do nothing.

Handle relevant interface states:

- Default.
- Hover.
- Focus.
- Active.
- Disabled.
- Loading.
- Empty.
- Success.
- Error.

Forms must provide understandable validation and feedback.

Navigation should be predictable.

Avoid unnecessary user steps.

Use realistic content when available. Do not invent business facts, metrics, testimonials, or product capabilities.

Clearly identify placeholders.

Never sacrifice usability to achieve a more decorative appearance.

---

## 10. Accessibility

Apply accessibility principles throughout implementation.

Prioritize:

- Semantic HTML.
- Keyboard navigation.
- Visible focus indicators.
- Appropriate color contrast.
- Accessible labels.
- Clear form errors.
- Screen-reader compatibility.
- Reduced-motion support.
- Sufficient touch targets.
- Appropriate heading hierarchy.

Use accessible component primitives where suitable.

Do not rely exclusively on color to communicate important information.

Aim for WCAG 2.2 AA where applicable.

Do not claim accessibility compliance without appropriate verification.

---

## 11. Frontend Engineering Standards

Follow the repository's actual framework, language, and package manager.

Prioritize:

- Readable code.
- Clear naming.
- Small, cohesive functions.
- Predictable state management.
- Reusable components.
- Type safety where supported.
- Explicit loading and error handling.
- Minimal unnecessary dependencies.
- Consistent file organization.

Do not change frameworks or replace existing libraries without authorization.

Do not introduce additional state management libraries when the existing approach is sufficient.

Do not hide errors or bypass validation just to make the application appear functional.

---

## 12. Performance and Production Quality

Consider performance during implementation, not only afterward.

Focus on:

- Avoiding unnecessary renders.
- Appropriate lazy loading.
- Bundle size.
- Image optimization.
- Font loading.
- Animation performance.
- Network request efficiency.
- Layout stability.
- Memory and event listener cleanup.

Do not optimize prematurely without understanding the bottleneck.

Use measurements or profiling when making significant performance claims.

Avoid performance regressions caused by decorative interface effects.

---

## 13. Safe Refactoring

Refactoring should improve clarity, maintainability, and consistency while preserving behavior.

Before refactoring:

1. Inspect the existing implementation.
2. Understand dependencies and behavior.
3. Identify relevant tests.
4. Define the scope of change.

During refactoring:

- Keep changes small and reviewable.
- Prefer readable solutions over shorter code.
- Preserve public contracts and user-facing behavior.
- Avoid unrelated changes.
- Do not remove necessary validation or security controls.

After refactoring:

- Run relevant regression tests.
- Check for behavior changes.
- Review the final diff.

Never perform a broad refactor merely because a different implementation style seems preferable.

---

## 14. Testing and Verification

Use verification appropriate to the task.

For UI work, check:

- Layout correctness.
- Responsive behavior.
- Functional interactions.
- Keyboard navigation.
- Form validation.
- Loading and error states.
- Browser console errors.
- Accessibility concerns.
- Visual consistency.

When browser testing tools are available, inspect the actual rendered application.

Compare implementation with supplied visual references where relevant.

For behavior changes, run appropriate unit, integration, or end-to-end tests.

Do not claim visual verification when the interface was not actually rendered or inspected.

Do not claim tests passed unless they were executed successfully.

---

## 15. Development Workflow

For non-trivial work:

1. Understand the task and project constraints.
2. Inspect relevant existing code and designs.
3. Select appropriate Agent Skills.
4. Identify implementation risks.
5. Prepare a concise plan.
6. Implement incrementally.
7. Verify functionality.
8. Review visual quality.
9. Review maintainability and code changes.
10. Report results and remaining limitations.

For simple changes, use a proportionate workflow.

Do not turn small tasks into unnecessary large-scale redesigns.

If a project already has an approved design, prioritize faithful implementation over creative reinterpretation.

---

## 16. Safety and Change Control

Do not:

- Delete user work without authorization.
- Rewrite unrelated modules.
- Change architecture without justification.
- Install packages unnecessarily.
- Expose or commit secrets.
- Modify production infrastructure without approval.
- Deploy automatically without authorization.
- Claim untested work is production-ready.

Preserve existing project conventions and decisions.

If there is a conflict between a skill recommendation and project requirements, project requirements take precedence unless higher-priority safety instructions apply.

---

## 17. Reporting

After implementation, report concisely:

### Changes
What was implemented or modified.

### Design Decisions
Relevant UI/UX decisions and their rationale.

### Skills Used
Only skills actually consulted or executed.

### Verification
Commands, tests, visual checks, and their observed results.

### Remaining Issues
Known limitations, unverified areas, and risks.

Do not claim that a tool, skill, test, or review was used if it was not.

---

## 18. Core Principles

- Design with intention.
- Avoid generic AI-generated aesthetics.
- Prioritize user experience.
- Respect established product identity.
- Make interfaces beautiful and functional.
- Keep components consistent.
- Prefer clarity over cleverness.
- Prefer maintainability over unnecessary abstraction.
- Use Agent Skills selectively.
- Verify before claiming completion.
- Avoid overengineering.
- Build for real users and real production conditions.

**The goal is not simply to generate attractive UI. The goal is to create a distinctive, coherent, usable, and production-quality product.**