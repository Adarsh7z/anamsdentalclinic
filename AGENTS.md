# Dr. Anam's Dental Clinic — Website Design & Development Rules

These are persistent project-level rules for future changes to this website. Apply them whenever creating, editing, reviewing, or extending the site, unless the user's current task explicitly overrides a rule.

## 1. Design identity is the default

The existing live implementation is the source of truth for the website's established visual identity. New pages, sections, components, interactions, and features must feel as though they belong to the same carefully art-directed website.

Preserve and extend the established visual language:

- Premium, warm, refined, minimal, clinically professional, and welcoming.
- A deliberate balance of warm ivory content surfaces and deep espresso sections.
- Muted bronze accents used with restraint.
- Elegant editorial-style display typography paired with clear, readable supporting typography.
- Purposeful whitespace, careful alignment, understated borders, restrained shadows, and consistent iconography.
- Clear hierarchy and accessible controls rather than unnecessary decoration.

Do not make the site look like a generic dental template, dashboard, or unrelated design system.

## 2. Established design tokens

Use these as the project's documented baseline. First inspect the current CSS variables, theme configuration, and rendered site. If the live implementation has an intentional, newer value for a token, preserve the current implementation and update this document only when the user approves that change.

```css
:root {
  --ivory: #F3EFEC;
  --ivory-line: #E7E3E0;
  --ink: #2E2A27;
  --ink-soft: #4A4541;
  --bronze: #A18667;
  --bronze-hover: #8E7557;
  --on-bronze: #FBF6EF;
  --espresso: #11100C;
  --espresso-warm: #1E1810;
}
```

Use the palette contextually:

- Ivory for suitable light page and section backgrounds.
- Ink for headings and strong text on light surfaces.
- Soft ink for supporting copy.
- Bronze for primary actions and restrained accents.
- Ivory text on bronze controls.
- Espresso and warm espresso for intentional dark sections, overlays, and the footer.
- Ivory-line for subtle dividers and borders.

Do not apply a token mechanically where it would harm contrast or the visual hierarchy. Do not turn every section the same colour. Preserve intentional dark/light contrast.

Avoid pure-white backgrounds where the established ivory surface is intended, bright gold or unrelated accent colours, gradients on buttons, excessive shadows, and decorative clutter.

## 3. Typography

The established type pairing is:

- **Cormorant Garamond** for display headings, section titles, and appropriate editorial/card titles.
- **DM Sans** for body copy, navigation, buttons, labels, forms, and supporting information.

Use the actual font files, imports, weights, and CSS configuration already present in the project where possible. Do not introduce duplicate font imports or unnecessary font weights. Preserve a clear type hierarchy, readable sizes, appropriate line height, and restrained letter spacing.

Do not introduce an unrelated font family for a new component unless the user specifically requests it.

## 4. Consistency without repetition

Every addition must match the site's design language, but not every page or section should use the same layout.

- Design each page according to its content and purpose.
- Reuse established spacing, typography, colour, button, card, icon, and interaction patterns.
- Extend existing components and tokens before creating new ones.
- New components should look native to the website, not pasted in from another template.
- Do not copy the homepage hero or homepage section layout onto every internal page.
- Use cards only when they improve information organisation; do not put every paragraph inside a card.
- Maintain the existing content hierarchy and appropriate whitespace.

## 5. Future pages, sections, and components

Whenever adding a new page, section, card, menu item, CTA, form, gallery, or interactive element:

1. Inspect the closest existing equivalent in the project.
2. Identify the relevant design tokens, components, typography, spacing, responsive rules, and interactions.
3. Reuse existing components and styles where appropriate.
4. Match the current website's visual language and quality.
5. Preserve the site's existing navigation and information architecture unless the user asks to change them.
6. Ensure the new element works at desktop, tablet, and mobile sizes.
7. Verify the rendered result against neighbouring sections and the rest of the site.

Do not invent clinic details, clinical claims, qualifications, testimonials, service descriptions, contact details, or other factual content. Use only project content or information explicitly supplied by the user.

## 6. Scope control — make the smallest safe change

For every task, treat the user's current instructions as the authoritative specification for that task. The task-specific page, component, device, and behaviour restrictions take priority over these general rules.

Before editing:

- Inspect the relevant component and its dependencies.
- Identify the exact files and selectors involved.
- Check whether styles, scripts, or components are shared across pages.
- Review the current working-tree diff or recent changes where available.
- Determine whether a requested change could affect other sections, routes, or breakpoints.

Then make the smallest reliable change that achieves the requested outcome.

Do not perform unrelated refactoring, cleanups, redesigns, formatting changes, dependency upgrades, or framework migrations. Do not rewrite an entire page or component to make a small change.

If a shared component or stylesheet must change, inspect every relevant use and test for regressions. Prefer scoped selectors, component-level styles, and existing design tokens over broad global selectors.

Never modify unrelated pages or components merely because they share a stylesheet. Never remove existing functionality to simplify an implementation.

If the requested scope cannot be isolated safely, explain the dependency and propose the smallest safe approach before making a broader change.

## 7. Preserve content, routes, SEO, and functionality

Unless the user explicitly requests otherwise, preserve:

- Existing page URLs, routes, filenames, and routing behaviour.
- Navigation links, footer links, anchors, and hash fragments.
- Clinic name, doctor name, address, telephone numbers, and email addresses.
- Existing page copy, service names, descriptions, qualifications, and credentials.
- `tel:` and `mailto:` destinations.
- Google Maps links and embeds.
- Forms, their validation, and their existing integrations.
- CTA labels, destinations, and click behaviour.
- Existing menu, Back button, floating controls, galleries, and interactive behaviour.
- Page-specific title, meta description, canonical, Open Graph data, and structured data.

Do not fabricate working behaviour, form submissions, links, or integrations. If an existing feature is already broken or its behaviour is unclear, report that rather than silently replacing it.

## 8. Interaction and animation standards

Interactions should feel restrained, smooth, responsive, and consistent with the premium aesthetic.

- Prefer subtle transitions and clear feedback over conspicuous effects.
- Preserve existing interaction behaviour unless the task explicitly changes it.
- Do not introduce scroll hijacking, unnecessary pinning, forced snapping, or scroll-triggered movement without an explicit request.
- Do not add animation libraries for a small effect when existing CSS or project utilities are sufficient.
- Avoid layout thrashing and expensive high-frequency event handlers.
- Respect `prefers-reduced-motion` while keeping content and functionality accessible.
- Ensure menus, accordions, links, buttons, and controls work with keyboard and touch input.
- Do not allow invisible controls to receive focus or pointer input.

For any animation change, inspect existing timelines, triggers, transforms, stacking contexts, and responsive behaviour before editing. Do not break unrelated animations.

## 9. Responsive behaviour

Follow the existing responsive breakpoints and component patterns. Do not assume desktop styles automatically work on mobile.

- A mobile-only request must not change tablet or desktop layouts.
- A desktop-only request must not change mobile or tablet layouts.
- A page-specific request must not inadvertently change other pages.
- Preserve readable typography, usable touch targets, sensible image crops, and balanced spacing.
- Prevent horizontal overflow, overlapping controls, clipped content, and awkward section gaps.
- Use the viewport sizes specified by the user. If none are specified, test representative small and large mobile, tablet, and desktop sizes relevant to the change.

## 10. Accessibility, performance, and maintainability

Maintain semantic HTML, logical heading order, keyboard access, visible focus states, accessible names, appropriate contrast, descriptive image alt text, and correctly labelled form controls.

Preserve the existing framework and build setup. Avoid unnecessary packages, duplicated components, duplicate CSS rules, and redundant JavaScript. Optimise images and fonts using existing project conventions. Avoid layout shifts and performance regressions.

Write maintainable code that fits the project's existing conventions. Do not add dependencies or modify deployment configuration unless necessary for the requested task.

## 11. Required workflow for changes

For small, isolated tasks, inspect the relevant implementation and proceed directly with a targeted change.

For tasks involving shared styles, animation systems, routing, multiple pages, or uncertain dependencies:

1. Inspect first and identify the likely cause or implementation path.
2. State the intended files and scope of changes.
3. Make a concise implementation plan before editing.
4. Implement only the agreed scope.
5. Test the actual local site when the environment supports it.
6. Review the final diff for unrelated changes.

Do not claim that a page, viewport, interaction, or browser was tested unless it was actually tested.

## 12. Completion report

At the end of each task, provide a short report containing:

- What changed.
- Which files were modified.
- Which pages, components, and breakpoints were affected.
- What existing content and functionality were preserved.
- What tests were actually performed and their results.
- Any known limitations, unresolved issues, or possible regressions.

Keep the report concise for small tasks and more detailed for complex changes.

## 13. Priority rule

The user's current task-specific instructions always govern the requested change. These project rules establish the default design and engineering standards; they do not prohibit an explicitly requested redesign or intentional departure from the current aesthetic.

When a task is ambiguous, preserve the current website and ask only for clarification that is essential to avoid a material mistake. Never interpret a request for a small update as permission to redesign unrelated parts of the site.

**Core principle: Extend the existing design identity; do not reinvent it. Preserve what works, change only what is requested, and verify the result.**
