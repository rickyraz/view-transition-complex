# View Transition Complex

This repository is a learning playground for modern page transitions in React.
It demonstrates how to combine:

- React Canary `<ViewTransition />` and `addTransitionType`
- TanStack Router file-based routing with typed route transitions
- CSS View Transition pseudo-elements for smooth, controllable animations

The project includes multiple interactive route demos (`/simple`, `/medium`, `/complex`, `/edge`, and additional lab routes) to show real transition patterns and common UX pitfalls.

## What this repo demonstrates

- Route-level transitions (forward/backward direction)
- Intra-route transitions (state updates inside each page)
- Shared element transitions between related UI regions
- UI stability fixes for production-like UX:
  - active tab auto-scroll into view
  - precise sliding active indicator
  - reduced layout jumping on long page titles

## Tech stack

- React Canary + React DOM Canary
- TypeScript + Vite
- TanStack Router (`@tanstack/react-router`)
- TanStack Router file-based plugin + CLI
- ESLint

## Getting started

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Lint code:

```bash
pnpm lint
```

## File-based routing commands

Generate route tree:

```bash
pnpm routes:generate
```

Watch route files and regenerate automatically:

```bash
pnpm routes:watch
```

## Project structure

- `src/routes/` - file-based route entries
- `src/router.tsx` - router setup and defaults
- `src/routeTree.gen.ts` - generated route tree (do not edit manually)
- `src/App.tsx` - route demo components and transition logic
- `src/App.css` - transition styling and layout behavior
- `docs/` - learning documents for beginner React developers

## Learning docs

- `docs/01_PEMBELAJARAN_REACT_ROUTER.md` - Router architecture and route manipulation
- `docs/02_PEMBELAJARAN_VIEW_TRANSITION.md` - Smooth transition implementation guide
- `docs/03_FUNGSI_CORE_VIEW_TRANSITION.md` - Core role of React `<ViewTransition />`

## Notes

- This project is intentionally experimental and education-focused.
- Some APIs rely on React Canary and modern browser View Transition support.
