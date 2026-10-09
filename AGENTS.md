# WordGana product and UX standards

Apply these standards to every user-facing change in this repository. Treat them as acceptance criteria, not optional polish. When a new platform or interaction pattern is introduced, check the current official guidance before implementing it and update this document when the guidance materially changes.

## Product principles

- Design mobile first while keeping the web experience complete. Use platform-neutral wording such as “device” instead of naming iPhone, Android, Safari, or another platform unless the instruction is genuinely platform-specific.
- Keep the primary practice flow focused. Put infrequent preferences in Settings and keep the home screen for study choices, progress, and the main action.
- Prefer familiar controls and conventional placement. Use text when an icon may be ambiguous. Icon-only controls must use a consistent vector icon and a localized accessible name; do not use emoji as functional UI icons.
- Match navigation semantics: use a Back chevron to return through the app hierarchy and reserve Close (×) for dismissing a modal or abandoning a focused flow.
- Preserve user progress and preferences across visual or localization changes. Never include the display language in learning-progress identifiers.
- Support every shipped language across the entire interface and study corpus. English is the source fallback. New content must pass the translation-coverage test.

## Interaction and accessibility

- Aim for at least 48 × 48 CSS pixels for interactive targets so the same control satisfies common Apple and Android guidance. Never go below WCAG 2.2 AA's 24 × 24 CSS pixel minimum.
- Every custom control needs visible hover, pressed, disabled, and keyboard-focus states where applicable. Keep the existing high-contrast `:focus-visible` outline or improve it; never suppress focus without an equivalent replacement.
- Give icon-only buttons a localized accessible name. Mark decorative icon contents with `aria-hidden="true"` so assistive technology announces the action once.
- Use semantic HTML controls before custom interaction code. Ensure keyboard operation, logical focus order, screen-reader status announcements, Dynamic Type/text zoom resilience, safe-area support, and reduced-motion behavior.
- Do not rely on color alone to communicate selection, success, errors, or disabled state. Maintain readable contrast in light and dark themes.

## Visual consistency

- Reuse the existing spacing, radius, typography, color, and surface tokens in `src/styles.css`.
- Use a restrained hierarchy: one prominent action per screen; secondary actions should remain visually quieter.
- Use SVG or the platform's standard symbol system for functional icons. Keep stroke weight, optical size, alignment, and interaction states consistent within a toolbar.
- Validate narrow mobile widths and longer German/French labels before considering a UI change complete.

## Required validation

- Run `npm test`, `npm run build`, and `npm run ios:sync` for user-facing changes.
- Check light and dark appearance, keyboard focus, touch target sizes, screen-reader names, narrow layouts, and all six supported languages.
- Add a focused automated test when a durable invariant can regress, such as localization coverage or persisted settings. Avoid tests that only duplicate implementation details.

## Primary references

- [Apple Human Interface Guidelines — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons): familiar symbols, clear purpose, interaction states, and a minimum 44 × 44 pt hit region.
- [Apple Human Interface Guidelines — Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars): standard Back controls retrace a hierarchy; standard Close controls dismiss modal views.
- [Apple Human Interface Guidelines — Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility): adaptable, perceivable, and operable interfaces across input methods.
- [Android Developers — Accessibility API defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults): 48 dp touch targets and textual descriptions for actionable icons.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): Level AA is the minimum web accessibility target, including focus visibility, semantics, status messages, and target sizing.
- [WCAG 2.2 — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): at least 24 × 24 CSS pixels or sufficient spacing; larger targets remain the preferred practice.
- [WCAG 2.2 — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html): focus indicators must be visible and sufficiently contrasted.
