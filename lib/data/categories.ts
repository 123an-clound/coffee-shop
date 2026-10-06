import type { SupabaseClient } from '@supabase/supabase-js'
import type { Category, CategoryInput } from '@/lib/types'

export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from('coffee_categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function createCategory(
  supabase: SupabaseClient,
  input: CategoryInput
): Promise<Category> {
  const { data, error } = await supabase.from('coffee_categories').insert([input]).select().single()
  if (error) throw error
  return data as Category
}

export async function updateCategory(
  supabase: SupabaseClient,
  id: string,
  input: Partial<CategoryInput>
): Promise<Category> {
  const { data, error } = await supabase
    .from('coffee_categories')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Category
}

export async function deleteCategory(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('coffee_categories').delete().eq('id', id)
  if (error) throw error
}
