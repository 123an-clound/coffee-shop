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
