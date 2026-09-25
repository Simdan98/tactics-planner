---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# React Conventions

## Components
- Named function declarations only — no arrow function components assigned to `const`.
- One component per file; file name matches the exported component name exactly.
- Named exports everywhere — no default exports except `src/main.tsx` and `src/App.tsx`.
- Small private sub-components used only within one file may be declared below the primary export in that file.

## Props
- Always define an explicit `interface` for props — never inline the type in the function signature.
- Destructure props in the function signature; never access `props.foo` inside the body.
- Optional props use destructuring defaults, not conditional fallbacks inside the body.

## TypeScript
- Use `interface` for object shapes (props, store state); use `type` for unions, intersections, and primitive aliases.
- Always use `import type` for type-only imports — never mix value and type imports in one statement.
- No `any`. Use `unknown` at boundaries and narrow with type guards. `as` casts only when required by a third-party API, with a comment explaining why.

## Hooks
- Custom hooks live in `src/hooks/`; file and export name both start with `use`.
- One concern per hook — split hooks that manage unrelated state or side effects.
- Never write multi-line logic inline in JSX; extract named handler functions inside the hook or component.
- `useEffect` dependencies must be exhaustive; never suppress the exhaustive-deps rule. Use a ref if a value must not re-trigger the effect.

## State (Zustand)
- Each store owns a single domain.
- Never read from one store inside another store's action — derive cross-store data in components or hooks.
- Select the minimal slice needed; never subscribe to the whole store object.
- Use `store.getState()` only inside timer or interval callbacks where a stale closure would otherwise be read.
- Actions must be pure — no side effects (`fetch`, `localStorage`) inside a `set` call.
- Persisted store keys are kebab-case, prefixed with the app name: `basketball-planner-<domain>`.

## Event handlers
- Local handler names follow `handle<Target><Event>` (`handleButtonClick`); prop names follow `on<Event>` (`onClick`).
- Call `e.preventDefault()` / `e.stopPropagation()` at the top of the handler, before any logic.

## Lists & keys
- Always use a stable unique `id` from the data as `key` — never use array index.

## Refs
- `useRef` is for DOM nodes and mutable values that must not trigger re-renders.
- Never read `.current` during render — only inside effects or event handlers.
- Initialise refs to `null` when the value is a DOM node or external object.
