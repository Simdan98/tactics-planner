---
paths:
  - "src/**/*.tsx"
  - "src/index.css"
---

# Styling Conventions

- Tailwind utility classes only — no separate `.css` files per component, no `<style>` blocks.
- Design tokens (colors, radii, spacing, typography) are defined in the `@theme` block in `src/index.css`. Never hardcode hex values or pixel sizes in components — always reference a token.
- Use `style` prop only for values computed at runtime that cannot be expressed as a static Tailwind class (e.g. dynamic pixel dimensions from JS measurements).
- Conditional classes: ternary for two variants, a keyed lookup object for three or more. Never build class strings with `+` concatenation.
- Mobile-first responsive: base styles apply to the smallest screen; use `sm:`, `lg:` etc. to override upward. Avoid `max-*` breakpoint variants.
- The app is dark-only — do not use the `dark:` variant.
- If the same group of classes appears three or more times, extract it into a shared component instead of duplicating the string.
