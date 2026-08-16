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
