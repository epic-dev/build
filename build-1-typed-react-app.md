# 🔨 Build #1 — Typed React App: List/Detail UI

**Date:** 2026-05-13
**Time budget:** 5–6 hr. Hard stop at 6.
**Deliverable:** Public Git repo + working dev server + README with profiler screenshots.

This is the rep that fixes "prose-fluent, code-broken." A test runner and the React DevTools profiler will catch the bugs that have been showing up in assessments. The goal isn't a beautiful product; it's a working senior-quality skeleton that demonstrates the patterns from the week.

---

## What you're proving

Six things, each tied to an assessment gap:

| # | Pattern | Closes gap from |
|---|---------|-----------------|
| 1 | Custom hook for data fetching, with loading/error/success states | TS Day 5 Q6 (Result type) + React Day 2 Q9 (state machine) |
| 2 | `useDeferredValue` for fast-input/slow-derived-view | React Day 3 Q8 (picked wrong tool) |
| 3 | `React.memo` on a child that takes a callback — and the callback is `useCallback`-stable so memo actually fires | React Day 1 Q9 + Day 3 Q1 |
| 4 | Context with state+dispatch split | React Day 2 Q5 + Day 3 Q1 (Fix A) |
| 5 | `useReducer` with discriminated-union actions (not bare strings) | React Day 1 Q7 + Day 2 Q9 |
| 6 | Profiler-driven optimization — measure before, measure after | React Day 3 Q4 (never used profiler) |

If those six land, the build is a success regardless of how the UI looks.

---

## Stack

- **Vite** + **TypeScript** + **React 18 or 19** (your choice — 19 if you want to play with `use()` hook; 18 is fine)
- **Vitest** + **@testing-library/react** for tests
- **No CSS framework needed** — plain CSS or CSS Modules is fine. Don't burn time on styling.
- **No routing library needed** — `useState` for view selection is enough at this size.
- **Strict TypeScript**: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` (we discussed these in TS Day 4)

---

## Functional requirements

**Domain — pick one** (the engineering matters; the content doesn't):

- **PokéAPI** (`https://pokeapi.co/api/v2/`) — list `/pokemon?limit=151`, detail `/pokemon/{name}`. No auth. Recommended — clean data, good for sorting/filtering.
- **HN top stories** (`https://hacker-news.firebaseio.com/v0/topstories.json` for IDs + `/item/{id}.json` for each). No auth.
- **GitHub repo search** (`https://api.github.com/search/repositories?q=react`). Rate limit is generous unauth.
- **Crypto** (CoinGecko `/coins/markets`). No auth for free tier.

Pick one, don't deliberate more than 2 min.

**Features the app must have:**

1. **List view** — paginated or virtualized. Shows ~50–200 rows. Each row is clickable.
2. **Search/filter input** — filters the list as you type. **This is where `useDeferredValue` goes.** Typing must feel instant; the filtered list updates on a deferred basis.
3. **Sort** — at least one sortable column (e.g., name A→Z / Z→A, or price asc/desc).
4. **Detail view** — clicking a row shows detail. Either side-by-side, modal, or replace-the-list. Your call.
5. **Favorites** — clicking a star/heart on a row toggles "favorited." Persisted to `localStorage`. This is where the **reducer + context** lives.
6. **One async error path** — if the detail fetch fails, show an error UI with retry. Tests should cover this.

---

## Performance requirements — the senior part

This is what separates Build #1 from "any React tutorial":

1. **Use the React DevTools Profiler.** Record a typing session in the search input. Take a screenshot of the initial state (yellow renders everywhere, probably).
2. **Apply memoization where the profiler shows wins** — `React.memo` on the row, `useCallback` on the row's click handler. Re-record. Screenshot the after state.
3. **Both screenshots go in the README** with a 2-line comment each ("Before: every row re-renders on each keystroke. After: only the rows whose content actually changed re-render.")
4. **Do NOT memoize cargo-cult** — every memo added must be justifiable by a profiler observation. If `React.memo` doesn't move the needle on a component, leave it un-memoized and note that in the README.

---

## Architecture requirements

These are the patterns I want to see in the codebase. PR-review checklist:

- `useFetch<T>(url)` custom hook returning **discriminated-union state**:
  ```ts
  type FetchState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
  ```
- `useReducer` for favorites (not `useState`), with **discriminated-union actions**:
  ```ts
  type FavoriteAction =
    | { type: 'add'; id: string }
    | { type: 'remove'; id: string }
    | { type: 'clear' };
  ```
- **`FavoritesStateContext` + `FavoritesDispatchContext`** — split. Components that only need dispatch (the star button) should not re-render when the favorites set changes.
- **One row component** wrapped in `React.memo` with the **callback passed via `useCallback`** from the list parent. Verify in the profiler that the row doesn't re-render when unrelated state changes.
- **Branded types** for IDs:
  ```ts
  type PokemonId = string & { readonly __brand: 'PokemonId' };
  ```
  Use them on the favorites set so a non-PokemonId can't sneak in.

---

## Testing requirements

At least 5 tests, each testing something non-trivial:

1. **`useFetch` happy path** — mock fetch, assert the hook transitions `idle → loading → success` with the right data.
2. **`useFetch` error path** — mock fetch to reject, assert state transitions to `error`.
3. **`favoritesReducer`** — pure-function tests for each action. Add, remove, clear, and an invalid sequence (add same ID twice — should be idempotent).
4. **Search filtering** — render the list with mock data, type in the search box, assert filtered results appear.
5. **Favorite toggle** — render a row, click the star, assert it's now favorited (check via context state OR `localStorage`).

`vitest --run` should pass green at the end.

---

## Deliverables

In the repo root:

1. **Working `npm run dev`** — opens in browser, all features functional.
2. **`npm test` passes** — all 5 tests green.
3. **README.md** with:
   - One-paragraph "what this is"
   - Stack list
   - Run instructions
   - **Profiler screenshots** (before/after memoization)
   - One paragraph "what I learned" — be honest, include something that surprised you
4. **`.gitignore`** correct (node_modules, dist, .env)
5. **TypeScript strict mode on** — `npm run typecheck` (add a script: `"typecheck": "tsc --noEmit"`) passes.

---

## What NOT to spend time on

- ❌ Beautiful CSS / animations. Default browser styles are fine.
- ❌ Authentication. Use public APIs.
- ❌ More than one route — keep it single-page.
- ❌ Pagination AND virtualization. Pick one. (Pagination is simpler.)
- ❌ A backend. We're not there yet.
- ❌ More than 5 tests. Quality > quantity for this build.
- ❌ Code splitting / lazy loading. Tomorrow's Next.js phase covers it.
- ❌ Server-side anything. This is purely client.

---

## Pacing — 6 hours, broken into phases

| Block | Time | What |
|-------|------|------|
| 0. Pick domain + scaffold | 30 min | `npm create vite@latest`, install deps, `git init`, smoke test |
| 1. Data layer | 60 min | `useFetch` hook + types + first test |
| 2. List + search + sort | 90 min | List render, search input, useDeferredValue, sort |
| 3. Detail view | 45 min | Click row → detail. Error UI for failed fetch. |
| 4. Favorites (reducer + context split) | 60 min | Reducer, contexts, star button, localStorage persistence |
| 5. Profiler pass + memoization | 45 min | Record, screenshot, add memo/useCallback, re-record, screenshot |
| 6. Tests | 45 min | 5 tests, run them all |
| 7. README + push | 15 min | Write README, commit, push |

**If you're behind at the 4-hour mark** — cut sort first (Block 2 trims to 60 min), then drop one of the tests. Don't cut the profiler pass — that's the most important part.

---

## How to handle blockers

- **You hit a TS error you can't fix in 10 min**: write the loosest type you can to keep moving, leave a `// TODO: tighten` comment. Don't lose 45 min to one type.
- **A test is hard to write**: skip it but write the comment `// SKIPPED: hard to mock X — would need MSW`. I'd rather see 4 good tests + an honest note than 5 fake tests.
- **The profiler shows no measurable win**: write that in the README. "I tried `React.memo` on `<Row>`; it didn't change render counts because Y." Honesty beats theater.
- **You finish early**: don't add features. Polish the README, add a 6th test, or stop and rest.

---

## How to ship

When done (or when 6 hr hits):

1. Push to a public GitHub repo
2. Reply with the repo URL + a one-paragraph "what went well / what I'd do differently"
3. I'll do a code review against the architecture requirements above — same grading style as the assessments, but on real code

If you don't finish all features in 6 hr, ship what you have. **A working subset > a broken superset.**

---

## After the build

Tomorrow (05-14) starts the Next.js phase. The patterns from this build carry directly:
- The boundary props question from React Day 4 Q6 will become real — Server Components can't take your `onIncrement` callbacks
- The fetch dedup question from React Day 4 Q8(c) becomes the default behavior in Next.js
- The discriminated-union reducer + context split you build today is exactly how Next.js apps share client state

Go.
