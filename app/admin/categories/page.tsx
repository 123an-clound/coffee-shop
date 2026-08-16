'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/data/categories'
import { CategoryForm } from '@/components/admin/CategoryForm'
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from './actions'
import type { Category, CategoryInput } from '@/lib/types'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)

  async function reload() {
    const supabase = createBrowserSupabaseClient()
    setCategories(await getCategories(supabase))
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleSubmit(input: CategoryInput) {
    if (editing) {
      await updateCategoryAction(editing.id, input)
    } else {
      await createCategoryAction(input)
    }
    setEditing(null)
    await reload()
  }

  async function handleDelete(id: string) {
    await deleteCategoryAction(id)
    await reload()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-forest">Quản lý danh mục</h1>

      <div className="mt-6 max-w-md">
        <CategoryForm category={editing ?? undefined} onSubmit={handleSubmit} />
      </div>

      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-forest/10">
            <th className="py-2">Tên</th>
            <th className="py-2">Slug</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-brand-forest/5">
              <td className="py-2">{category.name}</td>
              <td className="py-2 text-brand-ink/60">{category.slug}</td>
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => setEditing(category)}
                  className="mr-3 text-brand-terracotta"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
