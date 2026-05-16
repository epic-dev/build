# 🔨 Mini-Build — Parallel + Intercepting Routes Practice

**Date:** 2026-05-16
**Time budget:** **2–3 hours hard cap.** Stop at 3 — this is a focused drill, not a portfolio piece.
**Deliverable:** push to your existing repo as `build-mini/` (or `mini-practice/` — your call) + working `npm run dev`. **No README, no tests, no styling beyond default browser**.

This drill targets exactly the gaps from Next.js Day 3: Q3 (parallel routes), Q4 (intercepting routes), Q10 (real-world structure). Single feature, full implementation. The goal isn't a polished app — it's making the file structure and routing wiring stick in muscle memory.

---

## What you're building

A **photo gallery** with the modal-over-list pattern. Six features, no more:

1. `/` — gallery list (hardcoded array of ~10 photos with `id`, `title`, `imageUrl`)
2. Each photo clickable as a `<Link href={`/photos/${id}`}>`
3. **Clicking from `/` opens the photo as a MODAL** (intercepted route, URL becomes `/photos/<id>`, list stays visible behind)
4. **Direct visit to `/photos/<id>` (refresh or share-link) → full-page detail view** (NOT modal)
5. **Parallel route slot `@info`** alongside the gallery, rendering a static "About this gallery" panel. Goal: practice the slot wiring + `default.tsx` mechanics.
6. **Route group `(gallery)`** wrapping the home page + photos. Goal: practice route groups (URLs don't include the group name).

---

## The file structure I'm checking for

You should produce something close to this. Use this as a scaffold — don't copy blindly, but the shape should match:

```
app/
├── (gallery)/                          ← route group, doesn't appear in URLs
│   ├── @info/
│   │   ├── page.tsx                    ← "About this gallery" panel
│   │   └── default.tsx                 ← fallback when slot has no state
│   ├── @modal/
│   │   ├── (.)photos/
│   │   │   └── [id]/
│   │   │       └── page.tsx            ← INTERCEPTED — renders modal
│   │   └── default.tsx                 ← fallback when no modal showing
│   ├── photos/
│   │   └── [id]/
│   │       └── page.tsx                ← FULL-PAGE detail (non-intercepted)
│   ├── layout.tsx                      ← renders {children}, {info}, {modal}
│   └── page.tsx                        ← gallery home (list of photos)
└── layout.tsx                          ← root layout (html/body)
```

Six file structure decisions baked in:
1. `(gallery)` is a route group — `/` URL maps to `app/(gallery)/page.tsx`, NOT `app/(gallery)/page.tsx` in the URL
2. `@info` and `@modal` are parallel slots — they show up as props on `layout.tsx`
3. `(.)photos/[id]` intercepts at the same folder level (intercepting from inside `@modal`, the same level is `(gallery)/`, so `(.)photos` looks for `photos` at `(gallery)/photos/`)
4. `app/(gallery)/photos/[id]/page.tsx` is the **un-intercepted full-page version** — what you get on direct URL visit
5. Each parallel slot needs `default.tsx` — when navigating to a route that has no defined state for that slot, default renders. Without it, you get "missing slot" errors on hard navigations.
6. The root `app/layout.tsx` (with html/body) stays minimal — the gallery layout handles the slot composition.

---

## What the components should look like

**Don't over-engineer.** Each component is ~10-20 lines. Mock data is fine.

### `app/(gallery)/page.tsx` — gallery home

```tsx
import Link from 'next/link';

const photos = [
  { id: '1', title: 'Sunset', imageUrl: 'https://picsum.photos/seed/1/300' },
  { id: '2', title: 'Mountain', imageUrl: 'https://picsum.photos/seed/2/300' },
  // ... ~10 of these
];

export default function GalleryPage() {
  return (
    <div>
      <h1>Gallery</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {photos.map(p => (
          <Link key={p.id} href={`/photos/${p.id}`}>
            <img src={p.imageUrl} alt={p.title} style={{ width: '100%' }} />
            <p>{p.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### `app/(gallery)/layout.tsx` — slot composer

```tsx
export default function GalleryLayout({
  children,
  info,
  modal,
}: {
  children: React.ReactNode;
  info: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 16 }}>
      <main>{children}</main>
      <aside>{info}</aside>
      {modal}
    </div>
  );
}
```

### `app/(gallery)/@modal/(.)photos/[id]/page.tsx` — intercepted (modal)

```tsx
import { photos } from '@/data/photos';  // or wherever; you can inline

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = photos.find(p => p.id === id);
  if (!photo) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{ background: 'white', padding: 16 }}>
        <h2>{photo.title}</h2>
        <img src={photo.imageUrl} alt={photo.title} />
      </div>
    </div>
  );
}
```

### `app/(gallery)/photos/[id]/page.tsx` — full-page (non-intercepted)

```tsx
import { photos } from '@/data/photos';
import { notFound } from 'next/navigation';

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = photos.find(p => p.id === id);
  if (!photo) notFound();

  return (
    <div>
      <h1>{photo.title}</h1>
      <img src={photo.imageUrl} alt={photo.title} style={{ maxWidth: 600 }} />
    </div>
  );
}
```

### `app/(gallery)/@modal/default.tsx` — fallback when no modal

```tsx
export default function ModalDefault() {
  return null;  // nothing renders when no modal is showing
}
```

### `app/(gallery)/@info/default.tsx` — fallback for info slot

```tsx
export default function InfoDefault() {
  return null;  // or some default copy
}
```

### `app/(gallery)/@info/page.tsx` — the info panel

```tsx
export default function InfoPanel() {
  return (
    <div style={{ border: '1px solid #ccc', padding: 12 }}>
      <h3>About this gallery</h3>
      <p>Practice build for parallel + intercepting routes.</p>
    </div>
  );
}
```

---

## How to verify it works

After `npm run dev`:

1. Visit `/` — see gallery with 3-column grid + info panel on the right
2. Click a photo — URL changes to `/photos/1`, modal overlays the list, list visible behind
3. Hit refresh on `/photos/1` — full-page detail view, no modal, no list
4. Open `/photos/1` in a new tab — full-page detail view
5. Press back from the modal — URL returns to `/`, modal closes, list still there

**If any of these don't work, the file structure is wrong.** That's the diagnostic value of the build — the patterns either work or they don't.

---

## What I'll grade

When you push, paste the repo URL. I'll review against this checklist (~10 min):

1. ✅ `(gallery)` route group correctly hides from URLs
2. ✅ `@info` and `@modal` slots wired into `layout.tsx` as props
3. ✅ Intercepting path `(.)photos/[id]/page.tsx` is at the correct level (inside `@modal`, intercepting `photos/[id]` from the same parent)
4. ✅ Full-page `photos/[id]/page.tsx` exists and renders WITHOUT the modal wrapper
5. ✅ Both slots have `default.tsx` so hard navigations don't error
6. ✅ Direct URL visit vs intercepted navigation produce different visual results (this is the proof the pattern works)

No styling grade. No code-quality grade. **Just: does the routing wiring work as the spec describes?**

---

## What NOT to do

- ❌ Don't write tests
- ❌ Don't add styling beyond inline styles or browser defaults
- ❌ Don't fetch real data — hardcoded array of 10 photos is fine
- ❌ Don't add `<Suspense>` wrappers, `loading.tsx`, or `error.tsx` — out of scope
- ❌ Don't refactor your existing build-1 — this is a new mini-build in a new folder
- ❌ Don't add navigation, auth, search — out of scope
- ❌ Don't add Tailwind or CSS modules — inline styles are fine

If you find yourself "improving" something not in the spec, you're over-scoping. **Hard stop at 3 hours.**

---

## Blocker protocol

- **Modal renders but list disappears**: layout isn't rendering `{children}` alongside `{modal}`. Check `app/(gallery)/layout.tsx`.
- **Modal doesn't show on click**: intercepting path is wrong. Check the folder is `(.)photos/[id]` inside `@modal`, NOT something like `(.)products` or `(..)photos`.
- **Direct URL visit shows modal instead of full page**: the un-intercepted `app/(gallery)/photos/[id]/page.tsx` is missing or wrong.
- **"Slot is missing" error on hard navigation**: missing `default.tsx` in one or both slots.
- **URL includes `(gallery)`**: you put route group in the URL path somehow. Folder name in parens should never appear in URLs.

If you hit something not in this list after 30 min, push what you have with a note describing the symptom — I'll diagnose.
