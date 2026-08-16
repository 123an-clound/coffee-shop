'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { getMenuItems } from '@/lib/data/menu-items'
import { MenuItemForm } from '@/components/admin/MenuItemForm'
import { updateMenuItemAction } from '../../actions'
import type { Category, MenuItem, MenuItemInput } from '@/lib/types'

export default function EditMenuItemPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [item, setItem] = useState<MenuItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams<{ id: string }>()

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    getCategories(supabase).then(setCategories)
    getMenuItems(supabase).then((items) => {
      setItem(items.find((i) => i.id === params.id) ?? null)
    })
  }, [params.id])

  async function handleSubmit(input: MenuItemInput) {
    try {
      setError(null)
      await updateMenuItemAction(params.id, input)
      router.push('/admin/menu')
    } catch {
      setError('Không thể lưu món. Vui lòng thử lại.')
    }
  }

  if (!item) return <p>Đang tải...</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Sửa món</h1>
      <div className="mt-6 max-w-lg">
        <MenuItemForm key={item.id} item={item} categories={categories} onSubmit={handleSubmit} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
