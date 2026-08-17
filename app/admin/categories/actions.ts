'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/require-admin'
import { createCategory, updateCategory, deleteCategory } from '@/lib/data/categories'
import { parseCategoryInput } from '@/lib/validation/category'
import type { CategoryInput } from '@/lib/types'

export async function createCategoryAction(input: CategoryInput) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  const validated = parseCategoryInput(input)
  await createCategory(supabase, validated)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}

export async function updateCategoryAction(id: string, input: CategoryInput) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  const validated = parseCategoryInput(input)
  await updateCategory(supabase, id, validated)
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}

export async function deleteCategoryAction(id: string) {
  const supabase = await createServerSupabaseClient()
  await requireAdmin(supabase)
  try {
    await deleteCategory(supabase, id)
  } catch (err) {
    if (typeof err === 'object' && err !== null && (err as { code?: string }).code === '23503') {
      throw new Error(
        'Không thể xóa danh mục đang có món. Vui lòng chuyển hoặc xóa các món trong danh mục này trước.'
      )
    }
    throw err
  }
  revalidatePath('/admin/categories')
  revalidatePath('/menu')
}
