'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/data/menu-items'
import type { MenuItemInput } from '@/lib/types'

export async function createMenuItemAction(input: MenuItemInput) {
  const supabase = await createServerSupabaseClient()
  await createMenuItem(supabase, input)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}

export async function updateMenuItemAction(id: string, input: MenuItemInput) {
  const supabase = await createServerSupabaseClient()
  await updateMenuItem(supabase, id, input)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}

export async function deleteMenuItemAction(id: string) {
  const supabase = await createServerSupabaseClient()
  await deleteMenuItem(supabase, id)
  revalidatePath('/admin/menu')
  revalidatePath('/menu')
  revalidatePath('/')
}
