-- Coffee owns its own table namespace when several sites share Web-project.
-- Existing Supabase installations already imported by the consolidation skip
-- the rename. A clean coffee-only database follows migrations 0001-0004 first.
do $$
declare namespaced_tables integer;
begin
  select count(*) into namespaced_tables from pg_class
  where relnamespace = 'public'::regnamespace
    and relname in ('coffee_categories', 'coffee_menu_items', 'coffee_admin_users');
  if namespaced_tables = 0 then
    if to_regclass('public.restaurant_info') is not null then
      raise exception 'Shared database detected: import coffee tables separately; never rename Food-shop tables';
    end if;
    alter table public.categories rename to coffee_categories;
    alter table public.menu_items rename to coffee_menu_items;
    alter table public.admin_users rename to coffee_admin_users;
  elsif namespaced_tables <> 3 then
    raise exception 'Partial coffee namespace: repair the migration before continuing';
  end if;
end $$;

-- Table renames preserve foreign keys and the table references in RLS policies.
revoke all on public.coffee_categories, public.coffee_menu_items,
  public.coffee_admin_users from public, anon, authenticated;
grant select on public.coffee_categories, public.coffee_menu_items to anon;
grant select, insert, update, delete on public.coffee_categories,
  public.coffee_menu_items to authenticated;
grant select on public.coffee_admin_users to authenticated;
grant select, insert, update, delete on public.coffee_categories,
  public.coffee_menu_items, public.coffee_admin_users to service_role;

comment on table public.coffee_categories is 'coffee-shop: menu categories; separate from Food-shop public.categories';
comment on table public.coffee_menu_items is 'coffee-shop: menu items edited by the coffee admin';
comment on table public.coffee_admin_users is 'coffee-shop: admin allowlist for this site only';
comment on table public.coffee_site_settings is 'coffee-shop: public website configuration';
notify pgrst, 'reload schema';
