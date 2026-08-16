import type { SupabaseClient } from '@supabase/supabase-js'
import { isAdminUser } from '@/lib/data/admin-users'

// Defense-in-depth guard for admin Server Actions. RLS is the primary
// enforcement layer, but Server Actions are reachable directly by their
// action ID (independent of the /admin URL path middleware gates), so each
// action must also verify the caller is an admin before writing.
export async function requireAdmin(supabase: SupabaseClient): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await isAdminUser(supabase, user.id))) {
    throw new Error('Unauthorized')
  }
}
