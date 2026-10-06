# MỘC Coffee House

A Next.js 14 (App Router) + TypeScript + Tailwind CSS site for a coffee shop, with a public
marketing/menu site and a small admin panel (categories, menu items) backed by Supabase
(Postgres + Auth + Storage).

## Prerequisites

- Node.js 20+ (developed against v24)
- A Supabase project (free tier is fine)

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in your Supabase project's URL and
   anon key (Project Settings -> API in the Supabase dashboard):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

   Leave `SUPABASE_SERVICE_ROLE_KEY` empty unless you're running the seed script (see below).
   Never commit real values for any of these.

3. The shared production database is **Web-project** (`jtizooyjnllostamffpp`).
   Coffee uses `coffee_categories`, `coffee_menu_items`, `coffee_admin_users` and
   `coffee_site_settings`. Its Storage bucket is `menu-images`.
   The migration has already been applied to Web-project. Do not replay `0001_init.sql`
   there: the unprefixed `categories` and `menu_items` tables belong to Food-shop.
   For a new, empty coffee-only database, apply all files in `supabase/migrations`
   in order, including `20261006015842_namespace_coffee_tables.sql`.

## Running the app

```
npm run dev      # start the dev server
npm test         # run the vitest suite
npm run build    # production build
npm run lint      # eslint
```

## Seeding sample data

`supabase/seed/seed-data.ts` inserts the demo categories and menu items. Because
categories/menu_items INSERT is admin-only via RLS, the script needs a privileged client — set
`SUPABASE_SERVICE_ROLE_KEY` (Project Settings -> API -> service_role) as an environment variable
for the run only, then execute:

```
SUPABASE_SERVICE_ROLE_KEY=... npx tsx supabase/seed/seed-data.ts
```

This is a one-time/local script. Never commit the service role key or use it in app runtime code.

## Provisioning the first admin account

1. Sign up a user via Supabase Auth (e.g. the Supabase dashboard's Authentication -> Users ->
   Add user, or your own sign-up flow) and confirm that user's email.
2. Grant that user admin access by inserting their user id into `coffee_admin_users`:

   ```sql
   insert into coffee_admin_users (user_id) values ('<the user''s auth.users.id>');
   ```

3. Log in at `/admin/login` with that account.
