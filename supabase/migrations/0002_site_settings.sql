-- A single public document powers the editable site. Only admins may write it.
create table if not exists public.coffee_site_settings (
  id smallint primary key default 1 check (id = 1),
  settings jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.coffee_site_settings enable row level security;

grant select on public.coffee_site_settings to anon, authenticated;
grant insert, update on public.coffee_site_settings to authenticated;

do $$ begin
  create policy "coffee site settings are publicly readable"
    on public.coffee_site_settings for select
    using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "admins can insert coffee site settings"
    on public.coffee_site_settings for insert
    with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "admins can update coffee site settings"
    on public.coffee_site_settings for update
    using (exists (select 1 from public.admin_users where user_id = auth.uid()))
    with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
exception when duplicate_object then null;
end $$;

do $$ begin
  create trigger coffee_site_settings_set_updated_at
    before update on public.coffee_site_settings
    for each row execute function public.set_updated_at();
exception when duplicate_object then null;
end $$;
