# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the four findings from the 2026-08-17 OWASP Top 10:2025 / ASVS 5.0 security review of the coffee-shop admin app: outdated Next.js runtime, missing HTTP security headers, unvalidated admin write inputs, and unvalidated image uploads.

**Architecture:** No new subsystems. This is a hardening pass over the existing Next.js 14 App Router + Supabase app: (1) bump the framework to a patched version, (2) declare security headers via `next.config.js`, (3) add a Zod validation layer in front of the existing admin Server Actions, (4) replace the client-direct Supabase Storage upload with a Server Action that validates file content server-side before uploading.

**Tech Stack:** Next.js 15.5.23, React 19.2.8, TypeScript, Zod 4, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Vitest + Testing Library (existing).

**Spec:** This plan's spec is the security review delivered in-conversation on 2026-08-17 (no separate spec file — the four findings below are the full requirement set).

## Global Constraints

- Do not weaken or remove the existing three-layer authorization design (middleware → `requireAdmin()` in Server Actions → Postgres RLS). All new validation is additive, in front of existing checks.
- Keep all user-facing strings in Vietnamese, matching the existing UI (see `MenuItemForm.tsx`, `CategoryForm.tsx` for tone/style).
- No behavior change to the public site — only `/admin/*` write paths and app-wide config are touched.
- Target Next.js version: `15.5.23` exactly (not 16.x — avoids an extra major-version jump; 15.5.23 already resolves every CVE identified in the `npm audit` run during the review).
- Target React version: `19.2.8` (Next 15's minimum supported React version is 19; React 18 is not supported).
- Run `npm test` and `npm run build` after every task and keep both green before moving to the next task.

---

### Task 1: Upgrade Next.js to 15.5.23 / React 19, migrate `useFormState`

**Files:**
- Modify: `package.json` (dependency versions)
- Modify: `app/admin/login/page.tsx` (`useFormState` → `useActionState`)
- Test: existing suite (`npm test`) — no new test file; this task's correctness gate is "existing suite + build stay green"

**Interfaces:**
- Consumes: nothing from later tasks.
- Produces: a Next 15 / React 19 baseline that Tasks 2–4 build on. No exported function signatures change.

**Context:** `app/admin/login/page.tsx` currently does:
```tsx
import { useFormState, useFormStatus } from 'react-dom'
...
const [state, formAction] = useFormState(signIn, {})
```
In React 19, `useFormState` moved from `react-dom` to `react` and was renamed `useActionState`. `useFormStatus` stays in `react-dom` unchanged. This project has no server-side `params`/`searchParams` props and already awaits `cookies()` in `lib/supabase/server.ts`, so the async-dynamic-APIs codemod has nothing else to change — confirmed via grep before writing this plan.

- [ ] **Step 1: Bump dependency versions in `package.json`**

Edit `package.json` `dependencies`:
```json
"next": "15.5.23",
"react": "19.2.8",
"react-dom": "19.2.8",
```
Edit `package.json` `devDependencies`:
```json
"@types/react": "^19.2.18",
"@types/react-dom": "^19.2.4",
"eslint-config-next": "15.5.23",
```
Leave every other dependency (`@supabase/*`, `clsx`, `lenis`, `lucide-react`, `tailwind-merge`, `@testing-library/*`, `vitest`, `tailwindcss`, etc.) untouched — they are already React-19-compatible (`@testing-library/react@^16.0.1` supports React 19) and out of scope.

- [ ] **Step 2: Install**

Run: `npm install`
Expected: lockfile updates, install succeeds with no `ERESOLVE` peer-dependency errors.

- [ ] **Step 3: Migrate `useFormState` to `useActionState`**

In `app/admin/login/page.tsx`, change:
```tsx
import { useFormState, useFormStatus } from 'react-dom'
```
to:
```tsx
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
```
and change:
```tsx
const [state, formAction] = useFormState(signIn, {})
```
to:
```tsx
const [state, formAction] = useActionState(signIn, {})
```
No other line in this file changes — `signIn`'s signature (`(_prevState, formData) => Promise<{error?: string}>`) already matches `useActionState`'s expected action shape.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: all existing tests pass (in particular `components/layout/Header.test.tsx` and any test that renders client components, since these exercise React 19's render path).

- [ ] **Step 5: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type errors and no warnings about `useFormState` deprecation.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app/admin/login/page.tsx
git commit -m "chore: upgrade to Next.js 15.5.23 / React 19, fix unpatched CVEs in Next 14.2.35"
```

---

### Task 2: Add HTTP security headers

**Files:**
- Modify: `next.config.js`
- Create: `next.config.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by other tasks — purely additive config.

**Context:** `next.config.js` currently only configures `images.remotePatterns`. `headers()` is an async function Next.js calls at build/serve time; it can be imported and called directly from a Vitest test since it's just a plain export on the config object (no Next.js runtime needed to invoke it).

- [ ] **Step 1: Write the failing test**

Create `next.config.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import nextConfig from './next.config.js'

describe('next.config headers', () => {
  it('applies baseline security headers to every route', async () => {
    const rules = await nextConfig.headers()
    const global = rules.find((r: { source: string }) => r.source === '/(.*)')
    expect(global).toBeDefined()

    const byKey = Object.fromEntries(
      global.headers.map((h: { key: string; value: string }) => [h.key, h.value])
    )

    expect(byKey['X-Content-Type-Options']).toBe('nosniff')
    expect(byKey['X-Frame-Options']).toBe('DENY')
    expect(byKey['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(byKey['Permissions-Policy']).toContain('camera=()')
    expect(byKey['Strict-Transport-Security']).toContain('max-age=')
    expect(byKey['Content-Security-Policy']).toContain("frame-ancestors 'none'")
    expect(byKey['Content-Security-Policy']).toContain("default-src 'self'")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run next.config.test.ts`
Expected: FAIL — `nextConfig.headers` is undefined (`next.config.js` has no `headers()` export yet).

- [ ] **Step 3: Implement `headers()` in `next.config.js`**

Replace the full file with:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'xsspvdgnhelzprcqaiek.supabase.co' },
    ],
  },
  async headers() {
    const supabaseHost = 'https://xsspvdgnhelzprcqaiek.supabase.co'
    // script-src needs 'unsafe-inline' because Next.js App Router injects
    // inline bootstrap/hydration <script> tags (the __next_f RSC-streaming
    // payload) that a strict script-src would block, breaking hydration on
    // every page. Removing 'unsafe-inline' requires a nonce-based CSP wired
    // through middleware.ts — out of scope for this pass; every other
    // directive below still meaningfully reduces blast radius (no remote
    // script/object sources, no framing, no foreign form submission).
    const csp = [
      "default-src 'self'",
      `img-src 'self' data: blob: https://images.unsplash.com ${supabaseHost}`,
      `connect-src 'self' ${supabaseHost}`,
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run next.config.test.ts`
Expected: PASS

- [ ] **Step 5: Manually verify the site hydrates and renders under the new CSP**

Run: `npm run build && npm run start`, open `http://localhost:3000/` in a browser, open DevTools console, and confirm:
- No CSP violation errors are logged (this is the critical check — a misconfigured `script-src` would show `Refused to execute inline script` errors and the page would look static/non-interactive since React hydration failed).
- Interactive elements work: the mobile nav toggle in `Header.tsx` responds to clicks, and `MenuBrowser`'s search input filters items on `/menu`.
- The `/admin/login` page loads and its form still submits (Server Actions are same-origin POSTs, allowed by `form-action 'self'`).

Stop the dev/start server afterward.

- [ ] **Step 6: Commit**

```bash
git add next.config.js next.config.test.ts
git commit -m "feat: add baseline security headers and CSP"
```

---

### Task 3: Server-side input validation for admin write Server Actions

**Files:**
- Create: `lib/validation/menu-item.ts`
- Create: `lib/validation/menu-item.test.ts`
- Create: `lib/validation/category.ts`
- Create: `lib/validation/category.test.ts`
- Modify: `app/admin/menu/actions.ts`
- Modify: `app/admin/categories/actions.ts`
- Test (integration): `app/admin/menu/actions.test.ts`, `app/admin/categories/actions.test.ts`

**Interfaces:**
- Consumes: `MenuItemInput`, `CategoryInput` types from `lib/types.ts` (unchanged).
- Produces:
  - `lib/validation/menu-item.ts` exports `menuItemInputSchema: z.ZodType<MenuItemInput>` and `parseMenuItemInput(input: unknown): MenuItemInput` (throws `z.ZodError` on invalid input, returns a trimmed/validated `MenuItemInput` on success).
  - `lib/validation/category.ts` exports `categoryInputSchema: z.ZodType<CategoryInput>` and `parseCategoryInput(input: unknown): CategoryInput` (same contract).
  - Task 4 does not depend on these.

**Context:** `createMenuItemAction`/`updateMenuItemAction`/`createCategoryAction`/`updateCategoryAction` currently forward the client-supplied object straight to Supabase after only `requireAdmin()`. The client forms (`MenuItemForm.tsx`, `CategoryForm.tsx`) do minimal checks that a direct call to the Server Action bypasses entirely. Add a Zod schema per entity and call it first thing inside each action, right after `requireAdmin()`.

- [ ] **Step 1: Add the `zod` dependency**

Edit `package.json` `dependencies`, add:
```json
"zod": "^4.4.3",
```
Run: `npm install`

- [ ] **Step 2: Write the failing schema tests for menu items**

Create `lib/validation/menu-item.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { parseMenuItemInput } from './menu-item'

const validInput = {
  category_id: '11111111-1111-1111-1111-111111111111',
  name: 'Cà Phê Sữa Đá',
  description: 'Vị béo ngậy của sữa đặc hòa cùng cà phê phin đậm đà.',
  price: 45000,
  image_url: 'https://example.supabase.co/storage/v1/object/public/menu-images/a.jpg',
  is_available: true,
  is_featured: false,
  display_order: 0,
}

describe('parseMenuItemInput', () => {
  it('accepts a fully valid input and trims name/description', () => {
    const result = parseMenuItemInput({
      ...validInput,
      name: '  Cà Phê Sữa Đá  ',
    })
    expect(result.name).toBe('Cà Phê Sữa Đá')
  })

  it('accepts an empty image_url', () => {
    const result = parseMenuItemInput({ ...validInput, image_url: '' })
    expect(result.image_url).toBe('')
  })

  it('rejects a blank name', () => {
    expect(() => parseMenuItemInput({ ...validInput, name: '   ' })).toThrow()
  })

  it('rejects a name longer than 120 characters', () => {
    expect(() => parseMenuItemInput({ ...validInput, name: 'a'.repeat(121) })).toThrow()
  })

  it('rejects a description longer than 2000 characters', () => {
    expect(() =>
      parseMenuItemInput({ ...validInput, description: 'a'.repeat(2001) })
    ).toThrow()
  })

  it('rejects a non-positive price', () => {
    expect(() => parseMenuItemInput({ ...validInput, price: 0 })).toThrow()
    expect(() => parseMenuItemInput({ ...validInput, price: -1 })).toThrow()
  })

  it('rejects a price above the sanity ceiling', () => {
    expect(() => parseMenuItemInput({ ...validInput, price: 100_000_001 })).toThrow()
  })

  it('rejects a category_id that is not a UUID', () => {
    expect(() => parseMenuItemInput({ ...validInput, category_id: 'not-a-uuid' })).toThrow()
  })

  it('rejects an image_url that is not http(s)', () => {
    expect(() =>
      parseMenuItemInput({ ...validInput, image_url: 'javascript:alert(1)' })
    ).toThrow()
  })

  it('rejects a negative display_order', () => {
    expect(() => parseMenuItemInput({ ...validInput, display_order: -1 })).toThrow()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run lib/validation/menu-item.test.ts`
Expected: FAIL — `./menu-item` module does not exist.

- [ ] **Step 4: Implement `lib/validation/menu-item.ts`**

```ts
import { z } from 'zod'
import type { MenuItemInput } from '@/lib/types'

export const menuItemInputSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().trim().min(1, 'Vui lòng nhập tên món').max(120),
  description: z.string().trim().max(2000),
  price: z.number().positive().max(100_000_000),
  image_url: z
    .string()
    .trim()
    .max(2048)
    .refine((value) => value === '' || /^https?:\/\//i.test(value), {
      message: 'image_url must be empty or start with http(s)://',
    }),
  is_available: z.boolean(),
  is_featured: z.boolean(),
  display_order: z.number().int().min(0).max(100_000),
}) satisfies z.ZodType<MenuItemInput>

export function parseMenuItemInput(input: unknown): MenuItemInput {
  return menuItemInputSchema.parse(input)
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/validation/menu-item.test.ts`
Expected: PASS

- [ ] **Step 6: Write the failing schema tests for categories**

Create `lib/validation/category.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { parseCategoryInput } from './category'

const validInput = {
  name: 'Cà phê phin truyền thống',
  slug: 'ca-phe-phin',
  display_order: 0,
}

describe('parseCategoryInput', () => {
  it('accepts a fully valid input and trims name', () => {
    const result = parseCategoryInput({ ...validInput, name: '  Cà phê phin truyền thống  ' })
    expect(result.name).toBe('Cà phê phin truyền thống')
  })

  it('rejects a blank name', () => {
    expect(() => parseCategoryInput({ ...validInput, name: '   ' })).toThrow()
  })

  it('rejects a name longer than 80 characters', () => {
    expect(() => parseCategoryInput({ ...validInput, name: 'a'.repeat(81) })).toThrow()
  })

  it('rejects a slug with uppercase or invalid characters', () => {
    expect(() => parseCategoryInput({ ...validInput, slug: 'Ca-Phe' })).toThrow()
    expect(() => parseCategoryInput({ ...validInput, slug: 'ca_phe' })).toThrow()
  })

  it('rejects a blank slug', () => {
    expect(() => parseCategoryInput({ ...validInput, slug: '' })).toThrow()
  })

  it('rejects a negative display_order', () => {
    expect(() => parseCategoryInput({ ...validInput, display_order: -1 })).toThrow()
  })
})
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run lib/validation/category.test.ts`
Expected: FAIL — `./category` module does not exist.

- [ ] **Step 8: Implement `lib/validation/category.ts`**

```ts
import { z } from 'zod'
import type { CategoryInput } from '@/lib/types'

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên danh mục').max(80),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),
  display_order: z.number().int().min(0).max(100_000),
}) satisfies z.ZodType<CategoryInput>

export function parseCategoryInput(input: unknown): CategoryInput {
  return categoryInputSchema.parse(input)
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run lib/validation/category.test.ts`
Expected: PASS

- [ ] **Step 10: Write the failing integration tests proving the actions reject bad input before writing**

Create `app/admin/menu/actions.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/lib/supabase/require-admin', () => ({
  requireAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/data/menu-items', () => ({
  createMenuItem: vi.fn(),
  updateMenuItem: vi.fn(),
  deleteMenuItem: vi.fn(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createMenuItemAction } from './actions'
import { createMenuItem } from '@/lib/data/menu-items'

describe('createMenuItemAction', () => {
  it('rejects invalid input without calling createMenuItem', async () => {
    await expect(
      createMenuItemAction({
        category_id: 'not-a-uuid',
        name: '',
        description: '',
        price: -1,
        image_url: '',
        is_available: true,
        is_featured: false,
        display_order: 0,
      })
    ).rejects.toThrow()
    expect(createMenuItem).not.toHaveBeenCalled()
  })
})
```

Create `app/admin/categories/actions.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/lib/supabase/require-admin', () => ({
  requireAdmin: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/data/categories', () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { createCategoryAction } from './actions'
import { createCategory } from '@/lib/data/categories'

describe('createCategoryAction', () => {
  it('rejects invalid input without calling createCategory', async () => {
    await expect(
      createCategoryAction({ name: '', slug: 'BAD SLUG', display_order: -1 })
    ).rejects.toThrow()
    expect(createCategory).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 11: Run tests to verify they fail**

Run: `npx vitest run app/admin/menu/actions.test.ts app/admin/categories/actions.test.ts`
Expected: FAIL — the actions currently call `createMenuItem`/`createCategory` with unvalidated input, so the mocked functions get called and the "not.toHaveBeenCalled()" assertion fails (no throw happens either, since nothing validates `category_id`/`slug` shape before hitting the mocked, no-op data functions).

- [ ] **Step 12: Wire validation into `app/admin/menu/actions.ts`**

Add the import and a `parseMenuItemInput` call at the top of each action body, right after `requireAdmin`:
```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/data/menu-items'
import { parseMenuItemInput } from '@/lib/validation/menu-item'
import type { MenuItemInput } from '@/lib/types'

export async function createMenuItemAction(input: MenuItemInput) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  const validated = parseMenuItemInput(input)
  await createMenuItem(supabase, validated)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}

export async function updateMenuItemAction(id: string, input: MenuItemInput) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  const validated = parseMenuItemInput(input)
  await updateMenuItem(supabase, id, validated)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}

export async function deleteMenuItemAction(id: string) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  await deleteMenuItem(supabase, id)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}
```

- [ ] **Step 13: Wire validation into `app/admin/categories/actions.ts`**

Add the import and a `parseCategoryInput` call at the top of `createCategoryAction` and `updateCategoryAction`:
```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { createCategory, updateCategory, deleteCategory } from '@/lib/data/categories'
import { parseCategoryInput } from '@/lib/validation/category'
import type { CategoryInput } from '@/lib/types'

export async function createCategoryAction(input: CategoryInput) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  const validated = parseCategoryInput(input)
  await createCategory(supabase, validated)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}

export async function updateCategoryAction(id: string, input: CategoryInput) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  const validated = parseCategoryInput(input)
  await updateCategory(supabase, id, validated)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}

export async function deleteCategoryAction(id: string) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  try {
    await deleteCategory(supabase, id)
  } catch (err) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === '23503') {
      throw new Error(
        'Không thể xóa danh mục đang có món. Vui lòng chuyển hoặc xóa các món trong danh mục này trước.'
      )
    }
    throw err
  }
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}
```

- [ ] **Step 14: Run tests to verify they pass**

Run: `npx vitest run lib/validation app/admin/menu/actions.test.ts app/admin/categories/actions.test.ts`
Expected: all PASS

- [ ] **Step 15: Run the full suite and build**

Run: `npm test && npm run build`
Expected: both succeed (in particular, `CategoryForm.tsx`'s client-generated slug must still satisfy the new `categoryInputSchema` regex — its `slugify()` already lowercases and strips to `[a-z0-9-]`, so this should pass unmodified).

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json lib/validation app/admin/menu/actions.ts app/admin/menu/actions.test.ts app/admin/categories/actions.ts app/admin/categories/actions.test.ts
git commit -m "feat: validate admin menu/category Server Action inputs server-side with Zod"
```

---

### Task 4: Server-side validation for menu image uploads

**Files:**
- Create: `lib/utils/validate-image-file.ts`
- Create: `lib/utils/validate-image-file.test.ts`
- Create: `app/admin/menu/upload-image-action.ts`
- Modify: `components/admin/ImageUpload.tsx`
- Modify: `components/admin/ImageUpload.test.tsx`

**Interfaces:**
- Consumes: `requireAdmin` from `lib/supabase/require-admin.ts`, `createServerSupabaseClient` from `lib/supabase/server.ts` (both unchanged).
- Produces:
  - `lib/utils/validate-image-file.ts` exports `validateImageFile(bytes: Uint8Array, size: number): { ok: true; extension: string; contentType: string } | { ok: false; error: string }`. Pure function, no I/O — this is the core security check and the only piece worth unit-testing directly.
  - `app/admin/menu/upload-image-action.ts` exports `uploadMenuImageAction(formData: FormData): Promise<{ url: string } | { error: string }>`.

**Context:** `ImageUpload.tsx` currently uploads directly from the browser to Supabase Storage via `createBrowserSupabaseClient()`, trusting only the `accept="image/*"` HTML attribute (cosmetic — the underlying HTTP PUT to Supabase Storage isn't gated by it) and the storage RLS insert policy (auth only, not content). Move the upload through a Server Action that: (1) re-checks admin auth, (2) sniffs the file's real bytes against known image magic numbers instead of trusting the browser-supplied MIME type, (3) enforces a size ceiling, (4) generates the storage object key from `crypto.randomUUID()` instead of the attacker-controlled `file.name`.

- [ ] **Step 1: Write the failing tests for the magic-byte validator**

Create `lib/utils/validate-image-file.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { validateImageFile } from './validate-image-file'

const JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0])
const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const WEBP_HEADER = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
])
const NOT_AN_IMAGE = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]) // "%PDF-1.4"

const FIVE_MB = 5 * 1024 * 1024

describe('validateImageFile', () => {
  it('accepts a JPEG within the size limit', () => {
    const result = validateImageFile(JPEG_HEADER, 1024)
    expect(result).toEqual({ ok: true, extension: 'jpg', contentType: 'image/jpeg' })
  })

  it('accepts a PNG within the size limit', () => {
    const result = validateImageFile(PNG_HEADER, 1024)
    expect(result).toEqual({ ok: true, extension: 'png', contentType: 'image/png' })
  })

  it('accepts a WEBP within the size limit', () => {
    const result = validateImageFile(WEBP_HEADER, 1024)
    expect(result).toEqual({ ok: true, extension: 'webp', contentType: 'image/webp' })
  })

  it('rejects a file whose bytes are not a recognized image format, regardless of size', () => {
    const result = validateImageFile(NOT_AN_IMAGE, 1024)
    expect(result.ok).toBe(false)
  })

  it('rejects a valid image signature that exceeds the size ceiling', () => {
    const result = validateImageFile(JPEG_HEADER, FIVE_MB + 1)
    expect(result.ok).toBe(false)
  })

  it('rejects an empty file', () => {
    const result = validateImageFile(new Uint8Array(0), 0)
    expect(result.ok).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/utils/validate-image-file.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `lib/utils/validate-image-file.ts`**

```ts
const MAX_SIZE_BYTES = 5 * 1024 * 1024

type ImageSignature = {
  extension: string
  contentType: string
  matches: (bytes: Uint8Array) => boolean
}

const SIGNATURES: ImageSignature[] = [
  {
    extension: 'jpg',
    contentType: 'image/jpeg',
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    extension: 'png',
    contentType: 'image/png',
    matches: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    extension: 'webp',
    contentType: 'image/webp',
    matches: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
]

export type ValidateImageFileResult =
  | { ok: true; extension: string; contentType: string }
  | { ok: false; error: string }

export function validateImageFile(bytes: Uint8Array, size: number): ValidateImageFileResult {
  if (size <= 0) {
    return { ok: false, error: 'File rỗng.' }
  }
  if (size > MAX_SIZE_BYTES) {
    return { ok: false, error: 'Ảnh không được vượt quá 5MB.' }
  }
  const signature = SIGNATURES.find((s) => s.matches(bytes))
  if (!signature) {
    return { ok: false, error: 'Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.' }
  }
  return { ok: true, extension: signature.extension, contentType: signature.contentType }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/utils/validate-image-file.test.ts`
Expected: PASS

- [ ] **Step 5: Implement the upload Server Action**

Create `app/admin/menu/upload-image-action.ts`:
```ts
'use server'

import { randomUUID } from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { validateImageFile } from '@/lib/utils/validate-image-file'

export async function uploadMenuImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { error: 'Không có file được gửi lên.' }
  }

  const buffer = new Uint8Array(await file.arrayBuffer())
  const validation = validateImageFile(buffer, file.size)
  if (!validation.ok) {
    return { error: validation.error }
  }

  const path = `${randomUUID()}.${validation.extension}`
  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(path, buffer, { contentType: validation.contentType })

  if (uploadError) {
    return { error: 'Tải ảnh lên thất bại. Vui lòng thử lại.' }
  }

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return { url: data.publicUrl }
}
```

- [ ] **Step 6: Update `ImageUpload.tsx` to call the Server Action instead of uploading directly**

Read the current test file first to know what the component's rendered contract is:

Run: `cat components/admin/ImageUpload.test.tsx` (or open it) and keep every `aria-label`/`id` the test relies on unchanged — only the internal upload mechanism changes.

Replace `components/admin/ImageUpload.tsx` with:
```tsx
'use client'

import { useState, type ChangeEvent } from 'react'
import { uploadMenuImageAction } from '@/app/admin/menu/upload-image-action'

export function ImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.set('file', file)
    const result = await uploadMenuImageAction(formData)

    if ('error' in result) {
      setError(result.error)
      setUploading(false)
      return
    }

    onChange(result.url)
    setUploading(false)
  }

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium">
        Ảnh sản phẩm
      </label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Ảnh món hiện tại" className="mt-2 h-32 w-32 rounded object-cover" />
      )}
      <input
        id="image-upload"
        aria-label="Ảnh sản phẩm"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2 text-sm"
      />
      {uploading && <p className="mt-1 text-sm text-brand-ink/60">Đang tải lên...</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 7: Update `components/admin/ImageUpload.test.tsx` to mock the Server Action instead of the browser Supabase client**

The current file mocks `@/lib/supabase/client`'s `createBrowserSupabaseClient`, which no longer exists in the component. Replace the full file with:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from './ImageUpload'
import { uploadMenuImageAction } from '@/app/admin/menu/upload-image-action'

vi.mock('@/app/admin/menu/upload-image-action', () => ({
  uploadMenuImageAction: vi.fn(),
}))

describe('ImageUpload', () => {
  it('shows the current image when a value is set', () => {
    render(<ImageUpload value="https://images.unsplash.com/x" onChange={vi.fn()} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://images.unsplash.com/x')
  })

  it('uploads a selected file and calls onChange with the public URL', async () => {
    vi.mocked(uploadMenuImageAction).mockResolvedValue({
      url: 'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg',
    })
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload value="" onChange={onChange} />)

    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Ảnh sản phẩm')
    await user.upload(input, file)

    expect(onChange).toHaveBeenCalledWith(
      'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg'
    )
  })

  it('shows an error and does not call onChange when the server rejects the file', async () => {
    vi.mocked(uploadMenuImageAction).mockResolvedValue({
      error: 'Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.',
    })
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ImageUpload value="" onChange={onChange} />)

    const file = new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' })
    const input = screen.getByLabelText('Ảnh sản phẩm')
    await user.upload(input, file)

    expect(await screen.findByText('Chỉ chấp nhận ảnh JPEG, PNG hoặc WEBP.')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 8: Run the component test**

Run: `npx vitest run components/admin/ImageUpload.test.tsx`
Expected: PASS

- [ ] **Step 9: Run the full suite and build**

Run: `npm test && npm run build`
Expected: both succeed.

- [ ] **Step 10: Commit**

```bash
git add lib/utils/validate-image-file.ts lib/utils/validate-image-file.test.ts app/admin/menu/upload-image-action.ts components/admin/ImageUpload.tsx components/admin/ImageUpload.test.tsx
git commit -m "feat: validate menu image uploads server-side (magic bytes + size) instead of trusting client MIME type"
```

---

### Task 5: Final verification pass

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including every new file from Tasks 2–4.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: succeeds with no type errors.

- [ ] **Step 3: Run `npm audit` again**

Run: `npm audit --omit=dev`
Expected: the Next.js/PostCSS advisories found during the original review (`GHSA-*` list against `next@14.2.35`) no longer appear, since `next@15.5.23` resolves them.

- [ ] **Step 4: Manual smoke test of the admin flow**

Run: `npm run dev`, then in a browser:
1. Log in at `/admin/login`.
2. Go to `/admin/menu/new`, fill in a valid item, upload a real JPEG/PNG photo, save — confirm it appears in `/admin/menu` and on the public `/menu` page with the uploaded image showing.
3. Try uploading a renamed non-image file (e.g., a `.txt` file renamed to `photo.jpg`) — confirm `ImageUpload` shows the Vietnamese rejection message and no object lands in the `menu-images` bucket.
4. Go to `/admin/categories`, create a category with a name that is only whitespace — confirm it's rejected client-side (existing behavior) and stays rejected if you inspect network activity (no insert reaches Supabase).

Stop the dev server afterward.

- [ ] **Step 5: Request code review**

Use the `superpowers:requesting-code-review` skill against the full diff from this plan before merging/finishing the branch.
