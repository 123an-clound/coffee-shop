'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { MenuItemForm } from '@/components/admin/MenuItemForm'
import { createMenuItemAction } from '../actions'
import type { Category, MenuItemInput } from '@/lib/types'

export default function NewMenuItemPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    getCategories(createBrowserSupabaseClient()).then(setCategories)
  }, [])

  async function handleSubmit(input: MenuItemInput) {
    await createMenuItemAction(input)
    router.push('/admin/menu')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Thêm món mới</h1>
      <div className="mt-6 max-w-lg">
        <MenuItemForm categories={categories} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
