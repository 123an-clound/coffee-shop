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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    getCategories(createBrowserSupabaseClient()).then(setCategories)
  }, [])

  async function handleSubmit(input: MenuItemInput) {
    try {
      setError(null)
      await createMenuItemAction(input)
      router.push('/admin/menu')
    } catch {
      setError('Không thể lưu món. Vui lòng thử lại.')
    }
  }

  if (categories.length === 0) return <p>Đang tải...</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Thêm món mới</h1>
      <div className="mt-6 max-w-lg">
        <MenuItemForm categories={categories} onSubmit={handleSubmit} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
