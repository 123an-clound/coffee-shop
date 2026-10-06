import type { SupabaseClient } from '@supabase/supabase-js'

export async function isAdminUser(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('coffee_admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data !== null
}
