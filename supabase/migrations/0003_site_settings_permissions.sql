-- Supabase's default table privileges include DELETE and TRUNCATE.
-- This document only needs public reads and authenticated admin writes.
revoke all on public.coffee_site_settings from anon, authenticated;
grant select on public.coffee_site_settings to anon, authenticated;
grant insert, update on public.coffee_site_settings to authenticated;
