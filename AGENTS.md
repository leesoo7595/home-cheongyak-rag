# AGENTS.md

This file applies to this directory and all child directories unless a deeper `AGENTS.md` overrides it.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (`strict`)
- **Server state**: TanStack Query v5
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI)

## Project Structure

```text
app/
├── api/              # Route Handlers
├── components/
│   ├── ui/           # shadcn/ui primitives; avoid modifying directly
│   ├── common/       # shared app components
│   └── layout/       # layout components
├── features/
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       │   ├── queries/    # useQuery hooks
│       │   └── mutations/  # useMutation hooks
│       ├── views/          # page-level components
│       └── types.ts
├── contexts/         # React context + hooks
├── hooks/            # global hooks
└── lib/              # utilities
server/
└── services/         # server-only services (storage, rag)
```

New features should go under `app/features/<feature-name>/` and follow the existing structure.

## Code Quality

- Prefer editing existing files. Create new files only when needed.
- Write code, comments, and identifiers in English.
- Do not over-engineer. Solve the current problem directly.
- Do not add `console.log` unless explicitly requested.
- Add comments only when the logic is genuinely non-obvious.
- For first-party app code, prefer one component per file and one concern per hook.
- For first-party app code, split files before they become hard to maintain; around 300 lines is a warning sign, not an absolute rule.
- The file-size guideline does not apply to generated or vendor-style primitives under `app/components/ui/`.

## TypeScript

- Prefer `type` over `interface` for object shapes unless interface-specific behavior is needed.
- Avoid `any`. Use `unknown` and narrow explicitly.
- Co-locate types with the code that uses them. Shared feature types should live in that feature's `types.ts`.

## TanStack Query

- Query hooks belong in `hooks/queries/`; mutation hooks belong in `hooks/mutations/`.
- Define stable `queryKey` arrays for query hooks.
- Use `enabled` when a query should not run until prerequisites are ready.

## Next.js App Router

- Use the App Router (`app/` directory). Do not add Pages Router code.
- Default to Server Components. Add `"use client"` only when necessary for hooks, event handlers, or browser APIs.
- Keep `"use client"` components as leaf-like as practical.
- Prefer `async` Server Components for server-side data fetching. Use TanStack Query for client-side cached or interactive state.

## Styling

- Use Tailwind utility classes. Avoid inline styles unless there is a clear reason.
- Use `cn()` from `app/lib/utils.ts` for conditional classes.
- Prefer shadcn/ui primitives over building equivalent low-level UI from scratch.

## Dependency Hygiene

When moving or removing files, scan the affected imports and fix broken references in the same task. Do not leave dependency fallout behind.

## Verification

- After TypeScript changes, run `npx tsc --noEmit` when feasible.
- For UI or SSR-sensitive changes, verify the affected page loads without relevant runtime errors when local browser or dev-server access is available.
- If a verification step could not be run, say that explicitly rather than implying it passed.

## SSR Safety

`"use client"` does not skip server-side rendering. Next.js still renders client components on the server for the initial HTML. If a dependency touches browser-only globals (`window`, `document`, `DOMMatrix`, `canvas`, and similar APIs) at module evaluation time, it can still throw on the server.

When importing a third-party library known to access browser APIs at module scope, wrap the importing component with `next/dynamic` and `ssr: false`:

```tsx
const PdfViewerPanel = dynamic(
  () => import("./PdfViewerPanel").then((m) => ({ default: m.PdfViewerPanel })),
  { ssr: false },
)
```

If a newly added browser-only dependency causes a server-side `ReferenceError`, treat that as a signal to isolate it behind `ssr: false`.

## Commit Hygiene

- When asked to stage or commit, run `git status` first and review what will be included.
- Stage only files directly related to the current task.
- Do not include generated files, editor state, or unrelated changes unless explicitly requested.
