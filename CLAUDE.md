# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important:** Always consult the `.claude/rules/` folder for coding conventions. It contains rules for React/TypeScript patterns (`react-conventions.md`) and styling (`styling.md`) that apply to all source files.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check then build for production (tsc -b && vite build)
npm run lint      # Run oxlint
npm run preview   # Preview production build
```

There are no tests in this project.

## Architecture

This is a React + TypeScript + Vite SPA — a basketball tactics planner with a canvas-based court editor.

### Routing & Pages

Three pages rendered inside a persistent `<Sidebar>` layout ([src/App.tsx](src/App.tsx)):

- `/` → **Editor** — the main court canvas with toolbar, roster panel, frame controls, and action buttons
- `/roster` → **Roster** — manage team players (name, number, position)
- `/library` → **Library** — browse and load saved plays

### State (Zustand)

Three stores in [src/store/](src/store/):

| Store | Persistence | Purpose |
|---|---|---|
| `useCourtStore` | in-memory only | Active court session: players on court, ball, screens, move/pass actions, frames, playback state |
| `usePlaysStore` | `localStorage` (`basketball-planner-plays`) | Library of saved plays (each a `CourtSnapshot` + name + id) |
| `useRosterStore` | `localStorage` (`basketball-planner-roster`) | Team roster: players available to drag onto the court |

**Key distinction**: `RosterPlayer` (useRosterStore) is a team member definition. `CourtPlayerToken` (useCourtStore) is a placed instance on the court that references a `rosterId`. Deleting a player from the court cleans up their related actions automatically.

### Core Data Model

Defined in [src/store/courtTypes.ts](src/store/courtTypes.ts):

- **`Frame`** — a snapshot of the full court state (players, ball, screens, actions) used for animation
- **`CourtAction`** — either a `MoveAction` (player path as a `number[]` of x/y pairs) or a `PassAction` (ball transfer between two points)
- **`Tool`** — `'move' | 'draw' | 'erase'` controls how pointer interactions are interpreted

### Canvas Rendering

The court uses **react-konva** (Konva.js). The `<Court>` component holds a Konva `Stage`, and all interaction logic lives in the `useCourtInteractions` hook ([src/hooks/useCourtInteractions.ts](src/hooks/useCourtInteractions.ts)). The hook manages a local `drawing` state machine (reposition / path / ball) and writes to `useCourtStore` on pointer up.

The `ActionLayer` renders move arrows and pass lines on a separate Konva layer. Player and ball tokens are individual Konva components.

### Animation / Frames

Frames are discrete snapshots captured manually. Playback steps through them at 800 ms intervals via `useFramePlayback` ([src/hooks/useFramePlayback.ts](src/hooks/useFramePlayback.ts)), which drives `useCourtStore.goToFrame`. Loading a frame fully replaces the active court state.

### Sharing & Export

- **Share link** ([src/utils/shareLink.ts](src/utils/shareLink.ts)): serializes the full `CourtSnapshot` + name to JSON, compresses with `lz-string`, and encodes it into the URL hash (`#play=...`). The `useSharedPlayLoader` hook reads this on mount and loads it into the court.
- **Export** ([src/utils/exportCourt.ts](src/utils/exportCourt.ts)): uses jsPDF to export the Konva stage as a PDF, via a `stageRef` passed from the Editor.

### Styling

Tailwind CSS v4 (Vite plugin, no `tailwind.config`). Theme tokens defined in [src/theme.ts](src/theme.ts).
