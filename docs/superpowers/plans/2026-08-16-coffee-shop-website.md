# Coffee Shop Website + Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public coffee-shop showcase website (Home, Menu, About, Gallery, Contact) plus a password-protected admin panel (CRUD for menu items/categories, image upload) backed by Supabase, per `plan.md`.

**Architecture:** Next.js 14 App Router + TypeScript site. All menu/category data lives in Supabase Postgres, read publicly via RLS, written only by allow-listed admins via `@supabase/ssr` server/browser clients. Public pages are React Server Components that fetch data server-side; the admin panel is guarded by root `middleware.ts` and uses client components + Server Actions for mutations. Images: seed data uses hot-linked Unsplash URLs; real photos uploaded later via admin go to Supabase Storage bucket `menu-images`.

**Tech Stack:** Next.js 14 (App Router, TypeScript) + Tailwind CSS + hand-rolled Tailwind UI primitives (Button/Input/Textarea/Card/Badge, shadcn-style API — no CLI registry dependency) + Framer Motion + `@supabase/supabase-js` + `@supabase/ssr` + Vitest + React Testing Library.

**Spec:** `plan.md` (primary spec — brand, sitemap, 25-item menu, data model, non-functional requirements) and `docs/superpowers/specs/2026-08-16-coffee-shop-website-design.md` (addendum — Supabase project, `admin_users` security model, seed image approach, git/deploy scope).

## Global Constraints

- Brand colors (plan.md §3): nền `#F5F1E8`, primary (xanh rêu) `#2F3E2E`, accent ấm (đất nung) `#B5652A`, accent sang trọng (vàng đồng) `#C9A15B`, chữ chính `#2A2520`, card `#FFFFFF` / `#FAF7F0`.
- Fonts (plan.md §3): heading = Fraunces (serif), body = Be Vietnam Pro (sans, dấu tiếng Việt đầy đủ) — load via `next/font/google`.
- Supabase project (design addendum §1): URL `https://xsspvdgnhelzprcqaiek.supabase.co`, publishable key `sb_publishable_1i_JXF8ar4zT9eCrRdch0A_9TG-UhaP`. Project ID for MCP calls: `xsspvdgnhelzprcqaiek`. Do not touch existing tables `kho_iphone` / `kho_hang_iphone`.
- Data model (plan.md §6): tables `categories`, `menu_items` exactly as specified, plus `admin_users` allowlist (design addendum §2).
- RLS: public `SELECT` on `categories`/`menu_items`; `INSERT`/`UPDATE`/`DELETE` only for `auth.uid()` present in `admin_users`; `admin_users` `SELECT` only `auth.uid() = user_id`, no client write policies.
- Storage: bucket `menu-images`, public read (plan.md §6).
- Out of scope for this plan: no cart/online ordering (plan.md §1), no `contact_messages` table (contact form is client-side only, no submission persistence — nothing in plan.md §6 calls for storing messages), no git remote/push, no Vercel deploy (design addendum §4 — that's plan.md §8 giai đoạn 7, later).
- Language: UI text in Vietnamese (plan.md §1).

---

## File Structure

```
coffee-shop/
  next.config.js
  tailwind.config.ts
  postcss.config.js
  tsconfig.json
  vitest.config.ts
  package.json
  .env.local                (gitignored — Supabase URL/key)
  .gitignore
  middleware.ts              (root — guards /admin/**)
  app/
    layout.tsx
    globals.css
    page.tsx                 (Home)
    sitemap.ts
    robots.ts
    menu/page.tsx
    about/page.tsx
    gallery/page.tsx
    contact/page.tsx
    admin/
      login/page.tsx
      login/actions.ts
      layout.tsx              (protected shell + sign-out)
      page.tsx                 (dashboard)
      categories/page.tsx
      categories/actions.ts
      menu/page.tsx
      menu/new/page.tsx
      menu/[id]/edit/page.tsx
      menu/actions.ts
  components/
    layout/Header.tsx
    layout/Footer.tsx
    home/Hero.tsx
    home/FeaturedItems.tsx
    menu/MenuBrowser.tsx       (client: search + category filter)
    menu/MenuItemCard.tsx
    contact/ContactForm.tsx
    admin/AdminNav.tsx
    admin/MenuItemForm.tsx
    admin/CategoryForm.tsx
    admin/ImageUpload.tsx
    ui/Button.tsx
    ui/Input.tsx
    ui/Textarea.tsx
    ui/Card.tsx
    ui/Badge.tsx
  lib/
    types.ts
    utils/cn.ts
    utils/format-price.ts
    utils/filter-menu-items.ts
    supabase/client.ts
    supabase/server.ts
    supabase/middleware.ts
    data/categories.ts
    data/menu-items.ts
    data/admin-users.ts
  supabase/
    migrations/0001_init.sql
    seed/seed-data.ts
```

---

### Task 1: Project scaffold, Tailwind design tokens, fonts

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.ts`, `vitest.config.ts`, `.gitignore`, `.env.local.example`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (temporary placeholder, replaced in Task 8)
- Create: `lib/utils/cn.ts`
- Test: `lib/utils/cn.test.ts`

**Interfaces:**
- Produces: `cn(...classes: (string | false | null | undefined)[]): string` — used by every `components/ui/*` primitive.
- Produces: Tailwind theme colors `brand-cream`, `brand-forest`, `brand-terracotta`, `brand-gold`, `brand-ink`, `brand-card` and font vars `--font-heading`, `--font-body` — consumed by all later UI tasks.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "coffee-shop",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.45.4",
    "clsx": "^2.1.1",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.445.0",
    "next": "^14.2.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.8",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.13",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.12",
    "typescript": "^5.6.2",
    "vitest": "^2.1.1"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'xsspvdgnhelzprcqaiek.supabase.co' },
    ],
  },
}

module.exports = nextConfig
```

- [ ] **Step 4: Create `postcss.config.js`**

```js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
```

- [ ] **Step 5: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F5F1E8',
        'brand-forest': '#2F3E2E',
        'brand-terracotta': '#B5652A',
        'brand-gold': '#C9A15B',
        'brand-ink': '#2A2520',
        'brand-card': '#FAF7F0',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Also create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 7: Create `.gitignore`**

```
node_modules/
.next/
.env.local
```

- [ ] **Step 8: Create `.env.local.example` and `.env.local`**

`.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env.local` (real values, not committed — see `.gitignore`):
```
NEXT_PUBLIC_SUPABASE_URL=https://xsspvdgnhelzprcqaiek.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_1i_JXF8ar4zT9eCrRdch0A_9TG-UhaP
```

- [ ] **Step 9: Write the failing test for `cn`**

`lib/utils/cn.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names with spaces', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes, keeping the last one', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npm install && npx vitest run lib/utils/cn.test.ts`
Expected: FAIL — `cn.ts` does not exist yet.

- [ ] **Step 11: Implement `cn`**

`lib/utils/cn.ts`:
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

Add `tailwind-merge` to `package.json` dependencies (already listed in Step 1) and reinstall if needed: `npm install`.

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run lib/utils/cn.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 13: Create root layout with fonts and global CSS**

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-brand-cream text-brand-ink font-body;
}

h1, h2, h3, h4 {
  @apply font-heading;
}
```

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Fraunces, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const heading = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
})

const body = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'MỘC Coffee House',
  description: 'Chậm lại giữa nhịp sống — Cà phê & thiên nhiên',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

`app/page.tsx` (temporary — replaced in Task 8):
```tsx
export default function HomePage() {
  return <main className="p-8">MỘC Coffee House — đang xây dựng.</main>
}
```

- [ ] **Step 14: Verify the app builds**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 15: Commit**

```bash
git add package.json tsconfig.json next.config.js postcss.config.js tailwind.config.ts vitest.config.ts vitest.setup.ts .gitignore .env.local.example app lib
git commit -m "chore: scaffold Next.js project with Tailwind design tokens and fonts"
```

---

### Task 2: Supabase schema, RLS, storage bucket

**Files:**
- Create: `supabase/migrations/0001_init.sql`

**Interfaces:**
- Produces: tables `categories(id, name, slug, display_order)`, `menu_items(id, category_id, name, description, price, image_url, is_available, is_featured, display_order, created_at, updated_at)`, `admin_users(user_id, created_at)`; storage bucket `menu-images`. Consumed by every task in the Data Layer and Admin sections.

- [ ] **Step 1: Write the migration SQL**

`supabase/migrations/0001_init.sql`:
```sql
-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  display_order int not null default 0
);

alter table public.categories enable row level security;

create policy "categories are publicly readable"
  on public.categories for select
  using (true);

-- Menu items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  description text not null default '',
  price numeric not null check (price >= 0),
  image_url text not null default '',
  is_available boolean not null default true,
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

create policy "menu_items are publicly readable"
  on public.menu_items for select
  using (true);

-- Admin allowlist
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "a user can check their own admin status"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- Admin-only writes on categories/menu_items
create policy "admins can insert categories"
  on public.categories for insert
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "admins can update categories"
  on public.categories for update
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "admins can delete categories"
  on public.categories for delete
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "admins can insert menu_items"
  on public.menu_items for insert
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "admins can update menu_items"
  on public.menu_items for update
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "admins can delete menu_items"
  on public.menu_items for delete
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- updated_at trigger for menu_items
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger menu_items_set_updated_at
  before update on public.menu_items
  for each row execute function public.set_updated_at();

-- Storage bucket for menu photos
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;

create policy "menu-images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "admins can upload menu-images"
  on storage.objects for insert
  with check (
    bucket_id = 'menu-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admins can update menu-images"
  on storage.objects for update
  using (
    bucket_id = 'menu-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

create policy "admins can delete menu-images"
  on storage.objects for delete
  using (
    bucket_id = 'menu-images'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );
```

- [ ] **Step 2: Apply the migration to the Supabase project**

Use the `mcp__claude_ai_Supabase__apply_migration` tool with `project_id: "xsspvdgnhelzprcqaiek"`, `name: "0001_init"`, and the SQL from Step 1 as `query`.

- [ ] **Step 3: Verify tables and bucket exist**

Use `mcp__claude_ai_Supabase__list_tables` with `project_id: "xsspvdgnhelzprcqaiek"`.
Expected: `public.categories`, `public.menu_items`, `public.admin_users` present alongside the untouched `public.kho_iphone` / `public.kho_hang_iphone`, all with `rls_enabled: true`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_init.sql
git commit -m "feat(db): add categories, menu_items, admin_users schema with RLS and storage bucket"
```

---

### Task 3: Supabase clients and shared types

**Files:**
- Create: `lib/types.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars (Task 1).
- Produces: `Category`, `MenuItem`, `MenuItemInput` types; `createBrowserSupabaseClient(): SupabaseClient`; `createServerSupabaseClient(): Promise<SupabaseClient>`; `updateSession(request: NextRequest): Promise<NextResponse>` — consumed by every data-layer, page, and middleware task below.

- [ ] **Step 1: Define shared types**

`lib/types.ts`:
```ts
export type Category = {
  id: string
  name: string
  slug: string
  display_order: number
}

export type MenuItem = {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export type MenuItemInput = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>
export type CategoryInput = Omit<Category, 'id'>
```

- [ ] **Step 2: Create the browser client**

`lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create the server client**

`lib/supabase/server.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component render — safe to ignore because
            // middleware also refreshes the session on every request.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Create the middleware session helper**

`lib/supabase/middleware.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, supabase, user }
}
```

- [ ] **Step 5: Verify the project still builds**

Run: `npm run build`
Expected: build succeeds (no tests here — this task is pure wiring, exercised by later tasks' tests).

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/supabase
git commit -m "feat: add Supabase browser/server clients and shared types"
```

---

### Task 4: Data layer — categories and menu items

**Files:**
- Create: `lib/data/categories.ts`, `lib/data/menu-items.ts`, `lib/data/admin-users.ts`
- Test: `lib/data/categories.test.ts`, `lib/data/menu-items.test.ts`, `lib/data/admin-users.test.ts`

**Interfaces:**
- Consumes: `Category`, `MenuItem`, `MenuItemInput`, `CategoryInput` (Task 3).
- Produces:
  - `getCategories(supabase): Promise<Category[]>`
  - `createCategory(supabase, input: CategoryInput): Promise<Category>`
  - `updateCategory(supabase, id: string, input: Partial<CategoryInput>): Promise<Category>`
  - `deleteCategory(supabase, id: string): Promise<void>`
  - `getMenuItems(supabase, opts?: { categorySlug?: string }): Promise<MenuItem[]>`
  - `getFeaturedMenuItems(supabase, limit?: number): Promise<MenuItem[]>`
  - `createMenuItem(supabase, input: MenuItemInput): Promise<MenuItem>`
  - `updateMenuItem(supabase, id: string, input: Partial<MenuItemInput>): Promise<MenuItem>`
  - `deleteMenuItem(supabase, id: string): Promise<void>`
  - `isAdminUser(supabase, userId: string): Promise<boolean>`
  - All consumed by pages (Tasks 8-10, 13-15) and Server Actions (Tasks 12, 14, 15).

- [ ] **Step 1: Write failing tests for categories**

`lib/data/categories.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { getCategories, createCategory, updateCategory, deleteCategory } from './categories'

function makeSupabaseMock(result: { data: unknown; error: unknown }) {
  const order = vi.fn().mockResolvedValue(result)
  const select = vi.fn().mockReturnValue({ order })
  const single = vi.fn().mockResolvedValue(result)
  const eq = vi.fn().mockReturnValue({ single })
  const insertSelect = vi.fn().mockReturnValue({ single })
  const insert = vi.fn().mockReturnValue({ select: insertSelect })
  const updateEq = vi.fn().mockReturnValue({ select: insertSelect })
  const update = vi.fn().mockReturnValue({ eq: updateEq })
  const deleteEq = vi.fn().mockResolvedValue(result)
  const del = vi.fn().mockReturnValue({ eq: deleteEq })
  return {
    from: vi.fn().mockReturnValue({ select, insert, update, delete: del, eq }),
    _select: select,
    _insert: insert,
    _update: update,
    _delete: del,
  }
}

describe('getCategories', () => {
  it('returns categories ordered by display_order', async () => {
    const categories = [{ id: '1', name: 'Cà phê', slug: 'ca-phe', display_order: 0 }]
    const supabase = makeSupabaseMock({ data: categories, error: null })

    const result = await getCategories(supabase as any)

    expect(supabase.from).toHaveBeenCalledWith('categories')
    expect(result).toEqual(categories)
  })

  it('throws when Supabase returns an error', async () => {
    const supabase = makeSupabaseMock({ data: null, error: new Error('db down') })
    await expect(getCategories(supabase as any)).rejects.toThrow('db down')
  })
})

describe('createCategory', () => {
  it('inserts a category and returns the created row', async () => {
    const created = { id: '1', name: 'Trà', slug: 'tra', display_order: 1 }
    const supabase = makeSupabaseMock({ data: created, error: null })

    const result = await createCategory(supabase as any, {
      name: 'Trà',
      slug: 'tra',
      display_order: 1,
    })

    expect(supabase._insert).toHaveBeenCalledWith([
      { name: 'Trà', slug: 'tra', display_order: 1 },
    ])
    expect(result).toEqual(created)
  })
})

describe('updateCategory', () => {
  it('updates a category by id and returns the updated row', async () => {
    const updated = { id: '1', name: 'Trà sữa', slug: 'tra', display_order: 1 }
    const supabase = makeSupabaseMock({ data: updated, error: null })

    const result = await updateCategory(supabase as any, '1', { name: 'Trà sữa' })

    expect(supabase._update).toHaveBeenCalledWith({ name: 'Trà sữa' })
    expect(result).toEqual(updated)
  })
})

describe('deleteCategory', () => {
  it('deletes a category by id', async () => {
    const supabase = makeSupabaseMock({ data: null, error: null })
    await deleteCategory(supabase as any, '1')
    expect(supabase._delete).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/data/categories.test.ts`
Expected: FAIL — `./categories` module does not exist.

- [ ] **Step 3: Implement the categories data module**

`lib/data/categories.ts`:
```ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Category, CategoryInput } from '@/lib/types'

export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function createCategory(
  supabase: SupabaseClient,
  input: CategoryInput
): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert([input]).select().single()
  if (error) throw error
  return data as Category
}

export async function updateCategory(
  supabase: SupabaseClient,
  id: string,
  input: Partial<CategoryInput>
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Category
}

export async function deleteCategory(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/data/categories.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Write failing tests for menu items**

`lib/data/menu-items.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import {
  getMenuItems,
  getFeaturedMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from './menu-items'

const sampleItem = {
  id: '1',
  category_id: 'cat-1',
  name: 'Cà Phê Đen Đá',
  description: 'Đậm đà',
  price: 39000,
  image_url: 'https://images.unsplash.com/x',
  is_available: true,
  is_featured: false,
  display_order: 0,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

function makeChain(finalResult: { data: unknown; error: unknown }) {
  const chain: any = {}
  const methods = ['select', 'eq', 'order', 'insert', 'update', 'delete']
  methods.forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain)
  })
  chain.single = vi.fn().mockResolvedValue(finalResult)
  chain.then = (resolve: any) => Promise.resolve(finalResult).then(resolve)
  return chain
}

describe('getMenuItems', () => {
  it('returns all available data without a filter', async () => {
    const chain = makeChain({ data: [sampleItem], error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    const result = await getMenuItems(supabase)

    expect(supabase.from).toHaveBeenCalledWith('menu_items')
    expect(result).toEqual([sampleItem])
  })

  it('filters by category id when categoryId is provided', async () => {
    const chain = makeChain({ data: [sampleItem], error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    await getMenuItems(supabase, { categoryId: 'cat-1' })

    expect(chain.eq).toHaveBeenCalledWith('category_id', 'cat-1')
  })
})

describe('getFeaturedMenuItems', () => {
  it('filters by is_featured and limits the result', async () => {
    const chain = makeChain({ data: [sampleItem], error: null })
    chain.limit = vi.fn().mockReturnValue(chain)
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    const result = await getFeaturedMenuItems(supabase, 4)

    expect(chain.eq).toHaveBeenCalledWith('is_featured', true)
    expect(chain.limit).toHaveBeenCalledWith(4)
    expect(result).toEqual([sampleItem])
  })
})

describe('createMenuItem', () => {
  it('inserts a menu item and returns the created row', async () => {
    const chain = makeChain({ data: sampleItem, error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any
    const { id, created_at, updated_at, ...input } = sampleItem

    const result = await createMenuItem(supabase, input)

    expect(chain.insert).toHaveBeenCalledWith([input])
    expect(result).toEqual(sampleItem)
  })
})

describe('updateMenuItem', () => {
  it('updates a menu item by id', async () => {
    const chain = makeChain({ data: { ...sampleItem, price: 42000 }, error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    const result = await updateMenuItem(supabase, '1', { price: 42000 })

    expect(chain.update).toHaveBeenCalledWith({ price: 42000 })
    expect(chain.eq).toHaveBeenCalledWith('id', '1')
    expect(result.price).toBe(42000)
  })
})

describe('deleteMenuItem', () => {
  it('deletes a menu item by id', async () => {
    const chain = makeChain({ data: null, error: null })
    const supabase = { from: vi.fn().mockReturnValue(chain) } as any

    await deleteMenuItem(supabase, '1')

    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', '1')
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run lib/data/menu-items.test.ts`
Expected: FAIL — `./menu-items` module does not exist.

- [ ] **Step 7: Implement the menu items data module**

`lib/data/menu-items.ts`:
```ts
import type { SupabaseClient } from '@supabase/supabase-js'
import type { MenuItem, MenuItemInput } from '@/lib/types'

export async function getMenuItems(
  supabase: SupabaseClient,
  opts: { categoryId?: string } = {}
): Promise<MenuItem[]> {
  let query = supabase.from('menu_items').select('*').order('display_order', { ascending: true })

  if (opts.categoryId) {
    query = query.eq('category_id', opts.categoryId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as MenuItem[]
}

export async function getFeaturedMenuItems(
  supabase: SupabaseClient,
  limit = 4
): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data as MenuItem[]
}

export async function createMenuItem(
  supabase: SupabaseClient,
  input: MenuItemInput
): Promise<MenuItem> {
  const { data, error } = await supabase.from('menu_items').insert([input]).select().single()
  if (error) throw error
  return data as MenuItem
}

export async function updateMenuItem(
  supabase: SupabaseClient,
  id: string,
  input: Partial<MenuItemInput>
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as MenuItem
}

export async function deleteMenuItem(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run lib/data/menu-items.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 9: Write failing test for admin-users, then implement**

`lib/data/admin-users.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { isAdminUser } from './admin-users'

describe('isAdminUser', () => {
  it('returns true when a matching row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { user_id: 'u1' }, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const supabase = { from: vi.fn().mockReturnValue({ select }) } as any

    expect(await isAdminUser(supabase, 'u1')).toBe(true)
    expect(supabase.from).toHaveBeenCalledWith('admin_users')
    expect(eq).toHaveBeenCalledWith('user_id', 'u1')
  })

  it('returns false when no matching row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
    const eq = vi.fn().mockReturnValue({ maybeSingle })
    const select = vi.fn().mockReturnValue({ eq })
    const supabase = { from: vi.fn().mockReturnValue({ select }) } as any

    expect(await isAdminUser(supabase, 'u2')).toBe(false)
  })
})
```

Run: `npx vitest run lib/data/admin-users.test.ts` — expect FAIL (module missing).

`lib/data/admin-users.ts`:
```ts
import type { SupabaseClient } from '@supabase/supabase-js'

export async function isAdminUser(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data !== null
}
```

Run: `npx vitest run lib/data/admin-users.test.ts` — expect PASS (2 tests).

- [ ] **Step 10: Commit**

```bash
git add lib/data
git commit -m "feat: add categories/menu-items/admin-users data layer with tests"
```

---

### Task 5: Utility functions — price formatting and menu filtering

**Files:**
- Create: `lib/utils/format-price.ts`, `lib/utils/filter-menu-items.ts`
- Test: `lib/utils/format-price.test.ts`, `lib/utils/filter-menu-items.test.ts`

**Interfaces:**
- Consumes: `MenuItem` (Task 3).
- Produces: `formatPriceVND(price: number): string`, `filterMenuItems(items: MenuItem[], opts: { categoryId?: string; search?: string }): MenuItem[]` — consumed by `MenuItemCard` (Task 9), `MenuBrowser` (Task 9), admin menu list (Task 15).

- [ ] **Step 1: Write failing test for `formatPriceVND`**

`lib/utils/format-price.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { formatPriceVND } from './format-price'

describe('formatPriceVND', () => {
  it('formats thousands with a dot separator and a đ suffix', () => {
    expect(formatPriceVND(39000)).toBe('39.000đ')
  })

  it('formats large numbers correctly', () => {
    expect(formatPriceVND(1250000)).toBe('1.250.000đ')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/utils/format-price.test.ts`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `formatPriceVND`**

`lib/utils/format-price.ts`:
```ts
export function formatPriceVND(price: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(price)}đ`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/utils/format-price.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Write failing test for `filterMenuItems`**

`lib/utils/filter-menu-items.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { filterMenuItems } from './filter-menu-items'
import type { MenuItem } from '@/lib/types'

function makeItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: '1',
    category_id: 'cat-1',
    name: 'Cà Phê Đen Đá',
    description: 'Đậm đà, thơm nồng',
    price: 39000,
    image_url: '',
    is_available: true,
    is_featured: false,
    display_order: 0,
    created_at: '',
    updated_at: '',
    ...overrides,
  }
}

describe('filterMenuItems', () => {
  const items = [
    makeItem({ id: '1', category_id: 'cat-1', name: 'Cà Phê Đen Đá' }),
    makeItem({ id: '2', category_id: 'cat-2', name: 'Trà Sen Vàng' }),
    makeItem({ id: '3', category_id: 'cat-1', name: 'Bạc Xỉu' }),
  ]

  it('returns all items when no filters are given', () => {
    expect(filterMenuItems(items, {})).toHaveLength(3)
  })

  it('filters by categoryId', () => {
    const result = filterMenuItems(items, { categoryId: 'cat-1' })
    expect(result.map((i) => i.id)).toEqual(['1', '3'])
  })

  it('filters by case-insensitive, accent-insensitive search on name', () => {
    const result = filterMenuItems(items, { search: 'ca phe' })
    expect(result.map((i) => i.id)).toEqual(['1'])
  })

  it('combines categoryId and search', () => {
    const result = filterMenuItems(items, { categoryId: 'cat-1', search: 'bac' })
    expect(result.map((i) => i.id)).toEqual(['3'])
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run lib/utils/filter-menu-items.test.ts`
Expected: FAIL — module missing.

- [ ] **Step 7: Implement `filterMenuItems`**

`lib/utils/filter-menu-items.ts`:
```ts
import type { MenuItem } from '@/lib/types'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function filterMenuItems(
  items: MenuItem[],
  opts: { categoryId?: string; search?: string }
): MenuItem[] {
  return items.filter((item) => {
    if (opts.categoryId && item.category_id !== opts.categoryId) return false
    if (opts.search && !normalize(item.name).includes(normalize(opts.search))) return false
    return true
  })
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run lib/utils/filter-menu-items.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 9: Commit**

```bash
git add lib/utils/format-price.ts lib/utils/format-price.test.ts lib/utils/filter-menu-items.ts lib/utils/filter-menu-items.test.ts
git commit -m "feat: add price formatting and menu filtering utilities with tests"
```

---

### Task 6: Seed data — categories and 25 menu items

**Files:**
- Create: `supabase/seed/seed-data.ts`

**Interfaces:**
- Consumes: `createCategory`, `createMenuItem` (Task 4), `CategoryInput`, `MenuItemInput` (Task 3).
- Produces: populated `categories` and `menu_items` tables, consumed by every public page (Tasks 8-10) and the admin list pages (Task 15).

- [ ] **Step 1: Write the seed script**

`supabase/seed/seed-data.ts`:
```ts
import { createClient } from '@supabase/supabase-js'
import type { CategoryInput, MenuItemInput } from '@/lib/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

const categories: CategoryInput[] = [
  { name: 'Cà phê phin truyền thống', slug: 'ca-phe-phin', display_order: 0 },
  { name: 'Espresso & cà phê máy', slug: 'espresso', display_order: 1 },
  { name: 'Cold Brew & Đặc biệt', slug: 'cold-brew', display_order: 2 },
  { name: 'Cà phê & trà trái cây', slug: 'trai-cay', display_order: 3 },
  { name: 'Trà & thảo mộc', slug: 'tra-thao-moc', display_order: 4 },
  { name: 'Đá xay / Sinh tố & Bánh', slug: 'da-xay-banh', display_order: 5 },
]

type SeedItem = {
  categorySlug: string
  name: string
  description: string
  price: number
  image_url: string
  is_featured?: boolean
}

const items: SeedItem[] = [
  // A. Cà phê phin truyền thống
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Đen Đá', description: 'Đậm đà, thơm nồng hương cà phê phin truyền thống.', price: 39000, image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800', is_featured: true },
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Sữa Đá', description: 'Vị béo ngậy của sữa đặc hòa cùng cà phê phin đậm đà.', price: 45000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800', is_featured: true },
  { categorySlug: 'ca-phe-phin', name: 'Bạc Xỉu', description: 'Nhiều sữa, ít cà phê — dịu nhẹ, dễ uống.', price: 45000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800' },
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Muối', description: 'Kem muối béo mịn phủ trên cà phê đen đậm đà.', price: 49000, image_url: 'https://images.unsplash.com/photo-1621912450937-77fabc154e00?w=800' },
  { categorySlug: 'ca-phe-phin', name: 'Cà Phê Trứng', description: 'Lớp kem trứng đánh bông mịn màng, béo thơm đặc trưng.', price: 55000, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800' },

  // B. Espresso & cà phê máy hiện đại
  { categorySlug: 'espresso', name: 'Espresso', description: 'Tách espresso nguyên bản, đậm vị cà phê rang xay.', price: 45000, image_url: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=800' },
  { categorySlug: 'espresso', name: 'Americano', description: 'Espresso pha loãng cùng nước nóng, thanh nhẹ.', price: 49000, image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800' },
  { categorySlug: 'espresso', name: 'Cappuccino', description: 'Espresso, sữa nóng và lớp bọt sữa dày mịn.', price: 55000, image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800', is_featured: true },
  { categorySlug: 'espresso', name: 'Latte', description: 'Espresso hòa quyện cùng sữa tươi béo mịn.', price: 58000, image_url: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=800' },
  { categorySlug: 'espresso', name: 'Caramel Macchiato', description: 'Latte phủ sốt caramel ngọt ngào, thơm béo.', price: 65000, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800' },

  // C. Cold Brew & Đặc biệt
  { categorySlug: 'cold-brew', name: 'Cold Brew Nguyên Bản', description: 'Cà phê ủ lạnh 12 giờ, vị êm dịu, ít chua.', price: 55000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800' },
  { categorySlug: 'cold-brew', name: 'Cold Brew Sữa Dừa', description: 'Cold brew kết hợp sữa dừa béo thơm.', price: 62000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800' },
  { categorySlug: 'cold-brew', name: 'Espresso Tonic', description: 'Espresso hòa cùng soda tonic sảng khoái.', price: 60000, image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800' },

  // D. Cà phê & trà trái cây
  { categorySlug: 'trai-cay', name: 'Cà Phê Xoài Sữa Dừa', description: 'Vị chua ngọt xoài chín hòa cùng cà phê và sữa dừa.', price: 62000, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800', is_featured: true },
  { categorySlug: 'trai-cay', name: 'Americano Quýt Vải', description: 'Thanh mát vị quýt và vải, hòa quyện cùng espresso.', price: 58000, image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800' },
  { categorySlug: 'trai-cay', name: 'Cold Brew Đào', description: 'Cold brew kết hợp siro đào ngọt dịu.', price: 58000, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800' },
  { categorySlug: 'trai-cay', name: 'Trà Đào Cam Sả', description: 'Trà đào thơm mát cùng cam tươi và sả.', price: 55000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800' },

  // E. Trà & thức uống thảo mộc
  { categorySlug: 'tra-thao-moc', name: 'Trà Sen Vàng', description: 'Hương sen thanh khiết, vị trà dịu nhẹ.', price: 45000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800' },
  { categorySlug: 'tra-thao-moc', name: 'Trà Thái Xanh Kem Cheese', description: 'Trà xanh Thái đậm vị, phủ kem cheese béo mặn.', price: 55000, image_url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800' },
  { categorySlug: 'tra-thao-moc', name: 'Matcha Latte', description: 'Bột trà xanh Nhật Bản hòa cùng sữa tươi béo mịn.', price: 58000, image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800', is_featured: true },
  { categorySlug: 'tra-thao-moc', name: 'Trà Gừng Mật Ong', description: 'Ấm nóng vị gừng cay nhẹ hòa cùng mật ong.', price: 45000, image_url: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800' },

  // F. Đá xay / Sinh tố & Bánh
  { categorySlug: 'da-xay-banh', name: 'Sinh Tố Bơ', description: 'Bơ sáp béo ngậy xay cùng sữa tươi mát lạnh.', price: 55000, image_url: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=800' },
  { categorySlug: 'da-xay-banh', name: 'Chocolate Đá Xay', description: 'Socola đậm đà xay đá mịn, phủ kem tươi.', price: 60000, image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800' },
  { categorySlug: 'da-xay-banh', name: 'Bánh Tiramisu', description: 'Lớp bông lan thấm cà phê, phủ kem mascarpone.', price: 65000, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800' },
  { categorySlug: 'da-xay-banh', name: 'Bánh Croissant Bơ', description: 'Vỏ bánh giòn xốp nhiều lớp, thơm bơ béo ngậy.', price: 35000, image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800' },
]

async function seed() {
  console.log('Seeding categories...')
  const slugToId = new Map<string, string>()

  for (const category of categories) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()
    if (error) throw error
    slugToId.set(category.slug, data.id)
  }

  console.log('Seeding menu items...')
  let order = 0
  for (const item of items) {
    const category_id = slugToId.get(item.categorySlug)
    if (!category_id) throw new Error(`Unknown category slug: ${item.categorySlug}`)

    const input: MenuItemInput = {
      category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      is_available: true,
      is_featured: item.is_featured ?? false,
      display_order: order++,
    }

    const { error } = await supabase.from('menu_items').insert([input])
    if (error) throw error
  }

  console.log(`Seeded ${categories.length} categories and ${items.length} menu items.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Run the seed script**

Run: `npx tsx supabase/seed/seed-data.ts` (add `tsx` as a devDependency first: `npm install -D tsx`)
Expected: console logs `Seeded 6 categories and 25 menu items.`

- [ ] **Step 3: Verify via Supabase MCP**

Use `mcp__claude_ai_Supabase__execute_sql` with `project_id: "xsspvdgnhelzprcqaiek"` and query `select count(*) from menu_items;`.
Expected: count = 25. Also run `select count(*) from categories;` — expected count = 6.

- [ ] **Step 4: Commit**

```bash
git add supabase/seed/seed-data.ts package.json package-lock.json
git commit -m "feat: seed 6 categories and 25 menu items"
```

---

### Task 7: Public layout — Header and Footer

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`
- Modify: `app/layout.tsx` (wrap children with Header/Footer)
- Test: `components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `cn` (Task 1).
- Produces: `<Header />`, `<Footer />` — consumed by `app/layout.tsx` and thus every public page.

- [ ] **Step 1: Write the failing test for Header navigation**

`components/layout/Header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders the brand name and all nav links', () => {
    render(<Header />)

    expect(screen.getByText('MỘC Coffee House')).toBeInTheDocument()

    const links = [
      ['Trang chủ', '/'],
      ['Menu', '/menu'],
      ['Về chúng tôi', '/about'],
      ['Không gian', '/gallery'],
      ['Liên hệ', '/contact'],
    ]
    for (const [label, href] of links) {
      const link = screen.getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', href)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/layout/Header.test.tsx`
Expected: FAIL — `./Header` does not exist.

- [ ] **Step 3: Implement Header**

`components/layout/Header.tsx`:
```tsx
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Không gian', href: '/gallery' },
  { label: 'Liên hệ', href: '/contact' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-forest/10 bg-brand-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-xl font-semibold text-brand-forest">
          MỘC Coffee House
        </Link>
        <nav className="flex gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-ink hover:text-brand-terracotta"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/layout/Header.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Implement Footer (no test — static content)**

`components/layout/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer className="border-t border-brand-forest/10 bg-brand-forest py-10 text-brand-cream">
      <div className="mx-auto max-w-6xl px-6 text-sm">
        <p className="font-heading text-lg">MỘC Coffee House</p>
        <p className="mt-2 opacity-90">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
        <p className="mt-1 opacity-90">Điện thoại: 0901 234 567 · Email: contact@moccoffee.vn</p>
        <p className="mt-1 opacity-90">Giờ mở cửa: 07:00 – 22:00, tất cả các ngày trong tuần</p>
        <p className="mt-6 opacity-70">&copy; {new Date().getFullYear()} MỘC Coffee House.</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: Wire Header/Footer into the root layout**

Modify `app/layout.tsx` — replace the `<body>` block:
```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
// ...keep existing imports and font setup...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Verify the app builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add components/layout app/layout.tsx
git commit -m "feat: add public Header/Footer layout"
```

---

### Task 8: Home page — Hero and Featured Items

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/FeaturedItems.tsx`
- Modify: `app/page.tsx`
- Test: `components/home/FeaturedItems.test.tsx`

**Interfaces:**
- Consumes: `getFeaturedMenuItems` (Task 4), `formatPriceVND` (Task 5), `MenuItem` (Task 3), `createServerSupabaseClient` (Task 3).
- Produces: `<Hero />`, `<FeaturedItems items={MenuItem[]} />` — consumed by `app/page.tsx` only.

- [ ] **Step 1: Write the failing test for FeaturedItems**

`components/home/FeaturedItems.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedItems } from './FeaturedItems'
import type { MenuItem } from '@/lib/types'

const items: MenuItem[] = [
  {
    id: '1',
    category_id: 'c1',
    name: 'Cà Phê Đen Đá',
    description: 'Đậm đà',
    price: 39000,
    image_url: 'https://images.unsplash.com/x',
    is_available: true,
    is_featured: true,
    display_order: 0,
    created_at: '',
    updated_at: '',
  },
]

describe('FeaturedItems', () => {
  it('renders a card per item with name and formatted price', () => {
    render(<FeaturedItems items={items} />)

    expect(screen.getByText('Cà Phê Đen Đá')).toBeInTheDocument()
    expect(screen.getByText('39.000đ')).toBeInTheDocument()
  })

  it('renders nothing extra when there are no items', () => {
    render(<FeaturedItems items={[]} />)
    expect(screen.getByText('Món nổi bật')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/home/FeaturedItems.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement FeaturedItems**

`components/home/FeaturedItems.tsx`:
```tsx
import Image from 'next/image'
import type { MenuItem } from '@/lib/types'
import { formatPriceVND } from '@/lib/utils/format-price'

export function FeaturedItems({ items }: { items: MenuItem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-center text-3xl font-semibold text-brand-forest">Món nổi bật</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg bg-brand-card shadow-sm">
            <div className="relative h-48 w-full">
              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-heading text-lg">{item.name}</h3>
              <p className="mt-1 text-brand-terracotta">{formatPriceVND(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/home/FeaturedItems.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Implement Hero (no test — static content)**

`components/home/Hero.tsx`:
```tsx
import Link from 'next/link'

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-heading text-4xl font-semibold text-brand-forest sm:text-5xl">
        MỘC Coffee House
      </h1>
      <p className="mt-4 max-w-xl text-lg text-brand-ink/80">
        Chậm lại giữa nhịp sống — Cà phê &amp; thiên nhiên
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/menu"
          className="rounded-full bg-brand-forest px-6 py-3 text-sm font-medium text-brand-cream hover:opacity-90"
        >
          Xem Menu
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-brand-forest px-6 py-3 text-sm font-medium text-brand-forest hover:bg-brand-forest hover:text-brand-cream"
        >
          Chỉ đường
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Wire the Home page**

`app/page.tsx` (replaces the Task 1 placeholder):
```tsx
import { Hero } from '@/components/home/Hero'
import { FeaturedItems } from '@/components/home/FeaturedItems'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getFeaturedMenuItems } from '@/lib/data/menu-items'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const featured = await getFeaturedMenuItems(supabase, 4)

  return (
    <main>
      <Hero />
      <FeaturedItems items={featured} />
    </main>
  )
}
```

- [ ] **Step 7: Verify with a real dev server**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: Hero renders, 4 featured items (seeded with `is_featured: true` in Task 6) show with images, names, prices.

- [ ] **Step 8: Commit**

```bash
git add components/home app/page.tsx
git commit -m "feat: build home page with hero and featured items"
```

---

### Task 9: Menu page — browse, filter, search

**Files:**
- Create: `components/menu/MenuItemCard.tsx`, `components/menu/MenuBrowser.tsx`, `app/menu/page.tsx`
- Test: `components/menu/MenuBrowser.test.tsx`

**Interfaces:**
- Consumes: `filterMenuItems` (Task 5), `formatPriceVND` (Task 5), `getMenuItems`, `getCategories` (Task 4), `MenuItem`, `Category` (Task 3).
- Produces: `<MenuItemCard item={MenuItem} />`, `<MenuBrowser items={MenuItem[]} categories={Category[]} />` — consumed by `app/menu/page.tsx` only.

- [ ] **Step 1: Implement MenuItemCard (no test — presentational, exercised via MenuBrowser tests)**

`components/menu/MenuItemCard.tsx`:
```tsx
import Image from 'next/image'
import type { MenuItem } from '@/lib/types'
import { formatPriceVND } from '@/lib/utils/format-price'

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="overflow-hidden rounded-lg bg-brand-card shadow-sm">
      <div className="relative h-40 w-full">
        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
        {!item.is_available && (
          <span className="absolute right-2 top-2 rounded bg-brand-ink/80 px-2 py-1 text-xs text-brand-cream">
            Hết hàng
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg">{item.name}</h3>
        <p className="mt-1 text-sm text-brand-ink/70">{item.description}</p>
        <p className="mt-2 font-medium text-brand-terracotta">{formatPriceVND(item.price)}</p>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Write the failing test for MenuBrowser**

`components/menu/MenuBrowser.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuBrowser } from './MenuBrowser'
import type { Category, MenuItem } from '@/lib/types'

const categories: Category[] = [
  { id: 'c1', name: 'Cà phê phin', slug: 'ca-phe-phin', display_order: 0 },
  { id: 'c2', name: 'Trà', slug: 'tra', display_order: 1 },
]

function makeItem(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: '1',
    category_id: 'c1',
    name: 'Cà Phê Đen Đá',
    description: '',
    price: 39000,
    image_url: 'https://images.unsplash.com/x',
    is_available: true,
    is_featured: false,
    display_order: 0,
    created_at: '',
    updated_at: '',
    ...overrides,
  }
}

const items: MenuItem[] = [
  makeItem({ id: '1', category_id: 'c1', name: 'Cà Phê Đen Đá' }),
  makeItem({ id: '2', category_id: 'c2', name: 'Trà Sen Vàng' }),
]

describe('MenuBrowser', () => {
  it('renders all items by default', () => {
    render(<MenuBrowser items={items} categories={categories} />)
    expect(screen.getByText('Cà Phê Đen Đá')).toBeInTheDocument()
    expect(screen.getByText('Trà Sen Vàng')).toBeInTheDocument()
  })

  it('filters by category when a category button is clicked', async () => {
    const user = userEvent.setup()
    render(<MenuBrowser items={items} categories={categories} />)

    await user.click(screen.getByRole('button', { name: 'Trà' }))

    expect(screen.queryByText('Cà Phê Đen Đá')).not.toBeInTheDocument()
    expect(screen.getByText('Trà Sen Vàng')).toBeInTheDocument()
  })

  it('filters by search text', async () => {
    const user = userEvent.setup()
    render(<MenuBrowser items={items} categories={categories} />)

    await user.type(screen.getByPlaceholderText('Tìm món...'), 'sen')

    expect(screen.queryByText('Cà Phê Đen Đá')).not.toBeInTheDocument()
    expect(screen.getByText('Trà Sen Vàng')).toBeInTheDocument()
  })
})
```

Add `@testing-library/user-event` to `package.json` devDependencies (`^14.5.2`) and run `npm install`.

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run components/menu/MenuBrowser.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 4: Implement MenuBrowser**

`components/menu/MenuBrowser.tsx`:
```tsx
'use client'

import { useMemo, useState } from 'react'
import type { Category, MenuItem } from '@/lib/types'
import { filterMenuItems } from '@/lib/utils/filter-menu-items'
import { MenuItemCard } from './MenuItemCard'

export function MenuBrowser({
  items,
  categories,
}: {
  items: MenuItem[]
  categories: Category[]
}) {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => filterMenuItems(items, { categoryId, search }),
    [items, categoryId, search]
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Tìm món..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-full border border-brand-forest/20 px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setCategoryId(undefined)}
          className={`rounded-full px-4 py-2 text-sm ${
            categoryId === undefined ? 'bg-brand-forest text-brand-cream' : 'bg-brand-card'
          }`}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryId(category.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              categoryId === category.id ? 'bg-brand-forest text-brand-cream' : 'bg-brand-card'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/menu/MenuBrowser.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 6: Wire the Menu page**

`app/menu/page.tsx`:
```tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/lib/data/menu-items'
import { getCategories } from '@/lib/data/categories'
import { MenuBrowser } from '@/components/menu/MenuBrowser'

export const metadata = { title: 'Menu — MỘC Coffee House' }

export default async function MenuPage() {
  const supabase = await createServerSupabaseClient()
  const [items, categories] = await Promise.all([
    getMenuItems(supabase),
    getCategories(supabase),
  ])

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-semibold text-brand-forest">Menu</h1>
      <div className="mt-10">
        <MenuBrowser items={items} categories={categories} />
      </div>
    </main>
  )
}
```

- [ ] **Step 7: Verify with a real dev server**

Run: `npm run dev`, open `http://localhost:3000/menu`.
Expected: 25 seeded items render; category buttons and search box filter correctly.

- [ ] **Step 8: Commit**

```bash
git add components/menu app/menu package.json
git commit -m "feat: build menu page with category filter and search"
```

---

### Task 10: About and Gallery pages

**Files:**
- Create: `app/about/page.tsx`, `app/gallery/page.tsx`

**Interfaces:**
- Consumes: nothing dynamic (static content per plan.md §0/§4).
- Produces: `/about`, `/gallery` routes.

- [ ] **Step 1: Implement the About page**

`app/about/page.tsx`:
```tsx
import Image from 'next/image'

export const metadata = { title: 'Về chúng tôi — MỘC Coffee House' }

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-brand-forest">Về chúng tôi</h1>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-lg">
        <Image
          src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200"
          alt="Không gian MỘC Coffee House"
          fill
          className="object-cover"
        />
      </div>
      <p className="mt-8 leading-relaxed text-brand-ink/90">
        MỘC Coffee House lấy cảm hứng từ cà phê Việt truyền thống, kết hợp không gian mộc mạc
        với chất liệu gỗ, cây xanh và ánh sáng tự nhiên — nơi khách &quot;chậm lại&quot; giữa
        nhịp sống hiện đại.
      </p>
      <h2 className="mt-10 font-heading text-2xl text-brand-forest">Giá trị cốt lõi</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-brand-ink/90">
        <li>Nguyên liệu chọn lọc, cà phê rang xay mỗi ngày</li>
        <li>Không gian mộc mạc, gần gũi thiên nhiên</li>
        <li>Phục vụ tận tâm, chậm lại đúng nghĩa</li>
      </ul>
    </main>
  )
}
```

- [ ] **Step 2: Implement the Gallery page**

`app/gallery/page.tsx`:
```tsx
import Image from 'next/image'

export const metadata = { title: 'Không gian quán — MỘC Coffee House' }

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=900',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=900',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900',
  'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=900',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900',
]

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-center text-3xl font-semibold text-brand-forest">Không gian quán</h1>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY_IMAGES.map((src) => (
          <div key={src} className="relative h-64 w-full overflow-hidden rounded-lg">
            <Image src={src} alt="Không gian MỘC Coffee House" fill className="object-cover" />
          </div>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Verify with a real dev server**

Run: `npm run dev`, open `http://localhost:3000/about` and `http://localhost:3000/gallery`.
Expected: both pages render with images and text, no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/about app/gallery
git commit -m "feat: build about and gallery pages"
```

---

### Task 11: Contact page — form and map

**Files:**
- Create: `components/contact/ContactForm.tsx`, `app/contact/page.tsx`
- Test: `components/contact/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `cn` (Task 1).
- Produces: `<ContactForm />` — consumed by `app/contact/page.tsx` only. Client-side validation only; no submission persistence (Global Constraints — no `contact_messages` table in scope).

- [ ] **Step 1: Write the failing test for ContactForm validation**

`components/contact/ContactForm.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('shows a validation error when submitting with an empty name', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Gửi' }))

    expect(await screen.findByText('Vui lòng nhập tên')).toBeInTheDocument()
  })

  it('shows a success message after submitting valid data', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Tên'), 'Nguyễn Văn A')
    await user.type(screen.getByLabelText('Email'), 'a@example.com')
    await user.type(screen.getByLabelText('Lời nhắn'), 'Tôi muốn hỏi về giờ mở cửa')
    await user.click(screen.getByRole('button', { name: 'Gửi' }))

    expect(
      await screen.findByText('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.')
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/contact/ContactForm.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement ContactForm**

`components/contact/ContactForm.tsx`:
```tsx
'use client'

import { useState, type FormEvent } from 'react'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên')
      return
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }
    setError(null)
    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-brand-forest">Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium">
          Tên
        </label>
        <input
          id="contact-name"
          aria-label="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          aria-label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Lời nhắn
        </label>
        <textarea
          id="contact-message"
          aria-label="Lời nhắn"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-brand-forest px-6 py-3 text-sm font-medium text-brand-cream hover:opacity-90"
      >
        Gửi
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/contact/ContactForm.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Wire the Contact page with a Google Maps embed**

`app/contact/page.tsx`:
```tsx
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = { title: 'Liên hệ — MỘC Coffee House' }

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-brand-forest">Liên hệ</h1>
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <p className="text-brand-ink/90">123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
          <p className="mt-2 text-brand-ink/90">Điện thoại: 0901 234 567</p>
          <p className="mt-2 text-brand-ink/90">Email: contact@moccoffee.vn</p>
          <p className="mt-2 text-brand-ink/90">Giờ mở cửa: 07:00 – 22:00, tất cả các ngày trong tuần</p>
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              title="Bản đồ MỘC Coffee House"
              className="h-full w-full"
              loading="lazy"
              src="https://www.google.com/maps?q=123+Nguy%E1%BB%85n+Hu%E1%BB%87+Qu%E1%BA%ADn+1+TP+H%E1%BB%93+Ch%C3%AD+Minh&output=embed"
            />
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  )
}
```

- [ ] **Step 6: Verify with a real dev server**

Run: `npm run dev`, open `http://localhost:3000/contact`.
Expected: map iframe loads, form validates and shows the thank-you message.

- [ ] **Step 7: Commit**

```bash
git add components/contact app/contact
git commit -m "feat: build contact page with form and map embed"
```

---

### Task 12: Admin authentication — login page and route guard

**Files:**
- Create: `app/admin/login/page.tsx`, `app/admin/login/actions.ts`, `middleware.ts`
- Test: `lib/supabase/admin-guard.test.ts`, `lib/supabase/admin-guard.ts`

**Interfaces:**
- Consumes: `createServerSupabaseClient` (Task 3), `updateSession` (Task 3), `isAdminUser` (Task 4).
- Produces: `isAdminPath(pathname: string): boolean`, `signIn(prevState, formData): Promise<{ error?: string }>` — consumed by the admin layout guard (Task 13) and root `middleware.ts`.

- [ ] **Step 1: Write the failing test for the path-matching helper**

`lib/supabase/admin-guard.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { isProtectedAdminPath } from './admin-guard'

describe('isProtectedAdminPath', () => {
  it('protects /admin and nested admin routes', () => {
    expect(isProtectedAdminPath('/admin')).toBe(true)
    expect(isProtectedAdminPath('/admin/menu')).toBe(true)
    expect(isProtectedAdminPath('/admin/menu/new')).toBe(true)
  })

  it('does not protect the login page', () => {
    expect(isProtectedAdminPath('/admin/login')).toBe(false)
  })

  it('does not protect public routes', () => {
    expect(isProtectedAdminPath('/menu')).toBe(false)
    expect(isProtectedAdminPath('/')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/supabase/admin-guard.test.ts`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement the helper**

`lib/supabase/admin-guard.ts`:
```ts
export function isProtectedAdminPath(pathname: string): boolean {
  if (!pathname.startsWith('/admin')) return false
  if (pathname === '/admin/login') return false
  return true
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/supabase/admin-guard.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Implement the root middleware**

`middleware.ts`:
```ts
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isProtectedAdminPath } from '@/lib/supabase/admin-guard'
import { isAdminUser } from '@/lib/data/admin-users'

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request)

  if (!isProtectedAdminPath(request.nextUrl.pathname)) {
    return response
  }

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const isAdmin = await isAdminUser(supabase, user.id)
  if (!isAdmin) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 6: Implement the sign-in Server Action**

`app/admin/login/actions.ts`:
```ts
'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function signIn(_prevState: { error?: string }, formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email hoặc mật khẩu không đúng.' }
  }

  redirect('/admin')
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
```

- [ ] **Step 7: Implement the login page**

`app/admin/login/page.tsx`:
```tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signIn } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-brand-forest px-6 py-3 text-sm font-medium text-brand-cream hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </button>
  )
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(signIn, {})

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-brand-forest">Đăng nhập quản trị</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
          />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <SubmitButton />
      </form>
    </main>
  )
}
```

- [ ] **Step 8: Verify the guard redirects unauthenticated users**

Run: `npm run dev`, open `http://localhost:3000/admin`.
Expected: redirected to `/admin/login` (no session yet — the first admin account is created in Task 13 Step 6).

- [ ] **Step 9: Commit**

```bash
git add middleware.ts lib/supabase/admin-guard.ts lib/supabase/admin-guard.test.ts app/admin/login
git commit -m "feat: add admin login page and route guard middleware"
```

---

### Task 13: Admin shell — protected layout, dashboard, first admin account

**Files:**
- Create: `components/admin/AdminNav.tsx`, `app/admin/layout.tsx`, `app/admin/page.tsx`

**Interfaces:**
- Consumes: `createServerSupabaseClient` (Task 3), `getCategories`, `getMenuItems` (Task 4), `signOut` (Task 12).
- Produces: `<AdminNav />` — consumed by `app/admin/layout.tsx` only.

- [ ] **Step 1: Implement AdminNav**

`components/admin/AdminNav.tsx`:
```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/admin/login/actions'

const LINKS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Menu', href: '/admin/menu' },
  { label: 'Danh mục', href: '/admin/categories' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between border-b border-brand-forest/10 bg-brand-card px-6 py-4">
      <div className="flex gap-6">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium ${
              pathname === link.href ? 'text-brand-terracotta' : 'text-brand-ink'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <form action={signOut}>
        <button type="submit" className="text-sm text-brand-ink/70 hover:text-brand-ink">
          Đăng xuất
        </button>
      </form>
    </nav>
  )
}
```

- [ ] **Step 2: Implement the protected admin layout**

`app/admin/layout.tsx`:
```tsx
import { AdminNav } from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  )
}
```

Note: this layout does not itself check auth — `middleware.ts` (Task 12) already redirects unauthenticated/non-admin requests before any `/admin/**` page renders, including this layout and everything under it.

- [ ] **Step 3: Implement the dashboard page**

`app/admin/page.tsx`:
```tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/data/categories'
import { getMenuItems } from '@/lib/data/menu-items'

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()
  const [categories, items] = await Promise.all([
    getCategories(supabase),
    getMenuItems(supabase),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Tổng số món</p>
          <p className="mt-1 text-2xl font-semibold">{items.length}</p>
        </div>
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Danh mục</p>
          <p className="mt-1 text-2xl font-semibold">{categories.length}</p>
        </div>
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Còn bán</p>
          <p className="mt-1 text-2xl font-semibold">
            {items.filter((i) => i.is_available).length}
          </p>
        </div>
        <div className="rounded-lg bg-brand-card p-4">
          <p className="text-sm text-brand-ink/70">Món nổi bật</p>
          <p className="mt-1 text-2xl font-semibold">
            {items.filter((i) => i.is_featured).length}
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create the first admin account (Supabase Auth + allowlist)**

Ask the user for the email/password they want to use for the first admin login. Then:

1. Use `mcp__claude_ai_Supabase__execute_sql` with `project_id: "xsspvdgnhelzprcqaiek"` to check `select id, email from auth.users;` for an existing matching user, or create one via the Supabase dashboard (Authentication → Users → Add user) since the MCP toolset here does not expose a create-auth-user call.
2. Once the user exists, insert them into the allowlist:
   `insert into public.admin_users (user_id) select id from auth.users where email = '<the email>';`
   via `mcp__claude_ai_Supabase__execute_sql`.

- [ ] **Step 5: Verify end-to-end login**

Run: `npm run dev`, open `http://localhost:3000/admin/login`, sign in with the account from Step 4.
Expected: redirected to `/admin`, dashboard shows 25 total items, 6 categories, 25 available, 4 featured.

- [ ] **Step 6: Commit**

```bash
git add components/admin/AdminNav.tsx app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat: add protected admin shell with dashboard"
```

---

### Task 14: Admin — category management

**Files:**
- Create: `components/admin/CategoryForm.tsx`, `app/admin/categories/page.tsx`, `app/admin/categories/actions.ts`
- Test: `components/admin/CategoryForm.test.tsx`

**Interfaces:**
- Consumes: `createCategory`, `updateCategory`, `deleteCategory`, `getCategories` (Task 4), `createServerSupabaseClient` (Task 3).
- Produces: `<CategoryForm category?: Category, onSubmit: (input: CategoryInput) => void>` — consumed by `app/admin/categories/page.tsx` only.

- [ ] **Step 1: Write the failing test for CategoryForm validation**

`components/admin/CategoryForm.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CategoryForm } from './CategoryForm'

describe('CategoryForm', () => {
  it('rejects an empty name', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<CategoryForm onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Lưu' }))

    expect(await screen.findByText('Vui lòng nhập tên danh mục')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits name, an auto-generated slug, and display_order', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<CategoryForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Tên danh mục'), 'Trà trái cây')
    await user.click(screen.getByRole('button', { name: 'Lưu' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Trà trái cây',
      slug: 'tra-trai-cay',
      display_order: 0,
    })
  })

  it('pre-fills fields when editing an existing category', () => {
    render(
      <CategoryForm
        category={{ id: '1', name: 'Trà', slug: 'tra', display_order: 2 }}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Tên danh mục')).toHaveValue('Trà')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/admin/CategoryForm.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement CategoryForm**

`components/admin/CategoryForm.tsx`:
```tsx
'use client'

import { useState, type FormEvent } from 'react'
import type { Category, CategoryInput } from '@/lib/types'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function CategoryForm({
  category,
  onSubmit,
}: {
  category?: Category
  onSubmit: (input: CategoryInput) => void
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên danh mục')
      return
    }
    setError(null)
    onSubmit({
      name: name.trim(),
      slug: category?.slug ?? slugify(name),
      display_order: category?.display_order ?? 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category-name" className="block text-sm font-medium">
          Tên danh mục
        </label>
        <input
          id="category-name"
          aria-label="Tên danh mục"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-medium text-brand-cream"
      >
        Lưu
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/admin/CategoryForm.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Implement Server Actions**

`app/admin/categories/actions.ts`:
```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createCategory, updateCategory, deleteCategory } from '@/lib/data/categories'
import type { CategoryInput } from '@/lib/types'

export async function createCategoryAction(input: CategoryInput) {
  const supabase = await createServerSupabaseClient()
  await createCategory(supabase, input)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}

export async function updateCategoryAction(id: string, input: CategoryInput) {
  const supabase = await createServerSupabaseClient()
  await updateCategory(supabase, id, input)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}

export async function deleteCategoryAction(id: string) {
  const supabase = await createServerSupabaseClient()
  await deleteCategory(supabase, id)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}
```

- [ ] **Step 6: Implement the categories admin page**

`app/admin/categories/page.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { CategoryForm } from '@/components/admin/CategoryForm'
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from './actions'
import type { Category, CategoryInput } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)

  async function reload() {
    const supabase = createBrowserSupabaseClient()
    setCategories(await getCategories(supabase))
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleSubmit(input: CategoryInput) {
    if (editing) {
      await updateCategoryAction(editing.id, input)
    } else {
      await createCategoryAction(input)
    }
    setEditing(null)
    await reload()
  }

  async function handleDelete(id: string) {
    await deleteCategoryAction(id)
    await reload()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Quản lý danh mục</h1>

      <div className="mt-6 max-w-md">
        <CategoryForm category={editing ?? undefined} onSubmit={handleSubmit} />
      </div>

      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-forest/10">
            <th className="py-2">Tên</th>
            <th className="py-2">Slug</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-brand-forest/5">
              <td className="py-2">{category.name}</td>
              <td className="py-2 text-brand-ink/60">{category.slug}</td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => setEditing(category)}
                  className="mr-3 text-brand-terracotta"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 7: Verify with a real dev server**

Run: `npm run dev`, sign in, open `http://localhost:3000/admin/categories`.
Expected: 6 seeded categories listed; create/edit/delete work and reflect immediately on `/menu`.

- [ ] **Step 8: Commit**

```bash
git add components/admin/CategoryForm.tsx components/admin/CategoryForm.test.tsx app/admin/categories
git commit -m "feat: add admin category management"
```

---

### Task 15: Admin — menu item management with image upload

**Files:**
- Create: `components/admin/ImageUpload.tsx`, `components/admin/MenuItemForm.tsx`, `app/admin/menu/page.tsx`, `app/admin/menu/new/page.tsx`, `app/admin/menu/[id]/edit/page.tsx`, `app/admin/menu/actions.ts`
- Test: `components/admin/ImageUpload.test.tsx`, `components/admin/MenuItemForm.test.tsx`

**Interfaces:**
- Consumes: `createMenuItem`, `updateMenuItem`, `deleteMenuItem`, `getMenuItems` (Task 4), `getCategories` (Task 4), `createBrowserSupabaseClient` (Task 3), `formatPriceVND` (Task 5).
- Produces: `<ImageUpload value={string} onChange={(url: string) => void}>`, `<MenuItemForm item?: MenuItem, categories: Category[], onSubmit: (input: MenuItemInput) => void>`.

- [ ] **Step 1: Write the failing test for ImageUpload**

`components/admin/ImageUpload.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from './ImageUpload'

vi.mock('@/lib/supabase/client', () => ({
  createBrowserSupabaseClient: () => ({
    storage: {
      from: () => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: () => ({
          data: { publicUrl: 'https://xsspvdgnhelzprcqaiek.supabase.co/storage/v1/object/public/menu-images/x.jpg' },
        }),
      }),
    },
  }),
}))

describe('ImageUpload', () => {
  it('shows the current image when a value is set', () => {
    render(<ImageUpload value="https://images.unsplash.com/x" onChange={vi.fn()} />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://images.unsplash.com/x')
  })

  it('uploads a selected file and calls onChange with the public URL', async () => {
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
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/admin/ImageUpload.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement ImageUpload**

`components/admin/ImageUpload.tsx`:
```tsx
'use client'

import { useState, type ChangeEvent } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

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

    const supabase = createBrowserSupabaseClient()
    const path = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('menu-images').upload(path, file)

    if (uploadError) {
      setError('Tải ảnh lên thất bại. Vui lòng thử lại.')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
    onChange(data.publicUrl)
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/admin/ImageUpload.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Write the failing test for MenuItemForm validation**

`components/admin/MenuItemForm.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuItemForm } from './MenuItemForm'
import type { Category } from '@/lib/types'

vi.mock('@/lib/supabase/client', () => ({
  createBrowserSupabaseClient: () => ({
    storage: { from: () => ({ upload: vi.fn(), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  }),
}))

const categories: Category[] = [
  { id: 'c1', name: 'Cà phê phin', slug: 'ca-phe-phin', display_order: 0 },
]

describe('MenuItemForm', () => {
  it('rejects an empty name or a non-positive price', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MenuItemForm categories={categories} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Giá (đ)'), '0')
    await user.click(screen.getByRole('button', { name: 'Lưu món' }))

    expect(await screen.findByText('Vui lòng nhập tên món')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a complete, valid input', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()
    render(<MenuItemForm categories={categories} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Tên món'), 'Latte Đá')
    await user.type(screen.getByLabelText('Mô tả'), 'Espresso và sữa tươi')
    await user.type(screen.getByLabelText('Giá (đ)'), '58000')
    await user.click(screen.getByRole('button', { name: 'Lưu món' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Latte Đá',
      description: 'Espresso và sữa tươi',
      price: 58000,
      category_id: 'c1',
      image_url: '',
      is_available: true,
      is_featured: false,
      display_order: 0,
    })
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/admin/MenuItemForm.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 7: Implement MenuItemForm**

`components/admin/MenuItemForm.tsx`:
```tsx
'use client'

import { useState, type FormEvent } from 'react'
import type { Category, MenuItem, MenuItemInput } from '@/lib/types'
import { ImageUpload } from './ImageUpload'

export function MenuItemForm({
  item,
  categories,
  onSubmit,
}: {
  item?: MenuItem
  categories: Category[]
  onSubmit: (input: MenuItemInput) => void
}) {
  const [name, setName] = useState(item?.name ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [price, setPrice] = useState(item?.price ?? 0)
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? '')
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '')
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true)
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên món')
      return
    }
    if (price <= 0) {
      setError('Giá phải lớn hơn 0')
      return
    }
    setError(null)
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price,
      category_id: categoryId,
      image_url: imageUrl,
      is_available: isAvailable,
      is_featured: isFeatured,
      display_order: item?.display_order ?? 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="item-name" className="block text-sm font-medium">
          Tên món
        </label>
        <input
          id="item-name"
          aria-label="Tên món"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="item-description" className="block text-sm font-medium">
          Mô tả
        </label>
        <textarea
          id="item-description"
          aria-label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="item-price" className="block text-sm font-medium">
          Giá (đ)
        </label>
        <input
          id="item-price"
          aria-label="Giá (đ)"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="item-category" className="block text-sm font-medium">
          Danh mục
        </label>
        <select
          id="item-category"
          aria-label="Danh mục"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full rounded border border-brand-forest/20 px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <ImageUpload value={imageUrl} onChange={setImageUrl} />
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Còn bán
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Món nổi bật
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-medium text-brand-cream"
      >
        Lưu món
      </button>
    </form>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/admin/MenuItemForm.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 9: Implement Server Actions**

`app/admin/menu/actions.ts`:
```ts
'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/data/menu-items'
import type { MenuItemInput } from '@/lib/types'

export async function createMenuItemAction(input: MenuItemInput) {
  const supabase = await createServerSupabaseClient()
  await createMenuItem(supabase, input)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}

export async function updateMenuItemAction(id: string, input: MenuItemInput) {
  const supabase = await createServerSupabaseClient()
  await updateMenuItem(supabase, id, input)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}

export async function deleteMenuItemAction(id: string) {
  const supabase = await createServerSupabaseClient()
  await deleteMenuItem(supabase, id)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}
```

- [ ] **Step 10: Implement the menu list, new, and edit admin pages**

`app/admin/menu/page.tsx`:
```tsx
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getMenuItems } from '@/lib/data/menu-items'
import { getCategories } from '@/lib/data/categories'
import { formatPriceVND } from '@/lib/utils/format-price'
import { deleteMenuItemAction } from './actions'

export default async function AdminMenuListPage() {
  const supabase = await createServerSupabaseClient()
  const [items, categories] = await Promise.all([
    getMenuItems(supabase),
    getCategories(supabase),
  ])
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? ''

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-brand-forest">Quản lý menu</h1>
        <Link
          href="/admin/menu/new"
          className="rounded-full bg-brand-forest px-4 py-2 text-sm text-brand-cream"
        >
          + Thêm món
        </Link>
      </div>

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-forest/10">
            <th className="py-2">Tên món</th>
            <th className="py-2">Danh mục</th>
            <th className="py-2">Giá</th>
            <th className="py-2">Trạng thái</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-brand-forest/5">
              <td className="py-2">{item.name}</td>
              <td className="py-2">{categoryName(item.category_id)}</td>
              <td className="py-2">{formatPriceVND(item.price)}</td>
              <td className="py-2">{item.is_available ? 'Còn bán' : 'Hết hàng'}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/menu/${item.id}/edit`} className="mr-3 text-brand-terracotta">
                  Sửa
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await deleteMenuItemAction(item.id)
                  }}
                  className="inline"
                >
                  <button type="submit" className="text-red-600">
                    Xóa
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

`app/admin/menu/new/page.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { MenuItemForm } from '@/components/admin/MenuItemForm'
import { createMenuItemAction } from '../actions'
import type { Category, MenuItemInput } from '@/lib/types'

export default function NewMenuItemPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    getCategories(createBrowserSupabaseClient()).then(setCategories)
  }, [])

  async function handleSubmit(input: MenuItemInput) {
    await createMenuItemAction(input)
    router.push('/admin/menu')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Thêm món mới</h1>
      <div className="mt-6 max-w-lg">
        <MenuItemForm categories={categories} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
```

`app/admin/menu/[id]/edit/page.tsx`:
```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { getMenuItems } from '@/lib/data/menu-items'
import { MenuItemForm } from '@/components/admin/MenuItemForm'
import { updateMenuItemAction } from '../../actions'
import type { Category, MenuItem, MenuItemInput } from '@/lib/types'

export default function EditMenuItemPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [item, setItem] = useState<MenuItem | null>(null)
  const router = useRouter()
  const params = useParams<{ id: string }>()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    getCategories(supabase).then(setCategories)
    getMenuItems(supabase).then((items) => {
      setItem(items.find((i) => i.id === params.id) ?? null)
    })
  }, [params.id])

  async function handleSubmit(input: MenuItemInput) {
    await updateMenuItemAction(params.id, input)
    router.push('/admin/menu')
  }

  if (!item) return <p>Đang tải...</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Sửa món</h1>
      <div className="mt-6 max-w-lg">
        <MenuItemForm item={item} categories={categories} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
```

- [ ] **Step 11: Verify with a real dev server**

Run: `npm run dev`, sign in, open `http://localhost:3000/admin/menu`.
Expected: 25 items listed; add/edit/delete work; image upload stores a file in the `menu-images` bucket and the public URL is saved on the item; changes reflect on `/menu` and `/` after revalidation.

- [ ] **Step 12: Commit**

```bash
git add components/admin/ImageUpload.tsx components/admin/ImageUpload.test.tsx components/admin/MenuItemForm.tsx components/admin/MenuItemForm.test.tsx app/admin/menu
git commit -m "feat: add admin menu item management with image upload"
```

---

### Task 16: SEO — metadata, sitemap, robots

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/about/page.tsx`, `app/gallery/page.tsx` (already have `metadata` from Task 10 — verify only)

**Interfaces:**
- Consumes: nothing dynamic.
- Produces: `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 1: Implement the sitemap**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://moccoffee.vn'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/menu', '/about', '/gallery', '/contact']
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }))
}
```

- [ ] **Step 2: Implement robots.txt**

`app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    sitemap: 'https://moccoffee.vn/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify metadata exists on every public page**

Confirm `app/page.tsx`, `app/menu/page.tsx`, `app/about/page.tsx`, `app/gallery/page.tsx`, `app/contact/page.tsx` each export a `metadata` object with a `title` (all already set in Tasks 8-11 — this step is a read-through check, not new code).

- [ ] **Step 4: Verify with a real dev server**

Run: `npm run dev`, open `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt`.
Expected: both render valid XML/text listing the 5 public routes and excluding `/admin`.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots.txt for SEO"
```

---

### Task 17: Final verification pass

**Files:** none created — verification only.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all test files pass (Tasks 1, 4, 5, 7-9, 11, 12, 14, 15).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable if pre-existing in generated Next.js config).

- [ ] **Step 4: Manual responsive/functional QA checklist**

With `npm run dev` running, check in the browser at mobile (375px), tablet (768px), and desktop (1280px) widths:
- [ ] Header nav collapses/remains usable at 375px width
- [ ] Menu page: search + category filter work at all widths, cards reflow to 1/2/3 columns
- [ ] Contact form validation and map embed render correctly
- [ ] Admin: login → dashboard → create/edit/delete a menu item → image upload → changes visible on `/menu`
- [ ] `/admin` redirects to `/admin/login` when signed out (open in an incognito window)

- [ ] **Step 5: Commit any fixes found during QA**

If QA turns up issues, fix them, re-run Steps 1-3, then:
```bash
git add -A
git commit -m "fix: address issues found in final QA pass"
```

If no issues: no commit needed for this task.

---

## Explicitly Out of Scope (see plan.md §8 giai đoạn 7)

Deploying to Vercel, connecting a real domain, and handing off admin credentials are **not** part of this plan — they happen later, on request, once the user has real brand content/photos to replace the placeholders.
