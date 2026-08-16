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
